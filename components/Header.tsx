
import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../types';
import { Icon } from './Icon';
import { t, Language } from '../utils/translations';

interface HeaderProps {
  currentUser: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onNavigate: (page: 'home' | 'editor') => void;
  language: Language;
  theme: 'light' | 'dark';
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  onLoginClick, 
  onLogout, 
  onNavigate,
  language,
  theme,
  onToggleLanguage,
  onToggleTheme,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 border-b border-[#3e2b22]/20 dark:border-[#5c4235] bg-white/60 dark:bg-[#2b1d16]/80 backdrop-blur-md sticky top-0 z-30 transition-all duration-300">
      <div className="h-full px-6 flex items-center justify-end gap-4">
        {/* Global Controls */}
        <div className="flex items-center bg-[#fdf8f1] dark:bg-[#1a1a1a] rounded-full p-1 border border-[#eaddcf] dark:border-[#3e2b22]">
          <button
            onClick={onToggleLanguage}
            className="w-9 h-9 flex items-center justify-center text-[10px] font-bold tracking-wider text-[#8a7060] hover:text-rose-600 dark:text-[#a89f91] dark:hover:text-rose-400 rounded-full transition-all"
            title={t('toggleLanguage', language)}
          >
            {language === 'ta' ? 'EN' : 'தமிழ்'}
          </button>
          
          <button
            onClick={onToggleTheme}
            className="w-9 h-9 flex items-center justify-center text-[#8a7060] hover:text-rose-600 dark:text-[#a89f91] dark:hover:text-rose-400 rounded-full transition-all"
            title={t('toggleTheme', language)}
          >
            <Icon name={theme === 'light' ? 'moon' : 'sun'} />
          </button>
        </div>

        <button
          onClick={() => onNavigate('editor')}
          className="hidden sm:inline-flex items-center space-x-2 px-6 py-2 text-sm font-bold rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
        >
          <Icon name="plus" />
          <span>{t('write', language)}</span>
        </button>

        <div className="h-8 w-px bg-[#eaddcf] dark:bg-[#3e2b22] hidden sm:block"></div>

        {currentUser ? (
          <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="flex items-center transition-transform hover:scale-105 focus:outline-none"
            >
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                className="w-10 h-10 rounded-full border-2 border-[#eaddcf] dark:border-[#3e2b22] shadow-sm object-cover" 
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-[#fdf8f1] dark:bg-[#1a1a1a] rounded-2xl shadow-2xl py-2 border border-[#eaddcf] dark:border-[#3e2b22] animate-fade-in">
                <div className="px-5 py-3 border-b border-[#eaddcf]/50 dark:border-[#3e2b22]">
                  <p className="text-[#8a7060] text-[10px] uppercase font-bold tracking-widest">Signed in as</p>
                  <p className="font-bold text-[#3e2b22] dark:text-white truncate">{currentUser.name}</p>
                </div>
                <div className="py-2">
                    <button
                        onClick={() => { onNavigate('editor'); setDropdownOpen(false); }}
                        className="w-full text-left px-5 py-2.5 text-sm text-[#5c4235] dark:text-[#a89f91] hover:bg-[#eaddcf]/30 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2 sm:hidden"
                    >
                        <Icon name="plus" /> {t('write', language)}
                    </button>
                    <button
                        onClick={() => { onLogout(); setDropdownOpen(false); }}
                        className="w-full text-left px-5 py-2.5 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-neutral-800 transition-colors font-bold flex items-center gap-2"
                    >
                        <Icon name="close" /> {t('logout', language)}
                    </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="inline-flex items-center px-6 py-2 text-sm font-bold rounded-full border-2 border-[#eaddcf] dark:border-[#3e2b22] text-[#5c4235] dark:text-[#a89f91] hover:border-rose-600 hover:text-rose-600 dark:hover:border-rose-500 dark:hover:text-rose-500 transition-all"
          >
            {t('login', language)}
          </button>
        )}
      </div>
    </header>
  );
};
