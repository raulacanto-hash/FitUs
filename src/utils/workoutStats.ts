import { WorkoutExercise, WorkoutSession } from '../types/workout';

export interface WorkoutSummary {
  exerciseCount: number;
  totalSets: number;
  completedSets: number;
  totalVolume: number;
}

export interface ExercisePerformance {
  maxWeight: number;
  totalVolume: number;
  completedSets: number;
  totalSets: number;
}

/**
 * Resumen rápido de una sesión: ejercicios, series y volumen efectivo
 * (solo series completadas, calculado como peso × repeticiones).
 */
export function getWorkoutSummary(workout: WorkoutSession): WorkoutSummary {
  const exercises = workout.exercises ?? [];
  const allSets = exercises.flatMap((exercise) => exercise.sets ?? []);
  const completedSets = allSets.filter((set) => set.completed);

  const totalVolume = completedSets.reduce((total, set) => {
    return total + (Number(set.weight) || 0) * (Number(set.reps) || 0);
  }, 0);

  return {
    exerciseCount: exercises.length,
    totalSets: allSets.length,
    completedSets: completedSets.length,
    totalVolume
  };
}

/**
 * Métricas de un ejercicio dentro de una sesión. Si no hay series marcadas
 * como completadas se usan todas las series registradas.
 */
export function getExercisePerformance(exercise: WorkoutExercise): ExercisePerformance {
  const sets = exercise.sets ?? [];
  const validSets = sets.filter((set) => (Number(set.weight) || 0) > 0 || (Number(set.reps) || 0) > 0);
  const completedSets = validSets.filter((set) => set.completed);
  const effectiveSets = completedSets.length > 0 ? completedSets : validSets;

  const maxWeight = effectiveSets.reduce((max, set) => Math.max(max, Number(set.weight) || 0), 0);
  const totalVolume = effectiveSets.reduce((total, set) => {
    return total + (Number(set.weight) || 0) * (Number(set.reps) || 0);
  }, 0);

  return {
    maxWeight,
    totalVolume,
    completedSets: completedSets.length,
    totalSets: sets.length
  };
}

/**
 * Ordena el historial de la sesión más reciente a la más antigua.
 */
export function sortWorkoutsByDateDesc(history: WorkoutSession[]): WorkoutSession[] {
  return [...history].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return (b.startTime ?? 0) - (a.startTime ?? 0);
  });
}

/**
 * Formatea un volumen de entrenamiento de forma compacta.
 */
export function formatVolume(volume: number): string {
  if (!Number.isFinite(volume) || volume <= 0) return '0 kg';
  if (volume >= 10000) {
    return `${(volume / 1000).toFixed(1).replace('.', ',')}k kg`;
  }
  return `${Math.round(volume).toLocaleString('es-MX')} kg`;
}
