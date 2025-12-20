
import React from 'react';
import { Icon } from './Icon';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
  icon?: 'home' | 'library' | 'school' | 'trophy' | 'pen' | 'collection' | 'archive';
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => (
  <nav className="flex items-center text-sm font-medium font-tamil overflow-x-auto whitespace-nowrap no-scrollbar mb-6 px-1">
    {items.map((item, index) => (
      <React.Fragment key={index}>
        {index > 0 && (
          <span className="text-[#8a7060]/40 dark:text-[#a89f91]/30 mx-2">/</span>
        )}
        <button
          onClick={item.onClick}
          disabled={item.active || !item.onClick}
          className={`transition-all duration-200 flex items-center gap-1.5 py-1 px-2 rounded-lg ${
            item.active 
            ? 'text-[#3e2b22] dark:text-[#edeadd] font-bold cursor-default bg-[#eaddcf]/30 dark:bg-[#3e2b22]/30' 
            : 'text-[#8a7060] hover:text-rose-600 dark:text-[#a89f91] dark:hover:text-rose-400 hover:bg-white/50 dark:hover:bg-black/20'
          }`}
        >
          {item.icon && <Icon name={item.icon as any} />}
          <span>{item.label}</span>
        </button>
      </React.Fragment>
    ))}
  </nav>
);
