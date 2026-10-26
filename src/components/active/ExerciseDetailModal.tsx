import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Clock, 
  Sparkles, 
  Video, 
  Check, 
  Plus, 
  Trash2, 
  FileText,
  Calendar
} from 'lucide-react';
import { WorkoutExercise, WorkoutSet } from '../../types/workout';
import { useTheme } from '../../context/ThemeContext';

interface ExerciseDetailModalProps {
  exercise: WorkoutExercise | null;
  onClose: () => void;
  onUpdateExercise: (exercise: WorkoutExercise) => void;
  onStartOrSave: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
  onUpdateExercise,
  onStartOrSave
}) => {
  const { accent, isDark } = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showWarmup, setShowWarmup] = useState(true);

  if (!exercise) return null;

  // Separar en series de calentamiento y series efectivas (Screenshot 3)
  const warmupSets = exercise.sets.filter(s => s.isWarmup);
  const workingSets = exercise.sets.filter(s => !s.isWarmup);

  const handleUpdateSet = (setId: string, field: 'weight' | 'reps', value: string) => {
    const parsed = value === '' ? '' : Math.max(0, Number(value));
    const updated = exercise.sets.map(s => s.id === setId ? { ...s, [field]: parsed } : s);
    onUpdateExercise({ ...exercise, sets: updated });
  };

  const handleToggleSet = (setId: string) => {
    const updated = exercise.sets.map(s => s.id === setId ? { ...s, completed: !s.completed } : s);
    onUpdateExercise({ ...exercise, sets: updated });
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
    onUpdateExercise({ ...exercise, sets: [...exercise.sets, newSet] });
  };

  const handleAddWarmupSet = () => {
    const newSet: WorkoutSet = {
      id: `st-warmup-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      weight: 20,
      reps: 12,
      completed: true,
      isWarmup: true
    };
    onUpdateExercise({ ...exercise, sets: [newSet, ...exercise.sets] });
  };

  const handleRemoveSet = (setId: string) => {
    onUpdateExercise({ ...exercise, sets: exercise.sets.filter(s => s.id !== setId) });
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className={`rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border ${
        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
      }`}>
        
        {/* Header con botón atrás, título y corazón (Screenshot 3) */}
        <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 rounded-xl hover:bg-zinc-800/40 text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-base font-black truncate max-w-[240px]">
            {exercise.name}
          </h2>

          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-1.5 rounded-xl hover:bg-zinc-800/40 text-zinc-400 hover:text-red-500 transition-colors"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Chips de navegación rápida (Screenshot 3: Score, Detalles, 04:00, Video) */}
        <div className="px-4 pt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <div className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> 35
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800/80 text-zinc-300 border border-zinc-700/40 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Detalles
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800/80 text-zinc-300 border border-zinc-700/40 flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-lime-400" /> 04:00 descanso
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800/80 text-zinc-300 border border-zinc-700/40 flex items-center gap-1">
            <Video className="w-3 h-3 text-red-400" /> Técnica
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* SECCIÓN 1: Sets de Calentamiento (Screenshot 3) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-zinc-400 uppercase tracking-wider text-[11px]">
                Sets de calentamiento
              </span>
              <button
                type="button"
                onClick={() => setShowWarmup(!showWarmup)}
                className="font-bold text-[11px]"
                style={{ color: accent.hex }}
              >
                {showWarmup ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {showWarmup && (
              <div className="space-y-1.5">
                <div className="grid grid-cols-12 text-[10px] font-semibold text-zinc-500 px-3 text-center uppercase tracking-wider">
                  <span className="col-span-2 text-left">SERIE</span>
                  <span className="col-span-4">REPETICIONES</span>
                  <span className="col-span-4">TOTAL KG</span>
                  <span className="col-span-2 text-right">BARRA</span>
                </div>

                {warmupSets.length === 0 ? (
                  <button
                    type="button"
                    onClick={handleAddWarmupSet}
                    className="w-full py-2 border border-dashed border-zinc-800 rounded-xl text-xs text-zinc-500 hover:text-zinc-300 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar set de calentamiento (20kg)
                  </button>
                ) : (
                  warmupSets.map((s, idx) => (
                    <div 
                      key={s.id} 
                      className={`grid grid-cols-12 items-center px-3 py-2 rounded-xl border text-xs ${
                        isDark ? 'bg-zinc-950/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <span className="col-span-2 font-mono text-zinc-400">#{idx + 1}</span>
                      <div className="col-span-4 px-1">
                        <input
                          type="number"
                          value={s.reps}
                          onChange={(e) => handleUpdateSet(s.id, 'reps', e.target.value)}
                          className={`w-full text-center rounded-lg py-1 font-bold ${
                            isDark ? 'bg-zinc-800 text-white' : 'bg-white border text-zinc-900'
                          }`}
                        />
                      </div>
                      <div className="col-span-4 px-1">
                        <input
                          type="number"
                          value={s.weight}
                          onChange={(e) => handleUpdateSet(s.id, 'weight', e.target.value)}
                          className={`w-full text-center rounded-lg py-1 font-bold ${
                            isDark ? 'bg-zinc-800 text-white' : 'bg-white border text-zinc-900'
                          }`}
                        />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveSet(s.id)}
                          className="text-zinc-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* SECCIÓN 2: Series Efectivas (Screenshot 3) */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Series efectivas
              </span>
              <span className="text-[10px] font-mono text-amber-400 flex items-center gap-0.5">
                ↗ Objetivo de sobrecarga
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="grid grid-cols-12 text-[10px] font-semibold text-zinc-500 px-3 text-center uppercase tracking-wider">
                <span className="col-span-2 text-left">SERIE</span>
                <span className="col-span-4">REPETICIONES</span>
                <span className="col-span-4">TOTAL KG</span>
                <span className="col-span-2 text-right">LISTO</span>
              </div>

              {workingSets.map((s, idx) => (
                <div 
                  key={s.id} 
                  className={`grid grid-cols-12 items-center px-3 py-2 rounded-2xl border transition-all text-xs ${
                    s.completed 
                      ? 'bg-emerald-950/20 border-emerald-500/30' 
                      : isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <span className="col-span-2 font-mono font-bold text-zinc-400">#{idx + 1}</span>
                  <div className="col-span-4 px-1">
                    <input
                      type="number"
                      value={s.reps}
                      onChange={(e) => handleUpdateSet(s.id, 'reps', e.target.value)}
                      className={`w-full text-center rounded-xl py-1.5 font-bold ${
                        isDark ? 'bg-zinc-800 text-white' : 'bg-white border text-zinc-900'
                      }`}
                    />
                  </div>
                  <div className="col-span-4 px-1">
                    <input
                      type="number"
                      step="any"
                      value={s.weight}
                      onChange={(e) => handleUpdateSet(s.id, 'weight', e.target.value)}
                      className={`w-full text-center rounded-xl py-1.5 font-bold ${
                        isDark ? 'bg-zinc-800 text-white' : 'bg-white border text-zinc-900'
                      }`}
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleSet(s.id)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        s.completed 
                          ? 'shadow-md scale-105' 
                          : isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-zinc-500'
                      }`}
                      style={s.completed ? { backgroundColor: accent.hex, color: accent.contrastText === 'text-white' ? '#fff' : '#000' } : undefined}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Botón Añadir Serie */}
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

          {/* SECCIÓN 3: Notas */}
          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
            <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1 mb-1">
              <FileText className="w-3.5 h-3.5" /> Notas del ejercicio
            </span>
            <input
              type="text"
              value={exercise.notes}
              onChange={(e) => onUpdateExercise({ ...exercise, notes: e.target.value })}
              placeholder="No se han añadido notas..."
              className="w-full bg-transparent text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none"
            />
          </div>

          {/* SECCIÓN 4: Historial previo de la última sesión (Screenshot 3) */}
          <div className={`p-3.5 rounded-2xl border space-y-2 ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                <Calendar className="w-3.5 h-3.5" style={{ color: accent.hex }} />
                <span>Última Sesión Registrada</span>
              </div>
              <span className="text-[10px] font-mono text-lime-400 font-bold">
                Esfuerzo: 1-2 RIR
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-zinc-400 pt-1">
              <div>Serie 1: <strong className="text-white">30 kg × 12 reps</strong></div>
              <div>Serie 2: <strong className="text-white">30 kg × 11 reps</strong></div>
              <div>Serie 3: <strong className="text-white">35 kg × 6 reps</strong></div>
              <div>Serie 4: <strong className="text-white">35 kg × 7 reps</strong></div>
            </div>
          </div>
        </div>

        {/* Footer flotante con botón Comenzar Entrenamiento / Guardar */}
        <div className={`p-4 border-t ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'}`}>
          <button
            type="button"
            onClick={() => {
              onStartOrSave();
              onClose();
            }}
            style={{ backgroundColor: accent.hex }}
            className={`w-full py-3.5 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all ${accent.contrastText}`}
          >
            Guardar y Continuar Sesión
          </button>
        </div>

      </div>
    </div>
  );
};
