import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  WorkoutSession, 
  WorkoutExercise, 
  ExerciseDefinition, 
  MuscleCategory,
  RoutineTemplate 
} from '../types/workout';
import { EXERCISE_DATABASE } from '../data/exerciseDatabase';
import { INITIAL_HISTORY } from '../data/initialHistory';
import { PREDEFINED_ROUTINES } from '../data/predefinedRoutines';
import { getLocalDateString } from '../utils/dates';
import { getStoredItem, setStoredItem, clearAllStorage } from '../utils/storage';
import { APP_STORAGE_KEYS } from '../utils/appData';
import { sortWorkoutsByDateDesc } from '../utils/workoutStats';

export function createNewWorkoutSession(): WorkoutSession {
  return {
    id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    routineName: 'Entrenamiento de Hoy',
    date: getLocalDateString(),
    startTime: undefined,
    exercises: []
  };
}

/**
 * Recupera la sesión guardada y limpia el placeholder que versiones anteriores
 * creaban automáticamente (un press de banca sin empezar), para que no aparezca
 * un entrenamiento activo al abrir la app.
 */
function loadInitialWorkoutSession(): WorkoutSession {
  const stored = getStoredItem<WorkoutSession | null>(APP_STORAGE_KEYS.CURRENT_WORKOUT, null);
  if (!stored) return createNewWorkoutSession();

  const firstExercise = stored.exercises?.[0];
  const isLegacyPlaceholder =
    !stored.startTime &&
    stored.routineName === 'Entrenamiento de Hoy' &&
    (stored.exercises?.length ?? 0) === 1 &&
    firstExercise?.name === 'Press de banca plano con barra' &&
    (firstExercise?.sets ?? []).every((set) => !set.completed);

  return isLegacyPlaceholder ? createNewWorkoutSession() : stored;
}

