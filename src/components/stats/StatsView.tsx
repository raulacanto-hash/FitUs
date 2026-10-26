import React, { useState, useMemo } from 'react';
import { TrendingUp, Trophy, BarChart2 } from 'lucide-react';
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

interface StatsViewProps {
  history: WorkoutSession[];
  allUsedExerciseNames: string[];
}

export const StatsView: React.FC<StatsViewProps> = ({
  history,
  allUsedExerciseNames
}) => {
  // Ejercicio seleccionado para graficar carga máxima
  const [selectedStatExercise, setSelectedStatExercise] = useState<string>(() => {
    // Buscar si hay alguno con historial previo
    for (const w of history) {
      if (w.exercises && w.exercises.length > 0) {
        return w.exercises[0].name;
      }
    }
    return allUsedExerciseNames[0] || 'Press de banca plano con barra';
  });

  // Datos de Carga Máxima para el ejercicio seleccionado
  const maxWeightChartData = useMemo(() => {
    return history
      .slice()
      .reverse()
      .map((w) => {
        const ex = w.exercises?.find((e) => e.name === selectedStatExercise);
        if (!ex || !ex.sets || ex.sets.length === 0) return null;

        // Considerar series válidas completadas (o cualquier serie con peso > 0)
        const validSets = ex.sets.filter((s) => s.completed && Number(s.weight) > 0);
        const fallbackSets = ex.sets.filter((s) => Number(s.weight) > 0);
        const setsToUse = validSets.length > 0 ? validSets : fallbackSets;

        if (setsToUse.length === 0) return null;

        const maxWeight = Math.max(...setsToUse.map((s) => Number(s.weight) || 0));
        if (maxWeight <= 0) return null;

        const dateParts = w.date.split('-');
        const shortDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}` : w.date;

        return {
          date: shortDate,
          fullDate: w.date,
          maxWeight
        };
      })
      .filter((item): item is { date: string; fullDate: string; maxWeight: number } => item !== null);
  }, [history, selectedStatExercise]);

  // Datos de Volumen Total Acumulado por Sesión (KG × Reps)
  const volumeChartData = useMemo(() => {
    return history
      .slice()
      .reverse()
      .map((w) => {
        const totalVol = w.exercises?.reduce((accEx, ex) => {
          return accEx + ex.sets.reduce((accSet, s) => {
            // Contabilizar series con peso y reps reales
            const wNum = Number(s.weight) || 0;
            const rNum = Number(s.reps) || 0;
            return accSet + (wNum * rNum);
          }, 0);
        }, 0) || 0;

        const dateParts = w.date.split('-');
        const shortDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}` : w.date;

        return {
          date: shortDate,
          fullDate: w.date,
          volumen: totalVol
        };
      });
  }, [history]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
        <TrendingUp className="w-5 h-5 text-emerald-400" />
        Progresión y Métricas
      </h2>

      {/* Selector de Ejercicio y Gráfica de Carga Máxima */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 space-y-3 backdrop-blur-md">
        <label htmlFor="stat-exercise-select" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
          Selecciona Ejercicio para Graficar
        </label>
        <select
          id="stat-exercise-select"
          value={selectedStatExercise}
          onChange={(e) => setSelectedStatExercise(e.target.value)}
          className="w-full bg-zinc-800/80 border border-zinc-700/60 text-white rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-emerald-500"
        >
          {allUsedExerciseNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        {/* Gráfica de Carga Máxima */}
        <div className="pt-2">
          <h4 className="text-xs font-medium text-zinc-300 mb-3 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Carga Máxima Registrada (KG)
          </h4>
          <div className="h-48 w-full">
            {maxWeightChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl px-4 text-center">
                Sin datos registrados aún para {selectedStatExercise}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={maxWeightChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '0.75rem', fontSize: '11px' }}
                    itemStyle={{ color: '#10b981' }}
                    formatter={(val: number) => [`${val} kg`, 'Carga Máx']}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="maxWeight" 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#10b981', r: 4 }} 
                    activeDot={{ r: 6, fill: '#34d399' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Gráfica de Volumen Total Acumulado */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 space-y-3 backdrop-blur-md">
        <h4 className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
          <BarChart2 className="w-3.5 h-3.5 text-emerald-400" /> Volumen Total por Sesión (Reps × KG)
        </h4>
        <div className="h-44 w-full">
          {volumeChartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              Aún no hay entrenamientos registrados
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeChartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '0.75rem', fontSize: '11px' }}
                  itemStyle={{ color: '#34d399' }}
                  formatter={(val: number) => [`${val.toLocaleString()} kg·rep`, 'Volumen']}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
                />
                <Bar dataKey="volumen" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
