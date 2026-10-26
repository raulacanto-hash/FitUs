// Web Audio API singleton con desbloqueo en interacción de usuario
let audioContext: AudioContext | null = null;

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
      audioContext.resume();
    }
  } catch (e) {
    console.warn('No se pudo inicializar Web Audio Context:', e);
  }
}

/**
 * Reproduce un tono de campana de box (ring bell) al finalizar el descanso.
 * Suena como un "ding-ding" metálico de inicio/fin de round.
 */
export function playRestTimerBeep(): void {
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
    // Primer golpe (más fuerte)
    strikeBell(now, 620, 0.35);
    // Segundo golpe (ligeramente más suave, 180ms después)
    strikeBell(now + 0.18, 620, 0.25);
  } catch (e) {
    console.warn('Error al reproducir audio del temporizador:', e);
  }
}