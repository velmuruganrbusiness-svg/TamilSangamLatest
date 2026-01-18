
import React from 'react';
import type { Category } from '../types';
import { t, Language } from '../utils/translations';

interface CategoryPillsProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
  language: Language;
}

const categories: Category[] = ['கவிதை', 'கதை', 'கட்டுரை', 'மேற்கோள்', 'பொன்மொழி', 'ஊக்கம்', 'வரலாறு', 'பழமொழி'];

export const CategoryPills: React.FC<CategoryPillsProps> = ({ selectedCategory, onSelectCategory, language }) => {
  return (
    <div className="flex items-center gap-8 py-2 px-2">
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
        className={`group relative px-0 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-500 ease-out outline-none focus:outline-none flex flex-col items-center ${
            isActive 
            ? 'text-zen-green' 
            : 'text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300'
        }`}
    >
        <span className="relative z-10 block">
            {label}
        </span>
    </button>
);