export function useWorkoutManager() {
  // Historial
  const [history, setHistory] = useState<WorkoutSession[]>(() => {
    return getStoredItem<WorkoutSession[]>(APP_STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
  });

  // Ejercicios personalizados
  const [customExercises, setCustomExercises] = useState<ExerciseDefinition[]>(() => {
    return getStoredItem<ExerciseDefinition[]>(APP_STORAGE_KEYS.CUSTOM_EXERCISES, []);
  });

  // Plantillas de Rutinas (Predefinidas + creadas por el usuario)
  const [routineTemplates, setRoutineTemplates] = useState<RoutineTemplate[]>(() => {
    return getStoredItem<RoutineTemplate[]>(APP_STORAGE_KEYS.ROUTINE_TEMPLATES, PREDEFINED_ROUTINES);
  });

  // Entrenamiento actual en curso
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSession>(loadInitialWorkoutSession);

  // Modal / Edición de histórico
  const [editingWorkout, setEditingWorkout] = useState<WorkoutSession | null>(null);

  // Sincronización con LocalStorage
  useEffect(() => {
    setStoredItem(APP_STORAGE_KEYS.HISTORY, history);
  }, [history]);

  useEffect(() => {
    setStoredItem(APP_STORAGE_KEYS.CUSTOM_EXERCISES, customExercises);
  }, [customExercises]);

  useEffect(() => {
    setStoredItem(APP_STORAGE_KEYS.ROUTINE_TEMPLATES, routineTemplates);
  }, [routineTemplates]);

  useEffect(() => {
    setStoredItem(APP_STORAGE_KEYS.CURRENT_WORKOUT, currentWorkout);
  }, [currentWorkout]);

  // Lista consolidada de ejercicios
  const fullExerciseList = useMemo(() => {
    return [...EXERCISE_DATABASE, ...customExercises];
  }, [customExercises]);

  // Asegura que el tiempo de inicio esté marcado
  const ensureStartTime = useCallback(() => {
    setCurrentWorkout(prev => {
      if (!prev.startTime) {
        return { ...prev, startTime: Date.now() };
      }
      return prev;
    });
  }, []);

  // Iniciar una rutina específica a partir de una plantilla
  const handleStartRoutine = useCallback((routine: RoutineTemplate) => {
    const newSession: WorkoutSession = {
      id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      routineName: routine.name,
      routineId: routine.id,
      date: getLocalDateString(),
      startTime: Date.now(),
      exercises: routine.exercises.map((templateEx, idx) => ({
        id: `ex-${Date.now()}-${idx}`,
        name: templateEx.name,
        category: templateEx.category,
        notes: '',
        sets: Array.from({ length: templateEx.targetSets }, (_, sIdx) => ({
          id: `st-${Date.now()}-${idx}-${sIdx}`,
          reps: templateEx.defaultReps,
          weight: templateEx.defaultWeight,
          completed: false
        }))
      }))
    };
    setCurrentWorkout(newSession);
  }, []);

  // Iniciar una sesión libre vacía (sin ejercicios precargados)
  const handleStartEmptyWorkout = useCallback(() => {
    setCurrentWorkout({
      id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      routineName: 'Entrenamiento Libre',
      date: getLocalDateString(),
      startTime: Date.now(),
      exercises: []
    });
  }, []);

  const handleDiscardWorkout = useCallback(() => {
    if (!window.confirm('¿Descartar la sesión actual? No se guardará en el historial.')) return;
    setCurrentWorkout(createNewWorkoutSession());
  }, []);

  // Guardar la sesión actual como una nueva plantilla de rutina
  const handleSaveCurrentAsRoutine = useCallback((name: string, category: string, subtitle?: string) => {
    const newTemplate: RoutineTemplate = {
      id: `custom-routine-${Date.now()}`,
      name: name.trim() || currentWorkout.routineName,
      subtitle: subtitle || `${currentWorkout.exercises.length} ejercicios registrados`,
      category: category.toUpperCase() || 'PERSONALIZADO',
      estimatedMinutes: Math.max(30, currentWorkout.exercises.length * 9),
      recoveryScore: 100,
      heroGradient: 'from-emerald-500/20 via-zinc-900 to-zinc-950',
      isCustom: true,
      exercises: currentWorkout.exercises.map(ex => ({
        name: ex.name,
        category: ex.category,
        targetSets: Math.max(1, ex.sets.length),
        defaultReps: typeof ex.sets[0]?.reps === 'number' ? ex.sets[0].reps : 10,
        defaultWeight: typeof ex.sets[0]?.weight === 'number' ? ex.sets[0].weight : 20
      }))
    };

    setRoutineTemplates(prev => [newTemplate, ...prev]);
    alert(`¡Rutina "${newTemplate.name}" guardada con éxito en tus plantillas!`);
  }, [currentWorkout]);

  // Crear rutina desde cero
  const handleCreateRoutineTemplate = useCallback((template: Omit<RoutineTemplate, 'id'>) => {
    const newTemplate: RoutineTemplate = {
      ...template,
      id: `custom-routine-${Date.now()}`,
      isCustom: true
    };
    setRoutineTemplates(prev => [newTemplate, ...prev]);
  }, []);

  const handleDeleteRoutineTemplate = useCallback((id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta rutina?')) {
      setRoutineTemplates(prev => prev.filter(r => r.id !== id));
    }
  }, []);

  // Manejo de Series
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

  // Agregar ejercicio desde catálogo
  const handleSelectExerciseFromDb = useCallback((exerciseObj: ExerciseDefinition) => {
    const isHistoryEntry = Boolean(editingWorkout);
    const newEx: WorkoutExercise = {
      id: `ex-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: exerciseObj.name,
      category: exerciseObj.category,
      notes: '',
      sets: [
        { id: `st-${Date.now()}-1`, reps: 10, weight: 20, completed: isHistoryEntry },
        { id: `st-${Date.now()}-2`, reps: 10, weight: 20, completed: isHistoryEntry }
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

  // Crear ejercicio personalizado
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
    const duration = Math.min(360, Math.max(1, rawMinutes));

    const finishedWorkout: WorkoutSession = {
      ...currentWorkout,
      id: `workout-${Date.now()}`,
      durationMinutes: duration,
      date: currentWorkout.date || getLocalDateString(),
      updatedAt: now
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

  // Historial
  const handleStartEditWorkout = useCallback((workout: WorkoutSession) => {
    setEditingWorkout(JSON.parse(JSON.stringify(workout)));
  }, []);

  // Crear un registro manual de un entrenamiento anterior
  const handleStartNewPastWorkout = useCallback(() => {
    setEditingWorkout({
      id: `workout-manual-${Date.now()}`,
      routineName: 'Entrenamiento anterior',
      date: getLocalDateString(),
      durationMinutes: 60,
      exercises: [],
      updatedAt: Date.now()
    });
  }, []);

  const handleSaveEditWorkout = useCallback(() => {
    if (!editingWorkout) return;

    const routineName = editingWorkout.routineName.trim();
    if (!routineName) {
      alert('Escribe un nombre para el entrenamiento.');
      return;
    }

    if (
      editingWorkout.exercises.length === 0 &&
      !window.confirm('Este entrenamiento no tiene ejercicios. ¿Deseas guardarlo igualmente?')
    ) {
      return;
    }

    const updatedWorkout: WorkoutSession = {
      ...editingWorkout,
      routineName,
      date: editingWorkout.date || getLocalDateString(),
      durationMinutes: editingWorkout.durationMinutes || 45,
      updatedAt: Date.now()
    };

    setHistory(prev => {
      const exists = prev.some(w => w.id === updatedWorkout.id);
      return exists
        ? prev.map(w => (w.id === updatedWorkout.id ? updatedWorkout : w))
        : [updatedWorkout, ...prev];
    });
    setEditingWorkout(null);
  }, [editingWorkout]);

  const handleDeleteWorkout = useCallback((workoutId: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este entrenamiento? También se borrará de la nube si la sincronización está activa.')) {
      setHistory(prev => prev.filter(w => w.id !== workoutId));
    }
  }, []);

  // Combinar datos importados desde Excel/CSV sin borrar lo que ya existe
  const mergeImportedWorkoutData = useCallback(
    (data: {
      history?: WorkoutSession[];
      routineTemplates?: RoutineTemplate[];
      customExercises?: ExerciseDefinition[];
    }) => {
      const mergeById = <T extends { id: string }>(current: T[], imported: T[]): T[] => {
        const byId = new Map<string, T>(current.map((item) => [item.id, item]));
        imported.forEach((item) => byId.set(item.id, item));
        return Array.from(byId.values());
      };

      if (data.history) {
        setHistory((prev) => sortWorkoutsByDateDesc(mergeById(prev, data.history ?? [])));
      }
      if (data.routineTemplates) {
        setRoutineTemplates((prev) => {
          const byId = new Map(prev.map((routine) => [routine.id, routine]));
          (data.routineTemplates ?? []).forEach((imported) => {
            const existing = byId.get(imported.id);
            byId.set(
              imported.id,
              existing
                ? {
                    ...existing,
                    ...imported,
                    heroGradient: imported.heroGradient ?? existing.heroGradient,
                    targetMuscles: imported.targetMuscles ?? existing.targetMuscles,
                    daysPerWeek: imported.daysPerWeek ?? existing.daysPerWeek,
                    recoveryScore: imported.recoveryScore ?? existing.recoveryScore,
                    isActiveRoutine: imported.isActiveRoutine ?? existing.isActiveRoutine
                  }
                : imported
            );
          });
          return Array.from(byId.values());
        });
      }
      if (data.customExercises) {
        setCustomExercises((prev) => mergeById(prev, data.customExercises ?? []));
      }
    },
    []
  );

  // Cálculo de entrenamientos completados en la semana actual
  const completedThisWeek = useMemo(() => {
    const today = new Date();
    // Obtener el lunes de la semana actual
    const day = today.getDay(); // 0 es domingo
    const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diffToMonday));
    monday.setHours(0, 0, 0, 0);

    return history.filter(w => {
      const workoutDate = new Date(w.date + 'T00:00:00');
      return workoutDate >= monday;
    }).length;
  }, [history]);

  // Ajustes: Exportar JSON
  const handleExportData = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ history, customExercises, routineTemplates }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fittrack_backup_${getLocalDateString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [history, customExercises, routineTemplates]);

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
          if (parsed.routineTemplates && Array.isArray(parsed.routineTemplates)) {
            setRoutineTemplates(parsed.routineTemplates);
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

  // Reinicio total
  const handleResetAllData = useCallback((): boolean => {
    if (!window.confirm('¿Deseas borrar todos los datos? Si la sincronización está activa, también se eliminarán de la nube.')) {
      return false;
    }

    clearAllStorage();
    setHistory([]);
    setCustomExercises([]);
    setRoutineTemplates(PREDEFINED_ROUTINES);
    const cleanSession: WorkoutSession = {
      id: `w-${Date.now()}`,
      routineName: 'Entrenamiento de Hoy',
      date: getLocalDateString(),
      startTime: undefined,
      exercises: []
    };
    setCurrentWorkout(cleanSession);
    alert('Datos eliminados por completo.');
    return true;
  }, []);

  return {
    history,
    customExercises,
    routineTemplates,
    currentWorkout,
    fullExerciseList,
    completedThisWeek,
    editingWorkout,
    setEditingWorkout,
    handleStartRoutine,
    handleStartEmptyWorkout,
    handleDiscardWorkout,
    handleSaveCurrentAsRoutine,
    handleCreateRoutineTemplate,
    handleDeleteRoutineTemplate,
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
    handleStartNewPastWorkout,
    handleSaveEditWorkout,
    handleDeleteWorkout,
    mergeImportedWorkoutData,
    handleExportData,
    handleImportData,
    handleResetAllData
  };
}
