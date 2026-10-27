import { MuscleCategory, RoutineTemplate, WorkoutExercise, WorkoutSession } from '../types/workout';
import { formatDisplayDate } from './dates';

const numberFromSet = (value: number | '' | undefined): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

function templateFromExercise(exercise: WorkoutExercise): RoutineTemplate['exercises'][number] | null {
  if (!exercise.name?.trim()) return null;

  const completedSets = exercise.sets.filter((set) => set.completed);
  const sourceSets = completedSets.length > 0 ? completedSets : exercise.sets;
  const sets = sourceSets.length > 0 ? sourceSets : exercise.sets;

  const repsValues = sets
    .map((set) => numberFromSet(set.reps))
    .filter((value): value is number => value !== undefined && value > 0);
  const weightValues = sets
    .map((set) => numberFromSet(set.weight))
    .filter((value): value is number => value !== undefined && value >= 0);

  const firstReps = repsValues[0];
  const firstWeight = weightValues[0];
  const minReps = repsValues.length > 0 ? Math.min(...repsValues) : undefined;
  const maxReps = repsValues.length > 0 ? Math.max(...repsValues) : undefined;
  const minWeight = weightValues.length > 0 ? Math.min(...weightValues) : undefined;
  const maxWeight = weightValues.length > 0 ? Math.max(...weightValues) : undefined;

  return {
    name: exercise.name.trim(),
    category: exercise.category,
    targetSets: Math.max(1, sets.length),
    defaultReps: firstReps ?? 10,
    defaultWeight: firstWeight ?? 20,
    repsRange:
      minReps !== undefined && maxReps !== undefined && minReps !== maxReps
        ? `${minReps}-${maxReps}`
        : undefined,
    weightRange:
      minWeight !== undefined && maxWeight !== undefined && minWeight !== maxWeight
        ? `${minWeight}-${maxWeight} kg`
        : undefined
  };
}

export function buildRoutineFromWorkout(
  workout: WorkoutSession
): Omit<RoutineTemplate, 'id'> | null {
  const exercises = workout.exercises
    .map(templateFromExercise)
    .filter((exercise): exercise is RoutineTemplate['exercises'][number] => exercise !== null);

  if (exercises.length === 0) return null;

  const categoryCounts = new Map<MuscleCategory, number>();
  exercises.forEach((exercise) => {
    categoryCounts.set(exercise.category, (categoryCounts.get(exercise.category) ?? 0) + 1);
  });

  const sortedCategories = Array.from(categoryCounts.entries()).sort((a, b) => b[1] - a[1]);
  const mainCategory = sortedCategories[0]?.[0] ?? 'Pecho';
  const targetMuscles = sortedCategories.slice(0, 3).map(([muscle, count]) => ({
    muscle,
    percentage: Math.round((count / exercises.length) * 100)
  }));

  const dateLabel = workout.date ? formatDisplayDate(workout.date) : 'una sesión anterior';

  return {
    name: workout.routineName?.trim() || `Rutina del ${dateLabel}`,
    subtitle: `Creada desde el entrenamiento del ${dateLabel} · ${exercises.length} ejercicios`,
    category: mainCategory.toUpperCase(),
    estimatedMinutes: Math.max(15, workout.durationMinutes ?? 45),
    recoveryScore: 100,
    heroGradient: 'from-cyan-500/20 via-zinc-900 to-zinc-950',
    isCustom: true,
    targetMuscles,
    exercises
  };
}
