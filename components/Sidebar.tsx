
import React from 'react';
import type { Category } from '../types';
import { Icon } from './Icon';
import { t, Language } from '../utils/translations';

interface SidebarProps {
  onNavigate: (page: 'home' | 'editor' | 'classics' | 'category' | 'potikal' | 'karka', id?: null, category?: Category, workId?: string) => void;
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  language: Language;
}

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode; icon: React.ReactNode; isCollapsed: boolean; isActive?: boolean }> = ({ onClick, children, icon, isCollapsed, isActive }) => (
    <button 
        onClick={onClick} 
        className={`group relative w-full flex items-center space-x-3 text-left px-3 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
            isActive 
            ? 'bg-rose-600/10 text-rose-400' 
            : 'text-[#d6cbb8] hover:bg-[#3e2b22] hover:text-rose-300'
        } ${isCollapsed ? 'justify-center' : ''}`}
    >
        <span className={`transition-transform duration-200 ${isActive ? 'text-rose-500' : 'text-[#a89f91] group-hover:text-rose-400 group-hover:scale-110'}`}>
           {icon}
        </span>
        {!isCollapsed && (
            <span className="whitespace-nowrap font-tamil tracking-wide flex-1">{children}</span>
        )}
        {isCollapsed && (
            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-[100] whitespace-nowrap rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-xs font-semibold text-[#edeadd] shadow-xl opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none border border-[#3e2b22]">
                {children}
            </span>
        )}
    </button>
);

const RightFlyoutNavGroup: React.FC<{ 
    label: string; 
    icon: React.ReactNode; 
    isCollapsed: boolean; 
    children: React.ReactNode;
}> = ({ label, icon, isCollapsed, children }) => {
    return (
        <div className="group relative w-full">
             <button 
                className={`w-full flex items-center space-x-3 text-left px-3 py-3 rounded-xl text-base font-medium transition-all duration-200 text-[#d6cbb8] hover:bg-[#3e2b22] hover:text-rose-300 ${isCollapsed ? 'justify-center' : ''}`}
            >
                <span className="text-[#a89f91] group-hover:text-rose-400 transition-colors group-hover:scale-110 duration-200">{icon}</span>
                {!isCollapsed && (
                    <>
                        <span className="whitespace-nowrap font-tamil tracking-wide flex-1">{label}</span>
                        <span className="text-[#a89f91] group-hover:text-rose-400 transition-transform">
                            <svg className="w-4 h-4 rotate-[-90deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </>
                )}
            </button>
            
            {/* Flyout Submenu */}
            <div className="absolute left-full top-0 ml-2 w-56 py-2 bg-[#2b1d16] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-[#3e2b22] invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 z-[100] origin-left scale-95 group-hover:scale-100">
                <div className="px-5 py-2 border-b border-[#3e2b22] mb-1 text-[10px] font-black text-rose-500 uppercase tracking-widest font-sans">{label}</div>
                <div className="px-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ 
    onNavigate, isOpen, isCollapsed, onToggleCollapse, language 
}) => {
    return (
        <aside className={`fixed inset-y-0 left-0 bg-[#2b1d16] border-r border-[#3e2b22] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-all duration-300 ease-in-out z-40 flex flex-col ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}>
            {/* Top Branding Section */}
            <div className="h-20 flex items-center justify-between px-5 flex-shrink-0 border-b border-[#3e2b22] bg-[#221712]">
                <div className={`flex items-center gap-3 cursor-pointer ${isCollapsed ? 'hidden' : 'flex'}`} onClick={() => onNavigate('home')}>
                    <div className="text-rose-600"><Icon name="brand-logo" /></div>
                    <h1 className="text-xl font-bold font-tamil text-[#edeadd] tracking-tight">தமிழ்ச் சங்கம்</h1>
                </div>
                {isCollapsed && (
                    <div className="mx-auto text-rose-600 cursor-pointer" onClick={() => onNavigate('home')}>
                        <Icon name="brand-logo" />
                    </div>
                )}
            </div>

            <nav className="flex-1 px-3 py-6 flex flex-col space-y-1 overflow-y-visible no-scrollbar">
                <NavLink onClick={() => onNavigate('home')} icon={<Icon name="home" />} isCollapsed={isCollapsed}>{t('home', language)}</NavLink>
                
                <RightFlyoutNavGroup label={t('creations', language)} icon={<Icon name="collection" />} isCollapsed={isCollapsed}>
                    <button onClick={() => onNavigate('category', null, 'கவிதை')} className="w-full text-left px-4 py-2.5 text-sm font-tamil text-[#d6cbb8] hover:bg-[#3e2b22] hover:text-rose-400 rounded-lg transition-colors">● {t('poems', language)}</button>
                    <button onClick={() => onNavigate('category', null, 'கதை')} className="w-full text-left px-4 py-2.5 text-sm font-tamil text-[#d6cbb8] hover:bg-[#3e2b22] hover:text-rose-400 rounded-lg transition-colors">● {t('stories', language)}</button>
                    <button onClick={() => onNavigate('category', null, 'கட்டுரை')} className="w-full text-left px-4 py-2.5 text-sm font-tamil text-[#d6cbb8] hover:bg-[#3e2b22] hover:text-rose-400 rounded-lg transition-colors">● {t('articles', language)}</button>
                </RightFlyoutNavGroup>

                <RightFlyoutNavGroup label={t('treasury', language)} icon={<Icon name="archive" />} isCollapsed={isCollapsed}>
                    <button onClick={() => onNavigate('category', null, 'மேற்கோள்')} className="w-full text-left px-4 py-2.5 text-sm font-tamil text-[#d6cbb8] hover:bg-[#3e2b22] hover:text-rose-400 rounded-lg transition-colors">● {t('quotes', language)}</button>
                    <button onClick={() => onNavigate('category', null, 'பொன்மொழி')} className="w-full text-left px-4 py-2.5 text-sm font-tamil text-[#d6cbb8] hover:bg-[#3e2b22] hover:text-rose-400 rounded-lg transition-colors">● {t('ponmozhigal', language)}</button>
                    <button onClick={() => onNavigate('category', null, 'பழமொழி')} className="w-full text-left px-4 py-2.5 text-sm font-tamil text-[#d6cbb8] hover:bg-[#3e2b22] hover:text-rose-400 rounded-lg transition-colors">● {t('proverbs', language)}</button>
                </RightFlyoutNavGroup>
                
                <NavLink onClick={() => onNavigate('potikal')} icon={<Icon name="trophy" />} isCollapsed={isCollapsed}>{t('competitions', language)}</NavLink>
                
                <RightFlyoutNavGroup label={t('classics', language)} icon={<Icon name="library" />} isCollapsed={isCollapsed}>
                    <button onClick={() => onNavigate('classics', null, null, 'thirukkural')} className="w-full text-left px-4 py-2.5 text-sm font-tamil text-[#d6cbb8] hover:bg-[#3e2b22] hover:text-rose-400 rounded-lg transition-colors">● திருக்குறள்</button>
                    <button onClick={() => onNavigate('classics', null, null, 'aathichoodi')} className="w-full text-left px-4 py-2.5 text-sm font-tamil text-[#d6cbb8] hover:bg-[#3e2b22] hover:text-rose-400 rounded-lg transition-colors">● ஆத்திசூடி</button>
                    <button onClick={() => onNavigate('classics', null, null, 'kondraivendhan')} className="w-full text-left px-4 py-2.5 text-sm font-tamil text-[#d6cbb8] hover:bg-[#3e2b22] hover:text-rose-400 rounded-lg transition-colors">● கொன்றை வேந்தன்</button>
                </RightFlyoutNavGroup>

                <NavLink onClick={() => onNavigate('karka')} icon={<Icon name="school" />} isCollapsed={isCollapsed}>{t('learnTamil', language)}</NavLink>
            </nav>

            {/* Collapse Toggle at Bottom */}
            <div className="p-4 border-t border-[#3e2b22] bg-[#221712]">
                <button onClick={onToggleCollapse} className="w-full flex items-center justify-center p-2.5 text-[#a89f91] hover:text-rose-400 rounded-xl hover:bg-[#3e2b22] transition-colors">
                    <Icon name={isCollapsed ? "expand" : "collapse"} />
                </button>
            </div>
        </aside>
    );
};
