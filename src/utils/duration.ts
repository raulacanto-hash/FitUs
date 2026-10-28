/**
 * Convierte una duración total en minutos a un texto legible:
 * 45 -> "45 min", 60 -> "1 h", 90 -> "1 h 30 min".
 */
export function formatDuration(totalMinutes?: number | null): string {
  const minutes = Math.max(0, Math.round(Number(totalMinutes) || 0));
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes === 0
    ? `${hours} h`
    : `${hours} h ${remainingMinutes} min`;
}

export function splitDuration(totalMinutes?: number | null): { hours: number; minutes: number } {
  const total = Math.max(0, Math.round(Number(totalMinutes) || 0));
  return {
    hours: Math.floor(total / 60),
    minutes: total % 60
  };
}

export function durationFromParts(hours: number, minutes: number): number {
  return Math.max(0, Math.round(hours) || 0) * 60 + Math.max(0, Math.round(minutes) || 0);
}
