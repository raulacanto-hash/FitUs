import { ExerciseDefinition, MuscleFilter } from '../types/workout';

export const MUSCLE_GROUPS: MuscleFilter[] = [
  'Todos',
  'Pecho',
  'Espalda',
  'Hombros',
  'Bíceps',
  'Tríceps',
  'Cuádriceps',
  'Isquiotibiales',
  'Glúteos',
  'Gemelos',
  'Abdomen'
];

export const EXERCISE_DATABASE: ExerciseDefinition[] = [
  // PECHO
  { id: 'db-1', name: 'Press de banca plano con barra', category: 'Pecho', equipment: 'Barra' },
  { id: 'db-2', name: 'Press inclinado con mancuernas', category: 'Pecho', equipment: 'Mancuernas' },
  { id: 'db-3', name: 'Press declinado con barra', category: 'Pecho', equipment: 'Barra' },
  { id: 'db-4', name: 'Aperturas en polea alta (Crossover)', category: 'Pecho', equipment: 'Polea' },
  { id: 'db-5', name: 'Fondos en paralelas (Dips)', category: 'Pecho', equipment: 'Corporal' },
  { id: 'db-6', name: 'Press plano con mancuernas', category: 'Pecho', equipment: 'Mancuernas' },
  { id: 'db-7', name: 'Peck Deck (Mariposa)', category: 'Pecho', equipment: 'Máquina' },
  { id: 'db-8', name: 'Flexiones de pecho (Push-ups)', category: 'Pecho', equipment: 'Corporal' },

  // ESPALDA
  { id: 'db-9', name: 'Dominadas (Pull-ups)', category: 'Espalda', equipment: 'Corporal' },
  { id: 'db-10', name: 'Remo con barra (Overhand)', category: 'Espalda', equipment: 'Barra' },
  { id: 'db-11', name: 'Jalón al pecho (Lat Pulldown)', category: 'Espalda', equipment: 'Polea' },
  { id: 'db-12', name: 'Remo unilateral con mancuerna', category: 'Espalda', equipment: 'Mancuernas' },
  { id: 'db-13', name: 'Remo Gironda (Polea baja)', category: 'Espalda', equipment: 'Polea' },
  { id: 'db-14', name: 'Peso muerto convencional', category: 'Espalda', equipment: 'Barra' },
  { id: 'db-15', name: 'Pullover en polea alta con cuerda', category: 'Espalda', equipment: 'Polea' },
  { id: 'db-16', name: 'Remo en máquina T-Bar', category: 'Espalda', equipment: 'Máquina' },

  // HOMBROS
  { id: 'db-17', name: 'Press militar sentado con mancuernas', category: 'Hombros', equipment: 'Mancuernas' },
  { id: 'db-18', name: 'Press militar de pie con barra (OHP)', category: 'Hombros', equipment: 'Barra' },
  { id: 'db-19', name: 'Elevaciones laterales con mancuernas', category: 'Hombros', equipment: 'Mancuernas' },
  { id: 'db-20', name: 'Pájaro (Elevaciones posteriores en polea/mancuerna)', category: 'Hombros', equipment: 'Polea' },
  { id: 'db-21', name: 'Face Pulls con cuerda', category: 'Hombros', equipment: 'Polea' },
  { id: 'db-22', name: 'Elevaciones frontales con disco/mancuerna', category: 'Hombros', equipment: 'Mancuernas' },
  { id: 'db-23', name: 'Encogimientos de hombro (Shrugs)', category: 'Hombros', equipment: 'Barra' },

  // BÍCEPS
  { id: 'db-24', name: 'Curl de bíceps con barra Z', category: 'Bíceps', equipment: 'Barra' },
  { id: 'db-25', name: 'Curl alterno con mancuernas', category: 'Bíceps', equipment: 'Mancuernas' },
  { id: 'db-26', name: 'Curl martillo con mancuernas', category: 'Bíceps', equipment: 'Mancuernas' },
  { id: 'db-27', name: 'Curl en banco predicador (Scott)', category: 'Bíceps', equipment: 'Barra' },
  { id: 'db-28', name: 'Curl inclinado con mancuernas', category: 'Bíceps', equipment: 'Mancuernas' },
  { id: 'db-29', name: 'Curl en polea baja con barra recta', category: 'Bíceps', equipment: 'Polea' },

  // TRÍCEPS
  { id: 'db-30', name: 'Extensiones de tríceps en polea con cuerda', category: 'Tríceps', equipment: 'Polea' },
  { id: 'db-31', name: 'Press francés con barra Z (Skullcrushers)', category: 'Tríceps', equipment: 'Barra' },
  { id: 'db-32', name: 'Extensiones trasnuca con mancuerna', category: 'Tríceps', equipment: 'Mancuernas' },
  { id: 'db-33', name: 'Fondos entre bancos', category: 'Tríceps', equipment: 'Corporal' },
  { id: 'db-34', name: 'Press de banca agarre cerrado', category: 'Tríceps', equipment: 'Barra' },

  // CUÁDRICEPS
  { id: 'db-35', name: 'Sentadilla trasera con barra (Back Squat)', category: 'Cuádriceps', equipment: 'Barra' },
  { id: 'db-36', name: 'Prensa 45°', category: 'Cuádriceps', equipment: 'Máquina' },
  { id: 'db-37', name: 'Extensión de piernas en máquina', category: 'Cuádriceps', equipment: 'Máquina' },
  { id: 'db-38', name: 'Sentadilla Búlgara con mancuernas', category: 'Cuádriceps', equipment: 'Mancuernas' },
  { id: 'db-39', name: 'Sentadilla Hack', category: 'Cuádriceps', equipment: 'Máquina' },
  { id: 'db-40', name: 'Zancadas caminantes con mancuernas', category: 'Cuádriceps', equipment: 'Mancuernas' },

  // ISQUIOTIBIALES / FEMORALES
  { id: 'db-41', name: 'Peso muerto rumano con barra (RDL)', category: 'Isquiotibiales', equipment: 'Barra' },
  { id: 'db-42', name: 'Curl femoral acostado en máquina', category: 'Isquiotibiales', equipment: 'Máquina' },
  { id: 'db-43', name: 'Curl femoral sentado en máquina', category: 'Isquiotibiales', equipment: 'Máquina' },
  { id: 'db-44', name: 'Peso muerto rumano con mancuernas', category: 'Isquiotibiales', equipment: 'Mancuernas' },

  // GLÚTEOS
  { id: 'db-45', name: 'Hip Thrust con barra', category: 'Glúteos', equipment: 'Barra' },
  { id: 'db-46', name: 'Patada de glúteo en polea', category: 'Glúteos', equipment: 'Polea' },
  { id: 'db-47', name: 'Abducción de cadera en máquina', category: 'Glúteos', equipment: 'Máquina' },
  { id: 'db-48', name: 'Step-ups en banco con mancuernas', category: 'Glúteos', equipment: 'Mancuernas' },

  // GEMELOS
  { id: 'db-49', name: 'Elevación de talones de pie en máquina', category: 'Gemelos', equipment: 'Máquina' },
  { id: 'db-50', name: 'Elevación de talones sentado', category: 'Gemelos', equipment: 'Máquina' },

  // ABDOMEN / CORE
  { id: 'db-51', name: 'Encogimientos abdominales (Crunches)', category: 'Abdomen', equipment: 'Corporal' },
  { id: 'db-52', name: 'Elevación de piernas colgado', category: 'Abdomen', equipment: 'Corporal' },
  { id: 'db-53', name: 'Plancha isométrica (Plank)', category: 'Abdomen', equipment: 'Corporal' },
  { id: 'db-54', name: 'Rueda abdominal (Ab Roller)', category: 'Abdomen', equipment: 'Accesorio' },
  { id: 'db-55', name: 'Crunch en polea alta con cuerda', category: 'Abdomen', equipment: 'Polea' }
];
