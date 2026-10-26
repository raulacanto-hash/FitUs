import React, { useState } from 'react';
import { X, Plus, Trash2, Dumbbell } from 'lucide-react';
import { RoutineTemplate, RoutineExerciseTemplate, ExerciseDefinition } from '../../types/workout';
import { useTheme } from '../../context/ThemeContext';

interface CreateRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseList: ExerciseDefinition[];
  onSaveRoutine: (routine: Omit<RoutineTemplate, 'id'>) => void;
}

export const CreateRoutineModal: React.FC<CreateRoutineModalProps> = ({
  isOpen,
  onClose,
  exerciseList,
  onSaveRoutine
}) => {
  const { accent, isDark } = useTheme();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('TORSO');
  const [subtitle, setSubtitle] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [exercises, setExercises] = useState<RoutineExerciseTemplate[]>([]);
  const [selectedExId, setSelectedExId] = useState('');

  if (!isOpen) return null;

  const handleAddExercise = () => {
    if (!selectedExId) return;
    const def = exerciseList.find(e => e.id === selectedExId);
    if (!def) return;

    const newEx: RoutineExerciseTemplate = {
      name: def.name,
      category: def.category,
      targetSets: 4,
      defaultReps: 10,
      defaultWeight: 20
    };

    setExercises(prev => [...prev, newEx]);
    setSelectedExId('');
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateExField = (index: number, field: keyof RoutineExerciseTemplate, val: number) => {
    setExercises(prev => prev.map((ex, i) => i === index ? { ...ex, [field]: val } : ex));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor ingresa un nombre para la rutina.');
      return;
    }
    if (exercises.length === 0) {
      alert('Agrega al menos un ejercicio a la rutina.');
      return;
    }

    onSaveRoutine({
      name: name.trim(),
      category: category.toUpperCase().trim() || 'PERSONALIZADA',
      subtitle: subtitle.trim() || `${exercises.length} ejercicios planificados`,
      estimatedMinutes: Number(estimatedMinutes) || 60,
      recoveryScore: 100,
      heroGradient: 'from-lime-500/20 via-zinc-900 to-zinc-950',
      exercises
    });

    setName('');
    setCategory('TORSO');
    setSubtitle('');
    setExercises([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className={`border rounded-3xl max-w-lg w-full max-h-[88vh] flex flex-col shadow-2xl p-4 space-y-3 ${
        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
      }`}>
        {/* Header */}
        <div className={`flex justify-between items-center border-b pb-2.5 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Dumbbell className="w-4 h-4" style={{ color: accent.hex }} />
            Crear Nueva Plantilla de Rutina
          </h3>
          <button 
            type="button" 
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-3.5 pr-1">
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Nombre de la Rutina</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Espalda & Bíceps Hipertrofia"
                className={`w-full rounded-xl p-2.5 text-xs border focus:outline-none ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                }`}
                style={{ borderColor: name ? accent.hex : undefined }}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Categoría / Etiqueta</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ej. TRACCIÓN, PIERNA, TORSO"
                  className={`w-full rounded-xl p-2.5 text-xs border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Duración Estimada (mins)</label>
                <input
                  type="number"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className={`w-full rounded-xl p-2.5 text-xs border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Subtítulo / Músculos Clave</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ej. Jalón, Remo unilateral y trabajo de antebrazo"
                className={`w-full rounded-xl p-2.5 text-xs border focus:outline-none ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                }`}
              />
            </div>
          </div>

          {/* Selector para añadir ejercicios a la plantilla */}
          <div className="pt-2 border-t space-y-2" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
            <label className="text-xs font-bold block">Ejercicios en esta Rutina</label>

            <div className="flex gap-2">
              <select
                value={selectedExId}
                onChange={(e) => setSelectedExId(e.target.value)}
                className={`flex-1 rounded-xl p-2 text-xs border focus:outline-none ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                }`}
              >
                <option value="">-- Elige un ejercicio del catálogo --</option>
                {exerciseList.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.category})</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddExercise}
                style={{ backgroundColor: accent.hex }}
                className={`font-black px-3 rounded-xl text-xs flex items-center gap-1 active:scale-95 ${accent.contrastText}`}
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>

            {/* Lista de ejercicios agregados */}
            <div className="space-y-2 pt-1">
              {exercises.length === 0 ? (
                <p className={`text-xs italic text-center py-4 rounded-xl border border-dashed ${
                  isDark ? 'text-zinc-500 bg-zinc-950/40 border-zinc-800' : 'text-zinc-400 bg-zinc-50 border-zinc-200'
                }`}>
                  Aún no has agregado ejercicios a esta rutina
                </p>
              ) : (
                exercises.map((ex, idx) => (
                  <div key={idx} className={`p-2.5 rounded-2xl border space-y-2 ${
                    isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                  }`}>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold">{ex.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(idx)}
                        className="text-zinc-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-zinc-400">
                      <div>
                        <span>Series obj:</span>
                        <input
                          type="number"
                          value={ex.targetSets}
                          onChange={(e) => handleUpdateExField(idx, 'targetSets', Number(e.target.value))}
                          className={`w-full rounded p-1 text-center font-bold mt-0.5 border ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                          }`}
                        />
                      </div>
                      <div>
                        <span>Reps obj:</span>
                        <input
                          type="number"
                          value={ex.defaultReps}
                          onChange={(e) => handleUpdateExField(idx, 'defaultReps', Number(e.target.value))}
                          className={`w-full rounded p-1 text-center font-bold mt-0.5 border ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                          }`}
                        />
                      </div>
                      <div>
                        <span>Peso base (kg):</span>
                        <input
                          type="number"
                          step="any"
                          value={ex.defaultWeight}
                          onChange={(e) => handleUpdateExField(idx, 'defaultWeight', Number(e.target.value))}
                          className={`w-full rounded p-1 text-center font-bold mt-0.5 border ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Botones de acción */}
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
              type="submit"
              style={{ backgroundColor: accent.hex }}
              className={`flex-1 font-black py-2 rounded-xl text-xs transition-colors active:scale-95 ${accent.contrastText}`}
            >
              Guardar Plantilla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
