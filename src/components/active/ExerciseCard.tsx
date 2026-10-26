import React from 'react';
import { Trash2, Plus, FileText } from 'lucide-react';
import { WorkoutExercise } from '../../types/workout';
import { SetRow } from './SetRow';
import { useTheme } from '../../context/ThemeContext';

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  exerciseIndex: number;
  onToggleSet: (exerciseId: string, setId: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, field: 'weight' | 'reps', value: string) => void;
  onAddSet: (exerciseId: string) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onUpdateNotes: (exerciseId: string, notes: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  exerciseIndex,
  onToggleSet,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
  onRemoveExercise,
  onUpdateNotes,
}) => {
  const { accent, isDark } = useTheme();

  return (
    <div className={`p-4 rounded-3xl border space-y-3 transition-all ${
      isDark 
        ? 'bg-zinc-900/80 border-zinc-800/80 backdrop-blur-md' 
        : 'bg-white border-zinc-200 shadow-sm'
    }`}>
      {/* Header del Ejercicio */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-sm flex items-center gap-2">
            <span className={`text-[11px] font-mono w-5 h-5 rounded-md flex items-center justify-center border ${
              isDark ? 'bg-zinc-800 text-zinc-400 border-zinc-700/50' : 'bg-zinc-100 text-zinc-600 border-zinc-300'
            }`}>
              {exerciseIndex + 1}
            </span>
            {exercise.name}
          </h3>
          <span 
            className="text-[10px] uppercase font-bold tracking-wider ml-7 block mt-0.5"
            style={{ color: accent.hex }}
          >
            {exercise.category}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRemoveExercise(exercise.id)}
          className={`p-1.5 transition-colors rounded-xl ${
            isDark ? 'text-zinc-500 hover:text-red-400 hover:bg-zinc-800/50' : 'text-zinc-400 hover:text-red-600 hover:bg-zinc-100'
          }`}
          title="Eliminar ejercicio de la sesión"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Tabla de Series */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-12 text-[10px] font-semibold text-zinc-400 px-2.5 text-center uppercase tracking-wider">
          <span className="col-span-2 text-left">SERIE</span>
          <span className="col-span-4">PESO (KG)</span>
          <span className="col-span-3">REPS</span>
          <span className="col-span-3 text-right">LISTO</span>
        </div>

        {exercise.sets.map((set, setIdx) => (
          <SetRow
            key={set.id}
            setIndex={setIdx}
            setData={set}
            exerciseId={exercise.id}
            onToggle={onToggleSet}
            onUpdate={onUpdateSet}
            onRemove={onRemoveSet}
            canRemove={exercise.sets.length > 1}
          />
        ))}
      </div>

      {/* Acciones de Serie y Notas */}
      <div className="pt-1 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onAddSet(exercise.id)}
          className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all active:scale-95 ${
            isDark 
              ? 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 border-zinc-700/50' 
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
          }`}
        >
          <Plus className="w-3.5 h-3.5" style={{ color: accent.hex }} /> Serie
        </button>

        <div className={`flex-1 flex items-center gap-2 rounded-xl px-2.5 py-1 border ${
          isDark ? 'bg-zinc-950/60 border-zinc-800/60' : 'bg-zinc-50 border-zinc-200'
        }`}>
          <FileText className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
          <input
            type="text"
            value={exercise.notes}
            onChange={(e) => onUpdateNotes(exercise.id, e.target.value)}
            placeholder="Añadir nota rápida..."
            className={`bg-transparent text-xs placeholder-zinc-500 focus:outline-none w-full ${
              isDark ? 'text-zinc-200' : 'text-zinc-900'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
