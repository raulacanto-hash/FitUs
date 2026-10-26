import React from 'react';
import { Plus, Dumbbell, Play, Trash2, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { RoutineTemplate, UserProfile, WorkoutSession } from '../../types/workout';
import { RoutineHeroCard } from './RoutineHeroCard';
import { RecentWorkoutsSection } from '../history/RecentWorkoutsSection';
import { useTheme } from '../../context/ThemeContext';

interface RoutinesHubProps {
  profile: UserProfile;
  completedThisWeek: number;
  routines: RoutineTemplate[];
  recentWorkouts: WorkoutSession[];
  onViewAllHistory: () => void;
  onStartRoutine: (routine: RoutineTemplate) => void;
  onViewRoutineDetails: (routine: RoutineTemplate) => void;
  onStartFreeWorkout: () => void;
  onOpenCreateRoutine: () => void;
  onDeleteRoutine: (id: string) => void;
}

export const RoutinesHub: React.FC<RoutinesHubProps> = ({
  profile,
  completedThisWeek,
  routines,
  recentWorkouts,
  onViewAllHistory,
  onStartRoutine,
  onViewRoutineDetails,
  onStartFreeWorkout,
  onOpenCreateRoutine,
  onDeleteRoutine
}) => {
  const { accent, isDark } = useTheme();
  const weeklyGoal = profile.weeklyGoal || 3;
  const featuredRoutine = routines[0];

  return (
    <div className={`space-y-5 animate-in fade-in duration-200 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      {/* Header superior estilo Screenshot */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-purple-600/30">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <button type="button" className="flex items-center gap-1 font-bold text-sm hover:opacity-80">
            {profile.name}
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>

        <button 
          type="button" 
          className={`p-2 rounded-xl border transition-colors ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600 shadow-sm'
          }`}
          title="Filtros y preferencias"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Sección "Esta Semana" con barra de progreso segmentada */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight">Esta Semana</h2>
          <span className="text-xs text-zinc-400 font-mono">
            {completedThisWeek} de {weeklyGoal} completados
          </span>
        </div>

        {/* Barras de progreso segmentadas */}
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: weeklyGoal }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx < completedThisWeek ? 'shadow-sm' : isDark ? 'bg-zinc-800' : 'bg-zinc-200'
              }`}
              style={idx < completedThisWeek ? { backgroundColor: accent.hex } : undefined}
            />
          ))}
        </div>
      </div>

      {/* Tarjeta Hero del Próximo Entrenamiento */}
      {featuredRoutine && (
        <RoutineHeroCard
          routine={featuredRoutine}
          onStartRoutine={onStartRoutine}
          onViewDetails={onViewRoutineDetails}
        />
      )}

      {/* Catálogo de Rutinas Disponibles */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Dumbbell className="w-4 h-4" style={{ color: accent.hex }} />
            Explorar Rutinas & Plantillas
          </h3>
          <button
            type="button"
            onClick={onOpenCreateRoutine}
            className="text-xs font-semibold flex items-center gap-1 transition-colors"
            style={{ color: accent.hex }}
          >
            <Plus className="w-3.5 h-3.5" /> Nueva Rutina
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {routines.slice(1).map((routine) => {
            const totalSets = routine.exercises.reduce((acc, ex) => acc + ex.targetSets, 0);

            return (
              <div
                key={routine.id}
                onClick={() => onViewRoutineDetails(routine)}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
                  isDark 
                    ? 'bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700' 
                    : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                }`}
              >
                <div className="space-y-1 flex-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent.hex }}>
                      {routine.category}
                    </span>
                    {routine.isCustom && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${
                        isDark ? 'bg-zinc-800 text-zinc-400 border-zinc-700/60' : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                      }`}>
                        Propia
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs leading-tight">
                    {routine.name}
                  </h4>
                  <p className={`text-[11px] line-clamp-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {routine.subtitle}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    {routine.estimatedMinutes} min • {routine.exercises.length} ejercicios • {totalSets} series
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {routine.isCustom && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRoutine(routine.id);
                      }}
                      className={`p-2 rounded-xl transition-colors ${
                        isDark ? 'text-zinc-500 hover:text-red-400 hover:bg-zinc-800' : 'text-zinc-400 hover:text-red-600 hover:bg-zinc-100'
                      }`}
                      title="Eliminar plantilla"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartRoutine(routine);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95 ${
                      isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900'
                    }`}
                    title="Iniciar entrenamiento con esta rutina"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" style={{ color: accent.hex }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botón para iniciar sesión rápida libre */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onStartFreeWorkout}
          className={`w-full py-3 border border-dashed rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            isDark 
              ? 'bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800 text-zinc-400 hover:text-zinc-200' 
              : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-300 text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Plus className="w-4 h-4" style={{ color: accent.hex }} /> Iniciar Sesión Libre (Sin Plantilla)
        </button>
      </div>

      {/* Últimos entrenamientos registrados */}
      <RecentWorkoutsSection
        history={recentWorkouts}
        onViewAll={onViewAllHistory}
        limit={3}
      />
    </div>
  );
};
