
import React, { useState, useEffect } from 'react';
import type { Post, Category } from '../types';
import { Icon } from './Icon';
import { t, Language } from '../utils/translations';
import { SEO } from './SEO';
import { PostCard } from './PostCard';
import { mockApi } from '../services/mockApi';
import { Breadcrumbs } from './Breadcrumbs';

interface PostViewProps {
  post: Post;
  onNavigate: (page: 'home' | 'category' | 'post' | 'author', id?: number | null, category?: Category | null) => void;
  language: Language;
}

export const PostView: React.FC<PostViewProps> = ({ post, onNavigate, language }) => {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  
  useEffect(() => {
      const fetchRelated = async () => {
          const allPosts = await mockApi.getPosts();
          const related = allPosts
            .filter(p => p.category === post.category && p.id !== post.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          setRelatedPosts(related);
      };
      fetchRelated();
  }, [post.id, post.category]);

  const handleLike = () => {
    if (isLiked) { setLikes(likes - 1); setIsLiked(false); } 
    else { setLikes(likes + 1); setIsLiked(true); }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
        if (navigator.share) await navigator.share({ title: post.title, url: shareUrl });
        else {
            await navigator.clipboard.writeText(shareUrl);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        }
    } catch (e) {}
  };

  const handlePrint = () => {
    window.print();
  };

  const breadcrumbs = [
      { label: t('home', language), onClick: () => onNavigate('home'), icon: 'home' as const },
      { label: post.category, onClick: () => onNavigate('category', null, post.category) },
      { label: post.title, active: true }
  ];

  const isPoem = post.category === 'கவிதை';

  return (
    <article className="max-w-4xl mx-auto pt-4 pb-32 px-4 animate-subtle-fade bg-bone dark:bg-stone-950">
      <SEO title={`${post.title} | VetriZen`} description={post.content.substring(0, 160)} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <Breadcrumbs items={breadcrumbs} />
        <button 
          onClick={() => onNavigate('category', null, post.category)}
          className="flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-zen-green transition-all duration-300 uppercase tracking-widest px-2 py-1"
        >
          <Icon name="chevron-left" />
          <span>{t('backToGallery', language)}</span>
        </button>
      </div>

      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-tamil-serif text-zen-green dark:text-zen-lightGreen leading-tight mb-6">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-2 text-stone-500 dark:text-stone-400 text-[12px] font-medium uppercase tracking-[0.15em]">
          <button 
            onClick={() => onNavigate('author', post.author.id)} 
            className="hover:text-zen-green transition-all duration-300 font-bold"
          >
            {post.author.name}
          </button>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString('ta-IN', { dateStyle: 'long' })}</span>
        </div>
      </header>

      <div className="max-w-[700px] mx-auto">
        <div className={`font-tamil-serif text-stone-800 dark:text-stone-300 leading-[2.2] whitespace-pre-wrap text-xl md:text-2xl ${isPoem ? 'text-center italic' : 'text-left'}`}>
            {post.content}
        </div>

        <div className="flex flex-col items-center mt-16 mb-4 opacity-60 select-none">
            <div className="text-zen-green dark:text-zen-lightGreen">
                <Icon name="leaf" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] mt-3 text-stone-700 dark:text-stone-400">
                {t('theEnd', language)}
            </span>
        </div>

        <div className="pt-16 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            <button 
              onClick={handleLike} 
              className={`flex items-center gap-2 text-xs font-bold transition-all duration-300 ${isLiked ? 'text-zen-terracotta' : 'text-stone-600 dark:text-stone-400 hover:text-zen-green'}`}
              title="Like"
            >
                <Icon name="like" isFilled={isLiked} />
                <span className="tracking-widest uppercase">{likes}</span>
            </button>
            
            <button 
              onClick={handleShare} 
              className="flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-zen-green transition-all duration-300"
              title={t('share', language)}
            >
                <Icon name="share" />
                <span className="tracking-widest uppercase">{t('share', language)}</span>
            </button>

            <button 
              onClick={handlePrint} 
              className="flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-zen-green transition-all duration-300"
              title={t('print', language)}
            >
                <Icon name="printer" />
                <span className="tracking-widest uppercase">{t('print', language)}</span>
            </button>
        </div>
      </div>

      {relatedPosts.length > 0 && (
          <div className="mt-16 border-t border-stone-200 dark:border-stone-800 pt-16">
              <h3 className="text-xl font-bold font-tamil text-stone-800 dark:text-stone-200 mb-12 text-center uppercase tracking-[0.1em]">
                  {t('relatedPosts', language)}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {relatedPosts.map(p => (
                    <PostCard 
                      key={p.id} 
                      post={p} 
                      onNavigate={(page, id) => onNavigate(page as any, id)}
                      variant="related" 
                    />
                  ))}
              </div>
          </div>
      )}
    </article>
  );
};
