
import React from 'react';
import type { Post, Category, User } from '../types';
import { PostCard } from './PostCard';
import { t, Language } from '../utils/translations';
import { Icon } from './Icon';
import { SEO } from './SEO';
import { Skeleton } from './Skeleton';
import { Breadcrumbs } from './Breadcrumbs';

interface HomeProps {
  posts: Post[];
  onNavigate: (page: 'post' | 'category' | 'home' | 'author', id?: number | null, category?: Category | null) => void;
  category?: Category | null;
  language: Language;
  searchQuery?: string;
  onSearch: (query: string) => void;
  currentUser?: User | null;
  isLoading?: boolean;
  selectedAuthor?: User;
}

const WordOfTheDay: React.FC<{ language: Language }> = ({ language }) => (
    <div className="mb-10 px-2 animate-fade-in">
        <div className="bg-gradient-to-r from-rose-50/80 to-[#fdf8f1]/80 dark:from-[#2b1d16] dark:to-[#1a1a1a] rounded-[2rem] border border-[#eaddcf] dark:border-neutral-800 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-rose-100 dark:bg-rose-900/20 rounded-full blur-3xl opacity-50"></div>
            
            <div className="relative z-10 w-full md:w-2/3">
                <div className="flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-400">
                    <Icon name="calendar" />
                    <span className="text-xs font-bold uppercase tracking-widest">{t('wordOfTheDay', language)}</span>
                </div>
                <h3 className="text-4xl font-black font-tamil text-[#3e2b22] dark:text-white mb-2">அறம்</h3>
                <p className="text-[#8a7060] dark:text-stone-400 font-medium text-lg mb-4">{t('meaning', language)}: Dharma / Virtue / Righteousness</p>
                <div className="bg-white/80 dark:bg-neutral-800 rounded-xl p-4 border border-[#eaddcf]/50 dark:border-neutral-700 shadow-sm inline-block w-full">
                    <p className="font-tamil text-[#5c4235] dark:text-stone-300 italic">
                        "அறம் செய விரும்பு" - ஔவையார்
                    </p>
                </div>
            </div>
            
            <div className="relative z-10 hidden md:flex w-1/3 justify-end opacity-20 dark:opacity-10">
                <Icon name="brand-logo" />
            </div>
        </div>
    </div>
);

const AuthorProfile: React.FC<{ author: User; postCount: number }> = ({ author, postCount }) => (
    <div className="mb-10 px-2 animate-fade-in">
        <div className="bg-[#fdf8f1]/80 dark:bg-[#1a1a1a] rounded-[2.5rem] border border-[#eaddcf] dark:border-neutral-800 p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-stone-200/40 dark:shadow-none relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/20 to-transparent dark:from-[#2b221e] dark:to-transparent opacity-50 pointer-events-none"></div>

             <div className="relative z-10 flex-shrink-0">
                 <div className="p-1 rounded-full bg-white dark:bg-[#1a1a1a] border-4 border-[#eaddcf] dark:border-[#2b221e] shadow-lg">
                    <img src={author.avatarUrl} alt={author.name} className="w-32 h-32 rounded-full object-cover" />
                 </div>
             </div>
             
             <div className="relative z-10 text-center md:text-left">
                 <h2 className="text-3xl md:text-4xl font-black font-tamil text-[#3e2b22] dark:text-white mb-2">{author.name}</h2>
                 <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                     <span className="px-4 py-1.5 rounded-full bg-[#eaddcf]/30 dark:bg-neutral-800 text-[#5c4235] dark:text-stone-300 text-sm font-bold">
                         {postCount} படைப்புகள்
                     </span>
                     <span className="px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm font-bold">
                         ஆசிரியர்
                     </span>
                 </div>
                 <p className="text-[#8a7060] dark:text-stone-400 max-w-xl font-medium">
                     தமிழ் இலக்கியத்திற்குத் தன் எழுத்துக்களால் வளம் சேர்க்கும் படைப்பாளி.
                 </p>
             </div>
        </div>
    </div>
);

