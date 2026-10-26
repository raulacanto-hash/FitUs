import React from 'react';
import { Play, Clock, Dumbbell, Layers, ChevronRight, Sparkles } from 'lucide-react';
import { RoutineTemplate } from '../../types/workout';
import { useTheme } from '../../context/ThemeContext';

interface RoutineHeroCardProps {
  routine: RoutineTemplate;
  onStartRoutine: (routine: RoutineTemplate) => void;
  onViewDetails?: (routine: RoutineTemplate) => void;
}

export const RoutineHeroCard: React.FC<RoutineHeroCardProps> = ({
  routine,
  onStartRoutine,
  onViewDetails
}) => {
  const { accent, isDark } = useTheme();
  const totalSets = routine.exercises.reduce((acc, ex) => acc + ex.targetSets, 0);

  return (
    <div 
      className={`relative overflow-hidden rounded-3xl border p-5 shadow-2xl backdrop-blur-xl transition-all cursor-pointer ${
        isDark 
          ? 'border-zinc-800 bg-gradient-to-b from-zinc-900/90 via-zinc-900/70 to-zinc-950' 
          : 'border-zinc-200 bg-gradient-to-b from-white via-zinc-50 to-zinc-100'
      }`}
      onClick={() => onViewDetails ? onViewDetails(routine) : onStartRoutine(routine)}
    >
      {/* Luz ambiental sutil en el fondo */}
      <div 
        className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: accent.hex }}
      />

      {/* Badges superiores estilo screenshot */}
      <div className="flex items-center justify-between mb-4">
        <span 
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase shadow-md ${accent.contrastText}`}
          style={{ backgroundColor: accent.hex }}
        >
          <Sparkles className="w-3 h-3 fill-current" />
          Próximo Entrenamiento
        </span>

        {routine.recoveryScore && (
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${
            isDark ? 'bg-zinc-800/80 border-zinc-700/50 text-zinc-300' : 'bg-white border-zinc-300 text-zinc-700'
          }`}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent.hex }} />
            <span className="font-bold">{routine.recoveryScore}%</span>
            <span className="text-zinc-500">Recuperado</span>
            <ChevronRight className="w-3 h-3 text-zinc-400" />
          </div>
        )}
      </div>

      {/* Categoría y Título de la rutina */}
      <div className="space-y-1.5 mb-4">
        <span className="text-[11px] uppercase tracking-widest font-black block" style={{ color: accent.hex }}>
          {routine.category}
        </span>
        <h2 className="text-xl font-extrabold tracking-tight leading-snug">
          {routine.name}
        </h2>
        <p className={`text-xs line-clamp-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          {routine.subtitle}
        </p>
      </div>

      {/* Pills de métricas resumen */}
      <div className={`flex items-center gap-2 text-xs rounded-2xl p-2.5 mb-5 font-mono border ${
        isDark ? 'bg-zinc-950/60 border-zinc-800/80 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700'
      }`}>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" style={{ color: accent.hex }} />
          <span>{routine.estimatedMinutes} mins</span>
        </div>
        <span className="text-zinc-500">•</span>
        <div className="flex items-center gap-1">
          <Dumbbell className="w-3.5 h-3.5" style={{ color: accent.hex }} />
          <span>{routine.exercises.length} ejercicios</span>
        </div>
        <span className="text-zinc-500">•</span>
        <div className="flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" style={{ color: accent.hex }} />
          <span>{totalSets} series</span>
        </div>
      </div>

      {/* Botón de Iniciar */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onStartRoutine(routine);
        }}
        style={{ backgroundColor: accent.hex }}
        className={`w-full py-3.5 px-4 rounded-2xl text-xs uppercase font-black tracking-wider flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all ${accent.contrastText}`}
      >
        <Play className="w-4 h-4 fill-current" />
        Iniciar Entrenamiento Ahora
      </button>
    </div>
  );
};
