import React from 'react';
import { History, Calendar } from 'lucide-react';
import { WorkoutSession } from '../../types/workout';
import { WorkoutHistoryCard } from './WorkoutHistoryCard';

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
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-400" />
          Histórico
        </h2>
        <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full font-mono">
          {history.length} {history.length === 1 ? 'entrenamiento' : 'entrenamientos'}
        </span>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-14 px-4 border border-dashed border-zinc-800/80 rounded-2xl bg-zinc-900/30">
          <Calendar className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
          <p className="text-zinc-400 font-medium text-xs">Aún no hay ningún entrenamiento registrado</p>
        </div>
      ) : (
        history.map((workout) => (
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
