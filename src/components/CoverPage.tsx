import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, Waves, Calendar, MapPin, Compass, ArrowRight, Heart } from 'lucide-react';
import { busanIntro } from '../data';
import Fireworks from './Fireworks';

interface CoverPageProps {
  onStart: () => void;
  isElderMode: boolean;
  toggleElderMode: () => void;
}

export default function CoverPage({ onStart, isElderMode, toggleElderMode }: CoverPageProps) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [collectedShells, setCollectedShells] = useState<number>(() => {
    const saved = localStorage.getItem('travel_collected_shells');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [shellMessage, setShellMessage] = useState<string>('');
  const [showFireworks, setShowFireworks] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string>('https://lh3.googleusercontent.com/d/1PjkAiIdNeN48r8LSqC3gF_zIOfAcQCT_');
  const [imageFallbackLevel, setImageFallbackLevel] = useState<number>(0);

  // Fireworks 2-second timer
  useEffect(() => {
    if (showFireworks) {
      const timer = setTimeout(() => {
        setShowFireworks(false);
      }, 2000); // Trigger fireworks for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [showFireworks]);

  // Target date: July 30, 2026
  useEffect(() => {
    const targetDate = new Date('2026-07-30T00:00:00');
    const currentDate = new Date();
    
    // Normalize both dates to midnight to calculate pure date differences
    const tDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const cDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    const diffTime = tDate.getTime() - cDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays);
  }, []);

  const handleImageError = () => {
    if (imageFallbackLevel === 0) {
      // Fallback 1: Google Drive Thumbnail link which bypasses many iframe/cross-site/cookie restrictions
      setImageSrc('https://drive.google.com/thumbnail?id=1PjkAiIdNeN48r8LSqC3gF_zIOfAcQCT_&sz=w1200');
      setImageFallbackLevel(1);
    } else if (imageFallbackLevel === 1) {
      // Fallback 2: Direct download/view link format
      setImageSrc('https://drive.google.com/uc?export=download&id=1PjkAiIdNeN48r8LSqC3gF_zIOfAcQCT_');
      setImageFallbackLevel(2);
    } else if (imageFallbackLevel === 2) {
      // Fallback 3: Ultimate failure protection
      setImageFallbackLevel(3);
    }
  };

  const handleShellClick = (index: number) => {
    setCollectedShells(prev => {
      const updated = prev + 1;
      localStorage.setItem('travel_collected_shells', updated.toString());
      if (updated >= 100 && Math.floor(updated / 100) > Math.floor(prev / 100)) {
        setShowFireworks(true);
      }
      return updated;
    });
    const messages = [
      '🐚 拾獲一枚美麗的廣安里貝殼！',
      '⭐ 發現了一顆閃亮的海星！',
      '🦀 喔呀！一隻可愛的小螃蟹向你招手！',
      '🍦 撿到了香甜的黑糖餅碎片！',
      '🎨 拿到甘川文化村的小王子印章！'
    ];
    setShellMessage(messages[index % messages.length]);
    setTimeout(() => setShellMessage(''), 3000);
  };

  return (
    <div id="cover-page-root" className="relative min-h-screen wave-bg flex flex-col justify-between overflow-hidden font-sans pb-12">
      {/* Summer Beach Decoration Elements */}
      {/* Sun */}
      <motion.div 
        id="sun-element"
        className="absolute top-10 right-10 md:top-16 md:right-16 text-amber-400 opacity-80"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
      >
        <Sun size={96} strokeWidth={1.5} className="filter drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
      </motion.div>

      {/* Clouds */}
      <motion.div 
        id="cloud-1"
        className="absolute top-20 left-[10%] w-24 h-8 bg-white/70 rounded-full blur-[1px]"
        animate={{ x: [0, 40, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />
      <motion.div 
        id="cloud-2"
        className="absolute top-40 right-[20%] w-32 h-10 bg-white/60 rounded-full blur-[2px] hidden md:block"
        animate={{ x: [0, -60, 0] }}
        transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
      />

      {/* Floating Seagulls */}
      <motion.div 
        id="seagull-1"
        className="absolute top-32 left-[15%] text-sky-400 opacity-60"
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        <svg width="32" height="16" viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 14C8 10 12 14 16 8C20 14 24 10 30 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </motion.div>
      <motion.div 
        id="seagull-2"
        className="absolute top-24 right-[30%] text-sky-400 opacity-50"
        animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 5, delay: 0.5, ease: "easeInOut" }}
      >
        <svg width="24" height="12" viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 14C8 10 12 14 16 8C20 14 24 10 30 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </motion.div>

      {/* Animated Beach Capsule Train sliding along the beach line */}
      <motion.div 
        id="beach-capsule-train"
        className="absolute bottom-[100px] left-[-150px] flex items-center justify-center bg-gradient-to-r from-red-400 to-amber-400 text-white p-2 rounded-full shadow-md z-10"
        animate={{ x: ['calc(0vw - 100px)', 'calc(100vw + 150px)'] }}
        transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
      >
        <span className="text-lg leading-none">🚃</span>
      </motion.div>

      {/* Top Header info */}
      <header id="cover-header" className="w-full max-w-5xl mx-auto px-6 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 z-10">
        {daysLeft !== null && (
          <div id="countdown-banner" className={`bg-amber-100/90 hover:bg-amber-200/90 text-amber-900 font-bold px-4 py-1.5 rounded-full shadow-md border border-amber-200/80 flex items-center gap-1.5 transition-colors duration-300 ${isElderMode ? 'text-lg px-5 py-2' : 'text-sm'}`}>
            <Calendar size={isElderMode ? 18 : 15} />
            {daysLeft > 0 ? (
              <>
                <span>出發倒數</span>
                <span className={`font-mono font-black bg-white/95 text-amber-600 px-1.5 rounded min-w-[24px] text-center shadow-xs ${isElderMode ? 'text-xl' : 'text-base'}`}>{daysLeft}</span>
                <span>天</span>
              </>
            ) : daysLeft === 0 ? (
              <span className="text-amber-700 animate-pulse font-black">🎉 今天出發囉！</span>
            ) : (
              <span className="text-amber-700 font-black">✨ 釜山湛藍漫遊中！</span>
            )}
          </div>
        )}

        {/* Version Switch Button */}
        <button
          id="cover-version-toggle-btn"
          onClick={toggleElderMode}
          className={`flex items-center gap-2 bg-white/95 hover:bg-slate-50 text-slate-700 font-black px-4.5 py-2 rounded-full border-2 border-sky-300 shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer ${
            isElderMode ? 'text-base px-6 py-3 border-orange-300 text-orange-700' : 'text-xs'
          }`}
        >
          {isElderMode ? (
            <>
              <span>🌟</span>
              <span>切換回【一般精緻版】</span>
            </>
          ) : (
            <>
              <span>👵</span>
              <span>切換至【長輩大字版】</span>
            </>
          )}
        </button>
      </header>

      {/* Main Intro Content */}
      <main id="cover-main" className="flex-1 max-w-3xl mx-auto px-6 flex flex-col justify-center items-center text-center z-10 my-8">
        <motion.div
          id="intro-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`flex items-center gap-1.5 bg-orange-100/80 backdrop-blur-sm border border-orange-200/50 text-orange-600 px-3.5 py-1 rounded-full font-bold uppercase tracking-wider mb-6 ${
            isElderMode ? 'text-sm px-5 py-1.5' : 'text-xs'
          }`}
        >
          <Compass size={isElderMode ? 15 : 13} className="animate-spin" style={{ animationDuration: '6s' }} />
          <span>{isElderMode ? '👵 釜山安心慢遊手冊' : '夏季度假旅遊手冊'}</span>
        </motion.div>

        <motion.h1
          id="intro-title"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={`font-display font-black tracking-tight text-slate-800 leading-tight mb-4 ${
            isElderMode ? 'text-5xl md:text-7xl text-sky-900' : 'text-4xl md:text-6xl'
          }`}
        >
          {busanIntro.title}
        </motion.h1>

        <motion.p
          id="intro-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`font-mono text-sky-600 font-extrabold tracking-widest uppercase mb-6 flex items-center gap-2 ${
            isElderMode ? 'text-base md:text-2xl' : 'text-sm md:text-lg'
          }`}
        >
          <span>✦</span> {busanIntro.subtitle} <span>✦</span>
        </motion.p>

        {isElderMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-amber-50/90 border-2 border-amber-200 p-5 rounded-3xl shadow-md text-slate-800 max-w-xl mx-auto"
          >
            <p className="text-xl md:text-2xl font-black text-amber-900 mb-1 flex items-center justify-center gap-2">
              <span>👴👵</span>
              <span>歡迎爸爸媽媽與長輩！</span>
            </p>
            <p className="text-base md:text-lg font-bold leading-relaxed text-slate-700">
              這裡為您準備了<span className="text-orange-600 font-black underline">特大字體與簡潔內容</span>的版本，讓您看行程不吃力，開開心心出發，平平安安旅遊！
            </p>
          </motion.div>
        )}

        <motion.div
          id="intro-divider"
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-1 bg-gradient-to-r from-sky-400 via-orange-300 to-amber-300 rounded-full mb-8"
        />

        {/* We are in Busan Group Photo / Vector Illustration */}
        <motion.div
          id="group-photo-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-xl mx-auto my-6 flex justify-center select-none"
        >
          {imageFallbackLevel === 3 ? (
            <div id="postcard-fallback" className="w-full max-w-md bg-white p-5 pb-12 rounded-2xl shadow-xl border border-slate-200/80 rotate-[-1deg] hover:rotate-[1deg] transition-all duration-300 flex flex-col items-center">
              <div className="w-full aspect-[4/3] bg-gradient-to-tr from-sky-400/10 via-orange-300/15 to-amber-300/10 rounded-xl border border-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 text-2xl">🏖️</div>
                <div className="absolute bottom-4 right-4 text-2xl">🐚</div>
                <Waves className="text-sky-400 animate-bounce mb-3" size={48} />
                <span className={`font-bold text-slate-700 tracking-wider ${isElderMode ? 'text-2xl' : 'text-lg'}`}>OUR BUSAN VACATION</span>
                <span className="text-xs text-slate-500 mt-1">2026.07.30 - 08.03</span>
              </div>
              <div className={`mt-6 text-center text-slate-700 font-extrabold tracking-wide flex items-center gap-1.5 ${isElderMode ? 'text-lg' : 'text-sm'}`}>
                <span>💖</span> 釜山回憶 ✦ 我們出發吧！
              </div>
            </div>
          ) : (
            <img 
              src={imageSrc} 
              alt="Busan Memories" 
              referrerPolicy="no-referrer"
              onError={handleImageError}
              className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-500"
            />
          )}
        </motion.div>



        {/* Start Button */}
        <motion.div
          id="start-button-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-12"
        >
          <button
            id="start-guide-btn"
            onClick={onStart}
            className={`group relative inline-flex items-center gap-3 bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-600 hover:to-sky-500 text-white font-black rounded-full shadow-lg transition-all duration-300 active:scale-95 cursor-pointer ${
              isElderMode 
                ? 'text-2xl px-12 py-5 shadow-sky-300 hover:shadow-xl scale-105' 
                : 'text-lg px-8 py-4 shadow-sky-200 hover:shadow-xl hover:scale-105'
            }`}
          >
            <span>{isElderMode ? '👵 進入放大版手冊' : '開始探索手冊'}</span>
            <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={isElderMode ? 24 : 20} />
          </button>
        </motion.div>
      </main>

      {/* Shell Collect Interactive Game in the footer area */}
      <div id="beach-sand-floor" className="relative w-full z-10 flex flex-col items-center mt-6">
        {shellMessage && (
          <motion.div
            id="shell-game-popup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-16 bg-white/95 text-slate-800 text-xs px-3.5 py-2 rounded-xl shadow-md border border-orange-100 flex items-center gap-1.5"
          >
            <span>{shellMessage}</span>
          </motion.div>
        )}
        
        {/* Decorative Shells on the Beach floor */}
        <div id="interactive-shells-container" className="flex items-center gap-8 text-2xl cursor-pointer">
          <motion.span 
            id="shell-1-btn"
            whileHover={{ scale: 1.3, rotate: 15 }} 
            onClick={() => handleShellClick(0)}
            className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:brightness-110 active:scale-90 select-none"
          >
            🐚
          </motion.span>
          <motion.span 
            id="shell-2-btn"
            whileHover={{ scale: 1.3, rotate: -20 }} 
            onClick={() => handleShellClick(1)}
            className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:brightness-110 active:scale-90 select-none"
          >
            ⭐
          </motion.span>
          <motion.span 
            id="shell-3-btn"
            whileHover={{ scale: 1.3, rotate: 10 }} 
            onClick={() => handleShellClick(2)}
            className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:brightness-110 active:scale-90 select-none"
          >
            🦀
          </motion.span>
          <motion.span 
            id="shell-4-btn"
            whileHover={{ scale: 1.3, rotate: -15 }} 
            onClick={() => handleShellClick(3)}
            className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:brightness-110 active:scale-90 select-none"
          >
            🏖️
          </motion.span>
        </div>
        
        <div className="flex flex-col items-center justify-center gap-1.5 mt-2 z-10">
          <div id="shell-counter" className="text-[11.5px] text-slate-500 font-semibold bg-amber-50/85 backdrop-blur-sm px-3 py-1 rounded-full border border-amber-100/50 flex items-center gap-1 shadow-xs">
            <span>已收集沙灘寶藏:</span>
            <span className="font-black text-orange-500 font-mono text-xs">{collectedShells}</span>
            <span>個</span>
          </div>
          <span className={`text-slate-400 font-medium tracking-wide animate-pulse text-center block ${isElderMode ? 'text-[12px]' : 'text-[10px]'}`}>
            ✨ 收集沙灘寶藏出發驚喜特效！ ✨
          </span>
        </div>
      </div>

      {/* Waves footer visual effect */}
      <div id="cover-bottom-waves" className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none h-20">
        <div className="sea-wave" />
      </div>

      {/* Fireworks overlay celebrate 100 treasures */}
      {showFireworks && <Fireworks />}
    </div>
  );
}
