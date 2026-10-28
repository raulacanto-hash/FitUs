import { WorkoutSession } from '../types/workout';
import { getRelativeLocalDateString } from '../utils/dates';

export const INITIAL_HISTORY: WorkoutSession[] = [
  {
    id: 'workout-1',
    date: getRelativeLocalDateString(-2),
    routineName: 'Empuje - Pecho & Tríceps',
    durationMinutes: 52,
    exercises: [
      {
        id: 'e1',
        name: 'Press de banca plano con barra',
        category: 'Pecho',
        notes: 'Enfocar en controlar la fase excéntrica',
        sets: [
          { id: 's1', reps: 10, weight: 60, completed: true },
          { id: 's2', reps: 8, weight: 70, completed: true },
          { id: 's3', reps: 6, weight: 75, completed: true },
        ]
      },
      {
        id: 'e2',
        name: 'Press inclinado con mancuernas',
        category: 'Pecho',
        notes: '',
        sets: [
          { id: 's4', reps: 10, weight: 24, completed: true },
          { id: 's5', reps: 10, weight: 26, completed: true },
          { id: 's6', reps: 8, weight: 28, completed: true },
        ]
      },
      {
        id: 'e3',
        name: 'Extensiones de tríceps en polea con cuerda',
        category: 'Tríceps',
        notes: '',
        sets: [
          { id: 's7', reps: 12, weight: 25, completed: true },
          { id: 's8', reps: 12, weight: 30, completed: true },
        ]
      }
    ]
  },
  {
    id: 'workout-2',
    date: getRelativeLocalDateString(-4),
    routineName: 'Tracción - Espalda & Bíceps',
    durationMinutes: 58,
    exercises: [
      {
        id: 'e4',
        name: 'Jalón al pecho (Lat Pulldown)',
        category: 'Espalda',
        notes: '',
        sets: [
          { id: 's10', reps: 12, weight: 45, completed: true },
          { id: 's11', reps: 10, weight: 55, completed: true },
          { id: 's12', reps: 8, weight: 60, completed: true },
        ]
      },
      {
        id: 'e5',
        name: 'Remo con barra (Overhand)',
        category: 'Espalda',
        notes: '',
        sets: [
          { id: 's13', reps: 10, weight: 50, completed: true },
          { id: 's14', reps: 8, weight: 60, completed: true },
        ]
      },
      {
        id: 'e6',
        name: 'Curl alterno con mancuernas',
        category: 'Bíceps',
        notes: '',
        sets: [
          { id: 's16', reps: 12, weight: 12, completed: true },
          { id: 's17', reps: 10, weight: 14, completed: true },
        ]
      }
    ]
  }
];
