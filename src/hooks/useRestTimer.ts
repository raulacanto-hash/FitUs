import { useState, useEffect, useRef, useCallback } from 'react';
import { unlockAudio, playRestTimerBeep } from '../utils/audio';

export interface RestTimerState {
  secondsRemaining: number;
  isActive: boolean;
  initialDuration: number;
  startTimer: (duration: number) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  adjustTimer: (secondsDelta: number) => void; // +15s o -15s
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

  // Ajustar tiempo (+15s / -15s)
  const adjustTimer = useCallback((secondsDelta: number) => {
    unlockAudio();
    const now = Date.now();

    if (targetEndTimeRef.current && isActive) {
      // Temporizador en marcha
      const updatedTarget = Math.max(now, targetEndTimeRef.current + secondsDelta * 1000);
      const diff = Math.max(0, Math.ceil((updatedTarget - now) / 1000));
      
      if (diff <= 0) {
        setIsActive(false);
        targetEndTimeRef.current = null;
        setSecondsRemaining(0);
      } else {
        targetEndTimeRef.current = updatedTarget;
        setSecondsRemaining(diff);
      }
    } else if (secondsRemaining > 0) {
      // Temporizador en pausa
      const newRemaining = Math.max(0, secondsRemaining + secondsDelta);
      setSecondsRemaining(newRemaining);
    } else if (secondsDelta > 0) {
      // Si estaba en 0 y sumamos +15s, iniciarlo
      startTimer(secondsDelta);
    }
  }, [isActive, secondsRemaining, startTimer]);

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
    resetTimer,
    adjustTimer
  };
}
