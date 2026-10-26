import React from 'react';
import { Timer, Plus, Minus, Play, Pause, X } from 'lucide-react';
import { RestTimerState } from '../../hooks/useRestTimer';
import { useTheme } from '../../context/ThemeContext';

interface QuickTimerBarProps {
  timer: RestTimerState;
}

export const QuickTimerBar: React.FC<QuickTimerBarProps> = ({ timer }) => {
  const { secondsRemaining, initialDuration, startTimer, adjustTimer, isActive, toggleTimer, resetTimer } = timer;
  const { accent, isDark } = useTheme();
  const presets = [60, 90, 120];

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = ('0' + (secondsRemaining % 60)).slice(-2);

  return (
    <div className={`pt-2.5 border-t space-y-2 ${isDark ? 'border-zinc-800/60' : 'border-zinc-200'}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: accent.hex }}>
          <Timer className="w-3.5 h-3.5" /> Descanso:
        </span>

        {/* Presets de 60s, 90s, 120s */}
        <div className="flex items-center gap-1.5">
          {presets.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => startTimer(sec)}
              className={`px-2.5 py-1 rounded-xl font-mono text-xs font-bold transition-all ${
                initialDuration === sec && secondsRemaining > 0
                  ? 'shadow-md scale-105'
                  : isDark 
                    ? 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/40' 
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
              }`}
              style={
                initialDuration === sec && secondsRemaining > 0
                  ? { backgroundColor: accent.hex, color: accent.contrastText === 'text-white' ? '#fff' : '#000' }
                  : undefined
              }
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      {/* Barra de Ajuste Fino (+15s / -15s) y Control Activo */}
      <div className={`p-2 rounded-2xl border flex items-center justify-between ${
        isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
      }`}>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => adjustTimer(-15)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all active:scale-95 flex items-center gap-0.5 ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300' 
                : 'bg-white border-zinc-300 hover:bg-zinc-100 text-zinc-800 shadow-sm'
            }`}
            title="Quitar 15 segundos al descanso"
          >
            <Minus className="w-3 h-3 text-red-400" /> 15s
          </button>
          <button
            type="button"
            onClick={() => adjustTimer(15)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all active:scale-95 flex items-center gap-0.5 ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300' 
                : 'bg-white border-zinc-300 hover:bg-zinc-100 text-zinc-800 shadow-sm'
            }`}
            title="Sumar 15 segundos al descanso"
          >
            <Plus className="w-3 h-3" style={{ color: accent.hex }} /> 15s
          </button>
        </div>

        {/* Estado actual del temporizador */}
        {secondsRemaining > 0 ? (
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-xs" style={{ color: accent.hex }}>
              {minutes}:{seconds}
            </span>
            <button
              type="button"
              onClick={toggleTimer}
              className={`p-1 rounded-lg transition-colors ${
                isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
              }`}
              title={isActive ? "Pausar" : "Reanudar"}
            >
              {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={resetTimer}
              className="text-zinc-400 hover:text-red-400 p-1 transition-colors"
              title="Cancelar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-[10px] font-mono text-zinc-500">
            Descanso inactivo
          </span>
        )}
      </div>
    </div>
  );
};
