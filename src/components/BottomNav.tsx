import React from 'react';
import { Home, FileText, BookOpen, FolderArchive, Settings } from 'lucide-react';

export type TabType = 'home' | 'notes' | 'bible' | 'library' | 'settings';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'notes' as TabType, label: 'Notes', icon: FileText },
    { id: 'bible' as TabType, label: 'Bible', icon: BookOpen },
    { id: 'library' as TabType, label: 'Library', icon: FolderArchive },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="h-16 border-t border-amber-900/10 dark:border-zinc-800 bg-[#FAF7F2]/95 dark:bg-[#121212]/95 backdrop-blur-md flex items-center justify-around px-2 select-none z-30 transition-colors">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 relative ${
              isActive
                ? 'text-[#C5A059] dark:text-[#E5C175] font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {isActive && (
              <span className="absolute -top-1 w-8 h-1 bg-[#C5A059] rounded-full shadow-sm animate-pulse" />
            )}
            <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
            <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
