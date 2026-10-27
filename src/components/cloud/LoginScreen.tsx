import React, { useState } from 'react';
import { Cloud, Dumbbell, LogIn, ShieldCheck, Smartphone } from 'lucide-react';
import { useCloudSync } from '../../context/CloudSyncContext';
import { useTheme } from '../../context/ThemeContext';
import { GoogleSignInButton } from './GoogleSignInButton';

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, signInWithGoogleCredential, enterLocalMode, error } = useCloudSync();
  const { accent, isDark, setThemeMode } = useTheme();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const oauthConsentUrl = projectId
    ? `https://console.cloud.google.com/apis/credentials/consent?project=${projectId}`
    : null;
  const oauthCredentialsUrl = projectId
    ? `https://console.cloud.google.com/apis/credentials?project=${projectId}`
    : null;
  const displayError = localError ?? error;
  const showOauthHelp = Boolean(
    oauthConsentUrl &&
      displayError &&
      (displayError.includes('Google rechazó') ||
        displayError.includes('consentimiento') ||
        displayError.includes('usuario de prueba'))
  );

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setLocalError(null);
    try {
      await signInWithGoogle();
    } catch {
      // El contexto ya expone el mensaje de error
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleCredential = async (idToken: string) => {
    setIsSigningIn(true);
    setLocalError(null);
    try {
      await signInWithGoogleCredential(idToken);
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
              <h1 className="text-base font-black tracking-tight">FitUs</h1>
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

        {displayError && (
          <div className="px-3 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 space-y-1.5">
            <p className="text-[11px] text-red-400 font-medium leading-relaxed">{displayError}</p>
            {showOauthHelp && oauthConsentUrl && (
              <a
                href={oauthConsentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-bold text-red-300 underline underline-offset-2 inline-block"
              >
                Revisar pantalla de consentimiento OAuth
              </a>
            )}
          </div>
        )}

        <div className="space-y-2.5">
          <GoogleSignInButton
            onCredential={handleGoogleCredential}
            onError={(googleError) => {
              console.error('Error de Google Identity Services:', googleError);
              setLocalError('No se pudo completar el acceso con Google. Inténtalo de nuevo.');
            }}
            width={300}
          />

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className={`w-full py-2 rounded-xl text-[10px] font-bold transition-colors disabled:opacity-60 ${
              isDark
                ? 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            {isSigningIn ? 'Redirigiendo a Google...' : '¿No funciona el botón? Usar redirección'}
          </button>

          <p className="text-center text-[9px] text-zinc-500 leading-relaxed">
            Elige tu cuenta de Google y volverás automáticamente a la app.
          </p>

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

          {oauthConsentUrl && (
            <details
              className={`rounded-2xl border px-3 py-2 text-[10px] ${
                isDark ? 'border-zinc-800 bg-zinc-900/40 text-zinc-400' : 'border-zinc-200 bg-white text-zinc-600'
              }`}
            >
              <summary className="cursor-pointer font-bold text-[10px] text-zinc-500">
                ¿Problemas para entrar con Google?
              </summary>
              <div className="pt-2 space-y-1.5 leading-relaxed">
                <p>
                  Si Google muestra <strong>“Acceso bloqueado”</strong>, agrega tu correo como
                  usuario de prueba en la pantalla de consentimiento OAuth o publica la app.
                </p>
                <a
                  href={oauthConsentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block font-bold underline underline-offset-2"
                  style={{ color: accent.hex }}
                >
                  Abrir pantalla de consentimiento OAuth
                </a>
                <p>
                  Si Google muestra <strong>origin_mismatch</strong>, agrega{' '}
                  <span className="font-mono">https://{window.location.host}</span> en{' '}
                  <strong>Orígenes JavaScript autorizados</strong> del cliente OAuth.
                </p>
                {oauthCredentialsUrl && (
                  <a
                    href={oauthCredentialsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block font-bold underline underline-offset-2"
                    style={{ color: accent.hex }}
                  >
                    Abrir credenciales OAuth
                  </a>
                )}
              </div>
            </details>
          )}
        </div>

        <p className="text-center text-[9px] text-zinc-500 leading-relaxed">
          Si continúas sin cuenta, el historial se guarda únicamente en este navegador. Puedes
          activar la sincronización más tarde desde Ajustes.
        </p>
      </div>
    </div>
  );
};
