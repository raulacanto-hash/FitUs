import React, { useState, useMemo } from 'react';
import { Dumbbell, X, Search, Sparkles, ChevronLeft, Plus } from 'lucide-react';
import { ExerciseDefinition, MuscleFilter, MuscleCategory } from '../../types/workout';
import { MUSCLE_GROUPS } from '../../data/exerciseDatabase';

interface ExerciseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseList: ExerciseDefinition[];
  onSelectExercise: (exercise: ExerciseDefinition) => void;
  onCreateCustomExercise: (name: string, category: MuscleCategory) => void;
}

export const ExerciseSelectorModal: React.FC<ExerciseSelectorModalProps> = ({
  isOpen,
  onClose,
  exerciseList,
  onSelectExercise,
  onCreateCustomExercise
}) => {
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
    onCreateCustomExercise(newCustomName.trim(), newCustomCategory);
    setNewCustomName('');
    setIsCreatingCustom(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header del Modal */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-emerald-400" />
            Catálogo de Ejercicios
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
                placeholder="Buscar ejercicio (ej. Press de banca)..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
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
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all font-medium ${
                    selectedCategory === group
                      ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/10'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-zinc-700/40'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>

            {/* Lista de Resultados */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredExercises.length === 0 ? (
                <div className="text-center py-10 text-xs text-zinc-500">
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
                    className="w-full bg-zinc-950/60 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-emerald-500/40 rounded-2xl p-3 flex justify-between items-center transition-all text-left group"
                  >
                    <div>
                      <p className="font-semibold text-xs text-zinc-100 group-hover:text-emerald-400 transition-colors">
                        {ex.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                          {ex.category}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          • {ex.equipment || 'General'}
                        </span>
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                  </button>
                ))
              )}
            </div>

            {/* Botón para crear personalizado */}
            <button
              type="button"
              onClick={() => setIsCreatingCustom(true)}
              className="w-full bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200 text-xs font-semibold py-2.5 rounded-xl border border-zinc-700/60 flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Crear Ejercicio Personalizado
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

            <h4 className="font-bold text-sm text-white">Nuevo Ejercicio Personalizado</h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Nombre del Ejercicio</label>
                <input
                  type="text"
                  value={newCustomName}
                  onChange={(e) => setNewCustomName(e.target.value)}
                  placeholder="Ej. Sentadilla Sissy con mancuerna"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Grupo Muscular Principal</label>
                <select
                  value={newCustomCategory}
                  onChange={(e) => setNewCustomCategory(e.target.value as MuscleCategory)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {MUSCLE_GROUPS.filter(g => g !== 'Todos').map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-2.5 rounded-xl text-xs transition-colors active:scale-95"
            >
              Guardar y Seleccionar
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
