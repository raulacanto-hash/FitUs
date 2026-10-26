import React from 'react';
import { Dumbbell, Library, History, TrendingUp, Scale, Settings } from 'lucide-react';
import { ActiveTab } from '../../types/workout';
import { useTheme } from '../../context/ThemeContext';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  hasActiveWorkoutSession?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  activeTab, 
  onTabChange,
  hasActiveWorkoutSession
}) => {
  const { accent, isDark } = useTheme();

  const tabs = [
    { id: 'train' as ActiveTab, label: 'Train', icon: Dumbbell, hasBadge: hasActiveWorkoutSession },
    { id: 'library' as ActiveTab, label: 'Biblioteca', icon: Library },
    { id: 'history' as ActiveTab, label: 'Historial', icon: History },
    { id: 'progress' as ActiveTab, label: 'Progreso', icon: TrendingUp },
    { id: 'body' as ActiveTab, label: 'Medidas', icon: Scale },
    { id: 'settings' as ActiveTab, label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-30 backdrop-blur-xl border-t max-w-lg mx-auto pb-[max(0.5rem,env(safe-area-inset-bottom))] ${
      isDark ? 'bg-zinc-950/90 border-zinc-800/80' : 'bg-white/90 border-zinc-200 shadow-lg'
    }`}>
      <div className="grid grid-cols-6 px-1.5 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center gap-1 py-1.5 px-0.5 rounded-2xl transition-all ${
                isActive 
                  ? 'font-black' 
                  : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-700'
              }`}
              style={isActive ? { color: accent.hex, backgroundColor: `${accent.hex}15` } : undefined}
            >
              <div className="relative">
                <Icon className="w-[18px] h-[18px]" />
                {tab.hasBadge && (
                  <span 
                    className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 animate-pulse ${
                      isDark ? 'ring-zinc-950' : 'ring-white'
                    }`}
                    style={{ backgroundColor: accent.hex }}
                  />
                )}
              </div>
              <span className="text-[9px] tracking-tight truncate max-w-full">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
