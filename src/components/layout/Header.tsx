import React from 'react';
import { Dumbbell, Timer, Play, Pause, X, Sun, Moon, Plus, Minus } from 'lucide-react';
import { RestTimerState } from '../../hooks/useRestTimer';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  timer: RestTimerState;
  timerFontScale?: number;
}

export const Header: React.FC<HeaderProps> = ({ timer, timerFontScale = 1 }) => {
  const { secondsRemaining, isActive, toggleTimer, resetTimer, adjustTimer } = timer;
  const { accent, setThemeMode, isDark } = useTheme();

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = ('0' + (secondsRemaining % 60)).slice(-2);

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-xl border-b px-4 py-2.5 flex items-center justify-between transition-colors ${
      isDark ? 'bg-zinc-950/85 border-zinc-800/60' : 'bg-white/85 border-zinc-200 shadow-sm'
    }`}>
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-xl border flex items-center justify-center transition-colors"
          style={{ backgroundColor: `${accent.hex}18`, borderColor: `${accent.hex}35` }}
        >
          <Dumbbell className="w-4 h-4" style={{ color: accent.hex }} />
        </div>
        <div>
          <h1 className="text-sm font-black tracking-tight flex items-center gap-1">
            FitUs 
            <span 
              className="text-[9px] px-1.5 py-0.2 rounded-md font-mono border"
              style={{ 
                backgroundColor: `${accent.hex}15`, 
                borderColor: `${accent.hex}30`, 
                color: accent.hex 
              }}
            >
              PRO
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Temporizador Activo en la cabecera con control +/- 15s */}
        {secondsRemaining > 0 && (
          <div 
            className="flex items-center gap-1.5 border px-2.5 py-1 rounded-full animate-pulse shadow-lg"
            style={{ 
              backgroundColor: isDark ? '#18181b' : '#f4f4f5', 
              borderColor: `${accent.hex}40`,
              boxShadow: `0 4px 12px ${accent.hex}15`
            }}
          >
            <Timer className="w-3.5 h-3.5" style={{ color: accent.hex }} />
            <span className="font-mono font-bold" style={{ color: accent.hex, fontSize: `${Math.round(12 * timerFontScale)}px` }}>
              {minutes}:{seconds}
            </span>

            {/* Botón -15s */}
            <button
              type="button"
              onClick={() => adjustTimer(-15)}
              className="px-1 py-0.5 rounded text-[10px] font-mono font-bold hover:bg-zinc-800/60 transition-colors flex items-center text-zinc-400 hover:text-white"
              title="Quitar 15 segundos"
            >
              <Minus className="w-2.5 h-2.5" />15
            </button>

            {/* Botón +15s */}
            <button
              type="button"
              onClick={() => adjustTimer(15)}
              className="px-1 py-0.5 rounded text-[10px] font-mono font-bold hover:bg-zinc-800/60 transition-colors flex items-center"
              style={{ color: accent.hex }}
              title="Sumar 15 segundos"
            >
              <Plus className="w-2.5 h-2.5" />15
            </button>

            <button 
              type="button"
              onClick={toggleTimer}
              className="text-zinc-400 hover:text-white transition-colors p-0.5"
              title={isActive ? "Pausar descanso" : "Reanudar descanso"}
            >
              {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <button 
              type="button"
              onClick={resetTimer} 
              className="text-zinc-400 hover:text-red-400 transition-colors p-0.5"
              title="Cancelar temporizador"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Botón rápido para alternar Modo Claro / Oscuro */}
        <button
          type="button"
          onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
          className={`p-2 rounded-xl border transition-colors ${
            isDark 
              ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' 
              : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-950'
          }`}
          title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>
      </div>
    </header>
  );
};
