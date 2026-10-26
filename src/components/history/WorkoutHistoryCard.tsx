import React from 'react';
import { Calendar, Clock, Edit, Trash2, FileText } from 'lucide-react';
import { WorkoutSession } from '../../types/workout';
import { formatDisplayDate } from '../../utils/dates';

interface WorkoutHistoryCardProps {
  workout: WorkoutSession;
  onEdit: (workout: WorkoutSession) => void;
  onDelete: (workoutId: string) => void;
}

export const WorkoutHistoryCard: React.FC<WorkoutHistoryCardProps> = ({
  workout,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 space-y-3 backdrop-blur-md">
      <div className="flex justify-between items-start border-b border-zinc-800/60 pb-2.5">
        <div>
          <h3 className="font-bold text-sm text-white">{workout.routineName}</h3>
          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-400" /> {formatDisplayDate(workout.date)}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-emerald-400" /> {workout.durationMinutes || 45} min
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(workout)}
            className="p-1.5 text-zinc-400 hover:text-emerald-400 bg-zinc-800/60 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Editar entrenamiento"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(workout.id)}
            className="p-1.5 text-zinc-400 hover:text-red-400 bg-zinc-800/60 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Eliminar registro"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Resumen de Ejercicios */}
      <div className="space-y-2">
        {workout.exercises && workout.exercises.map((ex) => (
          <div key={ex.id} className="text-xs bg-zinc-950/40 rounded-xl p-2.5 border border-zinc-800/50">
            <div className="flex justify-between font-semibold text-zinc-200">
              <span>{ex.name}</span>
              <span className="text-zinc-400 text-[11px]">{ex.sets.length} series</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1.5 flex flex-wrap gap-1">
              {ex.sets.map((s, idx) => (
                <span 
                  key={s.id || idx} 
                  className={`px-2 py-0.5 rounded font-mono text-[10px] border ${
                    s.completed 
                      ? 'bg-zinc-800/90 text-emerald-300 border-emerald-500/20' 
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}
                >
                  {s.weight}kg × {s.reps}
                </span>
              ))}
            </div>
            {ex.notes && (
              <p className="text-[10px] text-emerald-400/90 italic mt-1.5 flex items-center gap-1">
                <FileText className="w-3 h-3" /> {ex.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
