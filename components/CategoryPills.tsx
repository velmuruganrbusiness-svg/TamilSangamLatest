
import React from 'react';
import type { Category } from '../types';
import { t, Language } from '../utils/translations';

interface CategoryPillsProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
  language: Language;
}

const categories: Category[] = ['கவிதை', 'கதை', 'கட்டுரை', 'மேற்கோள்'];

export const CategoryPills: React.FC<CategoryPillsProps> = ({ selectedCategory, onSelectCategory, language }) => {
  return (
    <div className="flex flex-nowrap md:flex-wrap items-center gap-8 px-2 py-2">
      <CategoryItem 
        label={t('all', language)} 
        isActive={!selectedCategory} 
        onClick={() => onSelectCategory(null)} 
      />
      {categories.map(category => (
        <CategoryItem 
            key={category}
            label={category} 
            isActive={selectedCategory === category} 
            onClick={() => onSelectCategory(category)} 
        />
      ))}
    </div>
  );
};

const CategoryItem: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`group relative px-2 py-1 text-lg font-bold font-tamil transition-all duration-300 ease-out select-none outline-none focus:outline-none ${
            isActive 
            ? 'text-rose-600 dark:text-rose-400 scale-105' 
            : 'text-stone-500 hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400'
        }`}
    >
        {/* Text Label */}
        <span className="relative z-10 block transition-transform duration-300 group-hover:-translate-y-0.5">
            {label}
        </span>
        
        {/* Magic Underline - Expands from center */}
        <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-rose-600 dark:bg-rose-400 rounded-full transition-all duration-300 ease-out ${
            isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
        }`} />
        
        {/* Subtle Ambient Glow on Hover */}
        <span className="absolute inset-0 bg-rose-100/0 dark:bg-rose-500/0 rounded-lg blur-md transition-all duration-500 group-hover:bg-rose-400/20 dark:group-hover:bg-rose-400/10 -z-10 scale-50 group-hover:scale-110 opacity-0 group-hover:opacity-100" />
    </button>
);
