// Web Audio API singleton con desbloqueo en interacción de usuario
let audioContext: AudioContext | null = null;

// Campana real de fin de descanso (grabación de ElevenLabs)
const REST_BELL_SRC = `${import.meta.env.BASE_URL}sounds/rest-bell.mp3`;
let restBellBuffer: AudioBuffer | null = null;
let restBellLoad: Promise<AudioBuffer | null> | null = null;

/**
 * Desbloquea o inicializa el AudioContext durante un evento de usuario (click/tap)
 */
export function unlockAudio(): void {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!audioContext) {
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') {
      void audioContext.resume().catch(() => undefined);
    }
  } catch (e) {
    console.warn('No se pudo inicializar Web Audio Context:', e);
  }

  // Aprovechamos el gesto del usuario para decodificar la campana y dejarla
  // lista: luego el AudioContext ya está desbloqueado y suena al terminar.
  primeRestBell();
}

/**
 * Precarga y decodifica el MP3 de la campana dentro del AudioContext.
 */
export function primeRestBell(): void {
  if (!audioContext || audioContext.state !== 'running') return;
  void loadRestBellBuffer();
}

function loadRestBellBuffer(): Promise<AudioBuffer | null> {
  if (restBellBuffer) return Promise.resolve(restBellBuffer);
  if (restBellLoad) return restBellLoad;

  const ctx = audioContext;
  if (!ctx) return Promise.resolve(null);

  restBellLoad = fetch(REST_BELL_SRC)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.arrayBuffer();
    })
    .then(
      (data) =>
        new Promise<AudioBuffer>((resolve, reject) => {
          ctx.decodeAudioData(data, resolve, reject);
        })
    )
    .then((buffer) => {
      restBellBuffer = buffer;
      return buffer;
    })
    .catch((error) => {
      console.warn('No se pudo preparar la campana de descanso:', error);
      restBellLoad = null;
      return null;
    });

  return restBellLoad;
}

function playBellBuffer(buffer: AudioBuffer): Promise<void> {
  const ctx = audioContext;
  if (!ctx) return Promise.resolve();

  return new Promise((resolve) => {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => resolve();
    source.start();

    // Red de seguridad por si el navegador no dispara "ended".
    window.setTimeout(resolve, buffer.duration * 1000 + 150);
  });
}

/**
 * Campana sintetizada de respaldo (si el MP3 no puede decodificarse).
 */
function playSynthBell(): void {
  try {
    unlockAudio();
    if (!audioContext) return;

    const ctx = audioContext;
    const now = ctx.currentTime;

    // Función interna para crear un "golpe de campana" con armónicos metálicos
    const strikeBell = (startTime: number, baseFreq: number, volume: number) => {
      // Armónicos típicos de una campana (frecuencia fundamental + parciales inarmónicos)
      const partials = [
        { ratio: 1, gain: 1.0 },      // fundamental
        { ratio: 2.0, gain: 0.5 },    // octava
        { ratio: 2.76, gain: 0.35 },  // parcial inarmónico (da el timbre metálico)
        { ratio: 4.07, gain: 0.2 },   // otro parcial metálico
        { ratio: 5.43, gain: 0.1 },   // brillo
      ];

      partials.forEach(({ ratio, gain: partialGain }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * ratio, startTime);

        // Pequeño decay de frecuencia para simular el "golpe"
        osc.frequency.exponentialRampToValueAtTime(
          baseFreq * ratio * 0.98,
          startTime + 1.2
        );

        // Envolvente: ataque rápido + decay largo (como campana real)
        const peak = volume * partialGain;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(peak, startTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 2.0);
      });
    };

    // 🔔 Doble campana estilo box: "ding" ... "ding"
    strikeBell(now, 620, 0.35);
    strikeBell(now + 0.18, 620, 0.25);
  } catch (e) {
    console.warn('Error al reproducir audio del temporizador:', e);
  }
}

/**
 * Reproduce la campana de fin de descanso dos veces seguidas
 * (el MP3 original y una repetición adicional).
 */
export function playRestTimerBeep(): void {
  unlockAudio();

  const ctx = audioContext;
  if (!ctx) {
    playSynthBell();
    return;
  }

  void (async () => {
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // Si el navegador no permite reanudar, intentamos el sonido sintetizado.
        playSynthBell();
        return;
      }
    }

    const buffer = await loadRestBellBuffer();
    if (!buffer) {
      playSynthBell();
      return;
    }

    await playBellBuffer(buffer);
    // Repetición adicional solicitada: suena una vez más.
    await playBellBuffer(buffer);
  })();
}
