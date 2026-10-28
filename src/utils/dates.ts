/**
 * Retorna la fecha local actual en formato YYYY-MM-DD
 * Evita el bug de desfase de toISOString() que usa UTC
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Retorna fecha local con offset en días
 */
export function getRelativeLocalDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return getLocalDateString(d);
}

/**
 * Formatea una fecha YYYY-MM-DD para visualización en español
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

/**
 * Formatea una fecha YYYY-MM-DD de forma relativa para las sesiones recientes:
 * "Hoy", "Ayer", "Hace 3 días" o la fecha corta para registros más antiguos.
 */
export function formatRelativeDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return dateStr;

  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  const today = new Date();

  // Comparar días de calendario en UTC evita desfases por horario de verano
  const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.round((utcToday - utcDate) / 86400000);

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays > 1 && diffDays < 7) return `Hace ${diffDays} días`;
  return formatDisplayDate(dateStr);
}
