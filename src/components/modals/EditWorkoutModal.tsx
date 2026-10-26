import React from 'react';
import { X, Trash2, Plus, Dumbbell } from 'lucide-react';
import { WorkoutSession } from '../../types/workout';

interface EditWorkoutModalProps {
  editingWorkout: WorkoutSession | null;
  onClose: () => void;
  onSave: () => void;
  onUpdateWorkout: (updater: (prev: WorkoutSession) => WorkoutSession) => void;
  onOpenAddExercise: () => void;
}

export const EditWorkoutModal: React.FC<EditWorkoutModalProps> = ({
  editingWorkout,
  onClose,
  onSave,
  onUpdateWorkout,
  onOpenAddExercise
}) => {
  if (!editingWorkout) return null;

  const handleAddSetToExercise = (exerciseId: string) => {
    onUpdateWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet = {
          id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          weight: lastSet?.weight ?? 20,
          reps: lastSet?.reps ?? 10,
          completed: true
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      })
    }));
  };

  const handleRemoveSet = (exerciseId: string, setIndex: number) => {
    onUpdateWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return { ...ex, sets: ex.sets.filter((_, i) => i !== setIndex) };
      })
    }));
  };

  const handleUpdateSetValue = (
    exerciseId: string,
    setIndex: number,
    field: 'weight' | 'reps',
    value: string
  ) => {
    const parsed = value === '' ? '' : Math.max(0, Number(value));
    onUpdateWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((st, i) => (i === setIndex ? { ...st, [field]: parsed } : st))
        };
      })
    }));
  };

  const handleRemoveExercise = (exerciseId: string) => {
    onUpdateWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((e) => e.id !== exerciseId)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full max-h-[88vh] flex flex-col shadow-2xl p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-2.5">
          <h3 className="font-bold text-sm text-white">Editar Entrenamiento Pasado</h3>
          <button 
            type="button"
            onClick={onClose} 
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Nombre Rutina</label>
              <input
                type="text"
                value={editingWorkout.routineName}
                onChange={(e) => onUpdateWorkout(prev => ({ ...prev, routineName: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Fecha</label>
              <input
                type="date"
                value={editingWorkout.date}
                onChange={(e) => onUpdateWorkout(prev => ({ ...prev, date: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Lista de Ejercicios */}
          <div className="space-y-2">
            {editingWorkout.exercises.map((ex) => (
              <div key={ex.id} className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-xs text-white">{ex.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(ex.id)}
                    className="text-zinc-500 hover:text-red-400 p-1"
                    title="Eliminar ejercicio"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Series */}
                <div className="space-y-1">
                  {ex.sets.map((s, sIdx) => (
                    <div key={s.id || sIdx} className="flex items-center gap-2 text-xs">
                      <span className="text-zinc-500 font-mono text-[10px] w-5">#{sIdx + 1}</span>
                      <input
                        type="number"
                        step="any"
                        inputMode="decimal"
                        value={s.weight}
                        onChange={(e) => handleUpdateSetValue(ex.id, sIdx, 'weight', e.target.value)}
                        className="bg-zinc-800 border border-zinc-700/60 rounded px-2 py-1 text-center w-16 text-white text-xs focus:outline-none focus:border-emerald-500"
                        placeholder="0"
                      />
                      <span className="text-zinc-400 text-[10px]">kg ×</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={s.reps}
                        onChange={(e) => handleUpdateSetValue(ex.id, sIdx, 'reps', e.target.value)}
                        className="bg-zinc-800 border border-zinc-700/60 rounded px-2 py-1 text-center w-16 text-white text-xs focus:outline-none focus:border-emerald-500"
                        placeholder="0"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSet(ex.id, sIdx)}
                        className="text-zinc-500 hover:text-red-400 p-1 ml-auto"
                        title="Eliminar serie"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Botón para añadir serie en el modo edición */}
                <button
                  type="button"
                  onClick={() => handleAddSetToExercise(ex.id)}
                  className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 pt-1"
                >
                  <Plus className="w-3 h-3" /> Añadir serie
                </button>
              </div>
            ))}
          </div>

          {/* Botón para añadir ejercicio al entrenamiento pasado */}
          <button
            type="button"
            onClick={onOpenAddExercise}
            className="w-full py-2 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/50 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Añadir Ejercicio a esta Sesión
          </button>
        </div>

        {/* Footer */}
        <div className="flex gap-2 pt-2 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-2 rounded-xl text-xs transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-2 rounded-xl text-xs transition-colors active:scale-95"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
