// Web Audio API singleton con desbloqueo en interacción de usuario
let audioContext: AudioContext | null = null;

/**
 * Desbloquea o inicializa el AudioContext durante un evento de usuario (click/tap)
 */
export function unlockAudio(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
 * Reproduce un tono de campana/pitido de alerta al finalizar el descanso
 */
export function playRestTimerBeep(): void {
  try {
    unlockAudio();
    if (!audioContext) return;

    const ctx = audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Tono agradable de doble pulso (880Hz -> La5)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    console.warn('Error al reproducir audio del temporizador:', e);
  }
}
