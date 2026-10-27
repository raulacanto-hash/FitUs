import React from 'react';
import { Calendar, Clock, Edit, Trash2, FileText, CopyPlus } from 'lucide-react';
import { WorkoutSession } from '../../types/workout';
import { formatDisplayDate } from '../../utils/dates';
import { formatDuration } from '../../utils/duration';
import { useTheme } from '../../context/ThemeContext';

interface WorkoutHistoryCardProps {
  workout: WorkoutSession;
  onEdit: (workout: WorkoutSession) => void;
  onDelete: (workoutId: string) => void;
  onConvertToRoutine: (workout: WorkoutSession) => void;
}

export const WorkoutHistoryCard: React.FC<WorkoutHistoryCardProps> = ({
  workout,
  onEdit,
  onDelete,
  onConvertToRoutine
}) => {
  const { accent, isDark } = useTheme();
  const canConvertToRoutine = Boolean(workout.exercises && workout.exercises.length > 0);

  return (
    <div className={`p-4 rounded-3xl border space-y-3 transition-all ${
      isDark 
        ? 'bg-zinc-900/80 border-zinc-800/80 backdrop-blur-md' 
        : 'bg-white border-zinc-200 shadow-sm'
    }`}>
      <div className="flex justify-between items-start border-b pb-2.5" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
        <div>
          <h3 className="font-bold text-sm">{workout.routineName}</h3>
          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" style={{ color: accent.hex }} /> {formatDisplayDate(workout.date)}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" style={{ color: accent.hex }} /> {formatDuration(workout.durationMinutes ?? 45)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(workout)}
            className={`p-1.5 rounded-xl transition-colors ${
              isDark 
                ? 'text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-800' 
                : 'text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200'
            }`}
            title="Editar entrenamiento"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(workout.id)}
            className={`p-1.5 rounded-xl transition-colors ${
              isDark 
                ? 'text-zinc-400 hover:text-red-400 bg-zinc-800/60 hover:bg-zinc-800' 
                : 'text-zinc-400 hover:text-red-600 bg-zinc-100 hover:bg-zinc-200'
            }`}
            title="Eliminar registro"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Resumen de Ejercicios */}
      <div className="space-y-2">
        {workout.exercises && workout.exercises.map((ex) => (
          <div key={ex.id} className={`text-xs rounded-2xl p-2.5 border ${
            isDark ? 'bg-zinc-950/40 border-zinc-800/50' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <div className="flex justify-between font-bold">
              <span>{ex.name}</span>
              <span className="text-zinc-400 text-[11px] font-mono">{ex.sets.length} series</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1.5 flex flex-wrap gap-1">
              {ex.sets.map((s, idx) => (
                <span 
                  key={s.id || idx} 
                  className={`px-2 py-0.5 rounded-lg font-mono text-[10px] border ${
                    s.completed 
                      ? isDark 
                        ? 'bg-zinc-800/90 border-zinc-700' 
                        : 'bg-zinc-100 border-zinc-300 font-bold'
                      : isDark ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-white text-zinc-400 border-zinc-200'
                  }`}
                  style={s.completed ? { color: accent.hex } : undefined}
                >
                  {s.weight}kg × {s.reps}
                </span>
              ))}
            </div>
            {ex.notes && (
              <p className="text-[10px] italic mt-1.5 flex items-center gap-1 text-zinc-400">
                <FileText className="w-3 h-3" style={{ color: accent.hex }} /> {ex.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onConvertToRoutine(workout)}
        disabled={!canConvertToRoutine}
        className={`w-full pt-2.5 border-t text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
          isDark ? 'hover:text-lime-300' : 'hover:text-lime-600'
        }`}
        style={{ borderColor: isDark ? '#27272a' : '#e4e4e7', color: accent.hex }}
        title={canConvertToRoutine ? 'Convertir en rutina' : 'Añade ejercicios para convertirla en rutina'}
      >
        <CopyPlus className="w-3.5 h-3.5" /> Convertir en rutina
      </button>
    </div>
  );
};
