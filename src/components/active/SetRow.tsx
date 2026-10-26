import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { WorkoutSet } from '../../types/workout';

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
  return (
    <div 
      className={`grid grid-cols-12 items-center gap-1.5 px-2.5 py-2 rounded-xl border transition-all ${
        setData.completed 
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
          : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-200'
      }`}
    >
      {/* Indicador de serie */}
      <span className="col-span-2 font-mono text-xs font-medium text-zinc-400">
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
          className="w-full bg-zinc-800/70 border border-zinc-700/60 rounded-lg py-1.5 px-2 text-center text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
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
          className="w-full bg-zinc-800/70 border border-zinc-700/60 rounded-lg py-1.5 px-2 text-center text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
          placeholder="0"
        />
      </div>

      {/* Acciones: Completar y Eliminar serie */}
      <div className="col-span-3 flex items-center justify-end gap-1">
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(exerciseId, setData.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-zinc-800/60 transition-colors"
            title="Eliminar serie"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onToggle(exerciseId, setData.id)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            setData.completed 
              ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20 scale-105' 
              : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 border border-zinc-700/50'
          }`}
          title={setData.completed ? "Desmarcar completado" : "Completar serie"}
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
