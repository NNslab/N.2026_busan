import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plane, Clock, ShieldAlert, ArrowLeft, ArrowRight, Sparkles, Heart, Lock, Key, X } from 'lucide-react';
import { FamilyType } from '../types';

interface SplitPageProps {
  onSelect: (family: FamilyType) => void;
  onBack: () => void;
  isElderMode: boolean;
  toggleElderMode: () => void;
}

export default function SplitPage({ onSelect, onBack, isElderMode, toggleElderMode }: SplitPageProps) {
  const [selectedTeam, setSelectedTeam] = useState<FamilyType | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const handleTeamClick = (team: FamilyType) => {
    localStorage.setItem(`unlocked_family_${team}`, 'true');
    onSelect(team);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

    const trimmedInput = passwordInput.trim();
    if (selectedTeam === 'yun_cen') {
      if (trimmedInput === '920703') {
        localStorage.setItem('unlocked_family_yun_cen', 'true');
        setPasswordModalOpen(false);
        onSelect('yun_cen');
      } else {
        setPasswordError('密碼錯誤，請輸入 芸岑家 專屬密碼！🔑');
      }
    } else if (selectedTeam === 'pei_en') {
      if (trimmedInput === '1040627') {
        localStorage.setItem('unlocked_family_pei_en', 'true');
        setPasswordModalOpen(false);
        onSelect('pei_en');
      } else {
        setPasswordError('密碼錯誤，請輸入 沛恩家 專屬密碼！🔑');
      }
    }
  };

  return (
    <div id="split-page-root" className="min-h-screen wave-bg py-10 px-4 md:px-8 font-sans flex flex-col justify-between relative pb-20 overflow-hidden">
      
      {/* Wave header decor */}
      <div id="split-header" className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 bg-white/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-sky-100/50 shadow-sm z-10">
        <button 
          id="split-back-btn"
          onClick={onBack}
          className={`text-slate-500 hover:text-sky-600 transition-colors flex items-center gap-1.5 font-bold cursor-pointer ${isElderMode ? 'text-lg' : 'text-sm'}`}
        >
          ← 上一步：注意事項
        </button>

        <div className="flex items-center gap-3">
          {/* Version Toggle Switch */}
          <button
            id="split-version-toggle-btn"
            onClick={toggleElderMode}
            className={`flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 font-extrabold px-3 py-1.5 rounded-full border border-sky-200 shadow-sm transition-all duration-300 active:scale-95 cursor-pointer ${
              isElderMode ? 'text-base border-orange-200 text-orange-700' : 'text-xs'
            }`}
          >
            {isElderMode ? '🌟 一般精緻版' : '👵 長輩大字版'}
          </button>

          <div id="split-badge" className={`bg-sky-100 text-sky-700 px-3.5 py-1 rounded-full font-bold flex items-center gap-1 ${isElderMode ? 'text-base' : 'text-xs'}`}>
            <Users size={isElderMode ? 15 : 13} />
            <span>{isElderMode ? '👵 請選擇您的家族組別' : '選擇組別分流'}</span>
          </div>
        </div>
      </div>

      {/* Main selection content */}
      <main id="split-main" className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center items-center z-10">
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-display font-black text-slate-800 ${isElderMode ? 'text-4xl md:text-5xl text-sky-950' : 'text-3xl md:text-4xl'}`}
          >
            {isElderMode ? '👵 請點選您要看的手冊組別 🏖️' : '請問您是哪一個小隊的呢？🏖️'}
          </motion.h2>
        </div>

        {/* The two choice cards */}
        <div id="family-cards-container" className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          
          {/* Option A: 芸岑家 */}
          <motion.div
            id="yun-cen-card"
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTeamClick('yun_cen')}
            className={`group cursor-pointer bg-white/95 rounded-3xl p-8 border border-sky-100 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px] ${
              isElderMode ? 'border-2 border-teal-200 shadow-lg p-9 ring-4 ring-teal-50' : ''
            }`}
          >
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-colors" />
            <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />

            <div id="yun-cen-content" className="text-center md:text-left">
              {/* Header Badge or Decor */}
              <div className="flex justify-center md:justify-between items-center mb-4">
                <span className={isElderMode ? 'text-5xl' : 'text-4xl'}>🐚</span>
              </div>

              {/* Title */}
              <h3 className={`font-display font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors flex items-center justify-center md:justify-start gap-1.5 ${
                isElderMode ? 'text-4xl font-black' : 'text-3xl'
              }`}>
                <span>芸岑家</span>
                <Sparkles size={isElderMode ? 20 : 16} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
              </h3>
              <p className={`font-bold text-slate-500 ${isElderMode ? 'text-base text-slate-600 mt-1.5' : 'text-sm'}`}>
                {isElderMode ? '👉 點這裡，直接查看行程表' : '點選直接開啟 芸岑家 專屬行程表'}
              </p>
            </div>

            {/* Action footer */}
            <div className={`mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-teal-600 font-extrabold ${isElderMode ? 'text-lg' : 'text-sm'}`}>
              <span>{isElderMode ? '✨ 點擊載入行程表' : '直接載入行程'}</span>
              <div className="bg-teal-50 p-2 rounded-full group-hover:bg-teal-500 group-hover:text-white transition-all">
                <ArrowRight size={isElderMode ? 18 : 16} />
              </div>
            </div>
          </motion.div>

          {/* Option B: 沛恩家 */}
          <motion.div
            id="pei-en-card"
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTeamClick('pei_en')}
            className={`group cursor-pointer bg-white/95 rounded-3xl p-8 border border-orange-100 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px] ${
              isElderMode ? 'border-2 border-orange-200 shadow-lg p-9 ring-4 ring-orange-50' : ''
            }`}
          >
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors" />
            <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors" />

            <div id="pei-en-content" className="text-center md:text-left">
              {/* Header Badge or Decor */}
              <div className="flex justify-center md:justify-between items-center mb-4">
                <span className={isElderMode ? 'text-5xl' : 'text-4xl'}>🌴</span>
              </div>

              {/* Title */}
              <h3 className={`font-display font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition-colors flex items-center justify-center md:justify-start gap-1.5 ${
                isElderMode ? 'text-4xl font-black' : 'text-3xl'
              }`}>
                <span>沛恩家</span>
                <Sparkles size={isElderMode ? 20 : 16} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
              </h3>
              <p className={`font-bold text-slate-500 ${isElderMode ? 'text-base text-slate-600 mt-1.5' : 'text-sm'}`}>
                {isElderMode ? '👉 點這裡，直接查看行程表' : '點選直接開啟 沛恩家 專屬行程表'}
              </p>
            </div>

            {/* Action footer */}
            <div className={`mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-orange-600 font-extrabold ${isElderMode ? 'text-lg' : 'text-sm'}`}>
              <span>{isElderMode ? '✨ 點擊載入行程表' : '直接載入行程'}</span>
              <div className="bg-orange-50 p-2 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-all">
                <ArrowRight size={isElderMode ? 18 : 16} />
              </div>
            </div>
          </motion.div>

        </div>


      </main>

      {/* Password Modal Dialog */}
      <AnimatePresence>
        {passwordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPasswordModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-sky-100 max-w-md w-full overflow-hidden z-10 ${
                isElderMode ? 'p-8 border-2 border-orange-200 ring-4 ring-orange-50' : ''
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setPasswordModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className={`rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mx-auto mb-3 ${
                  isElderMode ? 'w-14 h-14' : 'w-12 h-12'
                }`}>
                  <Key size={isElderMode ? 28 : 24} />
                </div>
                <h3 className={`font-display font-black text-slate-800 ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
                  輸入 {selectedTeam === 'yun_cen' ? '芸岑家' : '沛恩家'} 專屬密碼
                </h3>
                <p className={`font-bold text-slate-500 mt-1.5 ${isElderMode ? 'text-sm text-slate-600' : 'text-xs'}`}>
                  {isElderMode ? '👵 請在下方框框輸入 6 位數密碼以解鎖' : '請輸入 6 位數密碼以載入您的安全手冊版本'}
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className={`block font-black text-slate-600 mb-1.5 uppercase tracking-wide ${isElderMode ? 'text-sm' : 'text-xs'}`}>
                    行程密碼 (Password)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setPasswordError('');
                      }}
                      placeholder={isElderMode ? "請輸入 6 位數密碼" : "請輸入密碼..."}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:ring focus:ring-sky-100 rounded-xl px-4 py-3 text-slate-800 text-center font-mono tracking-widest text-lg font-bold placeholder:text-slate-300 placeholder:font-sans placeholder:text-sm placeholder:tracking-normal transition-all"
                      autoFocus
                    />
                  </div>
                </div>

                {passwordError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-rose-500 font-bold text-center bg-rose-50 border border-rose-100 py-2 rounded-lg ${
                      isElderMode ? 'text-sm p-3' : 'text-xs'
                    }`}
                  >
                    {passwordError}
                  </motion.div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPasswordModalOpen(false)}
                    className={`flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2.5 rounded-xl transition-all cursor-pointer ${
                      isElderMode ? 'text-base py-3' : 'text-sm'
                    }`}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 bg-sky-500 hover:bg-sky-600 text-white font-black py-2.5 rounded-xl transition-all shadow-sm cursor-pointer ${
                      isElderMode ? 'text-base py-3' : 'text-sm'
                    }`}
                  >
                    確認解鎖
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Decorative Beach ground background */}
      <div id="split-footer-waves" className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none h-16 opacity-30">
        <div className="sea-wave" />
      </div>
    </div>
  );
}
