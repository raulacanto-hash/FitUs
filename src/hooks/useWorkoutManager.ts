import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  WorkoutSession, 
  WorkoutExercise, 
  ExerciseDefinition, 
  MuscleCategory 
} from '../types/workout';
import { EXERCISE_DATABASE } from '../data/exerciseDatabase';
import { INITIAL_HISTORY } from '../data/initialHistory';
import { getLocalDateString } from '../utils/dates';
import { getStoredItem, setStoredItem, clearAllStorage } from '../utils/storage';

const STORAGE_KEYS = {
  HISTORY: 'fittrack_history',
  CUSTOM_EXERCISES: 'fittrack_custom_exercises',
  CURRENT_WORKOUT: 'fittrack_current_workout'
};

export function createNewWorkoutSession(): WorkoutSession {
  return {
    id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    routineName: 'Entrenamiento de Hoy',
    date: getLocalDateString(),
    startTime: undefined, // Se activa al empezar la sesión
    exercises: [
      {
        id: `ex-${Date.now()}-1`,
        name: 'Press de banca plano con barra',
        category: 'Pecho',
        notes: '',
        sets: [
          { id: `st-1`, reps: 10, weight: 60, completed: false },
          { id: `st-2`, reps: 10, weight: 60, completed: false },
          { id: `st-3`, reps: 8, weight: 65, completed: false },
        ]
      }
    ]
  };
}

