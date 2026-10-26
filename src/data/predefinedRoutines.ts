import { RoutineTemplate } from '../types/workout';

export const PREDEFINED_ROUTINES: RoutineTemplate[] = [
  {
    id: 'routine-chest-arms',
    name: 'Pecho + Brazos',
    subtitle: 'Pectoral mayor, cabeza larga de bíceps y tríceps pesado',
    category: 'PECHO + BRAZOS',
    estimatedMinutes: 55,
    recoveryScore: 95,
    daysPerWeek: 4,
    isActiveRoutine: true,
    heroGradient: 'from-amber-500/20 via-zinc-900 to-zinc-950',
    targetMuscles: [
      { muscle: 'Pectorales', percentage: 85 },
      { muscle: 'Bíceps', percentage: 100 },
      { muscle: 'Tríceps', percentage: 100 }
    ],
    exercises: [
      { name: 'Press de banca plano con barra', category: 'Pecho', targetSets: 4, defaultReps: 10, defaultWeight: 40, repsRange: '12-7 reps', weightRange: '30->40 kg', score: 35 },
      { name: 'Press de banca inclinado con barra (30° - 45°)', category: 'Pecho', targetSets: 4, defaultReps: 8, defaultWeight: 35, repsRange: '8-6 reps', weightRange: '30->35 kg', score: 32 },
      { name: 'Peck Deck / Contractor (Mariposa en máquina)', category: 'Pecho', targetSets: 4, defaultReps: 8, defaultWeight: 50, repsRange: '8-7 reps', weightRange: '50 kg' },
      { name: 'Curl de bíceps con barra Z', category: 'Bíceps', targetSets: 4, defaultReps: 7, defaultWeight: 25, repsRange: '7 reps', weightRange: '25 kg', score: 82 },
      { name: 'Curl de bíceps en banco Scott en máquina', category: 'Bíceps', targetSets: 3, defaultReps: 8, defaultWeight: 25, repsRange: '7-8 reps', weightRange: '25 kg' },
      { name: 'Extensión de tríceps en polea con cuerda', category: 'Tríceps', targetSets: 4, defaultReps: 12, defaultWeight: 25, repsRange: '10-12 reps', weightRange: '20->25 kg' }
    ]
  },
  {
    id: 'routine-legs-pro',
    name: 'Lunes de nalgas & Pierna Completa',
    subtitle: 'Cuádriceps, Glúteos, Isquiotibiales, Aductores',
    category: 'PIERNA COMPLETA',
    estimatedMinutes: 63,
    recoveryScore: 100,
    daysPerWeek: 4,
    heroGradient: 'from-lime-500/20 via-zinc-900 to-zinc-950',
    targetMuscles: [
      { muscle: 'Glúteos', percentage: 100 },
      { muscle: 'Cuádriceps', percentage: 95 },
      { muscle: 'Isquios', percentage: 90 }
    ],
    exercises: [
      { name: 'Sentadilla trasera con barra (High Bar / Low Bar)', category: 'Cuádriceps', targetSets: 4, defaultReps: 8, defaultWeight: 80, repsRange: '8-6 reps', weightRange: '70->80 kg', score: 88 },
      { name: 'Prensa 45° con discos', category: 'Cuádriceps', targetSets: 4, defaultReps: 10, defaultWeight: 140, repsRange: '12-10 reps', weightRange: '120->140 kg' },
      { name: 'Hip Thrust con barra apoyado en banco', category: 'Glúteos', targetSets: 4, defaultReps: 10, defaultWeight: 90, repsRange: '10-8 reps', weightRange: '80->100 kg' },
      { name: 'Sentadillas Búlgaras con mancuernas', category: 'Cuádriceps', targetSets: 3, defaultReps: 10, defaultWeight: 18, repsRange: '10 reps', weightRange: '16-18 kg' },
      { name: 'Peso muerto rumano con barra (RDL)', category: 'Isquiotibiales', targetSets: 4, defaultReps: 10, defaultWeight: 70, repsRange: '10-8 reps', weightRange: '60->70 kg' },
      { name: 'Elevación de talones de pie en máquina / Multipower', category: 'Gemelos', targetSets: 4, defaultReps: 15, defaultWeight: 45, repsRange: '15 reps', weightRange: '45 kg' }
    ]
  },
  {
    id: 'routine-martes-pechugas',
    name: 'Martes de pechugas & Deltoides',
    subtitle: 'Volumen e hipertrofia de empuje torso superior',
    category: 'PECHO + HOMBRO',
    estimatedMinutes: 52,
    recoveryScore: 90,
    daysPerWeek: 4,
    heroGradient: 'from-blue-600/20 via-zinc-900 to-zinc-950',
    targetMuscles: [
      { muscle: 'Pectorales', percentage: 95 },
      { muscle: 'Deltoides', percentage: 90 }
    ],
    exercises: [
      { name: 'Press inclinado con mancuernas', category: 'Pecho', targetSets: 4, defaultReps: 10, defaultWeight: 28, repsRange: '10-8 reps', weightRange: '24->28 kg' },
      { name: 'Press militar sentado con mancuernas', category: 'Hombros', targetSets: 3, defaultReps: 10, defaultWeight: 20, repsRange: '10 reps', weightRange: '18-20 kg' },
      { name: 'Cruce de poleas bajas a altas (Pecho superior)', category: 'Pecho', targetSets: 3, defaultReps: 12, defaultWeight: 15, repsRange: '12 reps', weightRange: '12-15 kg' },
      { name: 'Elevaciones laterales de pie con mancuernas', category: 'Hombros', targetSets: 4, defaultReps: 12, defaultWeight: 12, repsRange: '15-12 reps', weightRange: '10-12 kg' },
      { name: 'Fondos en paralelas para pecho (Dips con inclinación)', category: 'Pecho', targetSets: 3, defaultReps: 10, defaultWeight: 0, repsRange: '10 reps', weightRange: 'Corporal' }
    ]
  },
  {
    id: 'routine-pecho-espalda',
    name: 'Pecho - Espalda Antagonista',
    subtitle: 'Superseries de antagonistas para densidad muscular',
    category: 'TORSO',
    estimatedMinutes: 60,
    recoveryScore: 92,
    daysPerWeek: 4,
    heroGradient: 'from-purple-600/20 via-zinc-900 to-zinc-950',
    targetMuscles: [
      { muscle: 'Pectorales', percentage: 90 },
      { muscle: 'Dorsales', percentage: 90 }
    ],
    exercises: [
      { name: 'Press de banca plano con barra', category: 'Pecho', targetSets: 4, defaultReps: 8, defaultWeight: 75, repsRange: '8 reps', weightRange: '70->75 kg' },
      { name: 'Remo con barra prono (Overhand)', category: 'Espalda', targetSets: 4, defaultReps: 8, defaultWeight: 65, repsRange: '8 reps', weightRange: '60->65 kg' },
      { name: 'Press inclinado en máquina (Incline Chest Press)', category: 'Pecho', targetSets: 3, defaultReps: 10, defaultWeight: 60, repsRange: '10 reps', weightRange: '60 kg' },
      { name: 'Jalón al pecho agarre abierto (Lat Pulldown)', category: 'Espalda', targetSets: 3, defaultReps: 10, defaultWeight: 55, repsRange: '10 reps', weightRange: '50-55 kg' },
      { name: 'Cruce de poleas medias (Aperturas en polea)', category: 'Pecho', targetSets: 3, defaultReps: 12, defaultWeight: 15, repsRange: '12 reps', weightRange: '15 kg' },
      { name: 'Remo unilateral con mancuerna (Apoyo en banco)', category: 'Espalda', targetSets: 3, defaultReps: 10, defaultWeight: 28, repsRange: '10 reps', weightRange: '28 kg' }
    ]
  }
];