export const Home: React.FC<HomeProps> = ({ 
    posts, 
    onNavigate, 
    category = null, 
    language, 
    searchQuery = '', 
    onSearch, 
    currentUser,
    isLoading = false,
    selectedAuthor
}) => {
    
    let pageTitle = "தமிழ்ச் சங்கம் - Tamil Sangam";
    let pageDescription = t('subTagline', language);
    let pageKeywords = ['Tamil', 'Literature', 'Stories', 'Poems'];

    const breadcrumbs = [];
    if (category || selectedAuthor || searchQuery) {
        breadcrumbs.push({ label: t('home', language), onClick: () => onNavigate('home'), icon: 'home' as const });
    }

    if (category) {
        pageTitle = `${category} | தமிழ்ச் சங்கம்`;
        pageDescription = `${t('latestPosts', language)} - ${category}`;
        pageKeywords.push(category);
        breadcrumbs.push({ label: t('creations', language), icon: 'collection' as const });
        breadcrumbs.push({ label: category, active: true });
    } else if (selectedAuthor) {
        pageTitle = `${selectedAuthor.name} | தமிழ்ச் சங்கம்`;
        breadcrumbs.push({ label: selectedAuthor.name, active: true });
    } else if (searchQuery) {
        pageTitle = `Search: ${searchQuery} | தமிழ்ச் சங்கம்`;
        breadcrumbs.push({ label: t('searchResultsFor', language).replace('{query}', ''), active: true });
    }

  return (
    <div className="max-w-7xl mx-auto min-h-[calc(100vh-200px)]">
      <SEO title={pageTitle} description={pageDescription} keywords={pageKeywords} />

      {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

      {!searchQuery && !category && !selectedAuthor && (
        <div className="text-center pt-10 pb-8 md:pt-16 md:pb-10 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-black font-tamil mb-6 text-[#3e2b22] dark:text-white leading-tight tracking-tight">
            {t('tagline', language)}
          </h2>
          <p className="text-lg md:text-xl text-[#8a7060] dark:text-stone-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {t('subTagline', language)}
          </p>
        </div>
      )}

      {category && (
          <div className="sticky top-24 z-20 px-2 mb-6 animate-fade-in">
            <div className="relative max-w-2xl mx-auto group">
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-3 border border-[#eaddcf] dark:border-neutral-700 rounded-full leading-5 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 sm:text-sm shadow-lg shadow-stone-200/20 dark:shadow-none transition-all"
                    placeholder={t('searchIn', language).replace('{category}', category)}
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-rose-500 transition-colors">
                    <Icon name="search" />
                </div>
            </div>
          </div>
      )}
      
      <div className="animate-fade-in-up mt-0 relative z-10 pb-20">
        {selectedAuthor && <AuthorProfile author={selectedAuthor} postCount={posts.length} />}
        {!searchQuery && !category && !selectedAuthor && <WordOfTheDay language={language} />}

        {(() => {
          if (searchQuery) {
            return (
              <div className="flex items-center gap-2 mb-6 text-[#8a7060] px-2">
                <Icon name="search" />
                <h3 className="text-lg font-semibold font-tamil">
                    {t('searchResultsFor', language).replace('{query}', searchQuery)}
                </h3>
              </div>
            );
          }
          if (category) {
            return (
              <div className="flex items-center gap-2 mb-6 px-2">
                 <h3 className="text-2xl font-bold font-tamil text-[#3e2b22] dark:text-stone-100">
                    {category} <span className="text-[#8a7060] text-lg font-normal ml-2">{posts.length} {t('posts', language)}</span>
                 </h3>
              </div>
            );
          }
          return null; 
        })()}

        {isLoading ? (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-96"><Skeleton /></div>
                ))}
            </div>
        ) : (
            posts.length > 0 ? (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, idx) => (
                <div key={post.id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-fade-in h-full">
                    <PostCard post={post} onNavigate={onNavigate} currentUser={currentUser} />
                </div>
                ))}
            </div>
            ) : (
            <div className="text-center py-24 bg-white/40 dark:bg-[#1a1a1a]/40 backdrop-blur-sm rounded-3xl border border-dashed border-[#eaddcf] dark:border-neutral-800 mx-2">
                <div className="text-[#eaddcf] dark:text-neutral-700 mb-4 flex justify-center">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                </div>
                <p className="text-lg font-medium text-[#8a7060] dark:text-stone-400">
                    {searchQuery ? t('noSearchResults', language) : t('noPostsFound', language)}
                </p>
            </div>
            )
        )}
      </div>
    </div>
  );
};
