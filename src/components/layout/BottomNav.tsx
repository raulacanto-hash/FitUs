import React from 'react';
import { Dumbbell, History, TrendingUp, Settings } from 'lucide-react';
import { ActiveTab } from '../../types/workout';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'active' as ActiveTab, label: 'Entreno', icon: Dumbbell },
    { id: 'history' as ActiveTab, label: 'Histórico', icon: History },
    { id: 'stats' as ActiveTab, label: 'Métricas', icon: TrendingUp },
    { id: 'settings' as ActiveTab, label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-zinc-950/85 backdrop-blur-xl border-t border-zinc-800/80 max-w-lg mx-auto pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-4 px-3 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-1.5 px-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-emerald-400 font-bold bg-emerald-500/10' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
