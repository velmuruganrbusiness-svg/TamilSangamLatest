
import React from 'react';
import { t, Language } from '../utils/translations';
import { Icon } from './Icon';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="bg-white border-t border-stone-200 dark:bg-[#111111] dark:border-neutral-800 mt-auto transition-colors duration-300">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Left Side: Brand */}
            <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-500 order-1 md:order-1">
                <Icon name="brand-logo" />
                <span className="font-bold font-tamil text-xl text-stone-800 dark:text-stone-100">தமிழ்ச் சங்கம்</span>
            </div>
            
            {/* Center: Navigation Links */}
            <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-stone-500 dark:text-stone-400 order-2 md:order-2">
                <a href="#" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">{t('about', language)}</a>
                <a href="#" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">{t('contact', language)}</a>
                <a href="#" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">{t('terms', language)}</a>
            </div>
            
            {/* Right Side: Social Icons & Copyright */}
            <div className="flex flex-col items-center md:items-end gap-4 order-3 md:order-3">
                <div className="flex gap-4 text-stone-400 dark:text-stone-500">
                    <a href="#" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors transform hover:scale-110 duration-200"><Icon name="linkedin" /></a>
                    <a href="#" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors transform hover:scale-110 duration-200"><Icon name="instagram" /></a>
                    <a href="#" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors transform hover:scale-110 duration-200"><Icon name="youtube" /></a>
                    <a href="#" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors transform hover:scale-110 duration-200"><Icon name="twitter" /></a>
                    <a href="#" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors transform hover:scale-110 duration-200"><Icon name="facebook" /></a>
                </div>
                <div className="flex flex-col md:items-end gap-1 text-stone-400 dark:text-stone-600 text-sm text-center md:text-right">
                    <span>&copy; {new Date().getFullYear()} {t('copyright', language)}</span>
                    <span className="text-xs opacity-75 hover:opacity-100 transition-opacity">{t('maintainedBy', language)}</span>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};
