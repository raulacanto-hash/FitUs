export const APP_STORAGE_EVENT = 'fittrack:storage';
export const APP_STORAGE_CLEARED_EVENT = 'fittrack:storage-cleared';

export interface AppStorageEventDetail {
  key: string;
  value: unknown;
}

function notifyStorageChange(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<AppStorageEventDetail>(APP_STORAGE_EVENT, {
      detail: { key, value }
    })
  );
}

export function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error al leer clave "${key}" de localStorage:`, error);
    return fallback;
  }
}

export function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyStorageChange(key, value);
  } catch (error) {
    console.error(`Error al guardar clave "${key}" en localStorage:`, error);
  }
}

export function removeStoredItem(key: string): void {
  try {
    localStorage.removeItem(key);
    notifyStorageChange(key, null);
  } catch (error) {
    console.error(`Error al remover clave "${key}" de localStorage:`, error);
  }
}

export function clearAllStorage(): void {
  try {
    localStorage.clear();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(APP_STORAGE_CLEARED_EVENT));
    }
  } catch (error) {
    console.error('Error al limpiar localStorage:', error);
  }
}
