import React from 'react';
import { BarChart2, CheckCircle2, ChevronRight, Dumbbell, MoreVertical } from 'lucide-react';
import { WorkoutExercise } from '../../types/workout';
import { useTheme } from '../../context/ThemeContext';

interface SessionExerciseRowProps {
  exercise: WorkoutExercise;
  onOpen: () => void;
  onOpenMenu: () => void;
}

const muscleInitials = (category: string): string =>
  category
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 3)
    .toUpperCase();

export const SessionExerciseRow: React.FC<SessionExerciseRowProps> = ({
  exercise,
  onOpen,
  onOpenMenu
}) => {
  const { accent, isDark } = useTheme();

  const workingSets = exercise.sets.filter((set) => !set.isWarmup);
  const summarySets = workingSets.length > 0 ? workingSets : exercise.sets;
  const completedSets = exercise.sets.filter((set) => set.completed).length;
  const allCompleted = exercise.sets.length > 0 && completedSets === exercise.sets.length;
  const lastSet = [...summarySets].reverse().find(
    (set) => Number(set.weight) > 0 || Number(set.reps) > 0
  );

  const summary = lastSet
    ? `${exercise.sets.length} series · ${completedSets} registradas · ${Number(lastSet.weight) || 0} kg × ${Number(lastSet.reps) || 0}`
    : `${exercise.sets.length} ${exercise.sets.length === 1 ? 'serie' : 'series'} · ${completedSets} registradas`;

  return (
    <div
      className={`rounded-2xl border transition-all flex items-center gap-2 pr-2 ${
        isDark
          ? 'bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700'
          : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
      }`}
      style={allCompleted ? { borderColor: `${accent.hex}55` } : undefined}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex-1 min-w-0 flex items-center gap-3 p-2.5 text-left rounded-2xl active:scale-[0.99] transition-transform"
        aria-label={`Abrir captura de ${exercise.name}`}
      >
        <span
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border ${
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
          }`}
        >
          <Dumbbell className="w-5 h-5" style={{ color: accent.hex }} />
          <span className={`text-[8px] font-black uppercase tracking-wider mt-0.5 ${
            isDark ? 'text-zinc-500' : 'text-zinc-500'
          }`}>
            {muscleInitials(exercise.category)}
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="text-xs font-bold truncate flex-1">{exercise.name}</span>
            {allCompleted && (
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent.hex }} />
            )}
          </span>
          <span
            className="text-[10px] uppercase font-bold tracking-wider block mt-0.5"
            style={{ color: accent.hex }}
          >
            {exercise.category}
          </span>
          <span className={`text-[10px] font-mono mt-1 flex items-center gap-1.5 ${
            isDark ? 'text-zinc-400' : 'text-zinc-500'
          }`}>
            <BarChart2 className="w-3 h-3 flex-shrink-0" style={{ color: accent.hex }} />
            <span className="truncate">{summary}</span>
          </span>
        </span>

        <ChevronRight className="w-4 h-4 text-zinc-500 flex-shrink-0" />
      </button>

      <button
        type="button"
        onClick={onOpenMenu}
        className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
          isDark ? 'text-zinc-500 hover:text-white hover:bg-zinc-800' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
        }`}
        title="Opciones del ejercicio"
        aria-label={`Opciones de ${exercise.name}`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  );
};
