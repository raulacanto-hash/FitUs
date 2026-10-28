import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react';
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

const MONTH_NAMES_LOWER = MONTH_NAMES.map((m) => m.toLowerCase());

const WEEKDAY_LABELS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

const FALLBACK_HEX = '#22c55e'; // por si accent viene undefined

/** Devuelve true si el hex es claro (luminancia alta). */
const isLightHex = (hex: string): boolean => {
  const clean = hex.replace('#', '');
  if (clean.length !== 6 && clean.length !== 3) return false;
  const full =
    clean.length === 3
      ? clean.split('').map((c) => c + c).join('')
      : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return false;
  // Luminancia relativa (aprox. sRGB)
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.6;
};

const getContrastColor = (hex: string): string =>
  isLightHex(hex) ? '#09090b' : '#ffffff';

/** Parsea "YYYY-MM-DD" validando rangos. Fallback: hoy. */
const parseDateKey = (dateKey: string | undefined | null) => {
  if (typeof dateKey === 'string') {
    const parts = dateKey.split('-').map(Number);
    if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
      const [year, month, day] = parts;
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const monthIndex = month - 1;
        const maxDay = new Date(year, monthIndex + 1, 0).getDate();
        if (day <= maxDay) {
          return { year, monthIndex, day };
        }
      }
    }
  }
  const today = new Date();
  return {
    year: today.getFullYear(),
    monthIndex: today.getMonth(),
    day: today.getDate()
  };
};

/** Devuelve "YYYY-MM" para indexar conteos por mes. */
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

  // Cambiamos de mes cuando selectedDate cambia desde fuera,
  // pero evitamos resetear en el primer render si ya coincide.
  const isFirstRender = useRef(true);
  useEffect(() => {
    const parts = parseDateKey(selectedDate);
    setVisibleMonth((prev) => {
      if (prev.year === parts.year && prev.monthIndex === parts.monthIndex) {
        return prev; // evita re-render innecesario
      }
      return { year: parts.year, monthIndex: parts.monthIndex };
    });
    isFirstRender.current = false;
  }, [selectedDate]);

  // Índice de días con entrenamiento: Set<"YYYY-MM-DD">
  const workoutDates = useMemo(() => {
    const set = new Set<string>();
    for (const w of history) {
      if (w?.date) set.add(w.date);
    }
    return set;
  }, [history]);

  // Índice de conteo por mes: Map<"YYYY-MM", number> -> O(1) lookup
  const workoutCountByMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (const w of history) {
      if (!w?.date) continue;
      const k = monthKeyOf(w.date);
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [history]);

  const todayKey = getLocalDateString();
  const today = useMemo(() => parseDateKey(todayKey), [todayKey]);

  const monthWorkoutCount =
    workoutCountByMonth.get(
      `${visibleMonth.year}-${String(visibleMonth.monthIndex + 1).padStart(2, '0')}`
    ) ?? 0;

  const firstDayOfMonth = new Date(visibleMonth.year, visibleMonth.monthIndex, 1);
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7; // lunes = 0
  const daysInMonth = new Date(
    visibleMonth.year,
    visibleMonth.monthIndex + 1,
    0
  ).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const days = useMemo(() => {
    return Array.from({ length: totalCells }, (_, index) => {
      const date = new Date(
        visibleMonth.year,
        visibleMonth.monthIndex,
        1 - startOffset + index
      );
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      const day = date.getDate();
      const key = toDateKey(year, monthIndex, day);
      return {
        key,
        day,
        monthIndex,
        year,
        isCurrentMonth:
          monthIndex === visibleMonth.monthIndex && year === visibleMonth.year,
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
    onSelectDate(key);
  };

  const navBtnClass = `p-2 rounded-xl transition-colors ${
    isDark
      ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
  }`;

  return (
    <div
      className={`rounded-3xl border p-3 ${
        isDark
          ? 'bg-zinc-900/70 border-zinc-800'
          : 'bg-white border-zinc-200 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-1">
        <button
          type="button"
          onClick={() => moveMonth(-1)}
          className={navBtnClass}
          aria-label="Mes anterior"
          title="Mes anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center min-w-0">
          <h3 className="text-lg font-black tracking-tight leading-tight">
            {MONTH_NAMES[visibleMonth.monthIndex]} {visibleMonth.year}
          </h3>
          <p className="text-[10px] font-mono text-zinc-500">
            {monthWorkoutCount}{' '}
            {monthWorkoutCount === 1 ? 'entrenamiento' : 'entrenamientos'}
            {monthWorkoutCount > 0 && (
              <span className="inline-flex items-center gap-1 ml-1">
                <Dumbbell className="w-2.5 h-2.5" style={{ color: accentHex }} />
              </span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => moveMonth(1)}
          className={navBtnClass}
          aria-label="Mes siguiente"
          title="Mes siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 mt-3 mb-1" role="row">
        {WEEKDAY_LABELS.map((label) => (
          <span
            key={label}
            role="columnheader"
            className={`text-center text-[9px] font-bold uppercase tracking-wider ${
              isDark ? 'text-zinc-500' : 'text-zinc-400'
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5" role="grid">
        {days.map((cell) => {
          const outsideColor = isDark ? 'text-zinc-600' : 'text-zinc-300';
          const isSelected = cell.isSelected;

          // Estilo combinado: selección (fondo) + hoy (borde interior).
          const style: React.CSSProperties = {};
          if (isSelected) {
            style.backgroundColor = accentHex;
            style.color = contrastColor;
          }
          if (cell.isToday) {
            // Si está seleccionado, el borde va en color de contraste para verse.
            style.boxShadow = isSelected
              ? `inset 0 0 0 2px ${contrastColor}`
              : `inset 0 0 0 2px ${accentHex}`;
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
              aria-current={cell.isToday ? 'date' : undefined}
              aria-label={`${cell.day} de ${MONTH_NAMES_LOWER[cell.monthIndex]} de ${cell.year}${
                cell.hasWorkout ? ', entrenamiento registrado' : ''
              }`}
            >
              <span
                className={`text-sm font-bold leading-none ${
                  isSelected
                    ? ''
                    : cell.isCurrentMonth
                      ? isDark
                        ? 'text-zinc-100'
                        : 'text-zinc-900'
                      : outsideColor
                }`}
              >
                {cell.day}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1 ${
                  cell.hasWorkout ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundColor: isSelected ? contrastColor : accentHex
                }}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-2 px-1">
        <span
          className={`text-[10px] font-mono ${
            isDark ? 'text-zinc-500' : 'text-zinc-400'
          }`}
        >
          {history.length > 0
            ? 'Los puntos indican días con entrenamiento'
            : 'Aún no hay entrenamientos registrados'}
        </span>
        <button
          type="button"
          onClick={goToToday}
          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
            isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
          }`}
          style={{ color: accentHex }}
        >
          Hoy
        </button>
      </div>
    </div>
  );
};

export default WorkoutCalendar;