export function useWorkoutManager() {
  // Historial
  const [history, setHistory] = useState<WorkoutSession[]>(() => {
    return getStoredItem<WorkoutSession[]>(STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
  });

  // Ejercicios personalizados
  const [customExercises, setCustomExercises] = useState<ExerciseDefinition[]>(() => {
    return getStoredItem<ExerciseDefinition[]>(STORAGE_KEYS.CUSTOM_EXERCISES, []);
  });

  // Entrenamiento actual
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSession>(() => {
    return getStoredItem<WorkoutSession>(STORAGE_KEYS.CURRENT_WORKOUT, createNewWorkoutSession());
  });

  // Modal / Edición de histórico
  const [editingWorkout, setEditingWorkout] = useState<WorkoutSession | null>(null);

  // Sincronización con LocalStorage
  useEffect(() => {
    setStoredItem(STORAGE_KEYS.HISTORY, history);
  }, [history]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.CUSTOM_EXERCISES, customExercises);
  }, [customExercises]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.CURRENT_WORKOUT, currentWorkout);
  }, [currentWorkout]);

  // Lista consolidada de ejercicios
  const fullExerciseList = useMemo(() => {
    return [...EXERCISE_DATABASE, ...customExercises];
  }, [customExercises]);

  // Asegura que el temporizador de inicio esté activo cuando se interactúa
  const ensureStartTime = useCallback(() => {
    setCurrentWorkout(prev => {
      if (!prev.startTime) {
        return { ...prev, startTime: Date.now() };
      }
      return prev;
    });
  }, []);

  // Manejo de Series en el Entrenamiento Activo
  const handleToggleSet = useCallback((exerciseId: string, setId: string, onSetCompleted?: () => void) => {
    ensureStartTime();
    setCurrentWorkout(prev => {
      let isNowCompleted = false;
      const updatedExercises = prev.exercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        const updatedSets = ex.sets.map(s => {
          if (s.id === setId) {
            const nextVal = !s.completed;
            if (nextVal) isNowCompleted = true;
            return { ...s, completed: nextVal };
          }
          return s;
        });
        return { ...ex, sets: updatedSets };
      });

      if (isNowCompleted && onSetCompleted) {
        // Disparar descanso fuera del ciclo de reconciliación
        setTimeout(onSetCompleted, 0);
      }

      return { ...prev, exercises: updatedExercises };
    });
  }, [ensureStartTime]);

  const handleUpdateSet = useCallback((exerciseId: string, setId: string, field: 'weight' | 'reps', value: string) => {
    ensureStartTime();
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map(s => {
            if (s.id !== setId) return s;
            const parsed = value === '' ? '' : Math.max(0, Number(value));
            return { ...s, [field]: parsed };
          })
        };
      })
    }));
  }, [ensureStartTime]);

  const handleAddSet = useCallback((exerciseId: string) => {
    ensureStartTime();
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet = {
          id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          reps: lastSet && lastSet.reps !== '' ? lastSet.reps : 10,
          weight: lastSet && lastSet.weight !== '' ? lastSet.weight : 20,
          completed: false
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      })
    }));
  }, [ensureStartTime]);

  const handleRemoveSet = useCallback((exerciseId: string, setId: string) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
      })
    }));
  }, []);

  const handleUpdateNotes = useCallback((exerciseId: string, notes: string) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => ex.id === exerciseId ? { ...ex, notes } : ex)
    }));
  }, []);

  const handleRemoveExercise = useCallback((exerciseId: string) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  }, []);

  const handleUpdateRoutineName = useCallback((name: string) => {
    setCurrentWorkout(prev => ({ ...prev, routineName: name }));
  }, []);

  // Agregar ejercicio desde catálogo (al entreno activo o al modal de edición)
  const handleSelectExerciseFromDb = useCallback((exerciseObj: ExerciseDefinition) => {
    const newEx: WorkoutExercise = {
      id: `ex-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: exerciseObj.name,
      category: exerciseObj.category,
      notes: '',
      sets: [
        { id: `st-${Date.now()}-1`, reps: 10, weight: 20, completed: false },
        { id: `st-${Date.now()}-2`, reps: 10, weight: 20, completed: false }
      ]
    };

    if (editingWorkout) {
      setEditingWorkout(prev => prev ? {
        ...prev,
        exercises: [...prev.exercises, newEx]
      } : null);
    } else {
      ensureStartTime();
      setCurrentWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, newEx]
      }));
    }
  }, [editingWorkout, ensureStartTime]);

  // Crear y guardar ejercicio personalizado
  const handleCreateCustomExercise = useCallback((name: string, category: MuscleCategory) => {
    if (!name.trim()) return;
    const customObj: ExerciseDefinition = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      category,
      equipment: 'Personalizado',
      isCustom: true
    };

    setCustomExercises(prev => [...prev, customObj]);
    handleSelectExerciseFromDb(customObj);
  }, [handleSelectExerciseFromDb]);

  // Finalizar entrenamiento activo
  const handleFinishWorkout = useCallback((): boolean => {
    if (currentWorkout.exercises.length === 0) {
      alert('Agrega al menos un ejercicio antes de guardar.');
      return false;
    }

    const now = Date.now();
    const start = currentWorkout.startTime || now - 45 * 60 * 1000;
    const rawMinutes = Math.round((now - start) / 60000);
    // Acotar duración a un rango razonable (1 a 360 min)
    const duration = Math.min(360, Math.max(1, rawMinutes));

    const finishedWorkout: WorkoutSession = {
      ...currentWorkout,
      id: `workout-${Date.now()}`,
      durationMinutes: duration,
      date: currentWorkout.date || getLocalDateString()
    };

    setHistory(prev => [finishedWorkout, ...prev]);

    // Iniciar nueva sesión limpia
    const nextSession: WorkoutSession = {
      id: `w-${Date.now()}`,
      routineName: 'Entrenamiento de Hoy',
      date: getLocalDateString(),
      startTime: undefined,
      exercises: []
    };
    setCurrentWorkout(nextSession);

    return true;
  }, [currentWorkout]);

  // Acciones de Historial
  const handleStartEditWorkout = useCallback((workout: WorkoutSession) => {
    setEditingWorkout(JSON.parse(JSON.stringify(workout)));
  }, []);

  const handleSaveEditWorkout = useCallback(() => {
    if (!editingWorkout) return;
    setHistory(prev => prev.map(w => w.id === editingWorkout.id ? editingWorkout : w));
    setEditingWorkout(null);
  }, [editingWorkout]);

  const handleDeleteWorkout = useCallback((workoutId: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este entrenamiento del historial?')) {
      setHistory(prev => prev.filter(w => w.id !== workoutId));
    }
  }, []);

  // Métricas: listado de nombres de ejercicios usados
  const allUsedExerciseNames = useMemo(() => {
    const names = new Set<string>();
    // Primero los que tienen datos en el historial
    history.forEach(w => w.exercises?.forEach(e => names.add(e.name)));
    // Luego los del catálogo
    fullExerciseList.forEach(e => names.add(e.name));
    return Array.from(names);
  }, [history, fullExerciseList]);

  // Ajustes: Exportar JSON
  const handleExportData = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ history, customExercises }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fittrack_backup_${getLocalDateString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [history, customExercises]);

  // Ajustes: Importar JSON
  const handleImportData = useCallback((file: File) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.history && Array.isArray(parsed.history)) {
          setHistory(parsed.history);
          if (parsed.customExercises && Array.isArray(parsed.customExercises)) {
            setCustomExercises(parsed.customExercises);
          }
          alert('¡Datos e historial restaurados con éxito!');
        } else if (Array.isArray(parsed)) {
          setHistory(parsed);
          alert('¡Historial restaurado con éxito!');
        } else {
          alert('El archivo no contiene un formato de entrenamiento válido.');
        }
      } catch {
        alert('El archivo no tiene un formato JSON válido.');
      }
    };
  }, []);

  // Ajustes: Reinicio Total Limpio
  const handleResetAllData = useCallback(() => {
    if (window.confirm('¿Deseas reiniciar completamente todos los datos de la app?')) {
      clearAllStorage();
      setHistory([]);
      setCustomExercises([]);
      const cleanSession: WorkoutSession = {
        id: `w-${Date.now()}`,
        routineName: 'Entrenamiento de Hoy',
        date: getLocalDateString(),
        startTime: undefined,
        exercises: []
      };
      setCurrentWorkout(cleanSession);
      alert('Datos eliminados por completo.');
    }
  }, []);

  return {
    history,
    customExercises,
    currentWorkout,
    fullExerciseList,
    allUsedExerciseNames,
    editingWorkout,
    setEditingWorkout,
    handleToggleSet,
    handleUpdateSet,
    handleAddSet,
    handleRemoveSet,
    handleUpdateNotes,
    handleRemoveExercise,
    handleUpdateRoutineName,
    handleSelectExerciseFromDb,
    handleCreateCustomExercise,
    handleFinishWorkout,
    handleStartEditWorkout,
    handleSaveEditWorkout,
    handleDeleteWorkout,
    handleExportData,
    handleImportData,
    handleResetAllData
  };
}
