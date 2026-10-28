import React, { useState, useMemo } from 'react';
import { Dumbbell, X, Search, Sparkles, ChevronLeft, Plus, ArrowLeftRight } from 'lucide-react';
import { ExerciseDefinition, MuscleFilter, MuscleCategory } from '../../types/workout';
import { MUSCLE_GROUPS } from '../../data/exerciseDatabase';
import { useTheme } from '../../context/ThemeContext';

interface ExerciseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseList: ExerciseDefinition[];
  onSelectExercise: (exercise: ExerciseDefinition) => void;
  onCreateCustomExercise: (name: string, category: MuscleCategory) => ExerciseDefinition;
  isReplaceMode?: boolean;
}

export const ExerciseSelectorModal: React.FC<ExerciseSelectorModalProps> = ({
  isOpen,
  onClose,
  exerciseList,
  onSelectExercise,
  onCreateCustomExercise,
  isReplaceMode = false
}) => {
  const { accent, isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MuscleFilter>('Todos');
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [newCustomName, setNewCustomName] = useState('');
  const [newCustomCategory, setNewCustomCategory] = useState<MuscleCategory>('Pecho');

  const filteredExercises = useMemo(() => {
    return exerciseList.filter((ex) => {
      const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || ex.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [exerciseList, searchTerm, selectedCategory]);

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomName.trim()) return;
    const created = onCreateCustomExercise(newCustomName.trim(), newCustomCategory);
    setNewCustomName('');
    setIsCreatingCustom(false);
    if (created) {
      onSelectExercise(created);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className={`border rounded-3xl max-w-lg w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden ${
        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
      }`}>
        
        {/* Header del Modal */}
        <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <h3 className="font-bold text-sm flex items-center gap-2">
            {isReplaceMode ? (
              <ArrowLeftRight className="w-4 h-4" style={{ color: accent.hex }} />
            ) : (
              <Dumbbell className="w-4 h-4" style={{ color: accent.hex }} />
            )}
            {isReplaceMode ? 'Cambiar ejercicio' : 'Catálogo de Ejercicios'}
          </h3>
          <button 
            type="button"
            onClick={() => {
              onClose();
              setIsCreatingCustom(false);
            }}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explorador de Ejercicios */}
        {!isCreatingCustom ? (
          <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-3">
            
            {/* Buscador */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar ejercicio (ej. Press banca, Sentadilla)..."
                className={`w-full rounded-2xl pl-9 pr-3 py-2 text-xs border focus:outline-none transition-colors ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                }`}
                style={{ borderColor: searchTerm ? accent.hex : undefined }}
                autoFocus
              />
            </div>

            {/* Filtro horizontal de grupos musculares */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {MUSCLE_GROUPS.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setSelectedCategory(group)}
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all font-bold ${
                    selectedCategory === group
                      ? 'shadow-md'
                      : isDark ? 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-zinc-700/40' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                  }`}
                  style={selectedCategory === group ? { backgroundColor: accent.hex, color: accent.contrastText === 'text-white' ? '#fff' : '#000' } : undefined}
                >
                  {group}
                </button>
              ))}
            </div>

            {/* Lista de Resultados */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredExercises.length === 0 ? (
                <div className="text-center py-10 text-xs text-zinc-400">
                  No se encontraron ejercicios con ese criterio.
                </div>
              ) : (
                filteredExercises.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => {
                      onSelectExercise(ex);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-2xl border transition-all flex justify-between items-center text-left group ${
                      isDark 
                        ? 'bg-zinc-950/60 hover:bg-zinc-800/80 border-zinc-800/80 hover:border-zinc-700' 
                        : 'bg-zinc-50 hover:bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs group-hover:opacity-80 transition-colors">
                        {ex.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: accent.hex }}>
                          {ex.category}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          • {ex.equipment || 'General'}
                        </span>
                      </div>
                    </div>
                    {isReplaceMode ? (
                      <ArrowLeftRight className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Botón para crear personalizado */}
            <button
              type="button"
              onClick={() => setIsCreatingCustom(true)}
              className={`w-full font-bold py-2.5 rounded-xl text-xs border flex items-center justify-center gap-1.5 transition-colors active:scale-95 ${
                isDark 
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700/60' 
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: accent.hex }} />
              {isReplaceMode ? 'Crear y usar ejercicio personalizado' : 'Crear Ejercicio Personalizado'}
            </button>
          </div>
        ) : (
          /* Vista para crear un ejercicio propio */
          <form onSubmit={handleCreateSubmit} className="flex-1 p-4 space-y-4">
            <button 
              type="button"
              onClick={() => setIsCreatingCustom(false)}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Volver al catálogo
            </button>

            <h4 className="font-bold text-sm">Nuevo Ejercicio Personalizado</h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Nombre del Ejercicio</label>
                <input
                  type="text"
                  value={newCustomName}
                  onChange={(e) => setNewCustomName(e.target.value)}
                  placeholder="Ej. Sentadilla Sissy con mancuerna"
                  className={`w-full rounded-xl p-2.5 text-xs border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Grupo Muscular Principal</label>
                <select
                  value={newCustomCategory}
                  onChange={(e) => setNewCustomCategory(e.target.value as MuscleCategory)}
                  className={`w-full rounded-xl p-2.5 text-xs border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                >
                  {MUSCLE_GROUPS.filter(g => g !== 'Todos').map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={{ backgroundColor: accent.hex }}
              className={`w-full font-black py-2.5 rounded-xl text-xs transition-colors active:scale-95 ${accent.contrastText}`}
            >
              Guardar y Seleccionar
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
