
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
  <nav className="flex items-center text-sm font-sans overflow-x-auto whitespace-nowrap no-scrollbar mb-8 px-1" aria-label="Breadcrumb">
    {items.map((item, index) => (
      <React.Fragment key={index}>
        {index > 0 && (
          <span className="text-stone-300 dark:text-stone-700 mx-3 select-none" aria-hidden="true">/</span>
        )}
        
        {item.active ? (
          <span className="text-stone-700 dark:text-stone-300 font-bold py-1 px-2">
            {item.label}
          </span>
        ) : (
          <button
            onClick={item.onClick}
            className="text-stone-500 dark:text-stone-400 hover:text-zen-green dark:hover:text-zen-green transition-colors duration-300 flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer outline-none focus:ring-1 focus:ring-zen-green/20"
          >
            {item.icon && (
              <span className="w-3.5 h-3.5 opacity-70">
                <Icon name={item.icon as any} />
              </span>
            )}
            <span>{item.label}</span>
          </button>
        )}
      </React.Fragment>
    ))}
  </nav>
);
