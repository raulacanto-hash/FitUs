import { WeightLogEntry, BodyMeasurementEntry, UserProfile } from '../types/workout';
import { getRelativeLocalDateString } from '../utils/dates';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Roma',
  weeklyGoal: 3,
  targetWeight: 75.0
};

export const INITIAL_WEIGHT_LOGS: WeightLogEntry[] = [
  { id: 'w-1', date: getRelativeLocalDateString(-28), weight: 81.2, bodyFat: 18.5, notes: 'Inicio de nuevo mesociclo' },
  { id: 'w-2', date: getRelativeLocalDateString(-21), weight: 80.6, bodyFat: 18.2, notes: 'Semana 1 completada' },
  { id: 'w-3', date: getRelativeLocalDateString(-14), weight: 80.1, bodyFat: 17.8, notes: 'Mejorando adherencia nutricional' },
  { id: 'w-4', date: getRelativeLocalDateString(-7), weight: 79.4, bodyFat: 17.4, notes: 'Buena recuperación y energía' },
  { id: 'w-5', date: getRelativeLocalDateString(0), weight: 78.8, bodyFat: 17.1, notes: 'Pesaje matutino en ayunas' },
];

export const INITIAL_BODY_MEASUREMENTS: BodyMeasurementEntry[] = [
  {
    id: 'm-1',
    date: getRelativeLocalDateString(-28),
    chest: 104.0,
    waist: 86.5,
    hips: 101.0,
    leftArm: 38.0,
    rightArm: 38.5,
    leftThigh: 60.5,
    rightThigh: 61.0,
    calves: 38.0,
    shoulders: 122.0,
    neck: 40.0,
    notes: 'Mediciones de referencia iniciales'
  },
  {
    id: 'm-2',
    date: getRelativeLocalDateString(-14),
    chest: 104.5,
    waist: 85.0,
    hips: 100.5,
    leftArm: 38.3,
    rightArm: 38.8,
    leftThigh: 61.0,
    rightThigh: 61.5,
    calves: 38.0,
    shoulders: 122.5,
    neck: 40.0,
    notes: 'Cintura -1.5cm, brazos en aumento'
  },
  {
    id: 'm-3',
    date: getRelativeLocalDateString(0),
    chest: 105.0,
    waist: 83.8,
    hips: 100.0,
    leftArm: 38.8,
    rightArm: 39.2,
    leftThigh: 61.8,
    rightThigh: 62.0,
    calves: 38.5,
    shoulders: 123.5,
    neck: 40.0,
    notes: 'Excelente recomposición corporal'
  }
];
