import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface GoogleSignInButtonProps {
  onCredential: (idToken: string) => Promise<void>;
  onError?: (error: unknown) => void;
  width?: number;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onCredential,
  onError,
  width = 300
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const credentialHandlerRef = useRef(onCredential);
  const errorHandlerRef = useRef(onError);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');

  useEffect(() => {
    credentialHandlerRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    errorHandlerRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setStatus('unavailable');
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const render = () => {
      if (cancelled) return;

      const google = window.google;
      if (!google?.accounts?.id) {
        attempts += 1;
        if (attempts > 60) {
          setStatus('unavailable');
          return;
        }
        window.setTimeout(render, 200);
        return;
      }

      try {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (!response.credential) {
              errorHandlerRef.current?.(new Error('Google no devolvió una credencial válida.'));
              return;
            }
            void credentialHandlerRef.current(response.credential).catch((error) => {
              errorHandlerRef.current?.(error);
            });
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: 'popup'
        });

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          google.accounts.id.renderButton(containerRef.current, {
            theme: 'outline',
            size: 'large',
            shape: 'rectangular',
            text: 'continue_with',
            width,
            locale: 'es'
          });
          setStatus('ready');
        }
      } catch (error) {
        console.error('No se pudo inicializar Google Identity Services:', error);
        setStatus('unavailable');
      }
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [width]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[44px]">
      <div
        ref={containerRef}
        className={`w-full flex items-center justify-center ${status === 'ready' ? 'min-h-[44px]' : 'hidden'}`}
      />
      {status === 'loading' && (
        <div className="w-full h-11 rounded-xl border border-zinc-700/60 bg-zinc-900 flex items-center justify-center gap-2 text-[11px] font-bold text-zinc-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          Cargando Google...
        </div>
      )}
      {status === 'unavailable' && (
        <div className="w-full h-11 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-[10px] font-semibold text-amber-500 px-3 text-center">
          No se pudo cargar el botón de Google. Usa la redirección de abajo.
        </div>
      )}
    </div>
  );
};
