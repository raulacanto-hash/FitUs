import { useState, useEffect, useCallback } from 'react';
import { WorkoutSettings } from '../types/workout';
import { WORKOUT_SETTINGS_DEFAULTS } from '../data/workoutSettingsDefaults';
import { APP_STORAGE_KEYS } from '../utils/appData';
import { getStoredItem, setStoredItem } from '../utils/storage';

export function useWorkoutSettings() {
  const [settings, setSettings] = useState<WorkoutSettings>(() => {
    const stored = getStoredItem<Partial<WorkoutSettings>>(
      APP_STORAGE_KEYS.WORKOUT_SETTINGS,
      {}
    );
    // Mezclamos con los valores por defecto para que los ajustes nuevos
    // (escala de letra, etc.) existan aunque la copia guardada sea anterior.
    return { ...WORKOUT_SETTINGS_DEFAULTS, ...stored };
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
