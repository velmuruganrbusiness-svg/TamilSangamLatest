
import React, { useState } from 'react';
import type { Post, User } from '../types';
import { Icon } from './Icon';

interface PostCardProps {
  post: Post;
  onNavigate: (page: 'post' | 'author', id: number) => void;
  currentUser?: User | null;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onNavigate, currentUser }) => {
  const snippet = post.content.substring(0, 140) + (post.content.length > 140 ? '...' : '');
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    
    if (isLiked) {
        setLikeCount(prev => prev - 1);
        setIsLiked(false);
    } else {
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onNavigate('author', post.author.id);
  };
  
  const categoryColors: Record<string, string> = {
    'கவிதை': 'text-rose-600 dark:text-rose-400',
    'கட்டுரை': 'text-blue-600 dark:text-blue-400',
    'மேற்கோள்': 'text-amber-600 dark:text-amber-400',
    'கதை': 'text-emerald-600 dark:text-emerald-400',
    'பொன்மொழி': 'text-yellow-600 dark:text-yellow-400',
    'ஊக்கம்': 'text-purple-600 dark:text-purple-400',
    'வரலாறு': 'text-orange-600 dark:text-orange-400',
    'பழமொழி': 'text-cyan-600 dark:text-cyan-400',
  };
  
  const accentColor = categoryColors[post.category] || 'text-stone-500';

  const authorName = post.author.name;
  const isLongName = authorName.length > 10;
  const displayAuthorName = isLongName ? `${authorName.substring(0, 10)}...` : authorName;

  return (
    <article 
      onClick={() => onNavigate('post', post.id)}
      className="group relative bg-[#fdf8f1] dark:bg-gradient-to-br dark:from-[#2b221e] dark:to-[#201a17] rounded-[2rem] p-6 sm:p-8 border border-[#eaddcf] dark:border-[#4a3b32] hover:border-rose-300 dark:hover:border-rose-700/50 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.4)] hover:-translate-y-2 cursor-pointer flex flex-col h-full overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className={`text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${accentColor}`}>
           <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
           {post.category}
        </span>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            {new Date(post.createdAt).toLocaleDateString('ta-IN', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="flex-grow mb-6 relative z-10">
         <h3 className="text-xl font-bold font-tamil mb-3 text-[#3e2b22] dark:text-[#edeadd] leading-snug group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors duration-300">
            {post.title}
         </h3>
         <p className="text-[#5c4235] dark:text-[#a89f91] font-tamil text-base leading-relaxed line-clamp-3">
            {snippet}
         </p>
      </div>

      <div className="h-px w-full bg-[#eaddcf] dark:bg-[#3e2b22] mb-5"></div>

      <div className="flex items-center justify-between relative z-10">
        <div 
            className="flex items-center gap-2 group/author hover:bg-rose-50 dark:hover:bg-white/5 p-1 rounded-full pr-3 transition-colors"
            onClick={handleAuthorClick}
        >
             <img src={post.author.avatarUrl} alt={post.author.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-[#eaddcf]" />
             <span className="text-xs font-bold text-[#5c4235] dark:text-[#d6cbb8] group-hover/author:text-rose-600">{displayAuthorName}</span>
        </div>

        <div className="flex items-center gap-3 text-stone-400 text-xs">
            <button 
                onClick={handleLike}
                className={`flex items-center gap-1 ${isLiked ? 'text-rose-600' : 'hover:text-rose-600'}`}
            >
                <div className={`${isAnimating ? 'scale-125' : ''} transition-transform`}>
                    <Icon name="like" isFilled={isLiked} />
                </div>
                <span>{likeCount}</span>
            </button>
            <div className="flex items-center gap-1">
                <Icon name="comment" />
                <span>{post.comments.length}</span>
            </div>
        </div>
      </div>
    </article>
  );
};
