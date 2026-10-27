import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { CloudSyncEngine, loadCloudSnapshot } from '../services/cloudSnapshot';
import {
  APP_STORAGE_KEYS,
  SYNCED_STORAGE_KEYS,
  clearSyncedAppData,
  mergeSnapshots,
  readLocalSnapshot,
  writeLocalSnapshot
} from '../utils/appData';
import {
  APP_STORAGE_CLEARED_EVENT,
  APP_STORAGE_EVENT,
  type AppStorageEventDetail
} from '../utils/storage';

export type CloudSyncStatus = 'disabled' | 'signedOut' | 'loading' | 'syncing' | 'synced' | 'error';

interface CloudSyncContextValue {
  configured: boolean;
  authReady: boolean;
  booting: boolean;
  ready: boolean;
  user: User | null;
  status: CloudSyncStatus;
  lastSyncedAt: Date | null;
  error: string | null;
  localMode: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  syncNow: (force?: boolean) => Promise<void>;
  enterLocalMode: () => void;
  retry: () => void;
}

const CLOUD_READY_KEY = 'fittrack_cloud_ready_uid';
const LAST_UID_KEY = 'fittrack_cloud_last_uid';
const LOCAL_MODE_KEY = 'fittrack_local_mode';

const CloudSyncContext = createContext<CloudSyncContextValue | undefined>(undefined);

function isMobileBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function getCloudErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = String((error as { code: unknown }).code);

    switch (code) {
      case 'auth/popup-closed-by-user':
        return 'Inicio de sesión cancelado.';
      case 'auth/popup-blocked':
        return 'El navegador bloqueó la ventana de Google. Inténtalo de nuevo.';
      case 'auth/unauthorized-domain':
        return 'Este dominio no está autorizado en Firebase Authentication.';
      case 'auth/operation-not-allowed':
        return 'El inicio de sesión con Google no está habilitado en Firebase.';
      case 'auth/invalid-api-key':
        return 'La API key de Firebase no es válida. Revisa el archivo .env.local.';
      case 'auth/configuration-not-found':
        return 'Falta configurar Authentication en el proyecto de Firebase.';
      case 'failed-precondition':
        return 'Firestore no está habilitado o falta crear la base de datos.';
      case 'permission-denied':
        return 'Firestore rechazó la operación. Revisa que las reglas permitan al usuario acceder a sus datos.';
      case 'unavailable':
        return 'No hay conexión con Firestore. Los cambios se guardarán localmente y se reintentará la sincronización.';
      default:
        break;
    }
  }

  if (error instanceof Error) return error.message;
  return 'Ocurrió un error inesperado con la sincronización.';
}

const SAVE_TIMEOUT_MS = 15000;

function withTimeout<T>(promise: Promise<T>, timeoutMs = SAVE_TIMEOUT_MS): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error('La sincronización tardó demasiado. Revisa tu conexión.'));
    }, timeoutMs);

    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      }
    );
  });
}

