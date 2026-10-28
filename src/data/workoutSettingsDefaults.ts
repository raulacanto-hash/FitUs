import { FontScaleOption, WorkoutSettings } from '../types/workout';

export const GOAL_OPTIONS = [
  'Crecer y tonificar músculo',
  'Ganar fuerza',
  'Perder grasa',
  'Mejorar resistencia',
  'Mantener'
];

export const EXPERIENCE_OPTIONS = ['Principiante', 'Intermedio', 'Avanzado'];

export const VARIETY_OPTIONS = ['Bajo', 'Balanceado', 'Alto'];

export const DURATION_OPTIONS = [30, 45, 60, 75, 90, 105, 120];

export const SET_RANGE_OPTIONS = ['2, 3', '3', '3, 4', '4', '4, 5'];

export const REP_RANGE_OPTIONS = ['6-8', '8-10', '8-12', '10-15', '12-20'];

export const DELOAD_OPTIONS = ['Ninguno', 'Cada 4 semanas', 'Cada 6 semanas', 'Cada 8 semanas'];

// Escalas disponibles para la letra de carga/repeticiones y del temporizador
export const FONT_SCALE_OPTIONS: { label: string; value: FontScaleOption }[] = [
  { label: 'Compacto', value: 'compact' },
  { label: 'Normal', value: 'normal' },
  { label: 'Grande', value: 'large' },
  { label: 'Extra grande', value: 'xlarge' }
];

export const FONT_SCALE_LABELS: Record<FontScaleOption, string> = {
  compact: 'Compacto',
  normal: 'Normal',
  large: 'Grande',
  xlarge: 'Extra grande'
};

export const FONT_SCALE_FACTORS: Record<FontScaleOption, number> = {
  compact: 0.85,
  normal: 1,
  large: 1.3,
  xlarge: 1.6
};

export function getFontScaleFactor(option: FontScaleOption | undefined): number {
  return FONT_SCALE_FACTORS[option ?? 'normal'] ?? 1;
}


export const WORKOUT_SETTINGS_DEFAULTS: WorkoutSettings = {
  activeRoutineId: undefined,
  goal: 'Crecer y tonificar músculo',
  experience: 'Principiante',
  variety: 'Balanceado',
  durationMinutes: 60,
  setRange: '3, 4',
  repRange: '8-12',
  repProgression: false,
  deload: 'Ninguno',
  updateSavedWorkouts: false,
  upcomingWorkouts: true,
  queueEnabled: false,
  focusedMuscles: [],
  excludedMuscles: [],
  injuries: '',
  warmup: false,
  stretching: false,
  supersets: false,
  dropsets: false,
  warmupSets: true,
  restTimer: true,
  plateCalculator: true,
  inputFontScale: 'normal',
  restTimerFontScale: 'normal',
  updatedAt: 0
};
