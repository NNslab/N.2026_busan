import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

const ANNOUNCE_FILE = path.join(process.cwd(), "travel_announcement.json");
const MESSAGES_FILE = path.join(process.cwd(), "travel_messages.json");

// Ensure data files initialization if missing
try {
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([]), "utf-8");
  }
} catch (e) {
  console.error("Failed to initialize state files on start", e);
}

// In-memory cache for fast and reliable persistence across I/O
let memoryAnnouncement: any = null;
let isExplicitlyCleared = false;

const TMP_ANNOUNCE_FILE = path.join("/tmp", "travel_announcement.json");

// Helper to get announcement
function getAnnouncement() {
  if (isExplicitlyCleared) {
    return null;
  }
  if (memoryAnnouncement) {
    return memoryAnnouncement;
  }

  if (fs.existsSync(ANNOUNCE_FILE)) {
    try {
      const ann = JSON.parse(fs.readFileSync(ANNOUNCE_FILE, "utf-8"));
      if (ann && ann.text) {
        memoryAnnouncement = ann;
        return ann;
      }
    } catch (e) {}
  }

  if (fs.existsSync(TMP_ANNOUNCE_FILE)) {
    try {
      const ann = JSON.parse(fs.readFileSync(TMP_ANNOUNCE_FILE, "utf-8"));
      if (ann && ann.text) {
        memoryAnnouncement = ann;
        return ann;
      }
    } catch (e) {}
  }

  return null;
}

// Helper to save announcement
function saveAnnouncement(announcement: any) {
  if (announcement === null) {
    isExplicitlyCleared = true;
    memoryAnnouncement = null;
    if (fs.existsSync(ANNOUNCE_FILE)) {
      try { fs.unlinkSync(ANNOUNCE_FILE); } catch (e) {}
    }
    if (fs.existsSync(TMP_ANNOUNCE_FILE)) {
      try { fs.unlinkSync(TMP_ANNOUNCE_FILE); } catch (e) {}
    }
  } else {
    isExplicitlyCleared = false;
    memoryAnnouncement = announcement;
    const data = JSON.stringify(announcement);
    try {
      fs.writeFileSync(ANNOUNCE_FILE, data, "utf-8");
    } catch (e) {}
    try {
      fs.writeFileSync(TMP_ANNOUNCE_FILE, data, "utf-8");
    } catch (e) {}
  }
}

// Helper to get messages
function getMessages() {
  if (fs.existsSync(MESSAGES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
    } catch (e) {
      return [];
    }
  }
  return [];
}

// Helper to save messages
function saveMessages(messages: any[]) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages), "utf-8");
}

// API routes FIRST
app.get("/api/announcement", (req, res) => {
  res.json({ announcement: getAnnouncement(), cleared: isExplicitlyCleared });
});

app.post("/api/announcement", (req, res) => {
  const { password, text } = req.body;
  if (password !== "allking") {
    return res.status(401).json({ error: "密碼錯誤！🔑" });
  }

  const trimmed = (text || "").trim();
  if (!trimmed) {
    return res.status(400).json({ error: "公告內容不可為空！" });
  }

  const now = Date.now();
  const newAnnounce = {
    id: `ann-${now}`,
    createdAt: now,
    text: trimmed,
    time: new Date().toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
  };

  saveAnnouncement(newAnnounce);
  res.json({ success: true, announcement: newAnnounce, cleared: false });
});

app.delete("/api/announcement", (req, res) => {
  const { password } = req.body;
  if (password !== "allking") {
    return res.status(401).json({ error: "密碼錯誤！🔑" });
  }

  saveAnnouncement(null);
  res.json({ success: true, cleared: true, announcement: null });
});

// Messages API
app.get("/api/messages", (req, res) => {
  res.json({ messages: getMessages() });
});

app.post("/api/messages", (req, res) => {
  const { nickname, content } = req.body;
  if (!nickname || !content || !content.trim()) {
    return res.status(400).json({ error: "暱稱或內容不可為空" });
  }

  const messages = getMessages();
  const newMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    nickname: nickname.trim(),
    content: content.trim(),
    createdAt: Date.now(),
  };

  const updated = [...messages, newMessage];
  saveMessages(updated);
  res.json({ success: true, messages: updated });
});


// Vite middleware for development or serving index.html
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Failed to start server", err);
});
