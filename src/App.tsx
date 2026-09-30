import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CoverPage from './components/CoverPage';
import PrecautionsPage from './components/PrecautionsPage';
import SplitPage from './components/SplitPage';
import ItineraryPage from './components/ItineraryPage';
import { FamilyType } from './types';

export default function App() {
  // Synchronous client state reset check to guarantee clean slate for all users
  if (typeof window !== 'undefined' && localStorage.getItem('travel_reset_v3_20260716') !== 'true') {
    localStorage.clear();
    localStorage.setItem('travel_reset_v3_20260716', 'true');
  }

  const [isElderMode, setIsElderMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('travel_elder_mode') === 'true';
    }
    return false;
  });

  const toggleElderMode = () => {
    setIsElderMode(prev => {
      const updated = !prev;
      localStorage.setItem('travel_elder_mode', String(updated));
      return updated;
    });
  };

  const [currentPage, setCurrentPage] = useState<'cover' | 'precautions' | 'split' | 'itinerary'>(() => {
    const saved = localStorage.getItem('travel_current_page');
    if (saved === 'cover' || saved === 'precautions' || saved === 'split' || saved === 'itinerary') {
      return saved;
    }
    return 'cover';
  });
  const [selectedFamily, setSelectedFamily] = useState<FamilyType>(() => {
    const saved = localStorage.getItem('travel_selected_family');
    if (saved === 'yun_cen' || saved === 'pei_en') {
      return saved as FamilyType;
    }
    return 'yun_cen';
  });

  const handleStart = () => {
    setCurrentPage('precautions');
    localStorage.setItem('travel_current_page', 'precautions');
  };

  const handlePrecautionsNext = () => {
    setCurrentPage('split');
    localStorage.setItem('travel_current_page', 'split');
  };

  const handlePrecautionsBack = () => {
    setCurrentPage('cover');
    localStorage.setItem('travel_current_page', 'cover');
  };

  const handleFamilySelect = (family: FamilyType) => {
    setSelectedFamily(family);
    setCurrentPage('itinerary');
    localStorage.setItem('travel_selected_family', family);
    localStorage.setItem('travel_current_page', 'itinerary');
  };

  const handleSplitBack = () => {
    setCurrentPage('precautions');
    localStorage.setItem('travel_current_page', 'precautions');
  };

  const handleBackToCover = () => {
    setCurrentPage('cover');
    localStorage.setItem('travel_current_page', 'cover');
  };

  return (
    <div id="app-root" className={`min-h-screen wave-bg select-none ${isElderMode ? 'elder-mode' : ''}`}>
      <AnimatePresence mode="wait">
        {currentPage === 'cover' && (
          <motion.div
            key="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CoverPage 
              onStart={handleStart} 
              isElderMode={isElderMode} 
              toggleElderMode={toggleElderMode} 
            />
          </motion.div>
        )}

        {currentPage === 'precautions' && (
          <motion.div
            key="precautions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <PrecautionsPage 
              onNext={handlePrecautionsNext} 
              onBack={handlePrecautionsBack} 
              isElderMode={isElderMode} 
              toggleElderMode={toggleElderMode} 
            />
          </motion.div>
        )}

        {currentPage === 'split' && (
          <motion.div
            key="split"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SplitPage 
              onSelect={handleFamilySelect} 
              onBack={handleSplitBack} 
              isElderMode={isElderMode} 
              toggleElderMode={toggleElderMode} 
            />
          </motion.div>
        )}

        {currentPage === 'itinerary' && (
          <motion.div
            key="itinerary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ItineraryPage 
              initialFamily={selectedFamily} 
              onBackToCover={handleBackToCover} 
              isElderMode={isElderMode} 
              toggleElderMode={toggleElderMode} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
