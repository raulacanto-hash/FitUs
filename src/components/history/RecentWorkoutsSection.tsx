import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Clock, Dumbbell, History } from 'lucide-react';
import { WorkoutSession } from '../../types/workout';
import { formatRelativeDate } from '../../utils/dates';
import { getWorkoutSummary, sortWorkoutsByDateDesc } from '../../utils/workoutStats';
import { useTheme } from '../../context/ThemeContext';

interface RecentWorkoutsSectionProps {
  history: WorkoutSession[];
  onViewAll: () => void;
  limit?: number;
}

export const RecentWorkoutsSection: React.FC<RecentWorkoutsSectionProps> = ({
  history,
  onViewAll,
  limit = 3
}) => {
  const { accent, isDark } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const recentWorkouts = useMemo(
    () => sortWorkoutsByDateDesc(history).slice(0, limit),
    [history, limit]
  );

  return (
    <section className="space-y-2.5 pt-1" aria-labelledby="recent-workouts-title">
      <div className="flex items-center justify-between">
        <h3 id="recent-workouts-title" className="text-sm font-bold flex items-center gap-2">
          <History className="w-4 h-4" style={{ color: accent.hex }} />
          Últimos Entrenamientos
        </h3>
        {recentWorkouts.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold flex items-center gap-0.5 transition-opacity hover:opacity-80"
            style={{ color: accent.hex }}
          >
            Ver todo <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {recentWorkouts.length === 0 ? (
        <div className={`text-center py-6 px-4 border border-dashed rounded-2xl ${
          isDark ? 'border-zinc-800/80 bg-zinc-900/30' : 'border-zinc-300 bg-white'
        }`}>
          <History className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
          <p className="text-zinc-400 font-bold text-xs">Aún no hay entrenamientos registrados</p>
          <p className="text-[10px] text-zinc-500 mt-1">Completa tu primera sesión para verla aquí.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentWorkouts.map((workout) => {
            const isExpanded = expandedId === workout.id;
            const summary = getWorkoutSummary(workout);
            const exercises = workout.exercises ?? [];

            return (
              <div
                key={workout.id}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  isDark
                    ? 'bg-zinc-900/80 border-zinc-800/80'
                    : 'bg-white border-zinc-200 shadow-sm'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : workout.id)}
                  aria-expanded={isExpanded}
                  className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition-colors ${
                    isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-zinc-50'
                  }`}
                >
                  <span
                    className="w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${accent.hex}12`, borderColor: `${accent.hex}30` }}
                  >
                    <Dumbbell className="w-4 h-4" style={{ color: accent.hex }} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-bold truncate flex-1">{workout.routineName}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md border flex-shrink-0 ${
                        isDark
                          ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                      }`}>
                        {formatRelativeDate(workout.date)}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono mt-1">
                      <Clock className="w-3 h-3" style={{ color: accent.hex }} />
                      {workout.durationMinutes || 45} min
                      <span className="text-zinc-600">•</span>
                      {summary.exerciseCount} {summary.exerciseCount === 1 ? 'ejercicio' : 'ejercicios'}
                      <span className="text-zinc-600">•</span>
                      {summary.completedSets} {summary.completedSets === 1 ? 'serie' : 'series'}
                    </span>
                  </span>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-500 flex-shrink-0 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div
                    className={`px-3 pb-3 pt-2.5 space-y-1.5 border-t ${
                      isDark ? 'border-zinc-800/80' : 'border-zinc-200'
                    }`}
                  >
                    {exercises.length === 0 ? (
                      <p className="text-[10px] text-zinc-500 italic">Sin ejercicios registrados.</p>
                    ) : (
                      exercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className={`rounded-xl p-2 border ${
                            isDark ? 'bg-zinc-950/40 border-zinc-800/60' : 'bg-zinc-50 border-zinc-200'
                          }`}
                        >
                          <div className="flex justify-between gap-2 text-[11px] font-bold">
                            <span className="truncate">{exercise.name}</span>
                            <span className="text-zinc-500 text-[10px] font-mono flex-shrink-0">
                              {exercise.sets.length} {exercise.sets.length === 1 ? 'serie' : 'series'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {exercise.sets.map((set, idx) => (
                              <span
                                key={set.id || idx}
                                className={`px-1.5 py-0.5 rounded-md font-mono text-[10px] border ${
                                  set.completed
                                    ? isDark
                                      ? 'bg-zinc-800/90 border-zinc-700 text-zinc-200'
                                      : 'bg-white border-zinc-300 text-zinc-800'
                                    : isDark
                                      ? 'bg-zinc-900 text-zinc-500 border-zinc-800'
                                      : 'bg-white text-zinc-400 border-zinc-200'
                                }`}
                              >
                                {set.weight === '' ? 0 : set.weight}kg × {set.reps === '' ? 0 : set.reps}
                              </span>
                            ))}
                          </div>
                          {exercise.notes && (
                            <p className="text-[10px] italic text-zinc-500 mt-1 truncate">{exercise.notes}</p>
                          )}
                        </div>
                      ))
                    )}

                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-zinc-500">
                      <span>Volumen efectivo</span>
                      <span className="font-bold" style={{ color: accent.hex }}>
                        {Math.round(summary.totalVolume).toLocaleString('es-MX')} kg
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
