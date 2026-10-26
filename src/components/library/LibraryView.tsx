import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Plus, MoreVertical, LayoutGrid, Dumbbell } from 'lucide-react';
import { RoutineTemplate, ExerciseDefinition } from '../../types/workout';
import { useTheme } from '../../context/ThemeContext';

interface LibraryViewProps {
  routines: RoutineTemplate[];
  exerciseList: ExerciseDefinition[];
  onSelectRoutine: (routine: RoutineTemplate) => void;
  onOpenCreateRoutine: () => void;
  onOpenExerciseModal: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  routines,
  exerciseList,
  onSelectRoutine,
  onOpenCreateRoutine,
  onOpenExerciseModal
}) => {
  const { accent, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [libraryFilter, setLibraryFilter] = useState<'all' | 'routines' | 'exercises'>('routines');

  const filteredRoutines = useMemo(() => {
    return routines.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [routines, searchQuery]);

  const filteredExercises = useMemo(() => {
    return exerciseList.filter(e =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [exerciseList, searchQuery]);

  return (
    <div className={`space-y-4 animate-in fade-in duration-200 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      {/* Header Biblioteca (Screenshot 2) */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-xl font-black tracking-tight">Biblioteca</h1>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            className={`p-2 rounded-xl border transition-colors ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600 shadow-sm'
            }`}
          >
            <Sparkles className="w-4 h-4" style={{ color: accent.hex }} />
          </button>
          <button 
            type="button"
            onClick={onOpenCreateRoutine}
            className={`p-2 rounded-xl border transition-colors ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700 shadow-sm'
            }`}
            title="Crear nueva rutina"
          >
            <Plus className="w-4 h-4" style={{ color: accent.hex }} />
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className={`w-4 h-4 absolute left-3.5 top-3.5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Busca en tu biblioteca..."
          className={`w-full rounded-2xl pl-10 pr-4 py-3 text-xs focus:outline-none transition-all ${
            isDark 
              ? 'bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500' 
              : 'bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 shadow-sm'
          }`}
          style={{ borderColor: searchQuery ? accent.hex : undefined }}
        />
      </div>

      {/* Filtros Chips (Screenshot 2: Ejercicios / Rutinas / Entrenamientos) */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setLibraryFilter('routines')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            libraryFilter === 'routines'
              ? 'text-zinc-950 font-black shadow-md'
              : isDark ? 'bg-zinc-900 text-zinc-400 border border-zinc-800' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
          }`}
          style={libraryFilter === 'routines' ? { backgroundColor: accent.hex } : undefined}
        >
          Rutinas
        </button>

        <button
          type="button"
          onClick={() => setLibraryFilter('exercises')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            libraryFilter === 'exercises'
              ? 'text-zinc-950 font-black shadow-md'
              : isDark ? 'bg-zinc-900 text-zinc-400 border border-zinc-800' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
          }`}
          style={libraryFilter === 'exercises' ? { backgroundColor: accent.hex } : undefined}
        >
          Ejercicios ({exerciseList.length})
        </button>
      </div>

      {/* Subsección: Recientes / Orden */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-400">Recientes</span>
        <span className="text-[11px] text-zinc-500 font-mono">Por defecto</span>
      </div>

      {/* Listado de Rutinas de la Biblioteca (Screenshot 2) */}
      {libraryFilter === 'routines' && (
        <div className="space-y-2">
          {filteredRoutines.map((routine) => (
            <div
              key={routine.id}
              onClick={() => onSelectRoutine(routine)}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
                isDark 
                  ? 'bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700' 
                  : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Icono de collage/grid estilo screenshot */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${accent.hex}18` }}
                >
                  <LayoutGrid className="w-5 h-5" style={{ color: accent.hex }} />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white group-hover:text-lime-300 transition-colors">
                      {routine.name}
                    </h3>
                    {routine.isActiveRoutine && (
                      <span 
                        className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md"
                        style={{ backgroundColor: accent.hex, color: accent.contrastText === 'text-white' ? '#fff' : '#000' }}
                      >
                        Activo
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Entrenamiento · {routine.exercises.length} ejercicios
                    {routine.daysPerWeek && ` · ${routine.daysPerWeek} d/sem`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRoutine(routine);
                }}
                className={`p-1.5 rounded-lg ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Listado de Ejercicios */}
      {libraryFilter === 'exercises' && (
        <div className="space-y-1.5">
          {filteredExercises.slice(0, 40).map((ex) => (
            <div
              key={ex.id}
              onClick={onOpenExerciseModal}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                isDark 
                  ? 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800' 
                  : 'bg-white border-zinc-200 hover:bg-zinc-50 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Dumbbell className="w-4 h-4" style={{ color: accent.hex }} />
                <div>
                  <h4 className="text-xs font-bold">{ex.name}</h4>
                  <span className="text-[10px] uppercase font-semibold text-zinc-400">
                    {ex.category} • {ex.equipment || 'General'}
                  </span>
                </div>
              </div>
              <MoreVertical className="w-4 h-4 text-zinc-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
