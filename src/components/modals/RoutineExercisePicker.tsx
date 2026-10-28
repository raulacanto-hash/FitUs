import React, { useMemo, useState } from 'react';
import { Dumbbell, Search, Plus, X } from 'lucide-react';
import { ExerciseDefinition, MuscleFilter } from '../../types/workout';
import { MUSCLE_GROUPS } from '../../data/exerciseDatabase';
import { useTheme } from '../../context/ThemeContext';

interface RoutineExercisePickerProps {
  isOpen: boolean;
  exerciseList: ExerciseDefinition[];
  onClose: () => void;
  onSelect: (exercise: ExerciseDefinition) => void;
}

export const RoutineExercisePicker: React.FC<RoutineExercisePickerProps> = ({
  isOpen,
  exerciseList,
  onClose,
  onSelect
}) => {
  const { accent, isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MuscleFilter>('Todos');

  const filteredExercises = useMemo(() => {
    return exerciseList.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Todos' || exercise.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [exerciseList, searchTerm, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-3 animate-in fade-in duration-200">
      <div
        className={`border rounded-3xl w-full max-w-lg h-[85vh] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        <div
          className={`p-4 border-b flex justify-between items-center flex-shrink-0 ${
            isDark ? 'border-zinc-800' : 'border-zinc-200'
          }`}
        >
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Dumbbell className="w-4 h-4" style={{ color: accent.hex }} />
            Catálogo de Ejercicios
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Cerrar catálogo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 flex flex-col overflow-hidden p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar ejercicio (ej. Press banca, Sentadilla)..."
              className={`w-full rounded-xl py-2.5 pl-9 pr-3 text-xs border focus:outline-none ${
                isDark
                  ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
              }`}
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {MUSCLE_GROUPS.map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setSelectedCategory(group)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-colors ${
                  selectedCategory === group
                    ? 'border-transparent'
                    : isDark
                      ? 'bg-zinc-800 text-zinc-400 border-zinc-700/60 hover:text-white'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:text-zinc-900'
                }`}
                style={
                  selectedCategory === group
                    ? { backgroundColor: accent.hex, color: accent.contrastText === 'text-white' ? '#fff' : '#000' }
                    : undefined
                }
              >
                {group}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filteredExercises.length === 0 ? (
              <div className="text-center py-10 text-xs text-zinc-400">
                No se encontraron ejercicios con ese criterio.
              </div>
            ) : (
              filteredExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  type="button"
                  onClick={() => {
                    onSelect(exercise);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl border transition-all flex justify-between items-center text-left group ${
                    isDark
                      ? 'bg-zinc-950/60 hover:bg-zinc-800/80 border-zinc-800/80 hover:border-zinc-700'
                      : 'bg-zinc-50 hover:bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-bold text-xs group-hover:opacity-80 transition-colors break-words">
                      {exercise.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: accent.hex }}
                      >
                        {exercise.category}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono truncate">
                        • {exercise.equipment || 'General'}
                      </span>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white flex-shrink-0 ml-2" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
