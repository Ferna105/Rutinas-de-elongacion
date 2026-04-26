// Hook para timer de ejercicios
// Corrige bugs: interval con deps correctas, pausa funcional
import {useState, useEffect, useRef, useCallback} from 'react';

export interface TimerState {
  totalSeconds: number;
  exerciseSeconds: number;
  restSeconds: number;
  currentIndex: number;
  totalExercises: number;
  isRest: boolean;
  isActive: boolean;
}

export const useExerciseTimer = (
  exerciseCount: number,
  exerciseDuration: number = 20,
  restDuration: number = 10,
) => {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [exerciseSeconds, setExerciseSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(restDuration); // Corrige bug: era 5
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRest, setIsRest] = useState(true); // Empieza con descanso
  const [isActive, setIsActive] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const toggleActive = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setTotalSeconds(0);
    setExerciseSeconds(0);
    setRestSeconds(restDuration);
    setCurrentIndex(0);
    setIsRest(true);
  }, [restDuration]);

  const nextExercise = useCallback(() => {
    if (currentIndex + 1 < exerciseCount) {
      setCurrentIndex(prev => prev + 1);
      setExerciseSeconds(0);
      setRestSeconds(restDuration);
      setIsRest(true);
    }
    return currentIndex + 1 >= exerciseCount; // Retorna true si terminó
  }, [currentIndex, exerciseCount, restDuration]);

  // Timer principal - Corrige bug: deps explícitas
  useEffect(() => {
    if (!isActive) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setTotalSeconds(prev => prev + 1);

      if (isRest) {
        setRestSeconds(prev => {
          if (prev <= 1) {
            // Cambiar a ejercicio
            setIsRest(false);
            setExerciseSeconds(0);
            return restDuration;
          }
          return prev - 1;
        });
      } else {
        setExerciseSeconds(prev => {
          if (prev >= exerciseDuration - 1) {
            // Cambiar a descanso o siguiente ejercicio
            const isFinished = nextExercise();
            if (!isFinished) {
              setIsRest(true);
              setRestSeconds(restDuration);
            }
            return 0;
          }
          return prev + 1;
        });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isRest, exerciseDuration, restDuration, nextExercise]);

  // Detectar si está en los últimos 3 segundos (para beep)
  const shouldPlayBeep =
    (isRest && restSeconds <= 3) ||
    (!isRest && exerciseSeconds >= exerciseDuration - 3);

  const state: TimerState = {
    totalSeconds,
    exerciseSeconds,
    restSeconds,
    currentIndex,
    totalExercises: exerciseCount,
    isRest,
    isActive,
  };

  return {
    state,
    toggleActive,
    reset,
    nextExercise,
    shouldPlayBeep,
  };
};
