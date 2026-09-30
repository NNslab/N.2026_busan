import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, MapPin, Clock, Calendar, Search, Filter, 
  ChevronRight, Volume2, Sparkles, RefreshCw, Star, 
  BookOpen, Coins, ArrowLeft, Plane, HelpCircle, 
  AlertCircle, Camera, CheckSquare, Heart, Info, Landmark, Footprints, Lock, X, MessageSquare
} from 'lucide-react';
import { yunCenItinerary, peiEnItinerary, koreanPhrases, precautions } from '../data';
import { FamilyType, DayItinerary, ItineraryItem } from '../types';

interface ItineraryPageProps {
  initialFamily: FamilyType;
  onBackToCover: () => void;
  isElderMode: boolean;
  toggleElderMode: () => void;
}

export interface BoardMessage {
  id: string;
  nickname: string;
  content: string;
  createdAt: number;
}

export default function ItineraryPage({ initialFamily, onBackToCover, isElderMode, toggleElderMode }: ItineraryPageProps) {
  const [selectedFamily, setSelectedFamily] = useState<FamilyType>(initialFamily);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  // Right Sidebar Tool state
  const [toolTab, setToolTab] = useState<'currency' | 'phrases'>('currency');
  
  // Message Board states
  const [nickname, setNickname] = useState<string>(() => localStorage.getItem('traveler_nickname') || '');
  const [tempNickname, setTempNickname] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<BoardMessage[]>([]);
  const [isMessageOpen, setIsMessageOpen] = useState<boolean>(false);

// Leader Announcement states
  const [activeAnnouncement, setActiveAnnouncement] = useState<{ id: string; text: string; time: string; createdAt?: number } | null>(() => {
    const saved = localStorage.getItem('travel_leader_announcement');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [hasAcknowledgedCurrent, setHasAcknowledgedCurrent] = useState<boolean>(() => {
    const savedAnnounce = localStorage.getItem('travel_leader_announcement');
    if (!savedAnnounce) return true;
    try {
      const parsed = JSON.parse(savedAnnounce);
      const ackId = localStorage.getItem('acknowledged_announcement_id');
      return ackId === parsed.id;
    } catch (e) {
      return true;
    }
  });

  const [leaderPassword, setLeaderPassword] = useState<string>('');
  const [isLeaderEditing, setIsLeaderEditing] = useState<boolean>(() => {
    return localStorage.getItem('is_leader_authenticated') === 'true';
  });
  const [announceInput, setAnnounceInput] = useState<string>('');
  const [leaderAuthError, setLeaderAuthError] = useState<string>('');
  const [isLeaderStationOpen, setIsLeaderStationOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnnouncementAndMessages = async () => {
      // 1. Fetch Announcement
      try {
        const res = await fetch('/api/announcement');
        if (res.ok) {
          const data = await res.json();
          const serverAnnounce = data.announcement;
          const isCleared = data.cleared === true;

          if (isCleared) {
            // Leader explicitly took down or deleted the announcement
            setActiveAnnouncement(null);
            setHasAcknowledgedCurrent(true);
            localStorage.removeItem('travel_leader_announcement');
          } else if (serverAnnounce) {
            // There is an active announcement on server
            localStorage.setItem('travel_leader_announcement', JSON.stringify(serverAnnounce));
            setActiveAnnouncement(serverAnnounce);

            const ackId = localStorage.getItem('acknowledged_announcement_id');
            if (ackId === serverAnnounce.id) {
              setHasAcknowledgedCurrent(true);
            } else {
              setHasAcknowledgedCurrent(false);
            }
          } else {
            // Server returned null without explicit clear flag (e.g. server restart)
            // Preserve existing local announcement if present
            const saved = localStorage.getItem('travel_leader_announcement');
            if (saved) {
              try {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.text) {
                  setActiveAnnouncement(parsed);
                }
              } catch (e) {}
            }
          }
        }
      } catch (err) {
        console.error('Failed to sync leader announcement:', err);
      }

      // 2. Fetch Shared Messages
      try {
        const res = await fetch('/api/messages');
        if (res.ok) {
          const data = await res.json();
          if (data.messages) {
            setMessages(data.messages);
          }
        }
      } catch (err) {
        console.error('Failed to sync message board:', err);
      }
    };

    // Initial fetch immediately
    fetchAnnouncementAndMessages();

    // Set up polling interval (every 3 seconds for live real-time sync)
    const interval = setInterval(fetchAnnouncementAndMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = tempNickname.trim();
    if (trimmed) {
      localStorage.setItem('traveler_nickname', trimmed);
      setNickname(trimmed);
    }
  };

  const handlePostMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMsg = newMessage.trim();
    if (!trimmedMsg || !nickname) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nickname: nickname,
          content: trimmedMsg
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.messages) {
          setMessages(data.messages);
        }
        setNewMessage('');
      } else {
        const data = await res.json();
        alert(data.error || '傳送失敗！');
      }
    } catch (err) {
      alert('網路連線失敗，請稍後再試！');
    }
  };
  
  // Currency Calculator states
  const [twdAmount, setTwdAmount] = useState<string>('100');
  const [krwAmount, setKrwAmount] = useState<string>('4500');
  const rate = 45; // Approx 1 TWD = 45 KRW in 2026

  // Simulated Korean voice playing state
  const [playingPhraseIdx, setPlayingPhraseIdx] = useState<number | null>(null);

  // Sights & Packing checks removed based on user request

  // Password switcher state
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [pendingFamily, setPendingFamily] = useState<FamilyType | null>(null);
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const handleFamilySwitchClick = (target: FamilyType) => {
    if (target === selectedFamily) return; // Already viewing
    setSelectedFamily(target);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingFamily) return;

    const trimmed = authPassword.trim();
    if (pendingFamily === 'yun_cen') {
      if (trimmed === '920703') {
        setSelectedFamily('yun_cen');
        setAuthModalOpen(false);
      } else {
        setAuthError('密碼錯誤，請重新輸入 芸岑家 密碼！🔑');
      }
    } else if (pendingFamily === 'pei_en') {
      if (trimmed === '1040627') {
        setSelectedFamily('pei_en');
        setAuthModalOpen(false);
      } else {
        setAuthError('密碼錯誤，請重新輸入 沛恩家 密碼！🔑');
      }
    }
  };

  // Get current itinerary based on family choice
  const currentItinerary = useMemo(() => {
    return selectedFamily === 'yun_cen' ? yunCenItinerary : peiEnItinerary;
  }, [selectedFamily]);

  // Handle currency conversions
  const handleTwdChange = (val: string) => {
    setTwdAmount(val);
    if (val === '') {
      setKrwAmount('');
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setKrwAmount(Math.round(num * rate).toString());
    }
  };

  const handleKrwChange = (val: string) => {
    setKrwAmount(val);
    if (val === '') {
      setTwdAmount('');
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setTwdAmount((num / rate).toFixed(1));
    }
  };

  // Play real Korean voice using Speech Synthesis API
  const playPhraseSound = (idx: number) => {
    if (playingPhraseIdx === idx) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
      setPlayingPhraseIdx(null);
      return;
    }

    setPlayingPhraseIdx(idx);

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const ph = koreanPhrases[idx];
        const utterance = new SpeechSynthesisUtterance(ph.korean);
        utterance.lang = 'ko-KR';
        utterance.rate = 0.8; // Set comfortable speaking pace for learning

        utterance.onend = () => {
          setPlayingPhraseIdx(null);
        };

        utterance.onerror = () => {
          setPlayingPhraseIdx(null);
        };

        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback for browsers without SpeechSynthesis support
        setTimeout(() => {
          setPlayingPhraseIdx(null);
        }, 1200);
      }
    } catch (err) {
      console.error('Speech synthesis error:', err);
      setTimeout(() => {
        setPlayingPhraseIdx(null);
      }, 1200);
    }
  };

  // Sights data removed based on user request

  // Map category to styles and icons
  const getItemBadge = (type: ItineraryItem['type']) => {
    switch (type) {
      case 'transport':
        return { label: '交通', style: 'bg-blue-50 text-blue-600 border-blue-100', icon: '🛫' };
      case 'activity':
        return { label: '行程', style: 'bg-sky-50 text-sky-700 border-sky-100', icon: '🎡' };
      case 'food':
        return { label: '美食', style: 'bg-orange-50 text-orange-600 border-orange-100', icon: '🍔' };
      case 'hotel':
        return { label: '住宿', style: 'bg-amber-50 text-amber-700 border-amber-100', icon: '🏨' };
      case 'shopping':
        return { label: '購物', style: 'bg-rose-50 text-rose-600 border-rose-100', icon: '🛍️' };
      case 'free':
        return { label: '自由', style: 'bg-teal-50 text-teal-600 border-teal-100', icon: '🧭' };
      default:
        return { label: '其他', style: 'bg-slate-50 text-slate-600 border-slate-100', icon: '✨' };
    }
  };

  // Filter day's items based on search query and category filter
  const activeDayItinerary = currentItinerary.find(day => day.dayNum === activeDay);
  
  const filteredItems = useMemo(() => {
    if (!activeDayItinerary) return [];
    return activeDayItinerary.items.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.time && item.time.includes(searchQuery));
      
      const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [activeDayItinerary, searchQuery, activeFilter]);

  // Packing state toggle removed based on user request

  // Day theme icons for the tabs
  const getDayIcon = (dayNum: number) => {
    switch (dayNum) {
      case 1: return '🛫';
      case 2: return '🚃';
      case 3: return '🚠';
      case 4: return '🏎️';
      case 5: return '🧭';
      default: return '✈️';
    }
  };

  return (
    <div id="itinerary-page-root" className="min-h-screen wave-bg font-sans flex flex-col pb-16 relative">
      
      {/* Top Navigation Bar */}
      <nav id="itinerary-nav" className={`w-full bg-white/80 backdrop-blur-md border-b border-sky-100 sticky top-0 z-40 px-4 transition-all duration-300 ${isElderMode ? 'py-5' : 'py-3.5'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          
          {/* Back & Title */}
          <div className="flex items-center gap-3">
            <button 
              id="nav-back-to-cover"
              onClick={onBackToCover}
              className={`hover:bg-slate-100 rounded-full text-slate-500 hover:text-sky-600 transition-colors cursor-pointer ${isElderMode ? 'p-3' : 'p-2'}`}
              title="返回首頁"
            >
              <ArrowLeft size={isElderMode ? 24 : 20} />
            </button>
            <div>
              <span className={`uppercase font-black text-sky-500 tracking-wider ${isElderMode ? 'text-sm' : 'text-[10px]'}`}>2026 釜山旅遊手冊</span>
              <div className="flex items-center gap-2.5">
                <h1 className={`font-display font-black text-slate-800 flex items-center gap-1.5 leading-tight ${isElderMode ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
                  <span>🏖️</span> 釜山湛藍夏日漫遊
                </h1>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLeaderStationOpen(true)}
                  className={`rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md hover:shadow-red-200 border-2 border-white relative transition-all cursor-pointer ${
                    isElderMode ? 'px-3.5 py-2 text-sm font-black gap-1.5' : 'p-1.5'
                  }`}
                  title="小隊長公告廣播站"
                >
                  {activeAnnouncement && (
                    <span className="absolute inset-0 rounded-full bg-red-400/50 animate-ping pointer-events-none" />
                  )}
                  <AlertCircle size={isElderMode ? 20 : 16} className="font-extrabold animate-pulse" />
                  {isElderMode && <span>📢 小隊長廣播</span>}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right Controls (Version Switcher, Family Switcher & Leader Station Entrance) */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 self-center md:self-auto">
            {/* Version Toggle Switch */}
            <button
              id="itinerary-version-toggle-btn"
              onClick={toggleElderMode}
              className={`flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 font-extrabold rounded-full border border-sky-200 shadow-sm transition-all duration-300 active:scale-95 cursor-pointer ${
                isElderMode ? 'text-base border-orange-200 text-orange-700 px-5 py-2.5 ring-2 ring-orange-50' : 'text-xs px-3.5 py-1.5'
              }`}
            >
              {isElderMode ? '🌟 一般精緻版' : '👵 長輩大字版'}
            </button>

            {/* Family Switcher */}
            <div className={`flex items-center gap-1.5 bg-slate-100/90 rounded-full border border-slate-200 ${isElderMode ? 'p-1.5' : 'p-1'}`}>
              <button
                id="switch-yun-cen-btn"
                onClick={() => handleFamilySwitchClick('yun_cen')}
                className={`rounded-full font-black transition-all flex items-center gap-1 cursor-pointer ${
                  isElderMode ? 'px-6 py-2 text-base' : 'px-4 py-1.5 text-xs'
                } ${
                  selectedFamily === 'yun_cen'
                    ? 'bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                <span>⚓</span> 芸岑組
              </button>
              <button
                id="switch-pei-en-btn"
                onClick={() => handleFamilySwitchClick('pei_en')}
                className={`rounded-full font-black transition-all flex items-center gap-1 cursor-pointer ${
                  isElderMode ? 'px-6 py-2 text-base' : 'px-4 py-1.5 text-xs'
                } ${
                  selectedFamily === 'pei_en'
                    ? 'bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                <span>⛵</span> 沛恩組
              </button>
            </div>
          </div>

        </div>
      </nav>

      {/* Main Container */}
      <div id="itinerary-main-grid" className="max-w-7xl mx-auto px-4 md:px-6 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full flex-1">
        
        {/* LEFT COLUMN: Timeline & Search (8 cols) */}
        <div id="itinerary-timeline-col" className="lg:col-span-8 flex flex-col gap-6">

          {/* PERSISTENT LEADER ANNOUNCEMENT CARD (Kept active for 6 hours) */}
          {activeAnnouncement && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white rounded-3xl shadow-xl border-2 border-red-300/80 overflow-hidden relative ${
                isElderMode ? 'p-6 sm:p-7 ring-4 ring-red-100' : 'p-4 sm:p-5'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`animate-bounce ${isElderMode ? 'text-3xl' : 'text-xl'}`}>📢</span>
                  <span className={`font-black tracking-wider uppercase bg-white/20 px-3 py-1 rounded-full text-white backdrop-blur-xs border border-white/30 ${
                    isElderMode ? 'text-base font-extrabold' : 'text-xs'
                  }`}>
                    小隊長最新公告
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold opacity-90 bg-black/20 px-2.5 py-1 rounded-full ${isElderMode ? 'text-sm' : 'text-[11px]'}`}>
                    🕒 {activeAnnouncement.time}
                  </span>
                  <span className={`font-black bg-amber-300 text-red-950 px-2.5 py-1 rounded-full shadow-xs ${isElderMode ? 'text-xs' : 'text-[10px]'}`}>
                    發佈中
                  </span>
                </div>
              </div>

              <div className={`font-black leading-relaxed whitespace-pre-wrap break-words bg-black/25 rounded-2xl border border-white/20 text-red-50 ${
                isElderMode ? 'text-xl sm:text-2xl p-5 my-4' : 'text-sm sm:text-base p-3.5 my-3'
              }`}>
                {activeAnnouncement.text}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
                <span className={`font-bold opacity-90 flex items-center gap-1 ${isElderMode ? 'text-sm text-amber-100' : 'text-xs text-amber-100'}`}>
                  <span>⚠️</span> 請隊員們注意行程配合事項！
                </span>
                <button
                  onClick={() => {
                    setHasAcknowledgedCurrent(false);
                  }}
                  className={`bg-white text-red-700 hover:bg-amber-50 font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isElderMode ? 'px-5 py-2.5 text-base' : 'px-3.5 py-1.5 text-xs'
                  }`}
                >
                  <span>🔍</span> {isElderMode ? '👵 全螢幕放大檢視' : '全螢幕放大查看'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Day Selector (Horizontal Tab Scroll) */}
          <div id="day-selector-container" className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl border border-sky-100/50 shadow-sm">
            <div className="flex items-center justify-between mb-3 px-1 border-b border-slate-50 pb-2">
              <div className="flex items-center gap-1.5">
                <Calendar size={isElderMode ? 18 : 15} className="text-sky-500" />
                <span className={`font-black text-slate-700 ${isElderMode ? 'text-base' : 'text-xs'}`}>
                  {isElderMode ? '📅 請選擇您要看的日期天數' : '選擇行程天數'}
                </span>
              </div>
              <span className={`font-mono font-black bg-amber-100 text-amber-800 rounded-md ${isElderMode ? 'text-sm px-3 py-1' : 'text-[10px] px-2 py-0.5'}`}>
                總計 6 天行程表
              </span>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-sky-200">
              {currentItinerary.map((day) => {
                const isActive = activeDay === day.dayNum;
                return (
                  <button
                    key={day.dayNum}
                    id={`day-tab-btn-${day.dayNum}`}
                    onClick={() => {
                      setActiveDay(day.dayNum);
                      setSearchQuery('');
                      setActiveFilter('all');
                    }}
                    className={`flex-1 flex flex-col items-center rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer ${
                      isElderMode 
                        ? 'p-5 min-w-[135px] border-2 shadow-sm' 
                        : 'p-2.5 min-w-[110px]'
                    } ${
                      isActive 
                        ? 'bg-gradient-to-b from-sky-50 to-sky-100/30 border-sky-400 shadow-md text-sky-800 font-extrabold scale-[1.03]' 
                        : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {/* Active Bottom Indicator Wave line */}
                    {isActive && (
                      <motion.div 
                        layoutId="activeDayBar"
                        className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 to-sky-500"
                      />
                    )}
                    <span className={`font-black tracking-tight opacity-75 ${isElderMode ? 'text-base mb-0.5' : 'text-xs'}`}>
                      Day {day.dayNum}
                    </span>
                    <span className={`my-1 ${isElderMode ? 'text-3xl' : 'text-base my-0.5'}`}>
                      {getDayIcon(day.dayNum)}
                    </span>
                    <span className={`font-mono whitespace-nowrap font-black ${isElderMode ? 'text-sm' : 'text-[10px]'}`}>
                      {day.date.slice(5)} ({day.dayOfWeek})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search, Filter Bar */}
          <div id="search-filter-box" className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-sky-100/50 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={isElderMode ? 18 : 16} />
              <input 
                id="itinerary-search-input"
                type="text" 
                placeholder="搜尋今天的景點、美食..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400 focus:bg-white transition-all font-bold text-slate-700 ${
                  isElderMode ? 'pl-11 pr-4 py-3 text-base' : 'pl-9 pr-4 py-2 text-xs'
                }`}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {[
                { id: 'all', label: '全部 ✨' },
                { id: 'activity', label: '行程 🎡' },
                { id: 'food', label: '美食 🍔' },
                { id: 'transport', label: '交通 🛫' },
                { id: 'shopping', label: '購物 🛍' },
                { id: 'free', label: '自由 🧭' }
              ].map((pill) => (
                <button
                  key={pill.id}
                  id={`filter-pill-${pill.id}`}
                  onClick={() => setActiveFilter(pill.id)}
                  className={`rounded-full font-black whitespace-nowrap border transition-all cursor-pointer ${
                    isElderMode ? 'px-6 py-3.5 text-base border-2 shadow-sm' : 'px-3 py-1.5 text-xs'
                  } ${
                    activeFilter === pill.id
                      ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Theme Card */}
          {activeDayItinerary && (
            <div id="day-theme-card" className="bg-gradient-to-r from-sky-400/90 to-sky-300 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 text-white/10 pointer-events-none">
                <Compass size={140} className="rotate-12" />
              </div>
              <div className="z-10 relative">
                <span className={`bg-white/25 text-white font-black rounded-full uppercase tracking-widest border border-white/20 ${
                  isElderMode ? 'text-sm px-4.5 py-1.5' : 'text-[10px] px-2.5 py-1'
                }`}>
                  Day {activeDay} 每日主題
                </span>
                <h2 className={`font-display font-black mt-3 flex items-center gap-2.5 ${
                  isElderMode ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
                }`}>
                  <span>{getDayIcon(activeDay)}</span>
                  {activeDayItinerary.theme}
                </h2>
                <p className={`mt-2.5 flex items-center gap-2 font-black ${
                  isElderMode ? 'text-base sm:text-lg text-white' : 'text-white/80 text-xs'
                }`}>
                  <Calendar size={isElderMode ? 18 : 13} />
                  <span>日期：{activeDayItinerary.date}（星期{activeDayItinerary.dayOfWeek}）</span>
                </p>
              </div>
            </div>
          )}

          {/* Timeline list of items */}
          <div id="timeline-list" className="relative pl-6 md:pl-8 border-l-2 border-dashed border-sky-200/80 space-y-6">
            
            <AnimatePresence mode="popLayout">
              {filteredItems.length === 0 ? (
                <motion.div 
                  id="no-items-fallback"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl text-center border border-sky-100/50 shadow-sm"
                >
                  <span className="text-3xl">🏜️</span>
                  <p className="text-sm font-bold text-slate-600 mt-2">找不到符合搜尋或分類的行程喔！</p>
                  <p className="text-xs text-slate-400 mt-1">換個關鍵字搜尋看看，或者切換分類標籤吧。</p>
                </motion.div>
              ) : (
                filteredItems.map((item, idx) => {
                  const badge = getItemBadge(item.type);
                  const isGathering = item.title.includes('集合') || (item.notes && item.notes.some(note => note.includes('集合')));
                  const hasDetails = !!(item.description || (item.photoSpots && item.photoSpots.length > 0) || (item.oathText && item.oathText.length > 0) || (item.notes && item.notes.length > 0));
                  const isExpanded = !isElderMode || !!expandedItems[`${activeDay}-${idx}`];

                  return (
                    <motion.div
                      key={`${item.title}-${idx}`}
                      id={`timeline-item-${idx}`}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={`relative rounded-3xl border transition-all duration-300 ${
                        isElderMode ? 'p-6 sm:p-8 border-2 shadow-lg' : 'p-5 md:p-6 shadow-sm hover:shadow-md'
                      } ${
                        isGathering
                          ? 'bg-amber-50/95 hover:bg-amber-50 border-amber-300/80 ring-2 ring-amber-400/20'
                          : 'bg-white/95 hover:bg-white border-sky-100/60'
                      }`}
                    >
                      {/* Timeline Dot Anchor node */}
                      <div className={`absolute -left-[31px] md:-left-[39px] top-6 w-4 h-4 rounded-full bg-white border-2 flex items-center justify-center shadow-sm ${
                        isGathering ? 'border-amber-500 animate-pulse' : 'border-sky-400'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isGathering ? 'bg-amber-500' : 'bg-sky-400'}`} />
                      </div>

                      {/* Header row: Time and badge category */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 pb-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`font-mono font-black rounded-xl flex items-center gap-1.5 shadow-sm border ${
                            isElderMode ? 'text-xl sm:text-2xl md:text-3xl px-5 py-2.5' : 'text-sm px-2.5 py-1'
                          } ${
                            isGathering 
                              ? 'bg-amber-100 text-amber-900 border-amber-300' 
                              : 'bg-slate-100 text-slate-850 border-slate-200'
                          }`}>
                            <Clock size={isElderMode ? 22 : 13} className={isGathering ? 'text-amber-600' : 'text-sky-500'} />
                            {item.time || '全天'}
                          </span>
                          
                          {item.duration && (
                            <span className={`font-black px-2.5 py-1 rounded-lg ${
                              isElderMode ? 'text-base sm:text-lg md:text-xl px-4 py-2' : 'text-[10px]'
                            } ${
                              isGathering ? 'bg-amber-200/50 text-amber-900' : 'bg-sky-50 text-slate-600'
                            }`}>
                              ⏳ 預估約 {item.duration}
                            </span>
                          )}
                        </div>

                        {/* Category pill */}
                        <span className={`font-black rounded-full border flex items-center gap-1.5 ${
                          isElderMode ? 'text-base sm:text-lg md:text-xl px-5 py-2.5' : 'text-[11px] px-2.5 py-1'
                        } ${badge.style}`}>
                          <span>{badge.icon}</span>
                          {badge.label}
                        </span>
                      </div>

                      {isGathering && (
                        <div className={`mb-4 bg-red-100/90 border border-red-300 text-red-800 font-black rounded-2xl shadow-xs animate-pulse ${
                          isElderMode ? 'p-6 border-2' : 'px-3.5 py-2'
                        }`}>
                          <div className={`flex items-center gap-2 mb-1.5 ${isElderMode ? 'text-xl sm:text-2xl md:text-3xl' : 'text-[11.5px]'}`}>
                            <span className={isElderMode ? 'text-3xl' : 'text-base'}>🚨</span>
                            <span>集合時間 ‧ 遲到的要請客！🥤🍰</span>
                          </div>
                          <div className={`leading-relaxed font-bold ${isElderMode ? 'text-lg sm:text-xl text-red-950 pl-8' : 'text-[11px] text-red-600/95 pl-5'}`}>
                            （如果在集合前15分鐘，發現自己迷路了，請即時求助各家小組長，讓小組長有時間找到你！）
                          </div>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className={`font-display font-black text-slate-800 flex items-center gap-1.5 ${
                        isElderMode ? 'text-3xl sm:text-4xl md:text-5xl mb-4 leading-tight' : 'text-base md:text-lg mb-2'
                      }`}>
                        {item.title}
                      </h3>

                      {/* Elder Mode toggle button (rendered only when there is detailed content to show) */}
                      {isElderMode && hasDetails && (
                        <button
                          onClick={() => {
                            const key = `${activeDay}-${idx}`;
                            setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
                          }}
                          className={`mt-2.5 mb-4 text-sky-600 hover:text-sky-700 font-black flex items-center gap-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-2xl cursor-pointer shadow-xs select-none transition-all ${
                            isExpanded ? 'py-3.5 px-6 text-base sm:text-lg' : 'py-5 px-8 text-xl sm:text-2xl md:text-3xl ring-4 ring-sky-150'
                          }`}
                        >
                          {isExpanded ? '🔼 收起詳細說明' : '🔽 點此看詳細說明/景點提示 (大字)'}
                        </button>
                      )}
                      
                      {isExpanded && item.description && (
                        <p className={`leading-relaxed font-bold whitespace-pre-line ${
                          isElderMode ? 'text-xl sm:text-2xl md:text-3xl text-slate-900 mb-5 bg-slate-50 p-6 rounded-3xl border-2 border-slate-200/60' : 'text-xs md:text-sm text-slate-600 mb-3'
                        }`}>
                          {item.description}
                        </p>
                      )}

                      {/* Photo Spots Highlight block */}
                      {isExpanded && item.photoSpots && item.photoSpots.length > 0 && (
                        <div className={`bg-amber-50/50 border border-amber-200/30 p-3 rounded-xl mb-3 ${isElderMode ? 'p-5 rounded-3xl border-2' : ''}`}>
                          <h4 className={`font-black text-amber-800 flex items-center gap-1 mb-2 ${isElderMode ? 'text-lg sm:text-xl md:text-2xl' : 'text-xs'}`}>
                            <Camera size={isElderMode ? 22 : 13} className="text-amber-500 animate-pulse" />
                            <span>📸 推薦拍照點 (美照指南)</span>
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {item.photoSpots.map((spot, spotIdx) => (
                              <span key={spotIdx} className={`bg-white border border-amber-200 font-black px-2.5 py-1 rounded-lg shadow-xs ${
                                isElderMode ? 'text-base sm:text-lg md:text-xl px-4 py-2.5' : 'text-[10px]'
                              }`}>
                                ✦ {spot}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Red Tourism Oath Block */}
                      {isExpanded && item.oathText && item.oathText.length > 0 && (
                        <div className="mt-4 p-4 md:p-5 rounded-2xl bg-red-50/95 border-2 border-red-200 shadow-sm">
                          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-red-200">
                            <span className="text-xl animate-bounce" style={{ animationDuration: '3s' }}>📜</span>
                            <h4 className={`font-black text-red-800 tracking-wider ${isElderMode ? 'text-lg sm:text-xl md:text-2xl' : 'text-sm'}`}>
                              釜山行前宣誓活動 (桃園機場限定)
                            </h4>
                          </div>
                          <div className={`space-y-2.5 text-red-700 font-bold leading-relaxed ${isElderMode ? 'text-lg sm:text-xl md:text-2xl' : 'text-xs md:text-sm'}`}>
                            {item.oathText.map((line, lineIdx) => {
                              if (line.includes('我宣誓：')) {
                                  return (
                                    <div key={lineIdx} className="bg-red-100/70 p-2.5 rounded-xl border border-red-200 mb-2">
                                      <span className={`text-red-850 font-extrabold flex items-start gap-1 ${isElderMode ? 'text-lg sm:text-xl md:text-2xl' : 'text-xs md:text-sm'}`}>
                                        <span>🙋‍♂️</span>
                                        <span>{line}</span>
                                      </span>
                                    </div>
                                  );
                                }
                                if (line.includes('絕對不說：')) {
                                  return (
                                    <div key={lineIdx} className="flex items-start gap-2 pl-3 py-0.5 text-red-600">
                                      <span className="text-xs mt-0.5">❌</span>
                                      <span className={`font-black ${isElderMode ? 'text-lg sm:text-xl md:text-2xl' : 'text-xs md:text-sm'}`}>{line}</span>
                                    </div>
                                  );
                                }
                                if (line.includes('我們要做到')) {
                                  return (
                                    <div key={lineIdx} className={`font-extrabold text-red-800 mt-4 border-b border-red-200 pb-1 mb-1.5 flex items-center gap-1.5 ${
                                      isElderMode ? 'text-lg sm:text-xl md:text-2xl' : 'text-xs md:text-sm'
                                    }`}>
                                      <span>💪</span>
                                      <span>{line}</span>
                                    </div>
                                  );
                                }
                                if (line.includes('走路不喊累') || line.includes('有狀況不硬撐') || line.includes('遇到突發狀況') || line.includes('兩人同行')) {
                                  return (
                                    <div key={lineIdx} className="flex items-start gap-2 pl-3 py-0.5 text-red-700 font-bold">
                                      <span className="text-xs mt-0.5">✨</span>
                                      <span className={isElderMode ? 'text-lg sm:text-xl md:text-2xl' : 'text-xs md:text-sm'}>{line}</span>
                                    </div>
                                  );
                                }
                                if (line.includes('如果違規')) {
                                  return (
                                    <div key={lineIdx} className="mt-3 bg-red-600 text-white p-3 rounded-xl border border-red-700 shadow-md flex items-start gap-2 animate-pulse">
                                      <span className="text-base">🎁</span>
                                      <span className={`font-black tracking-wide leading-normal ${isElderMode ? 'text-lg sm:text-xl md:text-2xl' : 'text-xs md:text-sm'}`}>{line}</span>
                                    </div>
                                  );
                                }
                                return (
                                  <p key={lineIdx} className={isElderMode ? 'text-lg sm:text-xl md:text-2xl' : 'text-xs md:text-sm'}>
                                    {line}
                                  </p>
                                );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Notes bullet points */}
                      {isExpanded && item.notes && item.notes.length > 0 && (
                        <div className="space-y-1.5 mt-3 pt-3 border-t border-dashed border-slate-100">
                          {item.notes.map((note, noteIdx) => (
                            <div key={noteIdx} className={`text-orange-600 font-black flex items-start gap-1.5 bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-100 ${
                              isElderMode ? 'text-lg sm:text-xl md:text-2xl p-5 border-2 shadow-sm' : 'text-xs'
                            }`}>
                              <span className="text-orange-500">⚠️</span>
                              <span className="leading-normal">{note}</span>
                            </div>
                          ))}
                        </div>
                      )}

                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>

          </div>

          {/* Bottom Day Selector (Convenient for switching days without scrolling to top) */}
          <div id="bottom-day-selector-container" className="bg-white/95 backdrop-blur-sm p-4 rounded-3xl border-2 border-sky-200/80 shadow-md mt-2">
            <div className="flex items-center justify-between mb-3 px-1 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <Calendar size={isElderMode ? 20 : 16} className="text-sky-500" />
                <span className={`font-black text-slate-800 ${isElderMode ? 'text-lg' : 'text-xs sm:text-sm'}`}>
                  {isElderMode ? '📅 切換行程天數（看完此天可直接點選下一步）' : '快速切換行程天數'}
                </span>
              </div>
              <span className={`font-mono font-black bg-sky-100 text-sky-800 rounded-lg ${isElderMode ? 'text-sm px-3 py-1' : 'text-[10px] px-2.5 py-1'}`}>
                快速跳轉
              </span>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-sky-200">
              {currentItinerary.map((day) => {
                const isActive = activeDay === day.dayNum;
                return (
                  <button
                    key={`bottom-day-${day.dayNum}`}
                    id={`bottom-day-tab-btn-${day.dayNum}`}
                    onClick={() => {
                      setActiveDay(day.dayNum);
                      setSearchQuery('');
                      setActiveFilter('all');
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className={`flex-1 flex flex-col items-center rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer ${
                      isElderMode 
                        ? 'p-4 min-w-[130px] border-2 shadow-sm' 
                        : 'p-2.5 min-w-[105px]'
                    } ${
                      isActive 
                        ? 'bg-gradient-to-b from-sky-100 to-sky-200/40 border-sky-500 shadow-md text-sky-900 font-extrabold scale-[1.03]' 
                        : 'bg-white hover:bg-sky-50/50 border-slate-200 text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeDayBarBottom"
                        className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 to-sky-600"
                      />
                    )}
                    <span className={`font-black tracking-tight opacity-80 ${isElderMode ? 'text-base mb-0.5' : 'text-xs'}`}>
                      Day {day.dayNum}
                    </span>
                    <span className={`my-1 ${isElderMode ? 'text-3xl' : 'text-base my-0.5'}`}>
                      {getDayIcon(day.dayNum)}
                    </span>
                    <span className={`font-mono whitespace-nowrap font-black ${isElderMode ? 'text-sm' : 'text-[10px]'}`}>
                      {day.date.slice(5)} ({day.dayOfWeek})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Travel Toolkit (4 cols) */}
        <div id="itinerary-toolkit-col" className="lg:col-span-4 flex flex-col gap-6">
          
          <div className={`bg-white/95 backdrop-blur-sm rounded-3xl border border-sky-100/50 shadow-md ${
            isElderMode ? 'p-6 sm:p-8 border-2' : 'p-5'
          }`}>
            
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50">
              <Compass size={isElderMode ? 24 : 18} className="text-orange-400 animate-spin" style={{ animationDuration: '8s' }} />
              <h2 className={`font-display font-black text-slate-800 tracking-wider uppercase ${
                isElderMode ? 'text-lg' : 'text-sm'
              }`}>
                🧳 釜山隨身旅遊工具箱
              </h2>
            </div>

            {/* Toolkit Tabs */}
            <div className="grid grid-cols-2 gap-0.5 bg-slate-100 p-1 rounded-xl mb-5 text-center">
              <button
                id="tool-tab-currency"
                onClick={() => setToolTab('currency')}
                className={`py-2 rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  isElderMode ? 'text-base font-black py-3' : 'text-xs font-bold'
                } ${
                  toolTab === 'currency' ? 'bg-white text-sky-600 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
                title="匯率換算"
              >
                <Coins size={isElderMode ? 20 : 14} />
                <span>匯率對照</span>
              </button>
              <button
                id="tool-tab-phrases"
                onClick={() => setToolTab('phrases')}
                className={`py-2 rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  isElderMode ? 'text-base font-black py-3' : 'text-xs font-bold'
                } ${
                  toolTab === 'phrases' ? 'bg-white text-sky-600 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
                title="實用韓語"
              >
                <BookOpen size={isElderMode ? 20 : 14} />
                <span>實用韓語</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div id="toolkit-tab-content" className="min-h-[300px]">
              
              {/* Tab 1: Currency Converter */}
              {toolTab === 'currency' && (
                <div id="currency-tab-content" className="space-y-4">
                  <div className="bg-sky-50/50 border border-sky-100 p-3.5 rounded-xl">
                    <span className={`font-black text-sky-600 block mb-1 ${isElderMode ? 'text-base' : 'text-[11px]'}`}>💱 即時台幣換算韓元 (2026 基準)</span>
                    <p className={`text-slate-600 leading-snug font-bold ${isElderMode ? 'text-sm' : 'text-[10px]'}`}>
                      今日試算基準為：<strong>1 TWD ≈ {rate} KRW</strong>。<br />
                      （僅供參考，請以當地換錢所或WOWPASS卡公告為準）
                    </p>
                  </div>

                  {/* Converter Inputs */}
                  <div className="space-y-3">
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <span className={`font-bold uppercase tracking-wider block ${isElderMode ? 'text-xs text-slate-500' : 'text-[10px] text-slate-400'}`}>新台幣 TWD</span>
                        <input
                          id="currency-twd-input"
                          type="number"
                          value={twdAmount}
                          onChange={(e) => handleTwdChange(e.target.value)}
                          placeholder="新台幣金額"
                          className={`bg-transparent text-slate-800 font-mono font-black focus:outline-none w-32 mt-0.5 ${
                            isElderMode ? 'text-2xl' : 'text-base'
                          }`}
                        />
                      </div>
                      <span className={`font-black bg-white rounded border border-slate-200 ${isElderMode ? 'text-lg px-3 py-1.5' : 'text-xs px-2 py-1'}`}>元 NTD</span>
                    </div>

                    <div className="flex justify-center my-1 text-slate-400">
                      <RefreshCw size={isElderMode ? 22 : 16} className="animate-pulse" />
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <span className={`font-bold uppercase tracking-wider block ${isElderMode ? 'text-xs text-slate-500' : 'text-[10px] text-slate-400'}`}>韓元 KRW</span>
                        <input
                          id="currency-krw-input"
                          type="number"
                          value={krwAmount}
                          onChange={(e) => handleKrwChange(e.target.value)}
                          placeholder="韓元金額"
                          className={`bg-transparent text-slate-800 font-mono font-black focus:outline-none w-32 mt-0.5 ${
                            isElderMode ? 'text-2xl' : 'text-base'
                          }`}
                        />
                      </div>
                      <span className={`font-black bg-white rounded border border-slate-200 ${isElderMode ? 'text-lg px-3 py-1.5' : 'text-xs px-2 py-1'}`}>₩ WON</span>
                    </div>
                  </div>

                  {/* Quick price references in Busan */}
                  <div className="border-t border-slate-100 pt-3">
                    <span className={`font-black text-slate-400 block mb-2 ${isElderMode ? 'text-sm' : 'text-[10px]'}`}>💡 釜山旅行常見物價對照</span>
                    <div className="space-y-2">
                      {[
                        { name: '街頭熱騰騰糖餅 / 魚板', krw: 3000, desc: '點心首選' },
                        { name: '豬肉湯飯 / 味贊王烤肉(人均)', krw: 15000, desc: '飽足一餐' },
                        { name: '計程車起步價 (一般)', krw: 4800, desc: '短途交通' },
                        { name: '鑽石灣遊艇現場加價', krw: 5000, desc: '必付差額' },
                        { name: '便利商店冰美式咖啡', krw: 2500, desc: '夏日消暑' }
                      ].map((item, index) => (
                        <div key={index} className={`flex justify-between items-center rounded-lg hover:bg-slate-50 transition-all ${
                          isElderMode ? 'p-2.5 bg-slate-50/30' : 'p-1.5'
                        }`}>
                          <div className="flex flex-col">
                            <span className={`font-black text-slate-700 ${isElderMode ? 'text-base sm:text-lg' : 'text-xs'}`}>{item.name}</span>
                            <span className={`text-slate-450 font-bold ${isElderMode ? 'text-xs' : 'text-[9px]'}`}>{item.desc}</span>
                          </div>
                          <div className="text-right">
                            <span className={`font-mono font-black text-slate-800 block ${isElderMode ? 'text-base sm:text-lg' : 'text-xs'}`}>₩{item.krw.toLocaleString()}</span>
                            <span className={`font-mono text-slate-400 font-bold ${isElderMode ? 'text-xs' : 'text-[10px]'}`}>≈ NT${Math.round(item.krw / rate)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Useful Korean Phrasebook */}
              {toolTab === 'phrases' && (
                <div id="phrases-tab-content" className="space-y-3">
                  <div className="bg-amber-50/50 border border-amber-200/30 p-3 rounded-xl mb-2">
                    <span className={`font-black text-amber-800 block mb-1 ${isElderMode ? 'text-base' : 'text-[10px]'}`}>🗣️ 釜山防身生存口訣</span>
                    <p className={`text-slate-600 leading-relaxed font-bold ${isElderMode ? 'text-sm' : 'text-[10px]'}`}>
                      跟著羅馬拼音念，在點餐、市場購物或是跟司機大哥溝通時，會讓對方倍感親切喔！點擊播放鍵來聽聽模擬發音。
                    </p>
                  </div>

                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {koreanPhrases.map((ph, idx) => (
                      <div 
                        key={idx}
                        id={`phrase-card-${idx}`}
                        className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center justify-between hover:bg-sky-50/30 hover:border-sky-200 transition-all duration-300"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`font-black text-slate-800 ${isElderMode ? 'text-lg sm:text-xl' : 'text-sm'}`}>{ph.korean}</span>
                            <span className={`text-slate-450 font-mono font-black ${isElderMode ? 'text-sm' : 'text-[10px]'}`}>({ph.romaji})</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`text-slate-700 font-black px-2 py-0.5 rounded-md ${
                              isElderMode ? 'text-sm bg-slate-200 py-1 px-2.5 rounded-lg' : 'text-xs bg-slate-200/60'
                            }`}>
                              {ph.translation}
                            </span>
                            <span className={`text-slate-500 font-bold ${isElderMode ? 'text-xs' : 'text-[10px]'}`}>{ph.usage}</span>
                          </div>
                        </div>

                        {/* Animated speaker button */}
                        <button
                          id={`play-sound-btn-${idx}`}
                          onClick={() => playPhraseSound(idx)}
                          className={`rounded-full transition-all cursor-pointer ${
                            isElderMode ? 'p-3.5' : 'p-2'
                          } ${
                            playingPhraseIdx === idx 
                              ? 'bg-sky-500 text-white scale-110 shadow-md' 
                              : 'bg-white hover:bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                          title="播放發音"
                        >
                          <Volume2 size={isElderMode ? 22 : 14} className={playingPhraseIdx === idx ? 'animate-bounce' : ''} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Switcher Password Verification Modal */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-sky-100 max-w-sm w-full overflow-hidden z-10"
            >
              {/* Close button */}
              <button
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-5">
                <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-2.5">
                  <Lock size={22} />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-800">
                  切換至 {pendingFamily === 'yun_cen' ? '芸岑家' : '沛恩家'}
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  請輸入該組別的安全密碼以進行切換對照
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => {
                      setAuthPassword(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="輸入該組密碼..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:ring focus:ring-sky-100 rounded-xl px-4 py-2.5 text-slate-800 text-center font-mono tracking-widest font-bold text-lg placeholder:text-slate-300 placeholder:font-sans placeholder:text-xs placeholder:tracking-normal transition-all"
                    autoFocus
                  />
                </div>

                {authError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-500 text-xs font-semibold text-center bg-rose-50 border border-rose-100 py-1.5 rounded-lg animate-pulse"
                  >
                    {authError}
                  </motion.div>
                )}

                <div className="flex gap-3.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(false)}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-2 rounded-xl transition-all text-xs"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-xl transition-all shadow-sm text-xs"
                  >
                    確認解鎖
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Draggable Blue Message Bubble & Popover Board */}
      <motion.div
        drag
        dragMomentum={false}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
        style={{ touchAction: 'none' }}
      >
        <AnimatePresence>
          {isMessageOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              onPointerDownCapture={(e) => e.stopPropagation()}
              onTouchStartCapture={(e) => e.stopPropagation()}
              className={`bg-white/95 backdrop-blur-md rounded-3xl border border-blue-100 shadow-2xl w-80 sm:w-96 flex flex-col mb-2 text-left ${
                isElderMode ? 'p-5 ring-2 ring-blue-100 shadow-2xl' : 'p-4'
              }`}
              style={{ maxHeight: isElderMode ? '460px' : '420px' }}
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-3 select-none">
                <div className={`flex items-center gap-1.5 font-black text-slate-800 ${isElderMode ? 'text-base' : 'text-sm'}`}>
                  <span className="text-blue-500">💬</span>
                  <span>釜山行互動留言板</span>
                </div>
                <button 
                  onClick={() => setIsMessageOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={isElderMode ? 18 : 16} />
                </button>
              </div>

              {/* Message Board Contents */}
              {!nickname ? (
                <div id="floating-messages-login" className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100/50 p-4 rounded-2xl text-center select-none">
                    <span className="text-2xl block mb-1">🏖️</span>
                    <h3 className={`font-black text-blue-800 ${isElderMode ? 'text-sm' : 'text-xs'}`}>歡迎來到釜山行留言板</h3>
                    <p className={`mt-1 leading-relaxed font-bold ${isElderMode ? 'text-xs text-blue-700' : 'text-[10px] text-blue-600'}`}>
                      大家可以在這裡隨時留言、交流，拖動小氣泡到處移動喔！
                    </p>
                  </div>
                  <form onSubmit={handleSaveNickname} className="space-y-3">
                    <div>
                      <label className={`font-black text-slate-600 block mb-1.5 ${isElderMode ? 'text-xs' : 'text-[10px]'}`}>
                        👤 請輸入你的旅行暱稱 (設定後不可修改)：
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={20}
                        value={tempNickname}
                        onChange={(e) => setTempNickname(e.target.value)}
                        placeholder="例如：芸岑 / 沛恩 / 媽媽..."
                        className={`w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring focus:ring-blue-100 rounded-xl px-3 font-bold text-slate-800 focus:outline-none transition-all ${
                          isElderMode ? 'py-3 text-sm' : 'py-2 text-xs'
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-black rounded-xl transition-all shadow-sm cursor-pointer ${
                        isElderMode ? 'py-3 text-sm' : 'py-2 text-xs'
                      }`}
                    >
                      開始留言
                    </button>
                  </form>
                </div>
              ) : (
                <div id="floating-messages-board" className="space-y-3 flex-1 flex flex-col overflow-hidden">
                  {/* Status & Nickname Display (No edit button, since once set it can't be changed) */}
                  <div className={`bg-blue-50 border border-blue-100/40 px-3 py-2 rounded-xl flex items-center justify-between select-none ${
                    isElderMode ? 'text-xs p-3' : 'text-[11px]'
                  }`}>
                    <div className="flex items-center gap-1.5 font-black text-blue-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>目前旅行身分：</span>
                      <span className="text-blue-600 font-extrabold">{nickname}</span>
                    </div>
                  </div>

                  {/* Messages Scrollable List */}
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 flex-1">
                    {messages.length === 0 ? (
                      <p className="text-center text-slate-400 text-xs py-10 select-none font-bold">還沒有人留言，快來留第一句話吧！✨</p>
                    ) : (
                      messages.map((msg) => {
                        const isMe = msg.nickname === nickname;
                        const dateStr = new Date(msg.createdAt).toLocaleString('zh-TW', {
                          timeZone: 'Asia/Taipei',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        });
                        return (
                          <div
                            key={msg.id}
                            className={`p-3 rounded-2xl border transition-all ${
                              isMe
                                ? 'bg-blue-50/40 border-blue-100 ml-4'
                                : 'bg-slate-50/80 border-slate-200/60 mr-4'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1 select-none">
                              <span className={`font-black ${isElderMode ? 'text-xs' : 'text-[11px]'} ${isMe ? 'text-blue-600' : 'text-slate-700'}`}>
                                {msg.nickname} {isMe && <span className="text-[9px] font-black text-blue-400 bg-blue-100/50 px-1 py-0.2 rounded">(你)</span>}
                              </span>
                              <span className={`text-slate-400 font-mono font-bold ${isElderMode ? 'text-[10px]' : 'text-[9px]'}`}>
                                {dateStr}
                              </span>
                            </div>
                            <p className={`leading-relaxed break-words font-bold ${isElderMode ? 'text-sm text-slate-800' : 'text-xs text-slate-700'}`}>
                              {msg.content}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Send Message Form */}
                  <form onSubmit={handlePostMessage} className="pt-2 border-t border-slate-100 flex gap-2">
                    <input
                      type="text"
                      required
                      maxLength={500}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="說點什麼吧..."
                      className={`flex-1 bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring focus:ring-blue-100 rounded-xl px-3 font-bold text-slate-800 focus:outline-none transition-all ${
                        isElderMode ? 'py-3 text-sm' : 'py-2 text-xs'
                      }`}
                    />
                    <button
                      type="submit"
                      className={`bg-blue-500 hover:bg-blue-600 text-white font-black rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer ${
                        isElderMode ? 'px-4 py-3 text-sm' : 'px-3 py-2 text-xs'
                      }`}
                    >
                      傳送
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Trigger Circle Bubble */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsMessageOpen(!isMessageOpen)}
          className={`rounded-full bg-gradient-to-tr from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 text-white flex flex-col items-center justify-center shadow-2xl border-2 border-white/90 relative cursor-grab active:cursor-grabbing transition-shadow duration-300 ${
            isElderMode ? 'w-16 h-16' : 'w-14 h-14'
          }`}
          title="留言板"
        >
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping pointer-events-none" />
          
          <MessageSquare size={isElderMode ? 24 : 22} className="relative z-10" />
          
          {messages.length > 0 && (
            <span className={`absolute bg-rose-500 text-white font-black rounded-full border border-white flex items-center justify-center shadow-md ${
              isElderMode ? '-top-1.5 -right-1.5 h-6 min-w-6 text-xs' : '-top-1 -right-1 h-5 min-w-5 text-[9px]'
            }`}>
              {messages.length}
            </span>
          )}
          <span className={`font-black tracking-tight opacity-90 leading-none mt-0.5 select-none relative z-10 ${
            isElderMode ? 'text-[9px]' : 'text-[8px]'
          }`}>
            {isElderMode ? '留言板' : '留言/拖移'}
          </span>
        </motion.button>
      </motion.div>

      {/* RED ALERT DIALOG OVERLAY */}
      <AnimatePresence>
        {activeAnnouncement && !hasAcknowledgedCurrent && (
          <div className="fixed inset-0 z-[100] overflow-y-auto p-4 sm:p-6 flex items-center justify-center min-h-full my-auto">
            {/* Dark background with heavy red overlay and backdrop-blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-red-950/95 backdrop-blur-md"
            />

            {/* Alert Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className={`relative bg-gradient-to-b from-red-900 via-red-950 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-red-500 max-w-xl w-full overflow-hidden z-10 text-center flex flex-col items-center my-auto ${
                isElderMode ? 'p-6 sm:p-8 border-4 border-amber-400' : ''
              }`}
            >
              {/* Flashing Warning Light decoration */}
              <div className={`rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center mb-3 animate-pulse relative shrink-0 ${
                isElderMode ? 'w-20 h-20' : 'w-16 h-16'
              }`}>
                <span className="absolute inset-0 rounded-full bg-red-500/10 animate-ping pointer-events-none" />
                <span className={`animate-bounce ${isElderMode ? 'text-4xl' : 'text-3xl'}`}>🚨</span>
              </div>

              <span className={`font-black tracking-widest text-amber-300 uppercase bg-red-950 px-3.5 py-1 rounded-full border border-red-700 mb-2 ${
                isElderMode ? 'text-base font-extrabold' : 'text-xs'
              }`}>
                小隊長重要公告
              </span>

              <h2 className={`font-display font-black text-white tracking-wide mb-3 ${
                isElderMode ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-xl md:text-2xl'
              }`}>
                小隊長緊急重要公告！
              </h2>

              <div className={`w-full bg-black/40 rounded-2xl p-4 md:p-6 border border-red-800/80 text-left mb-5 max-h-[350px] overflow-y-auto font-black leading-relaxed text-red-50 break-words whitespace-pre-wrap ${
                isElderMode ? 'text-xl sm:text-2xl p-6 ring-2 ring-red-400/50' : 'text-sm md:text-base'
              }`}>
                {activeAnnouncement.text}
              </div>

              <div className={`font-black text-amber-200/90 mb-5 flex items-center gap-1.5 font-mono ${
                isElderMode ? 'text-base' : 'text-xs'
              }`}>
                <span>🕒 發佈時間：</span>
                <span>{activeAnnouncement.time}</span>
              </div>

              <button
                id="ack-announcement-btn"
                onClick={() => {
                  if (activeAnnouncement) {
                    localStorage.setItem('acknowledged_announcement_id', activeAnnouncement.id);
                    setHasAcknowledgedCurrent(true);
                  }
                }}
                className={`w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-red-950 font-black rounded-2xl transition-all shadow-xl tracking-wider flex items-center justify-center gap-2 animate-bounce mt-1 cursor-pointer border-2 border-amber-200 ${
                  isElderMode ? 'py-4 text-xl sm:text-2xl' : 'py-3.5 text-base'
                }`}
                style={{ animationDuration: '2.5s' }}
              >
                <span>👍 {isElderMode ? '👵 我看懂了，關閉此公告' : '我了解了，已確認此消息'}</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEADER ANNOUNCEMENT STATION MODAL */}
      <AnimatePresence>
        {isLeaderStationOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center min-h-full my-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLeaderStationOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-6 shadow-2xl border border-red-100 max-w-md w-full overflow-hidden z-10 text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsLeaderStationOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-red-100">
                <span className="text-xl">📣</span>
                <h2 className="font-display font-black text-slate-800 text-sm md:text-base tracking-wider">
                  小隊長公告廣播站
                </h2>
              </div>

              {/* Display Active Announcement in Panel */}
              {activeAnnouncement ? (
                <div className="bg-red-50/50 border border-red-100/60 p-3.5 rounded-xl mb-4 text-left">
                  <div className="flex justify-between items-center mb-1.5 select-none">
                    <span className="text-[10px] font-black tracking-wider text-red-700 bg-red-100/70 px-2 py-0.5 rounded-md">
                      目前廣播中
                    </span>
                    <span className="text-[9px] text-red-500/80 font-mono font-bold">
                      {activeAnnouncement.time}
                    </span>
                  </div>
                  <p className="text-xs text-red-800 font-bold leading-relaxed break-words whitespace-pre-wrap mb-2.5">
                    {activeAnnouncement.text}
                  </p>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setHasAcknowledgedCurrent(false);
                        setIsLeaderStationOpen(false); // Close modal to show full alert immediately
                      }}
                      className="text-[10px] bg-red-100 hover:bg-red-200 text-red-700 font-bold px-2 py-1 rounded-md transition-all flex items-center gap-1"
                      title="重新預覽紅色警戒畫面"
                    >
                      <span>👁️</span> 預覽紅色警戒
                    </button>
                    <button
                      onClick={async () => {
                        const isAuth = localStorage.getItem('is_leader_authenticated') === 'true';
                        let pass = '';
                        if (isAuth) {
                          pass = localStorage.getItem('leader_password_key') || 'allking';
                        } else {
                          const promptedPass = prompt('請輸入小隊長密碼以清除公告：');
                          if (promptedPass === null) return;
                          pass = promptedPass;
                        }

                        try {
                          const res = await fetch('/api/announcement', {
                            method: 'DELETE',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ password: pass })
                          });

                          if (res.ok) {
                            localStorage.removeItem('travel_leader_announcement');
                            localStorage.removeItem('acknowledged_announcement_id');
                            setActiveAnnouncement(null);
                            setHasAcknowledgedCurrent(true);
                          } else {
                            const data = await res.json();
                            alert(data.error || '清除失敗！');
                          }
                        } catch (err) {
                          alert('網路連線失敗，請稍後再試！');
                        }
                      }}
                      className="text-[10px] bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 font-bold px-2 py-1 rounded-md transition-all flex items-center gap-1"
                      title="下架或清除目前公告"
                    >
                      <span>🗑️</span> 下架公告
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl mb-4 text-center select-none">
                  <span className="text-2xl block mb-1">📭</span>
                  <p className="text-xs text-slate-400 font-bold">目前暫無發佈中的小隊長公告</p>
                </div>
              )}

              {/* Authentication state */}
              {!isLeaderEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      placeholder="請輸入小隊長密碼"
                      value={leaderPassword}
                      onChange={(e) => {
                        setLeaderPassword(e.target.value);
                        setLeaderAuthError('');
                      }}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-red-400 rounded-xl px-3 py-2 text-xs font-mono font-bold tracking-widest focus:outline-none transition-all"
                    />
                    <button
                      onClick={() => {
                        if (leaderPassword.trim() === 'allking') {
                          localStorage.setItem('is_leader_authenticated', 'true');
                          localStorage.setItem('leader_password_key', 'allking');
                          setIsLeaderEditing(true);
                          setLeaderPassword('');
                          setLeaderAuthError('');
                        } else {
                          setLeaderAuthError('密碼錯誤！');
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shrink-0"
                    >
                      登入
                    </button>
                  </div>
                  {leaderAuthError && (
                    <p className="text-[10px] font-bold text-red-600 text-center">{leaderAuthError}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800">✅ 密碼已確認，可發佈公告</span>
                    <button
                      onClick={() => {
                        localStorage.removeItem('is_leader_authenticated');
                        localStorage.removeItem('leader_password_key');
                        setIsLeaderEditing(false);
                      }}
                      className="text-[9px] bg-white hover:bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded border border-slate-200"
                    >
                      鎖定
                    </button>
                  </div>
                  
                  <textarea
                    placeholder="請在此處輸入緊急公告內容，發佈後將會立即跳出紅色警戒覆蓋頁面！"
                    value={announceInput}
                    onChange={(e) => setAnnounceInput(e.target.value)}
                    maxLength={1000}
                    className="w-full h-24 bg-slate-50 border border-slate-200 focus:border-red-400 focus:bg-white focus:ring focus:ring-red-100 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none transition-all resize-none leading-relaxed"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsLeaderEditing(false);
                        setAnnounceInput('');
                      }}
                      className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2 rounded-xl transition-all text-xs"
                    >
                      取消
                    </button>
                    <button
                      onClick={async () => {
                        const trimmed = announceInput.trim();
                        if (!trimmed) {
                          alert('公告內容不可為空！');
                          return;
                        }

                        const password = localStorage.getItem('leader_password_key') || 'allking';

                        try {
                          const res = await fetch('/api/announcement', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ password, text: trimmed })
                          });

                          if (res.ok) {
                            const data = await res.json();
                            const newAnnounce = data.announcement;

                            localStorage.setItem('travel_leader_announcement', JSON.stringify(newAnnounce));
                            localStorage.removeItem('acknowledged_announcement_id');
                            setActiveAnnouncement(newAnnounce);
                            setHasAcknowledgedCurrent(false);
                            setAnnounceInput('');
                            setIsLeaderStationOpen(false); // Automatically close modal after publishing
                          } else {
                            const data = await res.json();
                            alert(data.error || '發佈失敗！');
                          }
                        } catch (err) {
                          alert('網路連線失敗，請稍後再試！');
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-black py-2 rounded-xl transition-all shadow-md text-xs"
                    >
                      📢 發佈公告
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>



    </div>
  );
}
