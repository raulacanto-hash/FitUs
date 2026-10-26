import React from 'react';
import { Trash2, Plus, FileText } from 'lucide-react';
import { WorkoutExercise } from '../../types/workout';
import { SetRow } from './SetRow';

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
  return (
    <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 space-y-3 shadow-sm backdrop-blur-md">
      {/* Header del Ejercicio */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
            <span className="text-[11px] font-mono bg-zinc-800 text-zinc-400 w-5 h-5 rounded-md flex items-center justify-center border border-zinc-700/50">
              {exerciseIndex + 1}
            </span>
            {exercise.name}
          </h3>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400 ml-7 block mt-0.5">
            {exercise.category}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRemoveExercise(exercise.id)}
          className="text-zinc-400 hover:text-red-400 p-1.5 transition-colors rounded-lg hover:bg-zinc-800/50"
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
          className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 px-3 py-1.5 rounded-xl transition-colors active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" /> Serie
        </button>

        <div className="flex-1 flex items-center gap-2 bg-zinc-950/50 border border-zinc-800/60 rounded-xl px-2.5 py-1">
          <FileText className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
          <input
            type="text"
            value={exercise.notes}
            onChange={(e) => onUpdateNotes(exercise.id, e.target.value)}
            placeholder="Añadir nota rápida..."
            className="bg-transparent text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none w-full"
          />
        </div>
      </div>
    </div>
  );
};
