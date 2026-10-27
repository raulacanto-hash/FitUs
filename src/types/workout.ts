export type MuscleCategory =
  | 'Pecho'
  | 'Espalda'
  | 'Hombros'
  | 'Bíceps'
  | 'Tríceps'
  | 'Antebrazos'
  | 'Cuádriceps'
  | 'Isquiotibiales'
  | 'Glúteos'
  | 'Gemelos'
  | 'Aductores'
  | 'Abdomen';

export type MuscleFilter = 'Todos' | MuscleCategory;

export interface ExerciseDefinition {
  id: string;
  name: string;
  category: MuscleCategory;
  equipment?: string;
  isCustom?: boolean;
}

export interface WorkoutSet {
  id: string;
  reps: number | '';
  weight: number | '';
  completed: boolean;
  isWarmup?: boolean; // Set de calentamiento vs Serie efectiva (Screenshot 3)
  rpe?: number; // Esfuerzo / RIR
}

export interface WorkoutExercise {
  id: string;
  name: string;
  category: MuscleCategory;
  notes: string;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  routineName: string;
  date: string; // YYYY-MM-DD
  startTime?: number; // epoch ms
  durationMinutes?: number;
  exercises: WorkoutExercise[];
  routineId?: string; // vínculo a la plantilla si se originó de una rutina
  updatedAt?: number; // epoch ms de la última modificación (para sincronización)
}

export interface MuscleRecoveryScore {
  muscle: string;
  percentage: number;
}

// Plantilla de Rutina predefinida o personalizada
export interface RoutineExerciseTemplate {
  name: string;
  category: MuscleCategory;
  targetSets: number;
  defaultReps: number;
  defaultWeight: number;
  repsRange?: string; // ej. '12-7 reps'
  weightRange?: string; // ej. '30->40 kg'
  score?: number; // ej. 35
}

export interface RoutineTemplate {
  id: string;
  name: string;
  subtitle: string;
  category: string; // ej. 'PIERNA COMPLETA', 'EMPUJE', 'TORSO'
  estimatedMinutes: number;
  recoveryScore?: number; // ej. 100
  heroGradient?: string;
  daysPerWeek?: number; // ej. 4 d/sem
  isActiveRoutine?: boolean;
  targetMuscles?: MuscleRecoveryScore[]; // Screenshot 1: Pectorales 85%, Bíceps 100%, Tríceps 100%
  exercises: RoutineExerciseTemplate[];
  isCustom?: boolean;
}

// Registro de Peso Corporal
export interface WeightLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // kg
  bodyFat?: number; // % grasa (opcional)
  notes?: string;
}

// Registro de Medidas Corporales (cm)
export interface BodyMeasurementEntry {
  id: string;
  date: string; // YYYY-MM-DD
  chest?: number; // Pecho
  waist?: number; // Cintura
  hips?: number; // Cadera
  leftArm?: number; // Brazo izquierdo (bíceps)
  rightArm?: number; // Brazo derecho
  leftThigh?: number; // Muslo izquierdo
  rightThigh?: number; // Muslo derecho
  calves?: number; // Gemelos
  shoulders?: number; // Hombros
  neck?: number; // Cuello
  notes?: string;
}

export type BodyMeasurementKey =
  | 'chest'
  | 'waist'
  | 'hips'
  | 'leftArm'
  | 'rightArm'
  | 'leftThigh'
  | 'rightThigh'
  | 'calves'
  | 'shoulders'
  | 'neck';

export interface UserProfile {
  name: string;
  weeklyGoal: number; // e.g. 3 o 4 entrenamientos
  targetWeight?: number; // kg objetivo
}

export type ActiveTab = 'train' | 'library' | 'progress' | 'body' | 'history' | 'settings';
