import React, { useMemo } from 'react';
import { History, Calendar } from 'lucide-react';
import { WorkoutSession } from '../../types/workout';
import { WorkoutHistoryCard } from './WorkoutHistoryCard';
import { sortWorkoutsByDateDesc } from '../../utils/workoutStats';
import { useTheme } from '../../context/ThemeContext';

interface HistoryViewProps {
  history: WorkoutSession[];
  onEditWorkout: (workout: WorkoutSession) => void;
  onDeleteWorkout: (workoutId: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onEditWorkout,
  onDeleteWorkout
}) => {
  const { accent, isDark } = useTheme();
  const orderedHistory = useMemo(() => sortWorkoutsByDateDesc(history), [history]);

  return (
    <div className={`space-y-4 animate-in fade-in duration-200 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-black flex items-center gap-2">
          <History className="w-5 h-5" style={{ color: accent.hex }} />
          Histórico de Entrenamientos
        </h2>
        <span className={`text-xs px-2.5 py-1 rounded-full font-mono border ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600 shadow-sm'
        }`}>
          {orderedHistory.length} {orderedHistory.length === 1 ? 'entrenamiento' : 'entrenamientos'}
        </span>
      </div>

      {orderedHistory.length === 0 ? (
        <div className={`text-center py-14 px-4 border border-dashed rounded-3xl ${
          isDark ? 'border-zinc-800/80 bg-zinc-900/30' : 'border-zinc-300 bg-white'
        }`}>
          <Calendar className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <p className="text-zinc-400 font-bold text-xs">Aún no hay ningún entrenamiento registrado</p>
        </div>
      ) : (
        orderedHistory.map((workout) => (
          <WorkoutHistoryCard
            key={workout.id}
            workout={workout}
            onEdit={onEditWorkout}
            onDelete={onDeleteWorkout}
          />
        ))
      )}
    </div>
  );
};
