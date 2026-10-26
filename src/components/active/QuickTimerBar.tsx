import React from 'react';
import { Timer } from 'lucide-react';
import { RestTimerState } from '../../hooks/useRestTimer';

interface QuickTimerBarProps {
  timer: RestTimerState;
}

export const QuickTimerBar: React.FC<QuickTimerBarProps> = ({ timer }) => {
  const { secondsRemaining, initialDuration, startTimer } = timer;
  const presets = [60, 90, 120];

  return (
    <div className="pt-2 border-t border-zinc-800/50 flex items-center justify-between text-xs text-zinc-400">
      <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-400">
        <Timer className="w-3.5 h-3.5 text-emerald-400" /> Descanso rápido:
      </span>
      <div className="flex gap-1.5">
        {presets.map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => startTimer(sec)}
            className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all ${
              initialDuration === sec && secondsRemaining > 0
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/40'
            }`}
          >
            {sec}s
          </button>
        ))}
      </div>
    </div>
  );
};
