import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  WeightLogEntry, 
  BodyMeasurementEntry, 
  UserProfile, 
  BodyMeasurementKey 
} from '../types/workout';
import { 
  INITIAL_WEIGHT_LOGS, 
  INITIAL_BODY_MEASUREMENTS, 
  INITIAL_USER_PROFILE 
} from '../data/initialBodyData';
import { getStoredItem, setStoredItem } from '../utils/storage';
import { getLocalDateString } from '../utils/dates';

const STORAGE_KEYS = {
  WEIGHT_LOGS: 'fittrack_weight_logs',
  BODY_MEASUREMENTS: 'fittrack_body_measurements',
  USER_PROFILE: 'fittrack_user_profile'
};

export const MEASUREMENT_LABELS: Record<BodyMeasurementKey, string> = {
  waist: 'Cintura',
  chest: 'Pecho',
  hips: 'Cadera',
  rightArm: 'Brazo Derecho',
  leftArm: 'Brazo Izquierdo',
  rightThigh: 'Muslo Derecho',
  leftThigh: 'Muslo Izquierdo',
  shoulders: 'Hombros',
  calves: 'Gemelos',
  neck: 'Cuello'
};

export function useBodyMetrics() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    return getStoredItem<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER_PROFILE);
  });

  const [weightLogs, setWeightLogs] = useState<WeightLogEntry[]>(() => {
    return getStoredItem<WeightLogEntry[]>(STORAGE_KEYS.WEIGHT_LOGS, INITIAL_WEIGHT_LOGS);
  });

  const [measurements, setMeasurements] = useState<BodyMeasurementEntry[]>(() => {
    return getStoredItem<BodyMeasurementEntry[]>(STORAGE_KEYS.BODY_MEASUREMENTS, INITIAL_BODY_MEASUREMENTS);
  });

  // Guardar en LocalStorage
  useEffect(() => {
    setStoredItem(STORAGE_KEYS.USER_PROFILE, profile);
  }, [profile]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.WEIGHT_LOGS, weightLogs);
  }, [weightLogs]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.BODY_MEASUREMENTS, measurements);
  }, [measurements]);

  // Agregar registro de peso
  const addWeightEntry = useCallback((weight: number, bodyFat?: number, notes?: string, date?: string) => {
    const newEntry: WeightLogEntry = {
      id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: date || getLocalDateString(),
      weight,
      bodyFat,
      notes
    };
    setWeightLogs(prev => [newEntry, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
  }, []);

  const deleteWeightEntry = useCallback((id: string) => {
    setWeightLogs(prev => prev.filter(w => w.id !== id));
  }, []);

  // Agregar registro de medidas
  const addMeasurementEntry = useCallback((entry: Omit<BodyMeasurementEntry, 'id'>) => {
    const newEntry: BodyMeasurementEntry = {
      ...entry,
      id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: entry.date || getLocalDateString()
    };
    setMeasurements(prev => [newEntry, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
  }, []);

  const deleteMeasurementEntry = useCallback((id: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== id));
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  // Métricas calculadas de peso
  const weightStats = useMemo(() => {
    const sorted = [...weightLogs].sort((a, b) => a.date.localeCompare(b.date));
    const latest = sorted[sorted.length - 1];
    const initial = sorted[0];

    const currentWeight = latest ? latest.weight : 0;
    const initialWeight = initial ? initial.weight : currentWeight;
    const totalChange = currentWeight - initialWeight;
    const targetDiff = profile.targetWeight ? currentWeight - profile.targetWeight : null;

    return {
      currentWeight,
      initialWeight,
      totalChange,
      targetDiff,
      latestBodyFat: latest?.bodyFat
    };
  }, [weightLogs, profile.targetWeight]);

  // Comparativa de últimas medidas
  const latestMeasurementComparison = useMemo(() => {
    const sorted = [...measurements].sort((a, b) => a.date.localeCompare(b.date));
    const latest = sorted[sorted.length - 1];
    const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;

    const diffs: Partial<Record<BodyMeasurementKey, number>> = {};
    if (latest) {
      (Object.keys(MEASUREMENT_LABELS) as BodyMeasurementKey[]).forEach(key => {
        const curr = latest[key];
        const prev = previous ? previous[key] : undefined;
        if (curr !== undefined && prev !== undefined) {
          diffs[key] = Number((curr - prev).toFixed(1));
        }
      });
    }

    return { latest, previous, diffs };
  }, [measurements]);

  return {
    profile,
    updateProfile,
    weightLogs,
    addWeightEntry,
    deleteWeightEntry,
    weightStats,
    measurements,
    addMeasurementEntry,
    deleteMeasurementEntry,
    latestMeasurementComparison
  };
}
