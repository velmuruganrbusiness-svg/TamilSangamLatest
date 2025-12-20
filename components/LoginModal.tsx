import React from 'react';
import { Icon } from './Icon';
import { t, Language } from '../utils/translations';

interface LoginModalProps {
  onClose: () => void;
  onLogin: () => void;
  language: Language;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, language }) => {
  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-2xl max-w-md w-full p-8 md:p-10 relative overflow-hidden ring-1 ring-black/5">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors">
          <Icon name="close" />
        </button>
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/10 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
             <Icon name="brand-logo" />
          </div>
          <h2 className="text-3xl font-bold font-tamil mb-2 text-stone-900 dark:text-white">{t('loginRegister', language)}</h2>
          <p className="text-stone-500 dark:text-stone-400 font-medium">{t('loginPrompt', language)}</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onLogin} 
            className="w-full flex items-center justify-center px-4 py-4 border border-stone-200 rounded-xl text-base font-bold text-stone-700 bg-white hover:bg-stone-50 hover:border-stone-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-stone-200 dark:hover:bg-neutral-700 transition-all shadow-sm"
          >
            <Icon name="google" />
            <span className="ml-3">{t('continueWithGoogle', language)}</span>
          </button>
          
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200 dark:border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-stone-400 font-medium dark:bg-[#1a1a1a] dark:text-stone-500">{t('or', language)}</span>
            </div>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="space-y-4 mb-6">
                <input 
                type="email" 
                placeholder={t('emailPlaceholder', language)}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:bg-white text-stone-900 dark:bg-neutral-900 dark:border-neutral-800 dark:text-white dark:focus:ring-rose-500/50 transition-all font-medium" 
                />
            </div>
            <button 
              type="submit" 
              className="w-full px-6 py-4 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-xl shadow-rose-600/20 active:scale-95 transition-all duration-200"
            >
              {t('continueWithEmail', language)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};