import React, { useState } from 'react';
import { Plus, Dumbbell, Play, Trash2, SlidersHorizontal, ChevronDown, BarChart2 } from 'lucide-react';
import { RoutineTemplate, UserProfile, WorkoutSession } from '../../types/workout';
import { RoutineHeroCard } from './RoutineHeroCard';
import { RecentWorkoutsSection } from '../history/RecentWorkoutsSection';
import { useTheme } from '../../context/ThemeContext';

interface RoutinesHubProps {
  profile: UserProfile;
  completedThisWeek: number;
  routines: RoutineTemplate[];
  recentWorkouts: WorkoutSession[];
  activeRoutineId?: string;
  onViewAllHistory: () => void;
  onStartRoutine: (routine: RoutineTemplate) => void;
  onViewRoutineDetails: (routine: RoutineTemplate) => void;
  onStartFreeWorkout: () => void;
  onOpenCreateRoutine: () => void;
  onDeleteRoutine: (id: string) => void;
  onOpenProfile: () => void;
  onOpenWorkoutSettings: () => void;
}

export const RoutinesHub: React.FC<RoutinesHubProps> = ({
  profile,
  completedThisWeek,
  routines,
  recentWorkouts,
  activeRoutineId,
  onViewAllHistory,
  onStartRoutine,
  onViewRoutineDetails,
  onStartFreeWorkout,
  onOpenCreateRoutine,
  onDeleteRoutine,
  onOpenProfile,
  onOpenWorkoutSettings
}) => {
  const { accent, isDark } = useTheme();
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(null);
  const weeklyGoal = profile.weeklyGoal || 3;
  const featuredRoutine = routines.find((routine) => routine.id === activeRoutineId) ?? routines[0];
  const profileInitial = profile.name.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className={`space-y-5 animate-in fade-in duration-200 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      {/* Header superior estilo Screenshot */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-purple-600/30 flex-shrink-0">
            {profileInitial}
          </div>
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-1 font-bold text-sm hover:opacity-80 min-w-0"
          >
            <span className="truncate max-w-[170px]">{profile.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
          </button>
        </div>

        <button 
          type="button" 
          onClick={onOpenWorkoutSettings}
          className={`p-2 rounded-xl border transition-colors ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600 shadow-sm'
          }`}
          title="Ajustes del entrenamiento"
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
            const isExpanded = expandedRoutineId === routine.id;

            return (
              <div
                key={routine.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isDark 
                    ? 'bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700' 
                    : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                }`}
              >
                <div
                  onClick={() => onViewRoutineDetails(routine)}
                  className="p-4 flex items-center justify-between cursor-pointer group"
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

                    {/* Menú resumen de los ejercicios de la rutina */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedRoutineId(isExpanded ? null : routine.id);
                      }}
                      aria-expanded={isExpanded}
                      className="text-[10px] font-bold flex items-center gap-1 pt-1 transition-opacity hover:opacity-80"
                      style={{ color: accent.hex }}
                    >
                      <BarChart2 className="w-3 h-3" />
                      {isExpanded ? 'Ocultar ejercicios' : `Ver ejercicios (${routine.exercises.length})`}
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
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

                {isExpanded && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`px-4 pb-3 pt-2 space-y-1.5 border-t ${
                      isDark ? 'border-zinc-800/80 bg-zinc-950/40' : 'border-zinc-200 bg-zinc-50/70'
                    }`}
                  >
                    {routine.exercises.length === 0 ? (
                      <p className="text-[10px] italic text-zinc-500 py-1">Esta rutina aún no tiene ejercicios.</p>
                    ) : (
                      routine.exercises.map((ex, idx) => {
                        const repsText = ex.repsRange || `${ex.defaultReps} reps`;
                        const weightText = ex.weightRange || `${ex.defaultWeight} kg`;
                        return (
                          <div
                            key={`${ex.name}-${idx}`}
                            className={`rounded-xl px-2.5 py-1.5 border ${
                              isDark ? 'bg-zinc-900/70 border-zinc-800/70' : 'bg-white border-zinc-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[9px] font-mono font-bold flex-shrink-0 ${
                                isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500'
                              }`}>
                                {idx + 1}
                              </span>
                              <span className="text-[11px] font-bold truncate flex-1">{ex.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 pl-6">
                              <BarChart2 className="w-2.5 h-2.5 flex-shrink-0" style={{ color: accent.hex }} />
                              <span className={`text-[10px] font-mono truncate ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                {ex.targetSets} series · {repsText} · {weightText}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <button
                      type="button"
                      onClick={() => onViewRoutineDetails(routine)}
                      className="w-full text-[10px] font-bold py-1.5 rounded-xl transition-colors"
                      style={{ color: accent.hex }}
                    >
                      Ver detalle y editar ejercicios
                    </button>
                  </div>
                )}
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