export const CloudSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured);
  const [user, setUser] = useState<User | null>(null);
  const [booting, setBooting] = useState(isFirebaseConfigured);
  const [ready, setReady] = useState(!isFirebaseConfigured);
  const [status, setStatus] = useState<CloudSyncStatus>(
    isFirebaseConfigured ? 'loading' : 'disabled'
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localMode, setLocalMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(LOCAL_MODE_KEY) === '1';
  });

  const engineRef = useRef<CloudSyncEngine | null>(null);
  const initializedUidRef = useRef<string | null>(null);
  const activeUidRef = useRef<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      setBooting(false);
      setReady(true);
      setStatus('disabled');
      return;
    }

    let mounted = true;

    void getRedirectResult(auth).catch((redirectError) => {
      if (!mounted) return;
      console.error('Error al completar el inicio de sesión:', redirectError);
      setError(getCloudErrorMessage(redirectError));
    });

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      if (!mounted) return;

      setAuthReady(true);

      if (nextUser) {
        const isSameUser = activeUidRef.current === nextUser.uid;
        activeUidRef.current = nextUser.uid;

        // Firebase puede emitir el mismo usuario al refrescar el token;
        // en ese caso no hay que reiniciar la app ni volver a cargar la nube.
        if (isSameUser) return;

        setBooting(true);
        setReady(false);
        setUser(nextUser);
      } else {
        activeUidRef.current = null;
        setUser(null);
        setBooting(false);
        setReady(false);
        setStatus('signedOut');
        setLastSyncedAt(null);
        initializedUidRef.current = null;
        engineRef.current = null;
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !authReady || !user) return;
    if (initializedUidRef.current === user.uid) return;

    initializedUidRef.current = user.uid;
    activeUidRef.current = user.uid;

    const initialize = async () => {
      setBooting(true);
      setReady(false);
      setStatus('loading');
      setError(null);

      try {
        const readyUid = sessionStorage.getItem(CLOUD_READY_KEY);
        const localStateExists = localStorage.getItem(APP_STORAGE_KEYS.HISTORY) !== null;

        if (readyUid === user.uid && localStateExists) {
          engineRef.current = new CloudSyncEngine(user.uid);
          if (activeUidRef.current === user.uid) {
            setReady(true);
            setBooting(false);
            setStatus('synced');
          }
          return;
        }

        const cloud = await loadCloudSnapshot(user.uid);
        if (activeUidRef.current !== user.uid) return;

        const previousUid = localStorage.getItem(LAST_UID_KEY);
        if (previousUid && previousUid !== user.uid) {
          // Evita mezclar el historial de otra cuenta usada en este dispositivo
          clearSyncedAppData();
        }

        const local = readLocalSnapshot();
        localStorage.setItem(LAST_UID_KEY, user.uid);

        if (!cloud.exists) {
          const engine = new CloudSyncEngine(user.uid);
          engineRef.current = engine;
          await withTimeout(engine.save(local, true));
          if (activeUidRef.current !== user.uid) return;

          sessionStorage.setItem(CLOUD_READY_KEY, user.uid);
          setLastSyncedAt(new Date());
          setStatus('synced');
          setReady(true);
          setBooting(false);
          return;
        }

        const merged = mergeSnapshots(local, cloud.snapshot);
        writeLocalSnapshot(merged);

        // Evita un bucle de recargas si el navegador no puede guardar en localStorage
        if (localStorage.getItem(APP_STORAGE_KEYS.HISTORY) === null) {
          throw new Error(
            'No se pudo guardar el historial en este navegador. Revisa el espacio de almacenamiento disponible.'
          );
        }

        sessionStorage.setItem(CLOUD_READY_KEY, user.uid);
        if (activeUidRef.current === user.uid) {
          window.location.reload();
        }
      } catch (initializationError) {
        if (activeUidRef.current !== user.uid) return;
        console.error('Error al inicializar la sincronización:', initializationError);
        setError(getCloudErrorMessage(initializationError));
        setStatus('error');
        setBooting(false);
        setReady(false);
      }
    };

    void initialize();
  }, [authReady, user]);

  useEffect(() => {
    if (!user || !ready || !engineRef.current) return;

    let disposed = false;
    let debounceTimer: number | undefined;

    const persist = async (force = false) => {
      if (disposed || !engineRef.current) return;

      setStatus('syncing');
      try {
        await withTimeout(engineRef.current.save(readLocalSnapshot(), force));
        if (disposed) return;
        setLastSyncedAt(new Date());
        setStatus('synced');
        setError(null);
      } catch (syncError) {
        if (disposed) return;
        console.error('Error al sincronizar con Firestore:', syncError);
        setError(getCloudErrorMessage(syncError));
        setStatus('error');
      }
    };

    const scheduleSync = () => {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        void persist();
      }, 1200);
    };

    const handleStorageChange = (event: Event) => {
      const detail = (event as CustomEvent<AppStorageEventDetail>).detail;
      if (detail?.key && !SYNCED_STORAGE_KEYS.includes(detail.key)) return;
      scheduleSync();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        void persist();
      }
    };

    window.addEventListener(APP_STORAGE_EVENT, handleStorageChange);
    window.addEventListener(APP_STORAGE_CLEARED_EVENT, scheduleSync);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const initialSyncTimer = window.setTimeout(() => {
      void persist(true);
    }, 900);
    const retryInterval = window.setInterval(() => {
      void persist();
    }, 30000);

    return () => {
      disposed = true;
      if (debounceTimer) window.clearTimeout(debounceTimer);
      window.clearTimeout(initialSyncTimer);
      window.clearInterval(retryInterval);
      window.removeEventListener(APP_STORAGE_EVENT, handleStorageChange);
      window.removeEventListener(APP_STORAGE_CLEARED_EVENT, scheduleSync);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [ready, user]);

  const signInWithGoogle = useCallback(async () => {
    if (!auth) {
      throw new Error('Firebase no está configurado.');
    }

    setError(null);
    sessionStorage.removeItem(LOCAL_MODE_KEY);
    setLocalMode(false);

    try {
      if (isMobileBrowser()) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      await signInWithPopup(auth, googleProvider);
    } catch (signInError) {
      const code =
        typeof signInError === 'object' && signInError !== null && 'code' in signInError
          ? String((signInError as { code: unknown }).code)
          : '';

      if (
        code === 'auth/popup-blocked' ||
        code === 'auth/operation-not-supported-in-this-environment'
      ) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      console.error('Error al iniciar sesión con Google:', signInError);
      setError(getCloudErrorMessage(signInError));
      throw signInError;
    }
  }, []);

  const syncNow = useCallback(
    async (force = false) => {
      if (!user || !engineRef.current) {
        throw new Error('No hay una sesión iniciada.');
      }

      setStatus('syncing');
      try {
        await withTimeout(engineRef.current.save(readLocalSnapshot(), force));
        setLastSyncedAt(new Date());
        setStatus('synced');
        setError(null);
      } catch (syncError) {
        console.error('Error al sincronizar con Firestore:', syncError);
        setError(getCloudErrorMessage(syncError));
        setStatus('error');
        throw syncError;
      }
    },
    [user]
  );

  const signOut = useCallback(async () => {
    if (!auth) return;

    try {
      if (user && engineRef.current) {
        await withTimeout(engineRef.current.save(readLocalSnapshot()), 5000);
      }
    } catch (syncError) {
      console.error('No se pudo sincronizar antes de cerrar sesión:', syncError);
    }

    await firebaseSignOut(auth);
    activeUidRef.current = null;
    sessionStorage.removeItem(CLOUD_READY_KEY);
    sessionStorage.removeItem(LOCAL_MODE_KEY);
    setLocalMode(false);
    initializedUidRef.current = null;
    engineRef.current = null;
    setReady(false);
    setBooting(false);
    setStatus('signedOut');
    setLastSyncedAt(null);
    setError(null);
  }, [user]);

  const enterLocalMode = useCallback(() => {
    sessionStorage.setItem(LOCAL_MODE_KEY, '1');
    setLocalMode(true);
    setError(null);
  }, []);

  const retry = useCallback(() => {
    sessionStorage.removeItem(CLOUD_READY_KEY);
    window.location.reload();
  }, []);

  const value = useMemo<CloudSyncContextValue>(
    () => ({
      configured: isFirebaseConfigured,
      authReady,
      booting,
      ready,
      user,
      status,
      lastSyncedAt,
      error,
      localMode,
      signInWithGoogle,
      signOut,
      syncNow,
      enterLocalMode,
      retry
    }),
    [
      authReady,
      booting,
      enterLocalMode,
      error,
      lastSyncedAt,
      localMode,
      ready,
      retry,
      signInWithGoogle,
      signOut,
      status,
      syncNow,
      user
    ]
  );

  return <CloudSyncContext.Provider value={value}>{children}</CloudSyncContext.Provider>;
};

export function useCloudSync(): CloudSyncContextValue {
  const context = useContext(CloudSyncContext);
  if (!context) {
    throw new Error('useCloudSync debe usarse dentro de CloudSyncProvider');
  }
  return context;
}
