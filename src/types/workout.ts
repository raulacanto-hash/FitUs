export type MuscleCategory =
  | 'Pecho'
  | 'Espalda'
  | 'Hombros'
  | 'Bíceps'
  | 'Tríceps'
  | 'Cuádriceps'
  | 'Isquiotibiales'
  | 'Glúteos'
  | 'Gemelos'
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
}

export type ActiveTab = 'active' | 'history' | 'stats' | 'settings';
