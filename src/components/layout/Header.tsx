import React from 'react';
import { Dumbbell, Timer, Play, Pause, X } from 'lucide-react';
import { RestTimerState } from '../../hooks/useRestTimer';

interface HeaderProps {
  timer: RestTimerState;
}

export const Header: React.FC<HeaderProps> = ({ timer }) => {
  const { secondsRemaining, isActive, toggleTimer, resetTimer } = timer;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = ('0' + (secondsRemaining % 60)).slice(-2);

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60 px-5 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Dumbbell className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            FitTrack <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">PRO</span>
          </h1>
          <p className="text-[11px] text-zinc-400">Seguimiento de Alto Rendimiento</p>
        </div>
      </div>

      {/* Temporizador Activo en la cabecera */}
      {secondsRemaining > 0 && (
        <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full animate-pulse shadow-lg shadow-emerald-500/5">
          <Timer className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono font-bold text-xs text-emerald-400">
            {minutes}:{seconds}
          </span>
          <button 
            type="button"
            onClick={toggleTimer}
            className="text-zinc-400 hover:text-white transition-colors p-0.5"
            title={isActive ? "Pausar descanso" : "Reanudar descanso"}
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button 
            type="button"
            onClick={resetTimer} 
            className="text-zinc-400 hover:text-red-400 transition-colors ml-0.5 p-0.5"
            title="Cancelar temporizador"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </header>
  );
};
