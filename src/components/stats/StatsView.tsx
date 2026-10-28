import React, { useMemo, useState } from 'react';
import { BarChart2, Dumbbell, TrendingUp, Trophy } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { WorkoutSession } from '../../types/workout';
import { useTheme } from '../../context/ThemeContext';
import {
  formatVolume,
  getExercisePerformance,
  getWorkoutSummary,
  sortWorkoutsByDateDesc
} from '../../utils/workoutStats';
import { WorkoutBreakdownSection } from './WorkoutBreakdownSection';

interface StatsViewProps {
  history: WorkoutSession[];
}

export const StatsView: React.FC<StatsViewProps> = ({ history }) => {
  const { accent, isDark } = useTheme();

  const sortedHistory = useMemo(() => sortWorkoutsByDateDesc(history), [history]);

  // Solo ejercicios que realmente aparecen en el historial de entrenamientos
  const trainedExerciseNames = useMemo(() => {
    const names = new Set<string>();
    history.forEach((workout) => {
      workout.exercises?.forEach((exercise) => {
        if (exercise.name.trim()) names.add(exercise.name);
      });
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b, 'es'));
  }, [history]);

  // Ejercicio seleccionado para las gráficas; por defecto, el del último entrenamiento
  const [selectedStatExercise, setSelectedStatExercise] = useState<string>(() => {
    const latestWorkout = sortWorkoutsByDateDesc(history).find(
      (workout) => (workout.exercises?.length ?? 0) > 0
    );
    return latestWorkout?.exercises[0]?.name ?? '';
  });

  const activeExercise = trainedExerciseNames.includes(selectedStatExercise)
    ? selectedStatExercise
    : trainedExerciseNames[0] ?? '';

  const totals = useMemo(() => {
    return history.reduce(
      (acc, workout) => {
        const summary = getWorkoutSummary(workout);
        acc.volume += summary.totalVolume;
        acc.sets += summary.completedSets;
        return acc;
      },
      { volume: 0, sets: 0 }
    );
  }, [history]);

  const activeExerciseStats = useMemo(() => {
    let sessions = 0;
    let best = 0;
    let volume = 0;
    let sets = 0;

    sortedHistory.forEach((workout) => {
      const exercise = workout.exercises?.find((item) => item.name === activeExercise);
      if (!exercise) return;
      const performance = getExercisePerformance(exercise);
      sessions += 1;
      best = Math.max(best, performance.maxWeight);
      volume += performance.totalVolume;
      sets += performance.completedSets;
    });

    return { sessions, best, volume, sets };
  }, [sortedHistory, activeExercise]);

  const chartData = useMemo(() => {
    const chronological = [...sortedHistory].reverse();
    const weight: Array<{ date: string; fullDate: string; maxWeight: number }> = [];
    const volume: Array<{ date: string; fullDate: string; volumen: number }> = [];

    chronological.forEach((workout) => {
      const exercise = workout.exercises?.find((item) => item.name === activeExercise);
      if (!exercise) return;

      const performance = getExercisePerformance(exercise);
      const parts = workout.date.split('-');
      const shortDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : workout.date;

      if (performance.maxWeight > 0) {
        weight.push({ date: shortDate, fullDate: workout.date, maxWeight: performance.maxWeight });
      }
      if (performance.totalVolume > 0) {
        volume.push({ date: shortDate, fullDate: workout.date, volumen: performance.totalVolume });
      }
    });

    return { weight, volume };
  }, [sortedHistory, activeExercise]);

  const cardClass = isDark
    ? 'bg-zinc-900/80 border-zinc-800/80 backdrop-blur-md'
    : 'bg-white border-zinc-200 shadow-sm';

  const tooltipStyle = {
    backgroundColor: isDark ? '#18181b' : '#ffffff',
    borderColor: isDark ? '#27272a' : '#e4e4e7',
    borderRadius: '0.75rem',
    fontSize: '11px',
    color: isDark ? '#ffffff' : '#09090b',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  };

  if (history.length === 0) {
    return (
      <div className={`space-y-4 animate-in fade-in duration-200 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
        <h2 className="text-lg font-black flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5" style={{ color: accent.hex }} />
          Progresión y Métricas
        </h2>
        <div className={`text-center py-14 px-4 border border-dashed rounded-3xl ${
          isDark ? 'border-zinc-800/80 bg-zinc-900/30' : 'border-zinc-300 bg-white'
        }`}>
          <BarChart2 className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <p className="text-zinc-400 font-bold text-xs">Aún no hay entrenamientos registrados</p>
          <p className="text-[10px] text-zinc-500 mt-1">
            Completa una sesión para ver el desglose por ejercicio y tus gráficas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 animate-in fade-in duration-200 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      <h2 className="text-lg font-black flex items-center gap-2 mb-1">
        <TrendingUp className="w-5 h-5" style={{ color: accent.hex }} />
        Progresión y Métricas
      </h2>

      {/* Resumen general */}
      <div className="grid grid-cols-3 gap-2">
        <div className={`rounded-2xl border p-2.5 ${cardClass}`}>
          <Dumbbell className="w-3.5 h-3.5 mb-1" style={{ color: accent.hex }} />
          <p className="text-sm font-black leading-none">{history.length}</p>
          <p className="text-[9px] uppercase tracking-wider text-zinc-500 mt-1">Sesiones</p>
        </div>
        <div className={`rounded-2xl border p-2.5 ${cardClass}`}>
          <Trophy className="w-3.5 h-3.5 mb-1" style={{ color: accent.hex }} />
          <p className="text-sm font-black leading-none">{trainedExerciseNames.length}</p>
          <p className="text-[9px] uppercase tracking-wider text-zinc-500 mt-1">Ejercicios</p>
        </div>
        <div className={`rounded-2xl border p-2.5 ${cardClass}`}>
          <BarChart2 className="w-3.5 h-3.5 mb-1" style={{ color: accent.hex }} />
          <p className="text-sm font-black leading-none">{formatVolume(totals.volume)}</p>
          <p className="text-[9px] uppercase tracking-wider text-zinc-500 mt-1">Volumen</p>
        </div>
      </div>

      {/* Lista de entrenamientos con desglose por ejercicio */}
      <WorkoutBreakdownSection workouts={sortedHistory} />

      {/* Progreso del ejercicio seleccionado */}
      <section
        className={`rounded-3xl border p-4 space-y-3 ${cardClass}`}
        aria-labelledby="exercise-progress-title"
      >
        <div className="flex items-center justify-between">
          <h3 id="exercise-progress-title" className="text-sm font-bold flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: accent.hex }} />
            Progreso por Ejercicio
          </h3>
          <span className="text-[10px] font-mono text-zinc-500">
            {activeExerciseStats.sessions} {activeExerciseStats.sessions === 1 ? 'sesión' : 'sesiones'}
          </span>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="stat-exercise-select"
            className="text-[10px] font-bold uppercase tracking-wider block text-zinc-400"
          >
            Selecciona un ejercicio entrenado
          </label>
          <select
            id="stat-exercise-select"
            value={activeExercise}
            onChange={(e) => setSelectedStatExercise(e.target.value)}
            className={`w-full rounded-2xl p-2.5 text-xs font-bold focus:outline-none border transition-colors ${
              isDark ? 'bg-zinc-800/80 border-zinc-700/60 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
            }`}
            style={{ borderColor: accent.hex }}
          >
            {trainedExerciseNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <div className={`rounded-xl px-2 py-1.5 border text-center ${
            isDark ? 'bg-zinc-950/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <p className="text-[8px] uppercase tracking-wider text-zinc-500">Mejor carga</p>
            <p className="text-[11px] font-black mt-0.5" style={{ color: accent.hex }}>
              {activeExerciseStats.best || 0} kg
            </p>
          </div>
          <div className={`rounded-xl px-2 py-1.5 border text-center ${
            isDark ? 'bg-zinc-950/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <p className="text-[8px] uppercase tracking-wider text-zinc-500">Volumen</p>
            <p className="text-[11px] font-black mt-0.5">{formatVolume(activeExerciseStats.volume)}</p>
          </div>
          <div className={`rounded-xl px-2 py-1.5 border text-center ${
            isDark ? 'bg-zinc-950/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <p className="text-[8px] uppercase tracking-wider text-zinc-500">Series</p>
            <p className="text-[11px] font-black mt-0.5 font-mono">{activeExerciseStats.sets}</p>
          </div>
        </div>

        <div className="pt-2 border-t" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
          <h4 className="text-xs font-bold mb-3 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Carga Máxima Registrada (KG)
          </h4>
          <div className="h-48 w-full">
            {chartData.weight.length === 0 ? (
              <div className={`h-full flex items-center justify-center text-xs border border-dashed rounded-2xl px-4 text-center ${
                isDark ? 'text-zinc-500 border-zinc-800' : 'text-zinc-400 border-zinc-300'
              }`}>
                Sin cargas registradas para {activeExercise}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.weight} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e4e4e7'} />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    itemStyle={{ color: accent.hex, fontWeight: 'bold' }}
                    formatter={(value: number) => [`${value} kg`, 'Carga máx.']}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
                  />
                  <Line
                    type="monotone"
                    dataKey="maxWeight"
                    stroke={accent.hex}
                    strokeWidth={2.5}
                    dot={{ fill: accent.hex, r: 4 }}
                    activeDot={{ r: 6, fill: accent.hex }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="pt-3 border-t" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
          <h4 className="text-xs font-bold mb-3 flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" style={{ color: accent.hex }} />
            Volumen del Ejercicio por Sesión (Reps × KG)
          </h4>
          <div className="h-40 w-full">
            {chartData.volume.length === 0 ? (
              <div className={`h-full flex items-center justify-center text-xs border border-dashed rounded-2xl px-4 text-center ${
                isDark ? 'text-zinc-500 border-zinc-800' : 'text-zinc-400 border-zinc-300'
              }`}>
                Sin volumen registrado para {activeExercise}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.volume} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e4e4e7'} />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    itemStyle={{ color: accent.hex, fontWeight: 'bold' }}
                    formatter={(value: number) => [`${value.toLocaleString('es-MX')} kg·rep`, 'Volumen']}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
                  />
                  <Bar dataKey="volumen" fill={accent.hex} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
