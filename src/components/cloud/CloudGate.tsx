import React from 'react';
import { CloudOff, LogOut, RefreshCw } from 'lucide-react';
import { useCloudSync } from '../../context/CloudSyncContext';
import { useTheme } from '../../context/ThemeContext';
import { CloudSplash } from './CloudSplash';
import { LoginScreen } from './LoginScreen';

interface CloudGateProps {
  children: React.ReactNode;
}

const CloudErrorScreen: React.FC<{ error: string | null }> = ({ error }) => {
  const { retry, signOut } = useCloudSync();
  const { accent, isDark } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-6 ${
        isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
      }`}
    >
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="w-14 h-14 rounded-2xl border border-red-500/30 bg-red-500/10 flex items-center justify-center mx-auto">
          <CloudOff className="w-7 h-7 text-red-400" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-lg font-black">No pudimos cargar tu historial</h1>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {error || 'Revisa tu conexión e inténtalo de nuevo. Tus datos locales no se han borrado.'}
          </p>
        </div>
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={retry}
            className={`w-full py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${accent.contrastText}`}
            style={{ backgroundColor: accent.hex }}
          >
            <RefreshCw className="w-4 h-4" /> Reintentar
          </button>
          <button
            type="button"
            onClick={() => void signOut()}
            className={`w-full py-2.5 rounded-2xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              isDark
                ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export const CloudGate: React.FC<CloudGateProps> = ({ children }) => {
  const { configured, authReady, booting, user, ready, error, localMode } = useCloudSync();

  if (!configured) return <>{children}</>;

  if (!authReady || booting) {
    return <CloudSplash />;
  }

  if (!user) {
    return localMode ? <>{children}</> : <LoginScreen />;
  }

  if (!ready) {
    return <CloudErrorScreen error={error} />;
  }

  return <>{children}</>;
};
