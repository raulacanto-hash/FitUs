import { useState, useEffect, useCallback } from 'react';
import { WorkoutSettings } from '../types/workout';
import { WORKOUT_SETTINGS_DEFAULTS } from '../data/workoutSettingsDefaults';
import { APP_STORAGE_KEYS } from '../utils/appData';
import { getStoredItem, setStoredItem } from '../utils/storage';

export function useWorkoutSettings() {
  const [settings, setSettings] = useState<WorkoutSettings>(() => {
    return getStoredItem<WorkoutSettings>(
      APP_STORAGE_KEYS.WORKOUT_SETTINGS,
      WORKOUT_SETTINGS_DEFAULTS
    );
  });

  useEffect(() => {
    setStoredItem(APP_STORAGE_KEYS.WORKOUT_SETTINGS, settings);
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<WorkoutSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...updates,
      updatedAt: Date.now()
    }));
  }, []);

  return { settings, updateSettings };
}
