import { useState, useEffect, useRef, useCallback } from 'react';
import { unlockAudio, playRestTimerBeep } from '../utils/audio';

export interface RestTimerState {
  secondsRemaining: number;
  isActive: boolean;
  initialDuration: number;
  startTimer: (duration: number) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
}

export function useRestTimer(): RestTimerState {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [initialDuration, setInitialDuration] = useState<number>(90);

  // Guardamos el timestamp en el que debe finalizar el temporizador
  const targetEndTimeRef = useRef<number | null>(null);

  const startTimer = useCallback((duration: number) => {
    unlockAudio();
    setInitialDuration(duration);
    setSecondsRemaining(duration);
    setIsActive(true);
    targetEndTimeRef.current = Date.now() + duration * 1000;
  }, []);

  const toggleTimer = useCallback(() => {
    unlockAudio();
    setIsActive(prev => {
      if (!prev) {
        // Reanudando
        if (secondsRemaining > 0) {
          targetEndTimeRef.current = Date.now() + secondsRemaining * 1000;
          return true;
        }
        return false;
      } else {
        // Pausando
        targetEndTimeRef.current = null;
        return false;
      }
    });
  }, [secondsRemaining]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setSecondsRemaining(0);
    targetEndTimeRef.current = null;
  }, []);

  useEffect(() => {
    if (!isActive || !targetEndTimeRef.current) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((targetEndTimeRef.current! - now) / 1000));

      setSecondsRemaining(diff);

      if (diff <= 0) {
        setIsActive(false);
        targetEndTimeRef.current = null;
        playRestTimerBeep();
      }
    }, 250); // Muestreo a 250ms para respuesta fluida y sin desfase de reloj

    return () => clearInterval(interval);
  }, [isActive]);

  return {
    secondsRemaining,
    isActive,
    initialDuration,
    startTimer,
    toggleTimer,
    resetTimer
  };
}
