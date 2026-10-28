import React, { useEffect, useRef, useState } from 'react';
import { X, Plus, Trash2, Dumbbell, Search, ArrowLeftRight } from 'lucide-react';
import { RoutineTemplate, RoutineExerciseTemplate, ExerciseDefinition, MuscleCategory } from '../../types/workout';
import { useTheme } from '../../context/ThemeContext';
import { ExerciseSelectorModal } from './ExerciseSelectorModal';

interface CreateRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseList: ExerciseDefinition[];
  initialRoutine?: RoutineTemplate | null;
  onSaveRoutine: (routine: Omit<RoutineTemplate, 'id'> & { id?: string }) => void;
  onCreateCustomExercise: (name: string, category: MuscleCategory) => ExerciseDefinition;
}

export const CreateRoutineModal: React.FC<CreateRoutineModalProps> = ({
  isOpen,
  onClose,
  exerciseList,
  initialRoutine,
  onSaveRoutine,
  onCreateCustomExercise
}) => {
  const { accent, isDark } = useTheme();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('TORSO');
  const [subtitle, setSubtitle] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [exercises, setExercises] = useState<RoutineExerciseTemplate[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (initialRoutine) {
      setName(initialRoutine.name);
      setCategory(initialRoutine.category);
      setSubtitle(initialRoutine.subtitle);
      setEstimatedMinutes(initialRoutine.estimatedMinutes);
      setExercises(initialRoutine.exercises.map((exercise) => ({ ...exercise })));
    } else {
      setName('');
      setCategory('TORSO');
      setSubtitle('');
      setEstimatedMinutes(60);
      setExercises([]);
    }
    setIsPickerOpen(false);
    setReplaceIndex(null);
  }, [isOpen, initialRoutine]);

  if (!isOpen) return null;

  const handleAddExercise = (definition: ExerciseDefinition) => {
    const newExercise: RoutineExerciseTemplate = {
      name: definition.name,
      category: definition.category,
      targetSets: 4,
      defaultReps: 10,
      defaultWeight: 20
    };

    setExercises((prev) => [...prev, newExercise]);
    window.setTimeout(() => {
      formRef.current?.scrollTo({ top: formRef.current.scrollHeight, behavior: 'smooth' });
    }, 80);
  };

  const handlePickerSelect = (definition: ExerciseDefinition) => {
    if (replaceIndex !== null) {
      setExercises((prev) =>
        prev.map((exercise, index) =>
          index === replaceIndex
            ? { ...exercise, name: definition.name, category: definition.category }
            : exercise
        )
      );
      setReplaceIndex(null);
    } else {
      handleAddExercise(definition);
    }
    setIsPickerOpen(false);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, exerciseIndex) => exerciseIndex !== index));
  };

  const handleUpdateExField = (
    index: number,
    field: keyof RoutineExerciseTemplate,
    value: number
  ) => {
    setExercises((prev) =>
      prev.map((exercise, exerciseIndex) =>
        exerciseIndex === index ? { ...exercise, [field]: value } : exercise
      )
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      alert('Por favor ingresa un nombre para la rutina.');
      return;
    }
    if (exercises.length === 0) {
      alert('Agrega al menos un ejercicio a la rutina.');
      return;
    }

    onSaveRoutine({
      id: initialRoutine?.id,
      name: name.trim(),
      category: category.toUpperCase().trim() || 'PERSONALIZADA',
      subtitle: subtitle.trim() || `${exercises.length} ejercicios planificados`,
      estimatedMinutes: Number(estimatedMinutes) || 60,
      recoveryScore: initialRoutine?.recoveryScore ?? 100,
      heroGradient:
        initialRoutine?.heroGradient ?? 'from-lime-500/20 via-zinc-900 to-zinc-950',
      targetMuscles: initialRoutine?.targetMuscles,
      daysPerWeek: initialRoutine?.daysPerWeek,
      isActiveRoutine: initialRoutine?.isActiveRoutine,
      isCustom: initialRoutine?.isCustom ?? true,
      exercises
    });

    setName('');
    setCategory('TORSO');
    setSubtitle('');
    setEstimatedMinutes(60);
    setExercises([]);
    setIsPickerOpen(false);
    onClose();
  };

  const inputClass = `w-full min-w-0 rounded-xl p-2.5 text-xs border focus:outline-none ${
    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
  }`;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
        <div
          className={`border rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}
        >
          {/* Header */}
          <div
            className={`p-4 border-b flex justify-between items-center flex-shrink-0 ${
              isDark ? 'border-zinc-800' : 'border-zinc-200'
            }`}
          >
            <h3 className="font-bold text-sm flex items-center gap-2 min-w-0">
              <Dumbbell className="w-4 h-4 flex-shrink-0" style={{ color: accent.hex }} />
              <span className="truncate">
                {initialRoutine ? 'Editar Plantilla de Rutina' : 'Crear Nueva Plantilla de Rutina'}
              </span>
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 flex-shrink-0"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Formulario con scroll interno */}
          <form
            id="create-routine-form"
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-3.5"
          >
            <div className="space-y-2">
              <div className="min-w-0">
                <label className="text-[10px] text-zinc-400 block mb-1">Nombre de la Rutina</label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ej. Espalda & Bíceps Hipertrofia"
                  className={inputClass}
                  style={{ borderColor: name ? accent.hex : undefined }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="min-w-0">
                  <label className="text-[10px] text-zinc-400 block mb-1">Categoría / Etiqueta</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder="Ej. TRACCIÓN, PIERNA"
                    className={inputClass}
                  />
                </div>
                <div className="min-w-0">
                  <label className="text-[10px] text-zinc-400 block mb-1">Duración Estimada (mins)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={estimatedMinutes}
                    onChange={(event) => setEstimatedMinutes(Number(event.target.value))}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="min-w-0">
                <label className="text-[10px] text-zinc-400 block mb-1">Subtítulo / Músculos Clave</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(event) => setSubtitle(event.target.value)}
                  placeholder="Ej. Jalón, Remo unilateral y trabajo de antebrazo"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Ejercicios de la plantilla */}
            <div
              className="pt-2 border-t space-y-2"
              style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}
            >
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold block">Ejercicios en esta Rutina</label>
                <span className="text-[10px] font-mono text-zinc-500">
                  {exercises.length} {exercises.length === 1 ? 'ejercicio' : 'ejercicios'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setReplaceIndex(null);
                  setIsPickerOpen(true);
                }}
                className={`w-full min-w-0 rounded-xl p-2.5 text-xs border flex items-center justify-between gap-2 text-left transition-colors active:scale-[0.99] ${
                  isDark
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-300'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <Search className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">Añadir ejercicio del catálogo...</span>
                </span>
                <Plus className="w-4 h-4 flex-shrink-0" style={{ color: accent.hex }} />
              </button>

              {/* Lista de ejercicios agregados */}
              <div className="space-y-2 pt-1">
                {exercises.length === 0 ? (
                  <p
                    className={`text-xs italic text-center py-4 px-3 rounded-xl border border-dashed ${
                      isDark
                        ? 'text-zinc-500 bg-zinc-950/40 border-zinc-800'
                        : 'text-zinc-400 bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    Aún no has agregado ejercicios a esta rutina
                  </p>
                ) : (
                  exercises.map((exercise, index) => (
                    <div
                      key={`${exercise.name}-${index}`}
                      className={`p-2.5 rounded-2xl border space-y-2 min-w-0 ${
                        isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-2 text-xs min-w-0">
                        <span className="font-bold min-w-0 break-words">{exercise.name}</span>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setReplaceIndex(index);
                              setIsPickerOpen(true);
                            }}
                            className="text-zinc-400 hover:text-lime-400 p-1"
                            title="Cambiar ejercicio"
                            aria-label={`Cambiar ${exercise.name}`}
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(index)}
                            className="text-zinc-400 hover:text-red-500 p-1"
                            aria-label={`Eliminar ${exercise.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[10px] text-zinc-400">
                        <div className="min-w-0">
                          <span>Series</span>
                          <input
                            type="number"
                            inputMode="numeric"
                            value={exercise.targetSets}
                            onChange={(event) =>
                              handleUpdateExField(index, 'targetSets', Number(event.target.value))
                            }
                            className={`w-full min-w-0 rounded p-1 text-center font-bold mt-0.5 border ${
                              isDark
                                ? 'bg-zinc-800 border-zinc-700 text-white'
                                : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <span>Reps</span>
                          <input
                            type="number"
                            inputMode="numeric"
                            value={exercise.defaultReps}
                            onChange={(event) =>
                              handleUpdateExField(index, 'defaultReps', Number(event.target.value))
                            }
                            className={`w-full min-w-0 rounded p-1 text-center font-bold mt-0.5 border ${
                              isDark
                                ? 'bg-zinc-800 border-zinc-700 text-white'
                                : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <span>Peso (kg)</span>
                          <input
                            type="number"
                            step="any"
                            inputMode="decimal"
                            value={exercise.defaultWeight}
                            onChange={(event) =>
                              handleUpdateExField(index, 'defaultWeight', Number(event.target.value))
                            }
                            className={`w-full min-w-0 rounded p-1 text-center font-bold mt-0.5 border ${
                              isDark
                                ? 'bg-zinc-800 border-zinc-700 text-white'
                                : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </form>

          {/* Footer fijo */}
          <div
            className={`p-4 border-t flex gap-2 flex-shrink-0 ${
              isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                isDark
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="create-routine-form"
              style={{ backgroundColor: accent.hex }}
              className={`flex-1 font-black py-2.5 rounded-xl text-xs transition-colors active:scale-95 ${accent.contrastText}`}
            >
              {initialRoutine ? 'Guardar Cambios' : 'Guardar Plantilla'}
            </button>
          </div>
        </div>
      </div>

      <ExerciseSelectorModal
        isOpen={isPickerOpen}
        exerciseList={exerciseList}
        onSelectExercise={handlePickerSelect}
        onCreateCustomExercise={onCreateCustomExercise}
        onClose={() => {
          setIsPickerOpen(false);
          setReplaceIndex(null);
        }}
        isReplaceMode={replaceIndex !== null}
      />
    </>
  );
};
