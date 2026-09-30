import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Bookmark, ShoppingBag, Battery, Sparkles, Waves } from 'lucide-react';
import { precautions } from '../data';

interface PrecautionsPageProps {
  onNext: () => void;
  onBack: () => void;
  isElderMode: boolean;
  toggleElderMode: () => void;
}

export default function PrecautionsPage({ onNext, onBack, isElderMode, toggleElderMode }: PrecautionsPageProps) {
  // Setup checked items state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('travel_checked_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      'must-1': false,
      'must-2': false,
      'rem-1': false,
      'rem-2': false,
      'rem-3': false,
      'rem-4': false,
      'rem-5': false,
      'rem-6': false,
    };
  });

  const toggleItem = (id: string) => {
    setCheckedItems(prev => {
      const updated = {
        ...prev,
        [id]: !prev[id]
      };
      localStorage.setItem('travel_checked_items', JSON.stringify(updated));
      return updated;
    });
  };

  const totalItems = Object.keys(checkedItems).length;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((checkedCount / totalItems) * 100);

  // Sound or haptic feedback mock (and show fun custom alerts when "本人" is checked or unchecked)
  const isMeChecked = checkedItems['must-2'];
  const isAllChecked = checkedCount === totalItems;

  return (
    <div id="precautions-page" className="min-h-screen wave-bg py-8 px-4 md:px-8 font-sans relative pb-20">
      {/* Summer design top header */}
      <div id="precautions-header" className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-white/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-sky-100/50 shadow-sm">
        <button 
          id="precautions-back-btn"
          onClick={onBack}
          className={`text-slate-500 hover:text-sky-600 transition-colors flex items-center gap-1.5 font-bold cursor-pointer ${isElderMode ? 'text-lg' : 'text-sm'}`}
        >
          ← 返回首頁
        </button>

        <div className="flex items-center gap-3">
          {/* Version Toggle Switch */}
          <button
            id="precautions-version-toggle-btn"
            onClick={toggleElderMode}
            className={`flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 font-extrabold px-3.5 py-1.5 rounded-full border border-sky-200 shadow-sm transition-all duration-300 active:scale-95 cursor-pointer ${
              isElderMode ? 'text-base border-orange-200 text-orange-700' : 'text-xs'
            }`}
          >
            {isElderMode ? '🌟 一般精緻版' : '👵 長輩大字版'}
          </button>

          <div id="precautions-progress-badge" className={`flex items-center gap-1.5 bg-sky-100 text-sky-700 px-3.5 py-1 rounded-full font-bold ${isElderMode ? 'text-base' : 'text-xs'}`}>
            <ShieldCheck size={isElderMode ? 16 : 14} />
            <span>{isElderMode ? '👵 安心出遊安全宣導' : '行前安全宣導'}</span>
          </div>
        </div>
      </div>

      <div id="precautions-content-grid" className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Packing checklist (7 cols) */}
        <div id="packing-checklist-section" className={`lg:col-span-7 bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-sky-100 shadow-md ${isElderMode ? 'ring-4 ring-orange-100' : ''}`}>
          <div id="checklist-title-container" className="flex justify-between items-start mb-6 border-b border-sky-50 pb-4">
            <div>
              <h2 className={`font-display font-black text-slate-800 flex items-center gap-2 ${isElderMode ? 'text-3xl' : 'text-2xl'}`}>
                <span>🎒</span> {isElderMode ? '行前行李檢查表' : '行前打包檢查表'}
              </h2>
              <p className={`text-slate-500 mt-1 ${isElderMode ? 'text-sm font-bold text-slate-600' : 'text-xs'}`}>
                {isElderMode ? '👵 請點擊下面框框進行勾選，帶好了就打勾喔！' : '點擊項目即可勾選，幫自己準備一個無憂無慮的完美假期吧！'}
              </p>
            </div>
            {isMeChecked && (
              <motion.div 
                id="me-checked-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-green-200 ${isElderMode ? 'text-sm' : 'text-xs'}`}
              >
                <span>❤️</span> 身心已備妥！
              </motion.div>
            )}
          </div>

          {/* Progress Tracker bar */}
          <div id="checklist-progress-container" className="mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className={`font-bold text-slate-700 flex items-center gap-1.5 ${isElderMode ? 'text-base' : 'text-sm'}`}>
                <Sparkles size={isElderMode ? 16 : 14} className="text-amber-400" />
                <span>行李準備進度</span>
              </span>
              <span className={`font-mono font-black px-2 py-0.5 rounded-lg transition-colors duration-300 ${
                isAllChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-50 text-sky-600'
              } ${isElderMode ? 'text-base' : 'text-sm'}`}>
                {checkedCount} / {totalItems} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <motion.div 
                id="checklist-progress-bar"
                className={`h-full rounded-full ${
                  isAllChecked ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-sky-400 to-sky-500'
                }`}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Must Brings (✅一定要帶) */}
          <div id="must-bring-group" className="mb-6">
            <h3 className={`font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 mb-4 border border-emerald-100 ${isElderMode ? 'text-base' : 'text-sm'}`}>
              <CheckCircle2 size={isElderMode ? 17 : 15} />
              <span>{isElderMode ? '🚨 必須攜帶（忘記帶會出大事！）' : '✅ 一定要帶 (絕不能漏！)'}</span>
            </h3>
            <div className="space-y-2.5">
              {precautions.mustBring.map((item) => (
                <div 
                  key={item.id}
                  id={`item-card-${item.id}`}
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-300 ${
                    checkedItems[item.id] 
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-400 line-through decoration-slate-300' 
                      : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/10 text-slate-700 shadow-sm'
                  }`}
                >
                  <div className={`mt-0.5 rounded-md flex items-center justify-center transition-all flex-shrink-0 ${
                    isElderMode ? 'w-6 h-6' : 'w-5 h-5'
                  } ${
                    checkedItems[item.id] ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300 bg-white'
                  }`}>
                    {checkedItems[item.id] && <span className={isElderMode ? 'text-sm font-black' : 'text-xs'}>✓</span>}
                  </div>
                  <span className={`font-bold leading-relaxed ${isElderMode ? 'text-lg text-slate-900' : 'text-sm text-slate-700'}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Remember to Bring (✔️記得帶) */}
          <div id="remember-bring-group">
            <h3 className={`font-black text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 mb-4 border border-sky-100 ${isElderMode ? 'text-base' : 'text-sm'}`}>
              <Bookmark size={isElderMode ? 17 : 15} />
              <span>{isElderMode ? '🧳 建議攜帶（讓旅途更舒服）' : '✔️ 記得帶'}</span>
            </h3>
            <div className="space-y-2.5">
              {precautions.rememberBring.map((item) => (
                <div 
                  key={item.id}
                  id={`item-card-${item.id}`}
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-300 ${
                    checkedItems[item.id] 
                      ? 'bg-sky-50/50 border-sky-200 text-slate-400 line-through decoration-slate-300' 
                      : 'bg-white border-slate-200/80 hover:border-sky-300 hover:bg-sky-50/10 text-slate-700 shadow-sm'
                  }`}
                >
                  <div className={`mt-0.5 rounded-md flex items-center justify-center transition-all flex-shrink-0 ${
                    isElderMode ? 'w-6 h-6' : 'w-5 h-5'
                  } ${
                    checkedItems[item.id] ? 'bg-sky-500 text-white' : 'border-2 border-slate-300 bg-white'
                  }`}>
                    {checkedItems[item.id] && <span className={isElderMode ? 'text-sm font-black' : 'text-xs'}>✓</span>}
                  </div>
                  <span className={`font-bold leading-relaxed ${isElderMode ? 'text-lg text-slate-900' : 'text-sm text-slate-700'}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Special Warnings & Next Button (5 cols) */}
        <div id="special-reminders-section" className="lg:col-span-5 space-y-6 flex flex-col justify-between h-full">
          {/* Rules / Reminders Cards */}
          <div id="tips-cards-container" className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-amber-500 animate-bounce" size={isElderMode ? 26 : 22} />
              <h2 className={`font-display font-black text-slate-800 ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
                {isElderMode ? '⚠️ 機場打包注意須知' : '⚠️ 機場與行李特別提醒'}
              </h2>
            </div>
            
            {precautions.specialTips.map((tip, idx) => {
              let displayContent = tip.content;
              if (isElderMode) {
                if (idx === 0) {
                  displayContent = "行動電源、隨身電風扇與相機電池『必須放在隨身包包內』帶上飛機，千萬不可以放進大行李箱托運喔！";
                } else if (idx === 1) {
                  displayContent = "大瓶的乳液、洗面乳、洗髮精『必須放進大行李箱托運』。隨身包包內只能攜帶 100 毫升以下的小瓶液體。";
                } else if (idx === 2) {
                  displayContent = "韓國插頭是『圓孔的雙圓頭』。手機和電子產品要用轉接頭才能充電。小隊長有準備，也建議自備萬用轉接頭！";
                } else if (idx === 3) {
                  displayContent = "注意行李不要裝太重！隨身登機包包不可超過 10 公斤，大行李箱托運重量不要超過 15 公斤喔。";
                }
              }

              return (
                <div 
                  key={idx} 
                  id={`reminder-tip-${idx}`}
                  className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] duration-300 bg-white shadow-sm ${
                    isElderMode ? 'p-5 border-2 border-orange-100' : ''
                  } ${
                    idx === 0 ? 'border-l-4 border-l-red-400 border-slate-100' :
                    idx === 1 ? 'border-l-4 border-l-orange-400 border-slate-100' :
                    idx === 2 ? 'border-l-4 border-l-amber-400 border-slate-100' :
                    'border-l-4 border-l-sky-400 border-slate-100'
                  }`}
                >
                  <h4 className={`font-black text-slate-800 flex items-center gap-1.5 mb-1.5 ${isElderMode ? 'text-lg' : 'text-sm'}`}>
                    <span>{idx === 0 ? '🔋' : idx === 1 ? '🧪' : idx === 2 ? '⚡' : '🧳'}</span>
                    {tip.title}
                  </h4>
                  <p className={`leading-relaxed font-bold ${isElderMode ? 'text-base text-slate-700' : 'text-xs text-slate-600'}`}>
                    {displayContent}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Next Page Navigation Button */}
          <div id="precautions-next-container" className="pt-4 space-y-2">
            <button
              id="precautions-next-btn"
              onClick={isAllChecked ? onNext : undefined}
              disabled={!isAllChecked}
              className={`w-full group inline-flex items-center justify-center gap-3 font-black rounded-2xl shadow-md transition-all duration-300 ${
                isElderMode ? 'py-5 text-xl' : 'py-4 text-base'
              } ${
                isAllChecked 
                  ? 'bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white hover:shadow-lg active:scale-95 cursor-pointer' 
                  : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>{isAllChecked ? (isElderMode ? '👵 檢查完畢！前往下一步' : '我準備好了，下一步選擇組別') : (isElderMode ? `請打勾完所有行李檢查項目 (${checkedCount}/${totalItems})` : `請完成所有行前打包勾選 (${checkedCount}/${totalItems})`)}</span>
              <ArrowRight className={`transition-transform ${isAllChecked ? 'group-hover:translate-x-1' : ''}`} size={isElderMode ? 22 : 18} />
            </button>
            
            {!isAllChecked && (
              <p className={`text-center font-bold animate-pulse text-rose-600 ${isElderMode ? 'text-sm' : 'text-xs'}`}>
                ⚠️ {isElderMode ? '請把左邊的 8 個項目全部打勾，才能按按鈕前往下一步喔！' : '為了確保旅途順利，請勾選完以上 8 個檢查項目以解鎖下一步！'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Beach ground background */}
      <div id="precautions-footer-waves" className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none h-16 opacity-30">
        <div className="sea-wave" />
      </div>
    </div>
  );
}
