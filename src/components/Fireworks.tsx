import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class for explosion sparks
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
      color: string;
      gravity: number;
      friction: number;
      size: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.012 + 0.008;
        this.color = color;
        this.gravity = 0.05;
        this.friction = 0.96;
        this.size = Math.random() * 2 + 1.5;
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.shadowBlur = 12;
        c.shadowColor = this.color;
        c.fill();
        c.restore();
      }
    }

    // Rocket shell class
    class Rocket {
      x: number;
      y: number;
      tx: number;
      ty: number;
      vx: number;
      vy: number;
      color: string;
      exploded: boolean;

      constructor() {
        this.x = Math.random() * width;
        this.y = height;
        this.tx = Math.random() * width;
        this.ty = Math.random() * (height * 0.6);
        const angle = Math.atan2(this.ty - this.y, this.tx - this.x);
        const speed = Math.random() * 5 + 11;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        const colors = [
          '#ff4d4d', '#ff944d', '#ffd14d', '#4dff4d',
          '#4dffff', '#4d94ff', '#944dff', '#ff4dff',
          '#ff3385', '#00ffcc', '#ffcc00', '#ff0055'
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.exploded = false;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Check if close to target height or falling down
        if (this.vy >= 0 || this.y <= this.ty) {
          this.exploded = true;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, 3, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.shadowBlur = 10;
        c.shadowColor = this.color;
        c.fill();
        c.restore();
      }
    }

    let rockets: Rocket[] = [];
    let particles: Particle[] = [];

    const spawnRocket = () => {
      if (rockets.length < 6) {
        rockets.push(new Rocket());
      }
    };

    let spawnTimer = 0;

    const tick = () => {
      // Clear with composite destination-out to keep trail, or clear rect for perfect clean overlays
      ctx.clearRect(0, 0, width, height);

      spawnTimer++;
      // Spawn rockets regularly
      if (spawnTimer % 18 === 0) {
        spawnRocket();
      }

      // Update and draw rockets
      rockets = rockets.filter((r) => {
        r.update();
        if (r.exploded) {
          // Explosion burst
          const count = Math.floor(Math.random() * 50) + 60;
          for (let i = 0; i < count; i++) {
            particles.push(new Particle(r.x, r.y, r.color));
          }
          return false;
        }
        r.draw(ctx);
        return true;
      });

      // Update and draw particles
      particles = particles.filter((p) => {
        p.update();
        p.draw(ctx);
        return p.alpha > 0;
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div id="fireworks-container" className="fixed inset-0 w-full h-full pointer-events-none z-50">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
