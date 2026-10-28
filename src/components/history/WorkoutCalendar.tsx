import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';
import { WorkoutSession } from '../../types/workout';
import { useTheme } from '../../context/ThemeContext';
import { getLocalDateString } from '../../utils/dates';

interface WorkoutCalendarProps {
  history: WorkoutSession[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAY_LABELS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const FALLBACK_HEX = '#22c55e';

const isLightHex = (hex: string): boolean => {
  const clean = hex.replace('#', '');
  if (clean.length !== 6 && clean.length !== 3) return false;
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return false;
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.6;
};

const getContrastColor = (hex: string): string => isLightHex(hex) ? '#09090b' : '#ffffff';

const parseDateKey = (dateKey: string | undefined | null) => {
  if (typeof dateKey === 'string') {
    const parts = dateKey.split('-').map(Number);
    if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
      const [year, month, day] = parts;
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const monthIndex = month - 1;
        const maxDay = new Date(year, monthIndex + 1, 0).getDate();
        if (day <= maxDay) return { year, monthIndex, day };
      }
    }
  }
  const today = new Date();
  return { year: today.getFullYear(), monthIndex: today.getMonth(), day: today.getDate() };
};

const monthKeyOf = (dateKey: string): string => dateKey.slice(0, 7);
const toDateKey = (year: number, monthIndex: number, day: number): string =>
  getLocalDateString(new Date(year, monthIndex, day));

