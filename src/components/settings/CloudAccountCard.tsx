import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  Cloud,
  CloudOff,
  CloudUpload,
  LogOut,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { useCloudSync } from '../../context/CloudSyncContext';
import { useTheme } from '../../context/ThemeContext';
import { GoogleSignInButton } from '../cloud/GoogleSignInButton';

const formatSyncTime = (date: Date | null): string => {
  if (!date) return 'Aún no sincronizado';
  return date.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const CloudAccountCard: React.FC = () => {
  const { isDark, accent } = useTheme();
  const {
    configured,
    user,
    status,
    lastSyncedAt,
    error,
    localMode,
    signInWithGoogle,
    signInWithGoogleCredential,
    signOut,
    syncNow
  } = useCloudSync();

  const [busy, setBusy] = useState<'google' | 'sync' | 'signout' | null>(null);
  const [credentialError, setCredentialError] = useState<string | null>(null);
  const displayError = credentialError ?? error;

  const cardClass = isDark
    ? 'bg-zinc-900/80 border-zinc-800/80 backdrop-blur-md'
    : 'bg-white border-zinc-200 shadow-sm';

  const handleGoogleSignIn = async () => {
    setBusy('google');
    setCredentialError(null);
    try {
      await signInWithGoogle();
    } catch {
      // El contexto muestra el error
    } finally {
      setBusy(null);
    }
  };

  const handleGoogleCredential = async (idToken: string) => {
    setBusy('google');
    setCredentialError(null);
    try {
      await signInWithGoogleCredential(idToken);
    } catch {
      // El contexto muestra el error
    } finally {
      setBusy(null);
    }
  };

  const handleSync = async () => {
    setBusy('sync');
    try {
      await syncNow();
    } catch {
      // El contexto muestra el error
    } finally {
      setBusy(null);
    }
  };

  const handleSignOut = async () => {
    setBusy('signout');
    try {
      await signOut();
    } finally {
      setBusy(null);
    }
  };

  const statusLabel =
    status === 'synced'
      ? 'Sincronizado'
      : status === 'syncing' || status === 'loading'
        ? 'Sincronizando...'
        : status === 'error'
          ? 'Error de sincronización'
          : 'Sin sincronizar';

  const statusColor =
    status === 'synced'
      ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'
      : status === 'error'
        ? 'text-red-500 border-red-500/30 bg-red-500/10'
        : 'text-amber-500 border-amber-500/30 bg-amber-500/10';

  const StatusIcon =
    status === 'syncing' || status === 'loading'
      ? CloudUpload
      : status === 'synced'
        ? Check
        : status === 'error'
          ? AlertTriangle
          : CloudOff;

  return (
    <div className={`rounded-2xl p-4 space-y-3 border ${cardClass}`}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
          <Cloud className="w-4 h-4" style={{ color: accent.hex }} />
          Cuenta y Sincronización
        </h3>
        {configured && (
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border flex items-center gap-1 ${statusColor}`}
          >
            <StatusIcon className={`w-3 h-3 ${status === 'syncing' || status === 'loading' ? 'animate-pulse' : ''}`} />
            {statusLabel}
          </span>
        )}
      </div>

      {!configured ? (
        <div className="space-y-1.5">
          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            La sincronización en la nube no está configurada.
          </p>
          <p className="text-[10px] text-zinc-500">
            Añade las claves de Firebase en <span className="font-mono">.env.local</span> y reinicia
            la app para activar el respaldo.
          </p>
        </div>
      ) : user ? (
        <>
          <div className="flex items-center gap-2.5">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Cuenta de Google'}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full border border-zinc-700/40 object-cover"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black"
                style={{ backgroundColor: `${accent.hex}20`, color: accent.hex }}
              >
                {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">{user.displayName || 'Tu cuenta'}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>

          <p className={`text-[10px] flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            <ShieldCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" />
            Tus datos se guardan en Firestore y solo tú puedes verlos.
          </p>

          <p className="text-[10px] text-zinc-500 font-mono">
            Última sincronización: {formatSyncTime(lastSyncedAt)}
          </p>

          {displayError && (
            <p className="text-[10px] text-red-400 leading-relaxed border border-red-500/20 bg-red-500/10 rounded-lg px-2 py-1.5">
              {displayError}
            </p>
          )}

          <div className="flex gap-2 pt-0.5">
            <button
              type="button"
              onClick={handleSync}
              disabled={busy !== null}
              className={`flex-1 font-bold py-2.5 px-3 rounded-xl text-[11px] flex items-center justify-center gap-1.5 border transition-colors active:scale-95 disabled:opacity-60 ${
                isDark
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700/60'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${busy === 'sync' ? 'animate-spin' : ''}`} />
              {busy === 'sync' ? 'Sincronizando...' : 'Sincronizar ahora'}
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={busy !== null}
              className={`font-bold py-2.5 px-3 rounded-xl text-[11px] flex items-center justify-center gap-1.5 border transition-colors active:scale-95 disabled:opacity-60 ${
                isDark
                  ? 'bg-zinc-900 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border-zinc-800'
                  : 'bg-white hover:bg-red-50 text-zinc-500 hover:text-red-600 border-zinc-200'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          </div>
        </>
      ) : (
        <>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Inicia sesión con Google para respaldar tu historial y usarlo en cualquier dispositivo.
          </p>
          {localMode && (
            <p className="text-[10px] text-amber-500 leading-relaxed border border-amber-500/20 bg-amber-500/10 rounded-lg px-2 py-1.5">
              Estás en modo local: si borras los datos del navegador, perderás el historial.
            </p>
          )}
          {displayError && (
            <p className="text-[10px] text-red-400 leading-relaxed border border-red-500/20 bg-red-500/10 rounded-lg px-2 py-1.5">
              {displayError}
            </p>
          )}
          <GoogleSignInButton
            onCredential={handleGoogleCredential}
            onError={() => setCredentialError('No se pudo completar el acceso con Google. Inténtalo de nuevo.')}
            width={280}
          />
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={busy !== null}
            className={`w-full py-1.5 rounded-lg text-[10px] font-bold transition-colors disabled:opacity-60 ${
              isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            {busy === 'google' ? 'Redirigiendo...' : '¿No funciona? Usar redirección'}
          </button>
        </>
      )}
    </div>
  );
};
