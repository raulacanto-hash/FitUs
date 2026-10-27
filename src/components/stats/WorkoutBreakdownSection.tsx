import React, { useMemo, useState } from 'react';
import { ChevronDown, Clock, Dumbbell, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { WorkoutSession } from '../../types/workout';
import { formatRelativeDate } from '../../utils/dates';
import { formatDuration } from '../../utils/duration';
import {
  ExercisePerformance,
  formatVolume,
  getExercisePerformance,
  getWorkoutSummary
} from '../../utils/workoutStats';
import { useTheme } from '../../context/ThemeContext';

interface WorkoutBreakdownSectionProps {
  workouts: WorkoutSession[];
  limit?: number;
}

interface PreviousPerformance {
  date: string;
  performance: ExercisePerformance;
}

const performanceKey = (workoutId: string, exerciseName: string) => `${workoutId}::${exerciseName}`;

const formatDelta = (diff: number): string => {
  const rounded = Math.round(diff * 10) / 10;
  return `${rounded > 0 ? '+' : ''}${rounded.toString().replace('.', ',')} kg`;
};

const DeltaBadge: React.FC<{ diff: number | null }> = ({ diff }) => {
  if (diff === null) {
    return (
      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-zinc-500/20 bg-zinc-500/10 text-zinc-400 flex-shrink-0">
        Nuevo
      </span>
    );
  }

  if (diff === 0) {
    return (
      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-zinc-500/20 bg-zinc-500/10 text-zinc-400 flex items-center gap-0.5 flex-shrink-0">
        <Minus className="w-3 h-3" /> =
      </span>
    );
  }

  const isPositive = diff > 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <span
      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border flex items-center gap-0.5 flex-shrink-0 ${
        isPositive
          ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'
          : 'text-red-500 border-red-500/30 bg-red-500/10'
      }`}
    >
      <Icon className="w-3 h-3" />
      {formatDelta(diff)}
    </span>
  );
};

export const WorkoutBreakdownSection: React.FC<WorkoutBreakdownSectionProps> = ({
  workouts,
  limit = 4
}) => {
  const { accent, isDark } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(() => workouts[0]?.id ?? null);
  const [showAll, setShowAll] = useState(false);

  const visibleWorkouts = showAll ? workouts : workouts.slice(0, limit);

  // Rendimiento de la sesión anterior de cada ejercicio (de más antigua a más reciente)
  const previousPerformances = useMemo(() => {
    const result = new Map<string, PreviousPerformance>();
    const seen = new Map<string, PreviousPerformance>();

    [...workouts].reverse().forEach((workout) => {
      const updates: Array<[string, PreviousPerformance]> = [];

      workout.exercises?.forEach((exercise) => {
        const previous = seen.get(exercise.name);
        if (previous) {
          result.set(performanceKey(workout.id, exercise.name), previous);
        }
        updates.push([
          exercise.name,
          { date: workout.date, performance: getExercisePerformance(exercise) }
        ]);
      });

      updates.forEach(([name, value]) => seen.set(name, value));
    });

    return result;
  }, [workouts]);

  return (
    <section className="space-y-2.5" aria-labelledby="workout-breakdown-title">
      <div className="flex items-center justify-between">
        <h3 id="workout-breakdown-title" className="text-sm font-bold flex items-center gap-2">
          <Dumbbell className="w-4 h-4" style={{ color: accent.hex }} />
          Entrenamientos
        </h3>
        <span className="text-[10px] font-mono text-zinc-500">
          {workouts.length} {workouts.length === 1 ? 'sesión' : 'sesiones'}
        </span>
      </div>

      <div className="space-y-2">
        {visibleWorkouts.map((workout) => {
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
                    {formatDuration(workout.durationMinutes ?? 45)}
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
                  className={`px-3 pb-3 pt-2.5 space-y-2 border-t ${
                    isDark ? 'border-zinc-800/80' : 'border-zinc-200'
                  }`}
                >
                  {exercises.length === 0 ? (
                    <p className="text-[10px] text-zinc-500 italic">Sin ejercicios registrados.</p>
                  ) : (
                    exercises.map((exercise, index) => {
                      const performance = getExercisePerformance(exercise);
                      const previous = previousPerformances.get(
                        performanceKey(workout.id, exercise.name)
                      );
                      const diff = previous
                        ? performance.maxWeight - previous.performance.maxWeight
                        : null;

                      return (
                        <div
                          key={`${exercise.id}-${index}`}
                          className={`rounded-xl p-2.5 border space-y-2 ${
                            isDark ? 'bg-zinc-950/40 border-zinc-800/60' : 'bg-zinc-50 border-zinc-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate">{exercise.name}</p>
                              <p className="text-[9px] uppercase tracking-wider text-zinc-500 mt-0.5">
                                {exercise.category}
                              </p>
                            </div>
                            <DeltaBadge diff={diff} />
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {exercise.sets.map((set, setIndex) => (
                              <span
                                key={set.id || setIndex}
                                className={`px-1.5 py-0.5 rounded-md font-mono text-[10px] border ${
                                  set.completed
                                    ? isDark
                                      ? 'bg-zinc-800/90 border-zinc-700 text-zinc-200'
                                      : 'bg-white border-zinc-300 text-zinc-800'
                                    : isDark
                                      ? 'bg-zinc-900 text-zinc-500 border-zinc-800'
                                      : 'bg-white text-zinc-400 border-zinc-200'
                                }`}
                                title={set.completed ? 'Serie completada' : 'Serie sin completar'}
                              >
                                {set.weight === '' ? 0 : set.weight} kg × {set.reps === '' ? 0 : set.reps}
                              </span>
                            ))}
                          </div>

                          <div className="grid grid-cols-3 gap-1.5">
                            <div className={`rounded-lg px-1.5 py-1 border text-center ${
                              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'
                            }`}>
                              <p className="text-[8px] uppercase tracking-wider text-zinc-500">Peso máx.</p>
                              <p className="text-[11px] font-black mt-0.5" style={{ color: accent.hex }}>
                                {performance.maxWeight || 0} kg
                              </p>
                            </div>
                            <div className={`rounded-lg px-1.5 py-1 border text-center ${
                              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'
                            }`}>
                              <p className="text-[8px] uppercase tracking-wider text-zinc-500">Volumen</p>
                              <p className="text-[11px] font-black mt-0.5">{formatVolume(performance.totalVolume)}</p>
                            </div>
                            <div className={`rounded-lg px-1.5 py-1 border text-center ${
                              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'
                            }`}>
                              <p className="text-[8px] uppercase tracking-wider text-zinc-500">Series</p>
                              <p className="text-[11px] font-black mt-0.5 font-mono">
                                {performance.completedSets}/{performance.totalSets}
                              </p>
                            </div>
                          </div>

                          {previous && (
                            <p className="text-[9px] text-zinc-500 font-mono">
                              Anterior · {formatRelativeDate(previous.date)}: {previous.performance.maxWeight} kg
                            </p>
                          )}
                        </div>
                      );
                    })
                  )}

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-zinc-500">
                    <span>Volumen total del entrenamiento</span>
                    <span className="font-bold" style={{ color: accent.hex }}>
                      {formatVolume(summary.totalVolume)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {workouts.length > limit && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className={`w-full py-2.5 rounded-2xl border border-dashed text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors ${
            isDark
              ? 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              : 'border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          {showAll ? 'Mostrar menos' : `Ver los ${workouts.length} entrenamientos`}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAll ? 'rotate-180' : ''}`} />
        </button>
      )}
    </section>
  );
};
