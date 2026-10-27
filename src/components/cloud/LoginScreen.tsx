import React, { useState } from 'react';
import { Cloud, Dumbbell, LogIn, ShieldCheck, Smartphone } from 'lucide-react';
import { useCloudSync } from '../../context/CloudSyncContext';
import { useTheme } from '../../context/ThemeContext';

const GoogleIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.58v2.98h3.88c2.27-2.09 3.54-5.17 3.54-8.8Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.96-1.08 7.95-2.93l-3.88-2.98c-1.08.73-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.95H1.27v3.09A11.99 11.99 0 0 0 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.3A7.2 7.2 0 0 1 4.9 12c0-.8.13-1.57.37-2.3V6.61H1.27A11.99 11.99 0 0 0 0 12c0 1.94.47 3.77 1.27 5.39l4-3.09Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.96 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
    />
  </svg>
);

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, enterLocalMode, error } = useCloudSync();
  const { accent, isDark, setThemeMode } = useTheme();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch {
      // El contexto ya expone el mensaje de error
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-5 py-10 ${
        isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
      }`}
    >
      <div className="w-full max-w-sm space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl border flex items-center justify-center"
              style={{ backgroundColor: `${accent.hex}18`, borderColor: `${accent.hex}35` }}
            >
              <Dumbbell className="w-5 h-5" style={{ color: accent.hex }} />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight">FitTrack</h1>
              <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">
                Tu historial en la nube
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition-colors ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {isDark ? 'Claro' : 'Oscuro'}
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight leading-tight">
            Tu progreso, siempre contigo.
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Inicia sesión para guardar tus entrenamientos, medidas y récords en la nube y
            recuperarlos en cualquier dispositivo.
          </p>
        </div>

        <div
          className={`rounded-3xl border p-4 space-y-3 ${
            isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
          }`}
        >
          <div className="flex items-start gap-3">
            <Cloud className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accent.hex }} />
            <div>
              <p className="text-xs font-bold">Sincronización automática</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Cada serie, rutina y medida se respalda al instante.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Smartphone className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accent.hex }} />
            <div>
              <p className="text-xs font-bold">Móvil, tablet y escritorio</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Empieza en el gimnasio y continúa donde lo dejaste.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accent.hex }} />
            <div>
              <p className="text-xs font-bold">Solo tú puedes verlo</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Tus datos quedan vinculados a tu cuenta de Google.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="px-3 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10">
            <p className="text-[11px] text-red-400 font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className={`w-full font-black py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2.5 border transition-all active:scale-[0.98] disabled:opacity-60 ${
              isDark
                ? 'bg-white text-zinc-900 border-white hover:bg-zinc-100'
                : 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800'
            }`}
          >
            {isSigningIn ? (
              <span
                className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }}
              />
            ) : (
              <GoogleIcon />
            )}
            {isSigningIn ? 'Conectando con Google...' : 'Continuar con Google'}
          </button>

          <button
            type="button"
            onClick={enterLocalMode}
            className={`w-full py-2.5 rounded-2xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              isDark
                ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Continuar sin cuenta (solo este dispositivo)
          </button>
        </div>

        <p className="text-center text-[9px] text-zinc-500 leading-relaxed">
          Si continúas sin cuenta, el historial se guarda únicamente en este navegador. Puedes
          activar la sincronización más tarde desde Ajustes.
        </p>
      </div>
    </div>
  );
};
