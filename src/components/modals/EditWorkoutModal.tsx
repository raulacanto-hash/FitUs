import React from 'react';
import { X, Trash2, Plus, Dumbbell } from 'lucide-react';
import { WorkoutSession } from '../../types/workout';
import { formatDuration, splitDuration, durationFromParts } from '../../utils/duration';
import { useTheme } from '../../context/ThemeContext';

interface EditWorkoutModalProps {
  editingWorkout: WorkoutSession | null;
  isNewWorkout?: boolean;
  onClose: () => void;
  onSave: () => void;
  onUpdateWorkout: (updater: (prev: WorkoutSession) => WorkoutSession) => void;
  onOpenAddExercise: () => void;
}

export const EditWorkoutModal: React.FC<EditWorkoutModalProps> = ({
  editingWorkout,
  isNewWorkout = false,
  onClose,
  onSave,
  onUpdateWorkout,
  onOpenAddExercise
}) => {
  const { accent, isDark } = useTheme();

  if (!editingWorkout) return null;

  const totalDuration = editingWorkout.durationMinutes ?? 45;
  const { hours, minutes } = splitDuration(totalDuration);

  const updateDuration = (nextHours: number, nextMinutes: number) => {
    onUpdateWorkout((prev) => ({
      ...prev,
      durationMinutes: durationFromParts(nextHours, nextMinutes)
    }));
  };

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
      <div className={`border rounded-3xl max-w-lg w-full max-h-[88vh] flex flex-col shadow-2xl p-4 space-y-3 ${
        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
      }`}>
        {/* Header */}
        <div className={`flex justify-between items-center border-b pb-2.5 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <h3 className="font-bold text-sm">
            {isNewWorkout ? 'Registrar Entrenamiento Anterior' : 'Editar Entrenamiento Pasado'}
          </h3>
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
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 block mb-1">Nombre del entrenamiento</label>
            <input
              type="text"
              value={editingWorkout.routineName}
              onChange={(e) => onUpdateWorkout(prev => ({ ...prev, routineName: e.target.value }))}
              className={`w-full rounded-xl p-2 text-xs border focus:outline-none ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
              style={{ borderColor: editingWorkout.routineName ? accent.hex : undefined }}
              placeholder="Ej. Pecho y tríceps"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 block mb-1">Fecha</label>
            <input
              type="date"
              value={editingWorkout.date}
              onChange={(e) => onUpdateWorkout(prev => ({ ...prev, date: e.target.value }))}
              className={`w-full rounded-xl p-2 text-xs border focus:outline-none ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-zinc-400 block">Duración</label>
              <span className="text-[10px] font-bold" style={{ color: accent.hex }}>
                {formatDuration(totalDuration)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="23"
                  inputMode="numeric"
                  value={hours}
                  onChange={(e) => {
                    const nextHours = Math.min(23, Math.max(0, Number(e.target.value) || 0));
                    updateDuration(nextHours, minutes);
                  }}
                  className={`w-full rounded-xl p-2 pr-7 text-xs border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                  aria-label="Horas de duración"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-zinc-500 font-mono">
                  h
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="59"
                  inputMode="numeric"
                  value={minutes}
                  onChange={(e) => {
                    const nextMinutes = Math.min(59, Math.max(0, Number(e.target.value) || 0));
                    updateDuration(hours, nextMinutes);
                  }}
                  className={`w-full rounded-xl p-2 pr-9 text-xs border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                  aria-label="Minutos de duración"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-zinc-500 font-mono">
                  min
                </span>
              </div>
            </div>
            <p className="text-[9px] text-zinc-500">Horas y minutos</p>
          </div>

          {/* Lista de Ejercicios */}
          <div className="space-y-2">
            {editingWorkout.exercises.map((ex) => (
              <div key={ex.id} className={`p-3 rounded-2xl border space-y-2 ${
                isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs">{ex.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(ex.id)}
                    className="text-zinc-400 hover:text-red-500 p-1"
                    title="Eliminar ejercicio"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Series */}
                <div className="space-y-1">
                  {ex.sets.map((s, sIdx) => (
                    <div key={s.id || sIdx} className="flex items-center gap-2 text-xs">
                      <span className="text-zinc-400 font-mono text-[10px] w-5">#{sIdx + 1}</span>
                      <input
                        type="number"
                        step="any"
                        inputMode="decimal"
                        value={s.weight}
                        onChange={(e) => handleUpdateSetValue(ex.id, sIdx, 'weight', e.target.value)}
                        className={`border rounded px-2 py-1 text-center w-16 text-xs font-bold focus:outline-none ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                        }`}
                        placeholder="0"
                      />
                      <span className="text-zinc-400 text-[10px]">kg ×</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={s.reps}
                        onChange={(e) => handleUpdateSetValue(ex.id, sIdx, 'reps', e.target.value)}
                        className={`border rounded px-2 py-1 text-center w-16 text-xs font-bold focus:outline-none ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                        }`}
                        placeholder="0"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSet(ex.id, sIdx)}
                        className="text-zinc-400 hover:text-red-500 p-1 ml-auto"
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
                  className="text-[11px] font-bold flex items-center gap-1 pt-1"
                  style={{ color: accent.hex }}
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
            className={`w-full py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
              isDark 
                ? 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border-zinc-700/50' 
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" style={{ color: accent.hex }} /> Añadir Ejercicio a esta Sesión
          </button>
        </div>

        {/* Footer */}
        <div className="flex gap-2 pt-2 border-t" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
              isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            style={{ backgroundColor: accent.hex }}
            className={`flex-1 font-black py-2 rounded-xl text-xs transition-colors active:scale-95 ${accent.contrastText}`}
          >
            {isNewWorkout ? 'Guardar Entrenamiento' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};
