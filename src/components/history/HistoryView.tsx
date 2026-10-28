import React, { useMemo, useState } from 'react';
import { History, Calendar, Plus } from 'lucide-react';
import { WorkoutSession } from '../../types/workout';
import { WorkoutHistoryCard } from './WorkoutHistoryCard';
import { sortWorkoutsByDateDesc } from '../../utils/workoutStats';
import { useTheme } from '../../context/ThemeContext';
import { WorkoutCalendar } from './WorkoutCalendar';
import { getLocalDateString } from '../../utils/dates';

interface HistoryViewProps {
  history: WorkoutSession[];
  onEditWorkout: (workout: WorkoutSession) => void;
  onDeleteWorkout: (workoutId: string) => void;
  onConvertWorkoutToRoutine: (workout: WorkoutSession) => void;
  onAddPastWorkout: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onEditWorkout,
  onDeleteWorkout,
  onConvertWorkoutToRoutine,
  onAddPastWorkout
}) => {
  const { accent, isDark } = useTheme();
  const orderedHistory = useMemo(() => sortWorkoutsByDateDesc(history), [history]);
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());

  return (
    <div className={`space-y-4 animate-in fade-in duration-200 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-black flex items-center gap-2">
          <History className="w-5 h-5" style={{ color: accent.hex }} />
          Histórico de Entrenamientos
        </h2>
        <span className={`text-xs px-2.5 py-1 rounded-full font-mono border ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600 shadow-sm'
        }`}>
          {orderedHistory.length} {orderedHistory.length === 1 ? 'entrenamiento' : 'entrenamientos'}
        </span>
      </div>

      <button
        type="button"
        onClick={onAddPastWorkout}
        className={`w-full py-3 rounded-2xl text-xs font-black border border-dashed flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] ${
          isDark
            ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-900'
            : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
        }`}
      >
        <Plus className="w-4 h-4" style={{ color: accent.hex }} />
        Registrar entrenamiento anterior
      </button>
       <div className="pt-2 pb-1">
        <WorkoutCalendar 
          history={history} 
          selectedDate={selectedDate} 
          onSelectDate={setSelectedDate} 
        />
      </div>
      {orderedHistory.length === 0 ? (
        <div className={`text-center py-14 px-4 border border-dashed rounded-3xl ${
          isDark ? 'border-zinc-800/80 bg-zinc-900/30' : 'border-zinc-300 bg-white'
        }`}>
          <Calendar className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <p className="text-zinc-400 font-bold text-xs">Aún no hay ningún entrenamiento registrado</p>
          <p className="text-[10px] text-zinc-500 mt-1">
            Usa el botón de arriba para registrar uno con su fecha.
          </p>
        </div>
      ) : (
        orderedHistory.map((workout) => (
          <WorkoutHistoryCard
            key={workout.id}
            workout={workout}
            onEdit={onEditWorkout}
            onDelete={onDeleteWorkout}
            onConvertToRoutine={onConvertWorkoutToRoutine}
          />
        ))
      )}
    </div>
  );
};
