import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { WorkoutSet } from '../../types/workout';
import { useTheme } from '../../context/ThemeContext';

interface SetRowProps {
  setIndex: number;
  setData: WorkoutSet;
  exerciseId: string;
  onToggle: (exerciseId: string, setId: string) => void;
  onUpdate: (exerciseId: string, setId: string, field: 'weight' | 'reps', value: string) => void;
  onRemove: (exerciseId: string, setId: string) => void;
  canRemove: boolean;
}

export const SetRow: React.FC<SetRowProps> = ({
  setIndex,
  setData,
  exerciseId,
  onToggle,
  onUpdate,
  onRemove,
  canRemove
}) => {
  const { accent, isDark } = useTheme();

  return (
    <div 
      className={`grid grid-cols-12 items-center gap-1.5 px-2.5 py-2 rounded-2xl border transition-all ${
        setData.completed 
          ? isDark 
            ? 'bg-zinc-900 border-zinc-700' 
            : 'bg-zinc-100 border-zinc-300'
          : isDark 
            ? 'bg-zinc-950/40 border-zinc-800/60' 
            : 'bg-white border-zinc-200 shadow-sm'
      }`}
      style={setData.completed ? { borderColor: `${accent.hex}60` } : undefined}
    >
      {/* Indicador de serie */}
      <span className={`col-span-2 font-mono text-xs font-bold ${
        setData.completed ? '' : 'text-zinc-400'
      }`} style={setData.completed ? { color: accent.hex } : undefined}>
        #{setIndex + 1}
      </span>

      {/* Input de Peso */}
      <div className="col-span-4 px-0.5">
        <input
          type="number"
          step="any"
          inputMode="decimal"
          value={setData.weight}
          onChange={(e) => onUpdate(exerciseId, setData.id, 'weight', e.target.value)}
          className={`w-full rounded-xl py-1.5 px-2 text-center text-xs font-bold focus:outline-none transition-colors ${
            isDark 
              ? 'bg-zinc-800/80 border border-zinc-700/60 text-white placeholder-zinc-500' 
              : 'bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400'
          }`}
          style={{ borderColor: setData.completed ? `${accent.hex}50` : undefined }}
          placeholder="0"
        />
      </div>

      {/* Input de Repeticiones */}
      <div className="col-span-3 px-0.5">
        <input
          type="number"
          inputMode="numeric"
          value={setData.reps}
          onChange={(e) => onUpdate(exerciseId, setData.id, 'reps', e.target.value)}
          className={`w-full rounded-xl py-1.5 px-2 text-center text-xs font-bold focus:outline-none transition-colors ${
            isDark 
              ? 'bg-zinc-800/80 border border-zinc-700/60 text-white placeholder-zinc-500' 
              : 'bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400'
          }`}
          style={{ borderColor: setData.completed ? `${accent.hex}50` : undefined }}
          placeholder="0"
        />
      </div>

      {/* Acciones: Completar y Eliminar serie */}
      <div className="col-span-3 flex items-center justify-end gap-1">
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(exerciseId, setData.id)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
              isDark 
                ? 'text-zinc-500 hover:text-red-400 hover:bg-zinc-800/60' 
                : 'text-zinc-400 hover:text-red-600 hover:bg-zinc-100'
            }`}
            title="Eliminar serie"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onToggle(exerciseId, setData.id)}
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
            setData.completed 
              ? 'shadow-md scale-105' 
              : isDark 
                ? 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 border border-zinc-700/50' 
                : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 border border-zinc-300'
          }`}
          style={setData.completed ? { backgroundColor: accent.hex, color: accent.contrastText === 'text-white' ? '#fff' : '#000' } : undefined}
          title={setData.completed ? "Desmarcar completado" : "Completar serie"}
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
