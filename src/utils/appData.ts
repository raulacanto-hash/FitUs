import {
  BodyMeasurementEntry,
  ExerciseDefinition,
  RoutineTemplate,
  UserProfile,
  WeightLogEntry,
  WorkoutSession,
  WorkoutSettings
} from '../types/workout';
import { getStoredItem, removeStoredItem, setStoredItem } from './storage';
import { sortWorkoutsByDateDesc } from './workoutStats';

export const APP_STORAGE_KEYS = {
  HISTORY: 'fittrack_history',
  CUSTOM_EXERCISES: 'fittrack_custom_exercises',
  CURRENT_WORKOUT: 'fittrack_current_workout',
  ROUTINE_TEMPLATES: 'fittrack_routine_templates',
  WEIGHT_LOGS: 'fittrack_weight_logs',
  BODY_MEASUREMENTS: 'fittrack_body_measurements',
  USER_PROFILE: 'fittrack_user_profile',
  WORKOUT_SETTINGS: 'fittrack_workout_settings'
} as const;

export const SYNCED_STORAGE_KEYS: string[] = Object.values(APP_STORAGE_KEYS);

export interface AppSnapshot {
  history: WorkoutSession[];
  customExercises: ExerciseDefinition[];
  currentWorkout: WorkoutSession | null;
  routineTemplates: RoutineTemplate[];
  weightLogs: WeightLogEntry[];
  bodyMeasurements: BodyMeasurementEntry[];
  userProfile: UserProfile | null;
  workoutSettings: WorkoutSettings | null;
}

export function readLocalSnapshot(): AppSnapshot {
  return {
    history: getStoredItem<WorkoutSession[]>(APP_STORAGE_KEYS.HISTORY, []),
    customExercises: getStoredItem<ExerciseDefinition[]>(APP_STORAGE_KEYS.CUSTOM_EXERCISES, []),
    currentWorkout: getStoredItem<WorkoutSession | null>(APP_STORAGE_KEYS.CURRENT_WORKOUT, null),
    routineTemplates: getStoredItem<RoutineTemplate[]>(APP_STORAGE_KEYS.ROUTINE_TEMPLATES, []),
    weightLogs: getStoredItem<WeightLogEntry[]>(APP_STORAGE_KEYS.WEIGHT_LOGS, []),
    bodyMeasurements: getStoredItem<BodyMeasurementEntry[]>(APP_STORAGE_KEYS.BODY_MEASUREMENTS, []),
    userProfile: getStoredItem<UserProfile | null>(APP_STORAGE_KEYS.USER_PROFILE, null),
    workoutSettings: getStoredItem<WorkoutSettings | null>(APP_STORAGE_KEYS.WORKOUT_SETTINGS, null)
  };
}

export function writeLocalSnapshot(snapshot: AppSnapshot): void {
  setStoredItem(APP_STORAGE_KEYS.HISTORY, snapshot.history);
  setStoredItem(APP_STORAGE_KEYS.CUSTOM_EXERCISES, snapshot.customExercises);
  setStoredItem(APP_STORAGE_KEYS.ROUTINE_TEMPLATES, snapshot.routineTemplates);
  setStoredItem(APP_STORAGE_KEYS.WEIGHT_LOGS, snapshot.weightLogs);
  setStoredItem(APP_STORAGE_KEYS.BODY_MEASUREMENTS, snapshot.bodyMeasurements);

  if (snapshot.currentWorkout) {
    setStoredItem(APP_STORAGE_KEYS.CURRENT_WORKOUT, snapshot.currentWorkout);
  } else {
    removeStoredItem(APP_STORAGE_KEYS.CURRENT_WORKOUT);
  }

  if (snapshot.userProfile) {
    setStoredItem(APP_STORAGE_KEYS.USER_PROFILE, snapshot.userProfile);
  } else {
    removeStoredItem(APP_STORAGE_KEYS.USER_PROFILE);
  }

  if (snapshot.workoutSettings) {
    setStoredItem(APP_STORAGE_KEYS.WORKOUT_SETTINGS, snapshot.workoutSettings);
  } else {
    removeStoredItem(APP_STORAGE_KEYS.WORKOUT_SETTINGS);
  }
}

