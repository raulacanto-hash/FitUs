import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Plus,
  RotateCcw,
  Trash2,
  FileText,
  Calendar
} from 'lucide-react';
import { WorkoutExercise, WorkoutSet } from '../../types/workout';
import { RestTimerState } from '../../hooks/useRestTimer';
import { QuickTimerBar } from './QuickTimerBar';
import { useTheme } from '../../context/ThemeContext';

interface ExerciseDetailModalProps {
  exercise: WorkoutExercise | null;
  timer: RestTimerState;
  timerFontScale?: number;
  onClose: () => void;
  onUpdateExercise: (exercise: WorkoutExercise) => void;
  onRegisterSet: (setId: string) => void;
  onUnregisterSet: (setId: string) => void;
  inputFontScale?: number;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  timer,
  timerFontScale = 1,
  onClose,
  onUpdateExercise,
  onRegisterSet,
  onUnregisterSet,
  inputFontScale = 1
}) => {
  const { accent, isDark } = useTheme();
  const [showWarmup, setShowWarmup] = useState(true);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const inputFontSize = `${Math.round(15 * inputFontScale)}px`;

  // Al abrir un ejercicio, seleccionamos la siguiente serie pendiente.
  useEffect(() => {
    if (!exercise) {
      setSelectedSetId(null);
      return;
    }
    const workingSets = exercise.sets.filter((set) => !set.isWarmup);
    const nextWorking = workingSets.find((set) => !set.completed);
    const nextAny = exercise.sets.find((set) => !set.completed);
    const fallback = workingSets[0] ?? exercise.sets[0];
    setSelectedSetId((nextWorking ?? nextAny ?? fallback)?.id ?? null);
  }, [exercise?.id]);

  if (!exercise) return null;

  const warmupSets = exercise.sets.filter((set) => set.isWarmup);
  const workingSets = exercise.sets.filter((set) => !set.isWarmup);
  const selectedSet = exercise.sets.find((set) => set.id === selectedSetId) ?? null;
  const canRegister = Boolean(selectedSet && !selectedSet.completed);

  const updateSets = (sets: WorkoutSet[]) => {
    onUpdateExercise({ ...exercise, sets });
  };

  const handleUpdateSet = (setId: string, field: 'weight' | 'reps', value: string) => {
    const parsed = value === '' ? '' : Math.max(0, Number(value));
    updateSets(exercise.sets.map((set) => (set.id === setId ? { ...set, [field]: parsed } : set)));
  };

  const handleAddWorkingSet = () => {
    const lastWorking = workingSets[workingSets.length - 1];
    const newSet: WorkoutSet = {
      id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      weight: lastWorking?.weight ?? 40,
      reps: lastWorking?.reps ?? 8,
      completed: false,
      isWarmup: false
    };
    updateSets([...exercise.sets, newSet]);
    setSelectedSetId(newSet.id);
  };

  const handleAddWarmupSet = () => {
    const newSet: WorkoutSet = {
      id: `st-warmup-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      weight: 20,
      reps: 12,
      completed: false,
      isWarmup: true
    };
    updateSets([newSet, ...exercise.sets]);
    setSelectedSetId(newSet.id);
  };

  const handleRemoveSet = (setId: string) => {
    if (exercise.sets.length <= 1) return;
    if (!window.confirm('¿Eliminar esta serie?')) return;
    updateSets(exercise.sets.filter((set) => set.id !== setId));
    if (selectedSetId === setId) {
      setSelectedSetId(null);
    }
  };

  const handleRegister = () => {
    if (!selectedSet || selectedSet.completed) return;
    onRegisterSet(selectedSet.id);

    const nextWorking = exercise.sets.find(
      (set) => !set.isWarmup && !set.completed && set.id !== selectedSet.id
    );
    setSelectedSetId(nextWorking?.id ?? null);
  };

  const handleUnregister = () => {
    if (!selectedSet?.completed) return;
    if (!window.confirm('¿Desmarcar esta serie? Dejará de contar como registrada.')) return;
    onUnregisterSet(selectedSet.id);
  };

  const renderSetRow = (set: WorkoutSet, index: number) => {
    const isSelected = selectedSetId === set.id;
    return (
      <div
        key={set.id}
        onClick={() => setSelectedSetId(set.id)}
        className={`grid grid-cols-12 items-center gap-1.5 px-2.5 py-2 rounded-2xl border transition-all cursor-pointer ${
          isSelected
            ? isDark
              ? 'bg-zinc-900/90'
              : 'bg-white'
            : set.completed
              ? isDark
                ? 'bg-zinc-900/60 border-zinc-800'
                : 'bg-zinc-100 border-zinc-300'
              : isDark
                ? 'bg-zinc-950/60 border-zinc-800/70'
                : 'bg-zinc-50 border-zinc-200'
        }`}
        style={isSelected ? { borderColor: accent.hex } : undefined}
        aria-selected={isSelected}
      >
        <span
          className="col-span-2 font-mono text-xs font-bold flex items-center gap-1"
          style={{ color: set.completed ? accent.hex : isDark ? '#a1a1aa' : '#52525b' }}
        >
          #{index + 1}
          {set.completed && <Check className="w-3 h-3" />}
        </span>

        <div className="col-span-4 px-0.5">
          <input
            type="number"
            inputMode="numeric"
            value={set.reps}
            onChange={(event) => handleUpdateSet(set.id, 'reps', event.target.value)}
            onFocus={() => setSelectedSetId(set.id)}
            className={`w-full rounded-xl py-2 px-1 text-center font-bold focus:outline-none ${
              isDark
                ? 'bg-zinc-800/80 border border-zinc-700/60 text-white'
                : 'bg-white border border-zinc-300 text-zinc-900'
            }`}
            style={{ fontSize: inputFontSize }}
            aria-label={`Repeticiones serie ${index + 1}`}
          />
        </div>

        <div className="col-span-4 px-0.5">
          <input
            type="number"
            step="any"
            inputMode="decimal"
            value={set.weight}
            onChange={(event) => handleUpdateSet(set.id, 'weight', event.target.value)}
            onFocus={() => setSelectedSetId(set.id)}
            className={`w-full rounded-xl py-2 px-1 text-center font-bold focus:outline-none ${
              isDark
                ? 'bg-zinc-800/80 border border-zinc-700/60 text-white'
                : 'bg-white border border-zinc-300 text-zinc-900'
            }`}
            style={{ fontSize: inputFontSize }}
            aria-label={`Carga serie ${index + 1}`}
          />
        </div>

        <div className="col-span-2 flex justify-end">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleRemoveSet(set.id);
            }}
            disabled={exercise.sets.length <= 1}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 ${
              isDark ? 'text-zinc-500 hover:text-red-400' : 'text-zinc-400 hover:text-red-600'
            }`}
            title="Eliminar serie"
            aria-label={`Eliminar serie ${index + 1}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[70] bg-zinc-950/90 backdrop-blur-md flex items-stretch sm:items-center justify-center p-0 sm:p-3 animate-in fade-in duration-200">
      <div className={`border max-w-lg w-full h-full sm:h-[92vh] flex flex-col shadow-2xl overflow-hidden sm:rounded-3xl ${
        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
      }`}>
        {/* Header con botón atrás y título */}
        <div className={`p-4 border-b flex justify-between items-center flex-shrink-0 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-xl transition-colors ${
              isDark ? 'hover:bg-zinc-800/40 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'
            }`}
            aria-label="Volver a la sesión"
            title="Volver a la sesión"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="text-base font-black truncate max-w-[240px]">
            {exercise.name}
          </h2>

          <span className="w-9" aria-hidden="true" />
        </div>

        {/* Temporizador de descanso integrado en la captura */}
        <div className="px-4 pt-3 flex-shrink-0">
          <div className={`rounded-2xl border px-3 py-2 ${
            isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <QuickTimerBar timer={timer} fontScale={timerFontScale} embedded />
          </div>
        </div>

          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {/* Sets de calentamiento */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className={`font-bold uppercase tracking-wider text-[11px] ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}>
                Sets de calentamiento
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddWarmupSet}
                  className="font-bold text-[11px] flex items-center gap-0.5"
                  style={{ color: accent.hex }}
                >
                  <Plus className="w-3 h-3" /> Añadir
                </button>
                {warmupSets.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowWarmup(!showWarmup)}
                    className="font-bold text-[11px] text-zinc-400"
                  >
                    {showWarmup ? 'Ocultar' : 'Mostrar'}
                  </button>
                )}
              </div>
            </div>

            {showWarmup && (
              <div className="space-y-1.5">
                <div className="grid grid-cols-12 text-[10px] font-semibold text-zinc-500 px-2.5 text-center uppercase tracking-wider">
                  <span className="col-span-2 text-left">SERIE</span>
                  <span className="col-span-4">REPS</span>
                  <span className="col-span-4">TOTAL KG</span>
                  <span className="col-span-2 text-right" />
                </div>

                {warmupSets.length === 0 ? (
                  <p className="text-[11px] italic text-zinc-500 px-1">
                    Sin sets de calentamiento.
                  </p>
                ) : (
                  warmupSets.map((set, index) => renderSetRow(set, index))
                )}
              </div>
            )}
          </div>

          {/* Series efectivas */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className={`font-bold uppercase tracking-wider text-[11px] ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Series efectivas
              </span>
              <span className={`text-[10px] font-mono flex items-center gap-0.5 ${
                isDark ? 'text-amber-400' : 'text-amber-600'
              }`}>
                ↗ Objetivo de sobrecarga
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="grid grid-cols-12 text-[10px] font-semibold text-zinc-500 px-2.5 text-center uppercase tracking-wider">
                <span className="col-span-2 text-left">SERIE</span>
                <span className="col-span-4">REPS</span>
                <span className="col-span-4">TOTAL KG</span>
                <span className="col-span-2 text-right" />
              </div>

              {workingSets.length === 0 ? (
                <p className="text-[11px] italic text-zinc-500 px-1">
                  Aún no hay series efectivas. Agrega una serie para comenzar.
                </p>
              ) : (
                workingSets.map((set, index) => renderSetRow(set, index))
              )}

              <button
                type="button"
                onClick={handleAddWorkingSet}
                className={`w-full py-2.5 border border-dashed rounded-2xl text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                  isDark
                    ? 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white'
                    : 'border-zinc-300 hover:border-zinc-400 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Plus className="w-4 h-4" style={{ color: accent.hex }} /> Añadir serie
              </button>
            </div>
          </div>

          {/* Notas */}
          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
            <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1 mb-1">
              <FileText className="w-3.5 h-3.5" /> Notas del ejercicio
            </span>
            <input
              type="text"
              value={exercise.notes}
              onChange={(event) => onUpdateExercise({ ...exercise, notes: event.target.value })}
              placeholder="No se han añadido notas..."
              className={`w-full bg-transparent text-xs placeholder-zinc-500 focus:outline-none ${
                isDark ? 'text-zinc-300' : 'text-zinc-900'
              }`}
            />
          </div>

          {/* Última sesión registrada */}
          <div className={`p-3.5 rounded-2xl border space-y-2 ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                <Calendar className="w-3.5 h-3.5" style={{ color: accent.hex }} />
                <span>Última Sesión Registrada</span>
              </div>
              <span className={`text-[10px] font-mono font-bold ${
                isDark ? 'text-lime-400' : 'text-lime-600'
              }`}>
                Esfuerzo: 1-2 RIR
              </span>
            </div>

            <div className={`grid grid-cols-2 gap-1.5 text-[11px] font-mono pt-1 ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              <div>Serie 1: <strong className={isDark ? 'text-white' : 'text-zinc-900'}>30 kg × 12 reps</strong></div>
              <div>Serie 2: <strong className={isDark ? 'text-white' : 'text-zinc-900'}>30 kg × 11 reps</strong></div>
              <div>Serie 3: <strong className={isDark ? 'text-white' : 'text-zinc-900'}>35 kg × 6 reps</strong></div>
              <div>Serie 4: <strong className={isDark ? 'text-white' : 'text-zinc-900'}>35 kg × 7 reps</strong></div>
            </div>
          </div>
        </div>

        {/* Footer fijo: registrar serie y volver */}
        <div className={`p-4 border-t flex items-center gap-2 flex-shrink-0 ${
          isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'
        }`}>
          {selectedSet?.completed ? (
            <button
              type="button"
              onClick={handleUnregister}
              className={`flex-1 py-3.5 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border active:scale-95 transition-all ${
                isDark
                  ? 'border-red-500/40 text-red-300 hover:bg-red-950/30'
                  : 'border-red-300 text-red-600 hover:bg-red-50'
              }`}
              title="Desmarcar la serie seleccionada"
            >
              <RotateCcw className="w-4 h-4" /> Desmarcar serie
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRegister}
              disabled={!canRegister}
              style={canRegister ? { backgroundColor: accent.hex } : undefined}
              className={`flex-1 py-3.5 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all disabled:cursor-not-allowed ${
                canRegister
                  ? accent.contrastText
                  : isDark
                    ? 'bg-zinc-800 text-zinc-500'
                    : 'bg-zinc-200 text-zinc-500'
              }`}
              title={canRegister ? 'Marcar esta serie como registrada e iniciar descanso' : 'Selecciona una serie pendiente'}
            >
              <Plus className="w-4 h-4" />
              {selectedSet ? 'Registrar serie' : 'Todas las series registradas'}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 ${
              isDark
                ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                : 'border-zinc-300 text-zinc-600 hover:bg-zinc-100'
            }`}
            title="Volver a la sesión"
            aria-label="Volver a la sesión"
          >
            <Check className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
