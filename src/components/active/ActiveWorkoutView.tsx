import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  BookmarkPlus,
  Calendar,
  CheckCircle2,
  Dumbbell,
  Layers,
  Plus,
  Timer,
  Trash2,
  X
} from 'lucide-react';
import { WorkoutSession } from '../../types/workout';
import { RestTimerState } from '../../hooks/useRestTimer';
import { QuickTimerBar } from './QuickTimerBar';
import { SessionExerciseRow } from './SessionExerciseRow';
import { useTheme } from '../../context/ThemeContext';
import { formatDuration } from '../../utils/duration';
import { formatVolume, getWorkoutSummary } from '../../utils/workoutStats';

interface ActiveWorkoutViewProps {
  currentWorkout: WorkoutSession;
  timer: RestTimerState;
  restTimerFontScale?: number;
  onUpdateRoutineName: (name: string) => void;
  onOpenExerciseDetail: (exerciseId: string) => void;
  onReplaceExercise: (exerciseId: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onOpenExerciseModal: () => void;
  onFinishWorkout: () => void;
  onSaveAsRoutine?: (name: string, category: string) => void;
  onBack: () => void;
  onDiscardWorkout: () => void;
}

export const ActiveWorkoutView: React.FC<ActiveWorkoutViewProps> = ({
  currentWorkout,
  timer,
  restTimerFontScale = 1,
  onUpdateRoutineName,
  onOpenExerciseDetail,
  onReplaceExercise,
  onRemoveExercise,
  onOpenExerciseModal,
  onFinishWorkout,
  onSaveAsRoutine,
  onBack,
  onDiscardWorkout
}) => {
  const { accent, isDark } = useTheme();
  const [menuExerciseId, setMenuExerciseId] = useState<string | null>(null);
  const [isFinishSheetOpen, setIsFinishSheetOpen] = useState(false);
  const [isDiscardSheetOpen, setIsDiscardSheetOpen] = useState(false);
  const [isSavingRoutinePrompt, setIsSavingRoutinePrompt] = useState(false);
  const [saveRoutineName, setSaveRoutineName] = useState(currentWorkout.routineName);
  const [saveRoutineCategory, setSaveRoutineCategory] = useState('TORSO');
  const [now, setNow] = useState(() => Date.now());

  // Mantiene visible la duración de la sesión sin depender del temporizador de descanso.
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 20000);
    return () => window.clearInterval(interval);
  }, []);

  const summary = useMemo(() => getWorkoutSummary(currentWorkout), [currentWorkout]);
  const elapsedMinutes = currentWorkout.startTime
    ? Math.max(0, Math.floor((now - currentWorkout.startTime) / 60000))
    : 0;

  const menuExercise = currentWorkout.exercises.find(
    (exercise) => exercise.id === menuExerciseId
  );

  const handleConfirmSaveRoutine = (event: React.FormEvent) => {
    event.preventDefault();
    if (onSaveAsRoutine) {
      onSaveAsRoutine(saveRoutineName, saveRoutineCategory);
      setIsSavingRoutinePrompt(false);
    }
  };

  const handleRemoveFromMenu = (exerciseId: string, exerciseName: string) => {
    if (
      window.confirm(
        `¿Quitar "${exerciseName}" de este entrenamiento? Las series registradas se perderán.`
      )
    ) {
      onRemoveExercise(exerciseId);
      setMenuExerciseId(null);
    }
  };

  return (
    <div className={`space-y-4 animate-in fade-in duration-200 pt-[max(0.75rem,env(safe-area-inset-top))] ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      {/* Barra de navegación de la sesión: atrás, título y salir */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-200 text-zinc-700'
          }`}
          title="Volver sin finalizar la sesión"
          aria-label="Volver sin finalizar la sesión"
        >
          <ArrowLeft className="w-5 h-5" style={{ color: accent.hex }} />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <input
            type="text"
            value={currentWorkout.routineName}
            onChange={(event) => onUpdateRoutineName(event.target.value)}
            className="w-full bg-transparent text-base font-black text-center tracking-tight focus:outline-none focus:border-b truncate"
            style={{ borderColor: accent.hex }}
            placeholder="Nombre del entrenamiento..."
            aria-label="Nombre del entrenamiento"
          />
          <span className="text-[10px] font-mono text-zinc-500 flex items-center justify-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3" style={{ color: accent.hex }} />
            {currentWorkout.date}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsDiscardSheetOpen(true)}
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-red-400' : 'hover:bg-zinc-200 text-zinc-500 hover:text-red-600'
          }`}
          title="Descartar entrenamiento"
          aria-label="Descartar entrenamiento"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Resumen de la sesión */}
      <div className={`rounded-3xl p-4 border space-y-3 ${
        isDark ? 'bg-zinc-900/70 border-zinc-800/80 backdrop-blur-md' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="grid grid-cols-3 gap-2">
          <div className={`rounded-2xl px-2 py-2 border text-center ${
            isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-500 flex items-center justify-center gap-1">
              <Timer className="w-3 h-3" style={{ color: accent.hex }} /> Duración
            </span>
            <span className="text-sm font-mono font-black" style={{ color: accent.hex }}>
              {formatDuration(elapsedMinutes)}
            </span>
          </div>
          <div className={`rounded-2xl px-2 py-2 border text-center ${
            isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-500 flex items-center justify-center gap-1">
              <Layers className="w-3 h-3" style={{ color: accent.hex }} /> Series
            </span>
            <span className="text-sm font-mono font-black">
              {summary.completedSets}/{summary.totalSets}
            </span>
          </div>
          <div className={`rounded-2xl px-2 py-2 border text-center ${
            isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-500 flex items-center justify-center gap-1">
              <Dumbbell className="w-3 h-3" style={{ color: accent.hex }} /> Volumen
            </span>
            <span className="text-sm font-mono font-black">
              {formatVolume(summary.totalVolume)}
            </span>
          </div>
        </div>

        <QuickTimerBar timer={timer} fontScale={restTimerFontScale} />
      </div>

      {/* Ejercicios de la sesión: solo resumen, se edita en la pantalla de captura */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-1.5">
            {currentWorkout.exercises.length} ejercicios
          </h3>
          <button
            type="button"
            onClick={onOpenExerciseModal}
            className={`p-1.5 rounded-xl border transition-colors ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300'
                : 'bg-zinc-100 border-zinc-300 hover:bg-zinc-200 text-zinc-700'
            }`}
            title="Añadir ejercicio a la sesión"
            aria-label="Añadir ejercicio a la sesión"
          >
            <Plus className="w-4 h-4" style={{ color: accent.hex }} />
          </button>
        </div>

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
          currentWorkout.exercises.map((exercise) => (
            <SessionExerciseRow
              key={exercise.id}
              exercise={exercise}
              onOpen={() => onOpenExerciseDetail(exercise.id)}
              onOpenMenu={() => setMenuExerciseId(exercise.id)}
            />
          ))
        )}
      </div>

      {/* Acciones secundarias */}
      {currentWorkout.exercises.length > 0 && (
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
      )}

      {/* Botón fijo para finalizar; abre una confirmación antes de guardar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-30 max-w-lg mx-auto px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-lg border-t ${
          isDark ? 'bg-zinc-950/85 border-zinc-800/60' : 'bg-white/85 border-zinc-200'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsFinishSheetOpen(true)}
          disabled={currentWorkout.exercises.length === 0}
          style={{ backgroundColor: accent.hex }}
          className={`w-full py-4 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${accent.contrastText}`}
        >
          <CheckCircle2 className="w-4 h-4" /> Finalizar
        </button>
      </div>

      {/* Menú de acciones del ejercicio */}
      {menuExercise && (
        <div
          className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200"
          onClick={() => setMenuExerciseId(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className={`w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            <div className={`flex items-start justify-between gap-2 px-4 py-3 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Ejercicio</p>
                <h3 className="text-sm font-black truncate">{menuExercise.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setMenuExerciseId(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 space-y-1">
              <button
                type="button"
                onClick={() => {
                  onOpenExerciseDetail(menuExercise.id);
                  setMenuExerciseId(null);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-left text-xs font-semibold transition-colors ${
                  isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                }`}
              >
                <Layers className="w-4 h-4" style={{ color: accent.hex }} />
                Abrir captura de series
              </button>
              <button
                type="button"
                onClick={() => {
                  onReplaceExercise(menuExercise.id);
                  setMenuExerciseId(null);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-left text-xs font-semibold transition-colors ${
                  isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" style={{ color: accent.hex }} />
                Reemplazar ejercicio
              </button>
              <button
                type="button"
                onClick={() => handleRemoveFromMenu(menuExercise.id, menuExercise.name)}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-left text-xs font-semibold transition-colors text-red-400 ${
                  isDark ? 'hover:bg-red-950/30' : 'hover:bg-red-50'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Quitar ejercicio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmación para finalizar */}
      {isFinishSheetOpen && (
        <div
          className="fixed inset-0 z-[60] bg-zinc-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200"
          onClick={() => setIsFinishSheetOpen(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className={`w-full max-w-sm rounded-3xl border shadow-2xl p-4 space-y-3 ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black">¿Finalizar entrenamiento?</h3>
              <button
                type="button"
                onClick={() => setIsFinishSheetOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              La sesión se guardará en tu historial y dejará de estar activa. Revisa el resumen
              antes de confirmar.
            </p>

            <div className={`grid grid-cols-3 gap-2 text-center rounded-2xl p-2.5 border ${
              isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <div>
                <p className="text-[9px] uppercase font-bold text-zinc-500">Duración</p>
                <p className="text-xs font-mono font-black">{formatDuration(elapsedMinutes)}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-zinc-500">Series</p>
                <p className="text-xs font-mono font-black">{summary.completedSets}/{summary.totalSets}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-zinc-500">Volumen</p>
                <p className="text-xs font-mono font-black">{formatVolume(summary.totalVolume)}</p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsFinishSheetOpen(false);
                  onFinishWorkout();
                }}
                style={{ backgroundColor: accent.hex }}
                className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider ${accent.contrastText}`}
              >
                Finalizar y guardar
              </button>
              <button
                type="button"
                onClick={() => setIsFinishSheetOpen(false)}
                className={`w-full py-2.5 rounded-2xl text-xs font-bold ${
                  isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
                }`}
              >
                Seguir entrenando
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmación para descartar */}
      {isDiscardSheetOpen && (
        <div
          className="fixed inset-0 z-[60] bg-zinc-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200"
          onClick={() => setIsDiscardSheetOpen(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className={`w-full max-w-sm rounded-3xl border shadow-2xl p-4 space-y-3 ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black">¿Descartar entrenamiento?</h3>
              <button
                type="button"
                onClick={() => setIsDiscardSheetOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Se perderán las series y notas capturadas en esta sesión. Esta acción no se puede
              deshacer.
            </p>
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsDiscardSheetOpen(false);
                  onDiscardWorkout();
                }}
                className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-red-500 text-white"
              >
                Sí, descartar sesión
              </button>
              <button
                type="button"
                onClick={() => setIsDiscardSheetOpen(false)}
                className={`w-full py-2.5 rounded-2xl text-xs font-bold ${
                  isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
                }`}
              >
                Seguir entrenando
              </button>
            </div>
          </div>
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
                  onChange={(event) => setSaveRoutineName(event.target.value)}
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
                  onChange={(event) => setSaveRoutineCategory(event.target.value)}
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
