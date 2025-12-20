
import React, { useState } from 'react';
import type { Category, Post } from '../types';
import { t, Language } from '../utils/translations';
import { SEO } from './SEO';
import { Icon } from './Icon';
import { Breadcrumbs } from './Breadcrumbs';

interface EditorProps {
  onSubmit: (post: Omit<Post, 'id' | 'author' | 'likes' | 'comments' | 'createdAt'>) => Promise<void>;
  language: Language;
  onNavigate: (page: 'home') => void;
}

export const Editor: React.FC<EditorProps> = ({ onSubmit, language, onNavigate }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('கவிதை');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      setIsSubmitting(true);
      try {
        await onSubmit({ title, content, category });
        setTitle(''); setContent('');
      } catch (error) {
        alert('தவறு ஏற்பட்டது.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const breadcrumbs = [
      { label: t('home', language), onClick: () => onNavigate('home'), icon: 'home' as const },
      { label: t('write', language), active: true, icon: 'pen' as const }
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
       <SEO title={`${t('submitYourWork', language)} | தமிழ்ச் சங்கம்`} />

       <Breadcrumbs items={breadcrumbs} />

       <div className="mb-10 text-center">
        <h2 className="text-4xl font-black font-tamil text-[#3e2b22] dark:text-stone-100">{t('submitYourWork', language)}</h2>
        <p className="text-[#8a7060] mt-2 font-medium">படைப்போம், பகிர்வோம்.</p>
      </div>

      <div className="bg-[#fdf8f1]/90 dark:bg-[#1a1a1a] rounded-[2.5rem] shadow-2xl border border-[#eaddcf] dark:border-neutral-800 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-[#8a7060] uppercase tracking-widest mb-3">{t('category', language)}</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full p-4 bg-white/50 dark:bg-neutral-900 border border-[#eaddcf] dark:border-neutral-800 rounded-2xl font-bold text-[#3e2b22] dark:text-stone-200 focus:ring-2 focus:ring-rose-500 transition-all appearance-none">
                        <option>கவிதை</option><option>கதை</option><option>கட்டுரை</option><option>மேற்கோள்</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#8a7060] uppercase tracking-widest mb-3">{t('title', language)}</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-4 bg-white/50 dark:bg-neutral-900 border border-[#eaddcf] dark:border-neutral-800 rounded-2xl font-bold text-lg text-[#3e2b22] dark:text-stone-200 focus:ring-2 focus:ring-rose-500 transition-all" placeholder={t('titlePlaceholder', language)} />
                </div>
            </div>
            
            <div className="relative">
                <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold text-[#8a7060] uppercase tracking-widest">{t('content', language)}</label>
                </div>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={15} className="w-full p-6 bg-white/50 dark:bg-neutral-900 border border-[#eaddcf] dark:border-neutral-800 rounded-3xl font-tamil text-xl leading-relaxed text-[#3e2b22] dark:text-stone-200 focus:ring-2 focus:ring-rose-500 transition-all resize-none" placeholder={t('contentPlaceholder', language)} />
            </div>
            
            <div className="pt-8 border-t border-[#eaddcf] dark:border-neutral-800 flex items-center justify-between">
                <p className="text-sm text-[#8a7060] hidden sm:block">உங்கள் படைப்புகள் உலகெங்கும் வாழும் தமிழர்களைச் சென்றடையும்.</p>
                <button type="submit" disabled={isSubmitting} className={`px-12 py-4 rounded-2xl font-bold text-white shadow-2xl transition-all ${isSubmitting ? 'bg-rose-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-rose-600/30'}`}>
                    {isSubmitting ? 'பதிவேற்றப்படுகிறது...' : t('submit', language)}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};
