import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  Plus,
  Play,
  Dumbbell,
  ShieldCheck,
  Activity,
  Pencil,
  Trash2,
  MoreVertical,
  BarChart2,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { RoutineExerciseTemplate, RoutineTemplate } from '../../types/workout';
import { useTheme } from '../../context/ThemeContext';

interface RoutineDetailViewProps {
  routine: RoutineTemplate;
  onBack: () => void;
  onStartRoutine: (routine: RoutineTemplate) => void;
  onAddExerciseClick: () => void;
  onEditRoutine: (routine: RoutineTemplate) => void;
  onDeleteRoutine: (id: string) => void;
  onReplaceExercise: (exerciseIndex: number) => void;
  onRemoveExercise: (exerciseIndex: number) => void;
  onUpdateExerciseTargets: (
    exerciseIndex: number,
    updates: Pick<RoutineExerciseTemplate, 'targetSets' | 'defaultReps' | 'defaultWeight'>
  ) => void;
}

const muscleInitials = (category: string): string =>
  category
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 3)
    .toUpperCase();

export const RoutineDetailView: React.FC<RoutineDetailViewProps> = ({
  routine,
  onBack,
  onStartRoutine,
  onAddExerciseClick,
  onEditRoutine,
  onDeleteRoutine,
  onReplaceExercise,
  onRemoveExercise,
  onUpdateExerciseTargets
}) => {
  const { accent, isDark } = useTheme();
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const [editorIndex, setEditorIndex] = useState<number | null>(null);
  const [editorDraft, setEditorDraft] = useState({
    targetSets: 4,
    defaultReps: 10,
    defaultWeight: 20
  });

  const openEditor = (index: number, exercise: RoutineExerciseTemplate) => {
    setEditorDraft({
      targetSets: exercise.targetSets,
      defaultReps: exercise.defaultReps,
      defaultWeight: exercise.defaultWeight
    });
    setEditorIndex(index);
    setMenuIndex(null);
  };

  const saveEditor = () => {
    if (editorIndex === null) return;
    onUpdateExerciseTargets(editorIndex, {
      targetSets: Math.max(1, Number(editorDraft.targetSets) || 1),
      defaultReps: Math.max(1, Number(editorDraft.defaultReps) || 1),
      defaultWeight: Math.max(0, Number(editorDraft.defaultWeight) || 0)
    });
    setEditorIndex(null);
  };

  return (
    <div className={`space-y-4 pb-20 animate-in fade-in duration-200 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      {/* Barra Superior con botón atrás y menú */}
      <div className="flex items-center justify-between pb-1">
        <button
          type="button"
          onClick={onBack}
          className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-200 text-zinc-700'}`}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: accent.hex }} />
        </button>

        <h1 className="text-base font-black tracking-tight text-center truncate max-w-[210px]">
          {routine.name}
        </h1>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEditRoutine(routine)}
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-200 text-zinc-600'
            }`}
            title="Editar rutina"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteRoutine(routine.id)}
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-red-400' : 'hover:bg-zinc-200 text-zinc-600 hover:text-red-600'
            }`}
            title="Eliminar rutina"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Músculos a entrenar */}
      <div className="space-y-2">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Músculos a entrenar
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {(routine.targetMuscles || [
            { muscle: 'Pectorales', percentage: 85 },
            { muscle: 'Bíceps', percentage: 100 },
            { muscle: 'Tríceps', percentage: 100 }
          ]).map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all ${
                isDark 
                  ? 'bg-zinc-900/80 border-zinc-800/80' 
                  : 'bg-white border-zinc-200 shadow-sm'
              }`}
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-1.5"
                style={{ backgroundColor: `${accent.hex}15` }}
              >
                <Activity className="w-5 h-5" style={{ color: accent.hex }} />
              </div>
              <span className="text-[11px] font-bold truncate max-w-full">{m.muscle}</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: accent.hex }}>
                {m.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Menú resumen de ejercicios: series, reps y carga */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-1.5">
            <span>{routine.exercises.length} ejercicios</span>
          </h3>
          <button
            type="button"
            onClick={onAddExerciseClick}
            className={`p-1.5 rounded-xl border transition-colors ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300' 
                : 'bg-zinc-100 border-zinc-300 hover:bg-zinc-200 text-zinc-700'
            }`}
            title="Añadir ejercicio a la rutina"
          >
            <Plus className="w-4 h-4" style={{ color: accent.hex }} />
          </button>
        </div>

        <div className="space-y-2.5">
          {routine.exercises.map((ex, idx) => {
            const repsText = ex.repsRange || `${ex.defaultReps} reps`;
            const weightText = ex.weightRange || `${ex.defaultWeight} kg`;
            const summaryText = `${ex.targetSets} series · ${repsText} · ${weightText}`;

            return (
              <div
                key={`${ex.name}-${idx}`}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                  isDark 
                    ? 'bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700' 
                    : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                }`}
              >
                {/* Thumbnail con categoría muscular */}
                <div
                  className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 overflow-hidden ${
                    isDark ? 'bg-zinc-950 border border-zinc-800' : 'bg-zinc-100 border border-zinc-200'
                  }`}
                >
                  <Dumbbell className="w-5 h-5" style={{ color: accent.hex }} />
                  <span className={`text-[8px] font-black uppercase tracking-wider mt-0.5 ${
                    isDark ? 'text-zinc-500' : 'text-zinc-500'
                  }`}>
                    {muscleInitials(ex.category)}
                  </span>
                </div>

                {/* Info del Ejercicio */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {ex.score && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0">
                        <ShieldCheck className="w-2.5 h-2.5" /> {ex.score}
                      </span>
                    )}
                    <h4 className="text-xs font-bold truncate">{ex.name}</h4>
                  </div>
                  <p className={`text-[11px] font-mono mt-1 flex items-center gap-1.5 ${
                    isDark ? 'text-zinc-400' : 'text-zinc-500'
                  }`}>
                    <BarChart2 className="w-3 h-3 flex-shrink-0" style={{ color: accent.hex }} />
                    <span className="truncate">{summaryText}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMenuIndex(menuIndex === idx ? null : idx)}
                  className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                    isDark ? 'hover:bg-zinc-800 text-zinc-500' : 'hover:bg-zinc-100 text-zinc-400'
                  }`}
                  title="Opciones del ejercicio"
                  aria-expanded={menuIndex === idx}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botón Flotante Fijo Inferior */}
      <div className={`fixed bottom-16 left-0 right-0 z-30 max-w-lg mx-auto p-4 backdrop-blur-lg ${
        isDark ? 'bg-zinc-950/80' : 'bg-white/80'
      }`}>
        <button
          type="button"
          onClick={() => onStartRoutine(routine)}
          style={{ backgroundColor: accent.hex }}
          className={`w-full py-4 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-all ${accent.contrastText}`}
        >
          <Play className="w-4 h-4 fill-current" />
          Comenzar Entrenamiento
        </button>
      </div>

      {/* Hoja de opciones del ejercicio: cambiar, ajustar o eliminar */}
      {menuIndex !== null && routine.exercises[menuIndex] && (
        <div
          className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200"
          onClick={() => setMenuIndex(null)}
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
                <h3 className="text-sm font-black truncate">{routine.exercises[menuIndex].name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setMenuIndex(null)}
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
                  onReplaceExercise(menuIndex);
                  setMenuIndex(null);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-left text-xs font-semibold transition-colors ${
                  isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" style={{ color: accent.hex }} />
                Cambiar ejercicio (catálogo o personalizado)
              </button>
              <button
                type="button"
                onClick={() => openEditor(menuIndex, routine.exercises[menuIndex])}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-left text-xs font-semibold transition-colors ${
                  isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" style={{ color: accent.hex }} />
                Ajustar series, reps y carga
              </button>
              <button
                type="button"
                onClick={() => {
                  const exercise = routine.exercises[menuIndex];
                  if (
                    !window.confirm(
                      `¿Eliminar "${exercise.name}" de esta rutina?`
                    )
                  ) {
                    return;
                  }
                  onRemoveExercise(menuIndex);
                  setMenuIndex(null);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-left text-xs font-semibold transition-colors text-red-400 ${
                  isDark ? 'hover:bg-red-950/30' : 'hover:bg-red-50'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Eliminar ejercicio de la rutina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor de series, reps y carga objetivo */}
      {editorIndex !== null && (
        <div className="fixed inset-0 z-[60] bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className={`w-full max-w-sm rounded-3xl border shadow-2xl p-4 space-y-3 ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black">Ajustar ejercicio</h3>
              <button
                type="button"
                onClick={() => setEditorIndex(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-zinc-500 truncate">
              {routine.exercises[editorIndex]?.name}
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Series</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={editorDraft.targetSets}
                  onChange={(event) =>
                    setEditorDraft((prev) => ({ ...prev, targetSets: Number(event.target.value) }))
                  }
                  className={`w-full rounded-xl p-2 text-center text-sm font-bold border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Reps</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={editorDraft.defaultReps}
                  onChange={(event) =>
                    setEditorDraft((prev) => ({ ...prev, defaultReps: Number(event.target.value) }))
                  }
                  className={`w-full rounded-xl p-2 text-center text-sm font-bold border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Carga (kg)</label>
                <input
                  type="number"
                  step="any"
                  inputMode="decimal"
                  min={0}
                  value={editorDraft.defaultWeight}
                  onChange={(event) =>
                    setEditorDraft((prev) => ({ ...prev, defaultWeight: Number(event.target.value) }))
                  }
                  className={`w-full rounded-xl p-2 text-center text-sm font-bold border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditorIndex(null)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${
                  isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
                }`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveEditor}
                style={{ backgroundColor: accent.hex }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black ${accent.contrastText}`}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
