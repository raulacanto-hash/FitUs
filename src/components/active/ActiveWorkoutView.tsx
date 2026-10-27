import React, { useState } from 'react';
import { Calendar, Dumbbell, Plus, CheckCircle2, BookmarkPlus, ArrowLeft } from 'lucide-react';
import { WorkoutSession } from '../../types/workout';
import { RestTimerState } from '../../hooks/useRestTimer';
import { QuickTimerBar } from './QuickTimerBar';
import { ExerciseCard } from './ExerciseCard';
import { useTheme } from '../../context/ThemeContext';

interface ActiveWorkoutViewProps {
  currentWorkout: WorkoutSession;
  timer: RestTimerState;
  onUpdateRoutineName: (name: string) => void;
  onToggleSet: (exerciseId: string, setId: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, field: 'weight' | 'reps', value: string) => void;
  onAddSet: (exerciseId: string) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onUpdateNotes: (exerciseId: string, notes: string) => void;
  onOpenExerciseModal: () => void;
  onFinishWorkout: () => void;
  onSaveAsRoutine?: (name: string, category: string) => void;
  onBackToRoutines?: () => void;
  onDiscardWorkout?: () => void;
}

export const ActiveWorkoutView: React.FC<ActiveWorkoutViewProps> = ({
  currentWorkout,
  timer,
  onUpdateRoutineName,
  onToggleSet,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
  onRemoveExercise,
  onUpdateNotes,
  onOpenExerciseModal,
  onFinishWorkout,
  onSaveAsRoutine,
  onBackToRoutines,
  onDiscardWorkout
}) => {
  const { accent, isDark } = useTheme();
  const [isSavingRoutinePrompt, setIsSavingRoutinePrompt] = useState(false);
  const [saveRoutineName, setSaveRoutineName] = useState(currentWorkout.routineName);
  const [saveRoutineCategory, setSaveRoutineCategory] = useState('TORSO');

  const handleConfirmSaveRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveAsRoutine) {
      onSaveAsRoutine(saveRoutineName, saveRoutineCategory);
      setIsSavingRoutinePrompt(false);
    }
  };

  return (
    <div className={`space-y-4 animate-in fade-in duration-200 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      {/* Botón superior de volver a rutinas si existe callback */}
      {onBackToRoutines && (
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBackToRoutines}
            className={`text-xs flex items-center gap-1.5 transition-colors font-bold ${
              isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" style={{ color: accent.hex }} /> Volver al catálogo de rutinas
          </button>
          {onDiscardWorkout && currentWorkout.exercises.length > 0 && (
            <button
              type="button"
              onClick={onDiscardWorkout}
              className="text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors"
            >
              Descartar sesión
            </button>
          )}
        </div>
      )}

      {/* Tarjeta de Inicio / Nombre de Rutina */}
      <div className={`rounded-3xl p-4 border transition-all ${
        isDark ? 'bg-zinc-900/60 border-zinc-800/80 backdrop-blur-md shadow-sm' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex justify-between items-center mb-3">
          <input
            type="text"
            value={currentWorkout.routineName}
            onChange={(e) => onUpdateRoutineName(e.target.value)}
            className="bg-transparent text-lg font-black focus:outline-none focus:border-b w-full tracking-tight"
            style={{ borderColor: accent.hex }}
            placeholder="Nombre de la rutina..."
          />
          <span className={`text-[11px] px-2.5 py-1 rounded-xl border flex items-center gap-1 font-mono flex-shrink-0 ml-2 ${
            isDark ? 'bg-zinc-800/80 text-zinc-300 border-zinc-700/50' : 'bg-zinc-100 text-zinc-700 border-zinc-200'
          }`}>
            <Calendar className="w-3 h-3" style={{ color: accent.hex }} />
            {currentWorkout.date}
          </span>
        </div>

        {/* Barra de descansos rápidos con soporte de +/- 15s */}
        <QuickTimerBar timer={timer} />
      </div>

      {/* Lista de ejercicios agregados hoy */}
      <div className="space-y-3">
        {currentWorkout.exercises.length === 0 ? (
          <div className={`text-center py-14 px-4 border border-dashed rounded-3xl ${
            isDark ? 'border-zinc-800/80 bg-zinc-900/30' : 'border-zinc-300 bg-white'
          }`}>
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto mb-3 ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-200 text-zinc-400'
            }`}>
              <Dumbbell className="w-6 h-6" style={{ color: accent.hex }} />
            </div>
            <p className="font-bold text-sm">Tu rutina está vacía hoy</p>
            <p className={`text-xs mt-1 mb-5 max-w-xs mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Selecciona ejercicios de nuestra base de datos o inicia una plantilla predefinida.
            </p>
            <button
              type="button"
              onClick={onOpenExerciseModal}
              style={{ backgroundColor: accent.hex }}
              className={`inline-flex items-center gap-2 font-black px-4 py-2.5 rounded-2xl text-xs transition-all shadow-lg active:scale-95 ${accent.contrastText}`}
            >
              <Plus className="w-4 h-4" /> Buscar & Agregar Ejercicio
            </button>
          </div>
        ) : (
          currentWorkout.exercises.map((exercise, exIndex) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              exerciseIndex={exIndex}
              onToggleSet={onToggleSet}
              onUpdateSet={onUpdateSet}
              onAddSet={onAddSet}
              onRemoveSet={onRemoveSet}
              onRemoveExercise={onRemoveExercise}
              onUpdateNotes={onUpdateNotes}
            />
          ))
        )}
      </div>

      {/* Botones de Acción Global */}
      {currentWorkout.exercises.length > 0 && (
        <div className="pt-2 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onOpenExerciseModal}
              className={`py-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                isDark 
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200' 
                  : 'bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-800 shadow-sm'
              }`}
            >
              <Plus className="w-4 h-4" style={{ color: accent.hex }} /> Añadir Ejercicio
            </button>

            {onSaveAsRoutine && (
              <button
                type="button"
                onClick={() => {
                  setSaveRoutineName(currentWorkout.routineName);
                  setIsSavingRoutinePrompt(true);
                }}
                className={`py-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                  isDark 
                    ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200' 
                    : 'bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-800 shadow-sm'
                }`}
              >
                <BookmarkPlus className="w-4 h-4" style={{ color: accent.hex }} /> Guardar Rutina
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onFinishWorkout}
            style={{ backgroundColor: accent.hex }}
            className={`w-full py-4 rounded-2xl text-xs uppercase font-black tracking-wider flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all ${accent.contrastText}`}
          >
            <CheckCircle2 className="w-4 h-4" /> Finalizar y Guardar Sesión
          </button>
        </div>
      )}

      {/* Modal para guardar como plantilla de rutina */}
      {isSavingRoutinePrompt && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className={`rounded-3xl max-w-sm w-full p-4 space-y-3 shadow-2xl border ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <h4 className="font-bold text-sm flex items-center gap-1.5">
              <BookmarkPlus className="w-4 h-4" style={{ color: accent.hex }} /> Guardar como Plantilla de Rutina
            </h4>
            <form onSubmit={handleConfirmSaveRoutine} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Nombre de la Rutina</label>
                <input
                  type="text"
                  value={saveRoutineName}
                  onChange={(e) => setSaveRoutineName(e.target.value)}
                  className={`w-full rounded-xl p-2.5 border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                  style={{ borderColor: saveRoutineName ? accent.hex : undefined }}
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Categoría (ej. PIERNA, EMPUJE, TORSO)</label>
                <input
                  type="text"
                  value={saveRoutineCategory}
                  onChange={(e) => setSaveRoutineCategory(e.target.value)}
                  className={`w-full rounded-xl p-2.5 border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                  required
                />
              </div>
              <div className="flex gap-2 pt-2 border-t" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
                <button
                  type="button"
                  onClick={() => setIsSavingRoutinePrompt(false)}
                  className={`flex-1 py-2 rounded-xl font-medium ${
                    isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: accent.hex }}
                  className={`flex-1 font-bold py-2 rounded-xl ${accent.contrastText}`}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
