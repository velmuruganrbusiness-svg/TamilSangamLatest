
import React from 'react';
import type { Competition } from '../types';
import { t, Language } from '../utils/translations';
import { SEO } from './SEO';
import { Icon } from './Icon';
import { Breadcrumbs } from './Breadcrumbs';

interface PotikalViewProps {
  competitions: Competition[];
  language: Language;
  onNavigate: (page: 'home') => void;
}

export const PotikalView: React.FC<PotikalViewProps> = ({ competitions, language, onNavigate }) => {
  const getStatusColor = (status: Competition['status']) => {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
        case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
        case 'completed': return 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border-stone-200 dark:border-stone-700';
        default: return 'bg-stone-100 text-stone-800';
    }
  };

  const breadcrumbs = [
      { label: t('home', language), onClick: () => onNavigate('home'), icon: 'home' as const },
      { label: t('competitions', language), active: true, icon: 'trophy' as const }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
      <SEO 
        title={`${t('competitions', language)} | தமிழ்ச் சங்கம்`}
        description="Participate in Tamil literary competitions, win prizes, and showcase your talent."
        keywords={['Tamil Competitions', 'Poetry Contest', 'Story Writing', 'Awards']}
      />

      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-black font-tamil text-[#3e2b22] dark:text-white mb-4">{t('competitions', language)}</h2>
        <p className="text-[#8a7060] dark:text-stone-400 text-lg max-w-2xl mx-auto">
            உங்கள் திறமைகளை வெளிப்படுத்தவும், பரிசுகளை வெல்லவும் ஒரு மேடை.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {competitions.map((comp) => (
            <div key={comp.id} className="group bg-[#fdf8f1]/80 dark:bg-[#1a1a1a] rounded-[2rem] border border-[#eaddcf] dark:border-neutral-800 shadow-xl shadow-stone-200/50 dark:shadow-none overflow-hidden hover:-translate-y-2 transition-all duration-300">
                <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    <img 
                        src={comp.imageUrl} 
                        alt={comp.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 z-20">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(comp.status)}`}>
                            {t(comp.status, language)}
                         </span>
                    </div>
                </div>

                <div className="p-8">
                    <h3 className="text-xl font-bold font-tamil mb-3 text-[#3e2b22] dark:text-white leading-tight group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {comp.title}
                    </h3>
                    <p className="text-[#5c4235] dark:text-stone-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {comp.description}
                    </p>
                    
                    <div className="space-y-3 mb-8">
                        <div className="flex items-center text-sm text-[#8a7060] dark:text-stone-400">
                             <svg className="w-5 h-5 mr-3 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <span className="font-semibold mr-2">{t('deadline', language)}:</span>
                             {new Date(comp.deadline).toLocaleDateString('ta-IN')}
                        </div>
                        <div className="flex items-center text-sm text-[#8a7060] dark:text-stone-400">
                             <svg className="w-5 h-5 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <span className="font-semibold mr-2">{t('prize', language)}:</span>
                             {comp.prize}
                        </div>
                    </div>

                    <button 
                        disabled={comp.status === 'completed'}
                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                            comp.status === 'active' 
                            ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/30 hover:shadow-xl' 
                            : 'bg-[#eaddcf]/30 text-[#8a7060] cursor-not-allowed dark:bg-stone-800 dark:text-stone-600'
                        }`}
                    >
                        {comp.status === 'completed' ? t('completed', language) : t('participate', language)}
                        {comp.status === 'active' && <Icon name="pen" />}
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