export const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({
  history,
  selectedDate,
  onSelectDate
}) => {
  const { accent, isDark } = useTheme();
  const accentHex = accent?.hex || FALLBACK_HEX;
  const contrastColor = getContrastColor(accentHex);

  const selectedParts = parseDateKey(selectedDate);
  const [visibleMonth, setVisibleMonth] = useState({
    year: selectedParts.year,
    monthIndex: selectedParts.monthIndex
  });

  // NUEVO: Estado para controlar si el panel de detalles está abierto o cerrado
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const parts = parseDateKey(selectedDate);
    setVisibleMonth((prev) => {
      if (prev.year === parts.year && prev.monthIndex === parts.monthIndex) return prev;
      return { year: parts.year, monthIndex: parts.monthIndex };
    });
    // Al cambiar de fecha desde afuera, cerramos los detalles
    setShowDetails(false);
  }, [selectedDate]);

  const workoutDates = useMemo(() => {
    const set = new Set<string>();
    for (const w of history) if (w?.date) set.add(w.date);
    return set;
  }, [history]);

  const workoutCountByMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (const w of history) {
      if (!w?.date) continue;
      const k = monthKeyOf(w.date);
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [history]);

  // NUEVO: Filtramos los entrenamientos del día seleccionado
  const selectedDayWorkouts = useMemo(() => {
    return history.filter(w => w.date === selectedDate);
  }, [history, selectedDate]);

  const todayKey = getLocalDateString();
  const today = useMemo(() => parseDateKey(todayKey), [todayKey]);

  const monthWorkoutCount = workoutCountByMonth.get(
    `${visibleMonth.year}-${String(visibleMonth.monthIndex + 1).padStart(2, '0')}`
  ) ?? 0;

  const firstDayOfMonth = new Date(visibleMonth.year, visibleMonth.monthIndex, 1);
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(visibleMonth.year, visibleMonth.monthIndex + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const days = useMemo(() => {
    return Array.from({ length: totalCells }, (_, index) => {
      const date = new Date(visibleMonth.year, visibleMonth.monthIndex, 1 - startOffset + index);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      const day = date.getDate();
      const key = toDateKey(year, monthIndex, day);
      return {
        key, day, monthIndex, year,
        isCurrentMonth: monthIndex === visibleMonth.monthIndex && year === visibleMonth.year,
        isToday: key === todayKey,
        isSelected: key === selectedDate,
        hasWorkout: workoutDates.has(key)
      };
    });
  }, [visibleMonth, startOffset, totalCells, todayKey, selectedDate, workoutDates]);

  const moveMonth = (delta: number) => {
    setVisibleMonth((prev) => {
      const next = new Date(prev.year, prev.monthIndex + delta, 1);
      return { year: next.getFullYear(), monthIndex: next.getMonth() };
    });
  };

  const goToToday = () => {
    setVisibleMonth({ year: today.year, monthIndex: today.monthIndex });
    onSelectDate(todayKey);
  };

  const handleSelectDay = (key: string, year: number, monthIndex: number) => {
    if (year !== visibleMonth.year || monthIndex !== visibleMonth.monthIndex) {
      setVisibleMonth({ year, monthIndex });
    }
    if (key === selectedDate) {
      // Si toca el mismo día, alternamos el panel de detalles
      setShowDetails(!showDetails);
    } else {
      onSelectDate(key);
      setShowDetails(true); // Abrimos detalles automáticamente al tocar un día nuevo
    }
  };

  const navBtnClass = `p-2 rounded-xl transition-colors ${
    isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
  }`;

  return (
    <div className={`rounded-3xl border overflow-hidden transition-all duration-300 ${
      isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
    }`}>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2 px-1">
          <button type="button" onClick={() => moveMonth(-1)} className={navBtnClass} aria-label="Mes anterior">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center min-w-0">
            <h3 className="text-lg font-black tracking-tight leading-tight">
              {MONTH_NAMES[visibleMonth.monthIndex]} {visibleMonth.year}
            </h3>
            <p className="text-[10px] font-mono text-zinc-500">
              {monthWorkoutCount} {monthWorkoutCount === 1 ? 'entrenamiento' : 'entrenamientos'}
              {monthWorkoutCount > 0 && (
                <span className="inline-flex items-center gap-1 ml-1">
                  <Dumbbell className="w-2.5 h-2.5" style={{ color: accentHex }} />
                </span>
              )}
            </p>
          </div>

          <button type="button" onClick={() => moveMonth(1)} className={navBtnClass} aria-label="Mes siguiente">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 mt-3 mb-1" role="row">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} role="columnheader" className={`text-center text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-0.5" role="grid">
          {days.map((cell) => {
            const outsideColor = isDark ? 'text-zinc-600' : 'text-zinc-300';
            const isSelected = cell.isSelected;

            const style: React.CSSProperties = {};
            if (isSelected) {
              style.backgroundColor = accentHex;
              style.color = contrastColor;
            }
            if (cell.isToday) {
              style.boxShadow = isSelected ? `inset 0 0 0 2px ${contrastColor}` : `inset 0 0 0 2px ${accentHex}`;
            }

            return (
              <button
                key={cell.key}
                type="button"
                role="gridcell"
                onClick={() => handleSelectDay(cell.key, cell.year, cell.monthIndex)}
                className="relative h-12 rounded-2xl flex flex-col items-center justify-center transition-colors active:scale-95"
                style={style}
                aria-pressed={isSelected}
              >
                <span className={`text-sm font-bold leading-none ${
                  isSelected ? '' : cell.isCurrentMonth ? (isDark ? 'text-zinc-100' : 'text-zinc-900') : outsideColor
                }`}>
                  {cell.day}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1 ${cell.hasWorkout ? 'opacity-100' : 'opacity-0'}`}
                  style={{ backgroundColor: isSelected ? contrastColor : accentHex }}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-2 px-1">
          <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {history.length > 0 ? 'Puntos = días con entrenamiento' : 'Sin entrenamientos registrados'}
          </span>
          <button type="button" onClick={goToToday} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`} style={{ color: accentHex }}>
            Hoy
          </button>
        </div>
      </div>

            {/* Panel de detalles desplegable del día seleccionado */}
      {selectedDayWorkouts.length > 0 && (
        <div className={`border-t ${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-100 bg-zinc-50'}`}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold ${
              isDark ? 'text-zinc-300 hover:bg-zinc-800/50' : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4" style={{ color: accentHex }} />
              Detalles del {selectedDate.split('-').reverse().join('/')}
            </span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="px-3 pb-3 space-y-3 animate-in slide-in-from-top-2">
              {selectedDayWorkouts.map((workout) => (
                <div key={workout.id} className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800/60' : 'bg-white border-zinc-200'}`}>
                  
                  {/* Título de la rutina */}
                  <p className="text-[11px] font-black uppercase tracking-wide mb-3 border-b pb-2 border-zinc-800/20 dark:border-zinc-700/50" style={{ color: accentHex }}>
                    {workout.routineName || 'Entrenamiento Libre'}
                  </p>
                  
                  {/* Lista de ejercicios */}
                  <div className="space-y-3">
                    {workout.exercises.map((exercise) => (
                      <div key={exercise.id}>
                        <p className={`text-xs font-bold mb-1 ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                          {exercise.name}
                        </p>
                        
                        {/* Lista de series del ejercicio */}
                        <div className="flex flex-wrap gap-1.5">
                          {exercise.sets.map((set, idx) => (
                            <span 
                              key={set.id} 
                              className={`text-[10px] font-mono px-2 py-1 rounded-md flex items-center gap-1 ${
                                set.isWarmup 
                                  ? (isDark ? 'bg-yellow-500/10 text-yellow-500' : 'bg-yellow-50 text-yellow-600')
                                  : (isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600')
                              }`}
                            >
                              {set.isWarmup && <span className="text-[8px] uppercase">Calentamiento</span>}
                              {!set.isWarmup && <span>Serie {idx + 1}:</span>}
                              <strong>{set.weight ? `${set.weight}kg` : '-'}</strong> x <strong>{set.reps || '-'}</strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}
         {/* ⚠️ ESTO ES LO QUE FALTABA: Cerrar el div principal y el componente */}
    </div>
  );
};

export default WorkoutCalendar;