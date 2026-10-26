import React from 'react';
import { ArrowLeft, MoreVertical, Plus, Play, Dumbbell, ShieldCheck, Activity } from 'lucide-react';
import { RoutineTemplate } from '../../types/workout';
import { useTheme } from '../../context/ThemeContext';

interface RoutineDetailViewProps {
  routine: RoutineTemplate;
  onBack: () => void;
  onStartRoutine: (routine: RoutineTemplate) => void;
  onAddExerciseClick: () => void;
}

export const RoutineDetailView: React.FC<RoutineDetailViewProps> = ({
  routine,
  onBack,
  onStartRoutine,
  onAddExerciseClick
}) => {
  const { accent, isDark } = useTheme();

  return (
    <div className={`space-y-4 pb-20 animate-in fade-in duration-200 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      {/* Barra Superior con botón atrás y menú */}
      <div className="flex items-center justify-between pb-1">
        <button
          type="button"
          onClick={onBack}
          className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-200 text-zinc-700'}`}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: accent.hex }} />
        </button>

        <h1 className="text-base font-black tracking-tight text-center truncate max-w-[220px]">
          {routine.name}
        </h1>

        <button
          type="button"
          className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-200 text-zinc-600'}`}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Músculos a entrenar (Screenshot 1) */}
      <div className="space-y-2">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Músculos a entrenar
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {(routine.targetMuscles || [
            { muscle: 'Pectorales', percentage: 85 },
            { muscle: 'Bíceps', percentage: 100 },
            { muscle: 'Tríceps', percentage: 100 }
          ]).map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all ${
                isDark 
                  ? 'bg-zinc-900/80 border-zinc-800/80' 
                  : 'bg-white border-zinc-200 shadow-sm'
              }`}
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-1.5"
                style={{ backgroundColor: `${accent.hex}15` }}
              >
                <Activity className="w-5 h-5" style={{ color: accent.hex }} />
              </div>
              <span className="text-[11px] font-bold truncate max-w-full">{m.muscle}</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: accent.hex }}>
                {m.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Listado de Ejercicios de la Rutina (Screenshot 1) */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-1.5">
            <span>{routine.exercises.length} ejercicios</span>
          </h3>
          <button
            type="button"
            onClick={onAddExerciseClick}
            className={`p-1.5 rounded-xl border transition-colors ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300' 
                : 'bg-zinc-100 border-zinc-300 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            <Plus className="w-4 h-4" style={{ color: accent.hex }} />
          </button>
        </div>

        <div className="space-y-2.5">
          {routine.exercises.map((ex, idx) => {
            const score = ex.score || (idx === 0 ? 35 : idx === 1 ? 32 : idx === 3 ? 82 : 45);
            const rangeText = ex.repsRange 
              ? `${ex.targetSets} series · ${ex.repsRange} · ${ex.weightRange || `${ex.defaultWeight} kg`}`
              : `${ex.targetSets} series · ${ex.defaultReps} reps · ${ex.defaultWeight} kg`;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                  isDark 
                    ? 'bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700' 
                    : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                }`}
              >
                {/* Thumbnail con icono muscular */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-zinc-950 border border-zinc-800' : 'bg-zinc-100 border border-zinc-200'
                }`}>
                  <Dumbbell className="w-6 h-6" style={{ color: accent.hex }} />
                </div>

                {/* Info del Ejercicio */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {score && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        <ShieldCheck className="w-2.5 h-2.5" /> {score}
                      </span>
                    )}
                    <h4 className="text-xs font-bold truncate">{ex.name}</h4>
                  </div>
                  <p className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {rangeText}
                  </p>
                </div>

                <button
                  type="button"
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-zinc-800 text-zinc-500' : 'hover:bg-zinc-100 text-zinc-400'
                  }`}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botón Flotante Fijo Inferior estilo Screenshot 1 */}
      <div className={`fixed bottom-16 left-0 right-0 z-30 max-w-lg mx-auto p-4 backdrop-blur-lg ${
        isDark ? 'bg-zinc-950/80' : 'bg-white/80'
      }`}>
        <button
          type="button"
          onClick={() => onStartRoutine(routine)}
          style={{ backgroundColor: accent.hex }}
          className={`w-full py-4 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-all ${accent.contrastText}`}
        >
          <Play className="w-4 h-4 fill-current" />
          Comenzar Entrenamiento
        </button>
      </div>
    </div>
  );
};