export function clearSyncedAppData(): void {
  SYNCED_STORAGE_KEYS.forEach((key) => removeStoredItem(key));
}

function mergeById<T extends { id: string }>(localItems: T[], cloudItems: T[]): T[] {
  const byId = new Map<string, T>();
  cloudItems.forEach((item) => byId.set(item.id, item));
  // Los datos locales tienen prioridad para no perder cambios recientes sin sincronizar
  localItems.forEach((item) => byId.set(item.id, item));
  return Array.from(byId.values());
}

function mergePreservingLocalOrder<T extends { id: string }>(localItems: T[], cloudItems: T[]): T[] {
  const byId = new Map<string, T>();
  localItems.forEach((item) => byId.set(item.id, item));
  cloudItems.forEach((item) => {
    if (!byId.has(item.id)) byId.set(item.id, item);
  });
  return Array.from(byId.values());
}

function pickCurrentWorkout(
  localWorkout: WorkoutSession | null,
  cloudWorkout: WorkoutSession | null
): WorkoutSession | null {
  if (!localWorkout) return cloudWorkout;
  if (!cloudWorkout) return localWorkout;

  const localStart = localWorkout.startTime ?? 0;
  const cloudStart = cloudWorkout.startTime ?? 0;
  if (localStart !== cloudStart) return localStart > cloudStart ? localWorkout : cloudWorkout;

  return (localWorkout.exercises?.length ?? 0) >= (cloudWorkout.exercises?.length ?? 0)
    ? localWorkout
    : cloudWorkout;
}

export function mergeSnapshots(local: AppSnapshot, cloud: AppSnapshot): AppSnapshot {
  return {
    history: sortWorkoutsByDateDesc(mergeHistory(local.history, cloud.history)),
    customExercises: mergePreservingLocalOrder(local.customExercises, cloud.customExercises),
    currentWorkout: pickCurrentWorkout(local.currentWorkout, cloud.currentWorkout),
    routineTemplates: mergePreservingLocalOrder(local.routineTemplates, cloud.routineTemplates),
    weightLogs: mergeById(local.weightLogs, cloud.weightLogs).sort((a, b) => b.date.localeCompare(a.date)),
    bodyMeasurements: mergeById(local.bodyMeasurements, cloud.bodyMeasurements).sort((a, b) =>
      b.date.localeCompare(a.date)
    ),
    userProfile: cloud.userProfile ?? local.userProfile,
    workoutSettings: mergeWorkoutSettings(local.workoutSettings, cloud.workoutSettings)
  };
}

function mergeWorkoutSettings(
  local: WorkoutSettings | null,
  cloud: WorkoutSettings | null
): WorkoutSettings | null {
  if (!local) return cloud;
  if (!cloud) return local;
  return (local.updatedAt ?? 0) >= (cloud.updatedAt ?? 0) ? local : cloud;
}

function mergeHistory(localHistory: WorkoutSession[], cloudHistory: WorkoutSession[]): WorkoutSession[] {
  const byId = new Map<string, WorkoutSession>();
  cloudHistory.forEach((workout) => byId.set(workout.id, workout));

  localHistory.forEach((workout) => {
    const cloudWorkout = byId.get(workout.id);
    if (!cloudWorkout) {
      byId.set(workout.id, workout);
      return;
    }

    const localUpdatedAt = workout.updatedAt ?? 0;
    const cloudUpdatedAt = cloudWorkout.updatedAt ?? 0;

    // Si la copia local es más reciente (o no hay marcas de tiempo), se conserva
    if (localUpdatedAt >= cloudUpdatedAt) {
      byId.set(workout.id, workout);
    }
  });

  return Array.from(byId.values());
}
