
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
  const [fontSize, setFontSize] = useState<'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl'>('text-xl');
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
    const shareUrl = `https://tamilsangam.app/post/${post.id}`;
    try {
        if (navigator.share) await navigator.share({ title: post.title, url: shareUrl });
        else {
            await navigator.clipboard.writeText(shareUrl);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        }
    } catch (e) {}
  };

  const breadcrumbs = [
      { label: t('home', language), onClick: () => onNavigate('home'), icon: 'home' as const },
      { label: t('creations', language), icon: 'collection' as const },
      { label: post.category, onClick: () => onNavigate('category', null, post.category) },
      { label: post.title, active: true }
  ];

  return (
    <article className="max-w-4xl mx-auto animate-fade-in pb-20">
      <SEO title={`${post.title} | தமிழ்ச் சங்கம்`} description={post.content.substring(0, 160)} />

      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-10 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold uppercase tracking-widest mb-6">{post.category}</span>
        <h1 className="text-4xl md:text-6xl font-black font-tamil text-[#3e2b22] dark:text-stone-50 leading-tight mb-8">{post.title}</h1>
        
        <div className="flex items-center justify-center gap-4">
            <img src={post.author.avatarUrl} className="w-12 h-12 rounded-full ring-2 ring-rose-500/20" alt={post.author.name} />
            <div className="text-left">
                <button onClick={() => onNavigate('author', post.author.id)} className="font-bold text-[#5c4235] dark:text-stone-200 hover:text-rose-600 transition-colors">{post.author.name}</button>
                <p className="text-xs text-stone-500">{new Date(post.createdAt).toLocaleDateString('ta-IN', { dateStyle: 'long' })}</p>
            </div>
        </div>
      </div>

      <div className="bg-[#fdf8f1]/90 dark:bg-[#1a1a1a] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-[#eaddcf] dark:border-neutral-800 relative">
        <div className="absolute top-6 right-8 flex gap-2">
             <button onClick={() => setFontSize(f => f === 'text-xl' ? 'text-2xl' : 'text-xl')} className="p-2 text-[#8a7060] hover:text-rose-500 transition-colors" title={t('appearance', language)}><Icon name="settings" /></button>
             <button onClick={handleShare} className="p-2 text-[#8a7060] hover:text-rose-500 transition-colors" title={t('share', language)}><Icon name="share" /></button>
        </div>

        <div className={`prose max-w-none font-tamil text-[#3e2b22] dark:text-stone-300 leading-loose whitespace-pre-wrap ${fontSize}`}>
            {post.content}
        </div>

        <div className="mt-12 pt-8 border-t border-[#eaddcf] dark:border-neutral-800 flex items-center justify-between">
            <button onClick={handleLike} className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all ${isLiked ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-[#eaddcf]/30 text-[#5c4235] dark:bg-neutral-800 dark:text-stone-400'}`}>
                <Icon name="like" isFilled={isLiked} />
                <span>{likes}</span>
            </button>
            <div className="flex gap-4">
                 <button onClick={() => onNavigate('home')} className="text-[#8a7060] hover:text-rose-600 dark:hover:text-stone-200 font-bold font-tamil">முகப்பு</button>
            </div>
        </div>
      </div>

      {relatedPosts.length > 0 && (
          <div className="mt-20">
              <h3 className="text-2xl font-bold font-tamil mb-8 text-[#3e2b22] dark:text-stone-200 flex items-center gap-3">
                  <span className="w-2 h-8 bg-rose-500 rounded-full"></span>
                  தொடர்புடைய பதிவுகள்
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map(p => <PostCard key={p.id} post={p} onNavigate={(page, id) => onNavigate(page as any, id)} />)}
              </div>
          </div>
      )}
    </article>
  );
};
