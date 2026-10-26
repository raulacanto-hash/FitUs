import React from 'react';
import { Calendar, Dumbbell, Plus, CheckCircle2 } from 'lucide-react';
import { WorkoutSession } from '../../types/workout';
import { RestTimerState } from '../../hooks/useRestTimer';
import { QuickTimerBar } from './QuickTimerBar';
import { ExerciseCard } from './ExerciseCard';

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
}) => {
  return (
    <div className="space-y-4">
      {/* Tarjeta de Inicio / Nombre de Rutina */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <input
            type="text"
            value={currentWorkout.routineName}
            onChange={(e) => onUpdateRoutineName(e.target.value)}
            className="bg-transparent text-lg font-bold text-white focus:outline-none focus:border-b border-emerald-500 w-full tracking-tight"
            placeholder="Nombre de la rutina..."
          />
          <span className="text-[11px] bg-zinc-800/80 text-zinc-300 px-2.5 py-1 rounded-lg border border-zinc-700/50 flex items-center gap-1 font-mono flex-shrink-0 ml-2">
            <Calendar className="w-3 h-3 text-emerald-400" />
            {currentWorkout.date}
          </span>
        </div>

        {/* Barra de descansos rápidos */}
        <QuickTimerBar timer={timer} />
      </div>

      {/* Lista de ejercicios agregados hoy */}
      <div className="space-y-3">
        {currentWorkout.exercises.length === 0 ? (
          <div className="text-center py-14 px-4 border border-dashed border-zinc-800/80 rounded-2xl bg-zinc-900/30">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-500">
              <Dumbbell className="w-6 h-6" />
            </div>
            <p className="text-zinc-200 font-semibold text-sm">Tu rutina está vacía hoy</p>
            <p className="text-xs text-zinc-400 mt-1 mb-5 max-w-xs mx-auto">
              Selecciona ejercicios de nuestra amplia base de datos por grupo muscular.
            </p>
            <button
              type="button"
              onClick={onOpenExerciseModal}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
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

      {/* Botones Flotantes o de Acción Global */}
      {currentWorkout.exercises.length > 0 && (
        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={onOpenExerciseModal}
            className="w-full bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-200 font-semibold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-emerald-400" /> Agregar Ejercicio a la Sesión
          </button>

          <button
            type="button"
            onClick={onFinishWorkout}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" /> Finalizar Entrenamiento
          </button>
        </div>
      )}
    </div>
  );
};
