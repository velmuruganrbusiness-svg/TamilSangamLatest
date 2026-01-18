
import React from 'react';
import { t, Language } from '../utils/translations';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="bg-bone dark:bg-stone-950 border-t border-[#EDEDED] dark:border-stone-900 transition-colors">
      <div className="max-w-5xl mx-auto py-8 px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] font-semibold tracking-tight text-stone-600 dark:text-stone-400">
            <div className="text-center md:text-left">
                <span>© 2026 VetriZen. {t('tagline', language)}.</span>
            </div>
            
            <div className="flex gap-6">
                <a href="#" className="hover:text-zen-green transition-all duration-300">Privacy Policy</a>
                <a href="#" className="hover:text-zen-green transition-all duration-300">Terms</a>
            </div>
        </div>
      </div>
    </footer>
  );
};
