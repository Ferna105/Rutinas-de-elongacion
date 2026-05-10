// Hook para timer de ejercicios.
// Refactor para evitar setStates anidados y el warning
// "Maximum update depth exceeded".
import {useState, useEffect, useRef, useCallback} from 'react';

export interface TimerState {
  totalSeconds: number;
  exerciseSeconds: number;
  restSeconds: number;
  currentIndex: number;
  totalExercises: number;
  isRest: boolean;
  isActive: boolean;
  finished: boolean;
}

export const useExerciseTimer = (
  exerciseCount: number,
  exerciseDuration: number = 20,
  restDuration: number = 10,
) => {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [exerciseSeconds, setExerciseSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(restDuration);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRest, setIsRest] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [shouldPlayBeep, setShouldPlayBeep] = useState(false);

  // Refs para acceder a estado actual dentro del setInterval sin recrearlo
  const isActiveRef = useRef(isActive);
  const isRestRef = useRef(isRest);
  const exerciseSecondsRef = useRef(exerciseSeconds);
  const restSecondsRef = useRef(restSeconds);
  const currentIndexRef = useRef(currentIndex);
  const finishedRef = useRef(finished);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);
  useEffect(() => {
    isRestRef.current = isRest;
  }, [isRest]);
  useEffect(() => {
    exerciseSecondsRef.current = exerciseSeconds;
  }, [exerciseSeconds]);
  useEffect(() => {
    restSecondsRef.current = restSeconds;
  }, [restSeconds]);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);

  const toggleActive = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setTotalSeconds(0);
    setExerciseSeconds(0);
    setRestSeconds(restDuration);
    setCurrentIndex(0);
    setIsRest(true);
    setFinished(false);
    setShouldPlayBeep(false);
  }, [restDuration]);

  // Saltar al siguiente ejercicio (en fase de descanso para preparar al usuario).
  const goNext = useCallback(() => {
    if (currentIndexRef.current + 1 >= exerciseCount) {
      return;
    }
    setCurrentIndex(prev => prev + 1);
    setIsRest(true);
    setExerciseSeconds(0);
    setRestSeconds(restDuration);
    setShouldPlayBeep(false);
  }, [exerciseCount, restDuration]);

  // Volver al ejercicio anterior (en fase de descanso para repasar).
  const goPrevious = useCallback(() => {
    if (currentIndexRef.current <= 0) {
      // Reinicia el ejercicio actual si ya estamos en el primero.
      setIsRest(true);
      setExerciseSeconds(0);
      setRestSeconds(restDuration);
      setShouldPlayBeep(false);
      return;
    }
    setCurrentIndex(prev => prev - 1);
    setIsRest(true);
    setExerciseSeconds(0);
    setRestSeconds(restDuration);
    setShouldPlayBeep(false);
  }, [restDuration]);

  // Loop principal: un único setInterval que vive mientras el componente exista,
  // controlado por refs (evita recrear el interval ante cada cambio de estado).
  useEffect(() => {
    const id = setInterval(() => {
      if (!isActiveRef.current || finishedRef.current) {
        return;
      }

      setTotalSeconds(prev => prev + 1);

      if (isRestRef.current) {
        const next = restSecondsRef.current - 1;
        if (next <= 0) {
          // Termina descanso, empieza ejercicio
          setIsRest(false);
          setExerciseSeconds(0);
          setRestSeconds(restDuration);
          setShouldPlayBeep(false);
        } else {
          setRestSeconds(next);
          setShouldPlayBeep(next <= 3);
        }
      } else {
        const next = exerciseSecondsRef.current + 1;
        if (next >= exerciseDuration) {
          // Termina ejercicio
          const isLast = currentIndexRef.current + 1 >= exerciseCount;
          if (isLast) {
            setFinished(true);
            setIsActive(false);
            setExerciseSeconds(exerciseDuration);
            setShouldPlayBeep(false);
          } else {
            setCurrentIndex(prev => prev + 1);
            setIsRest(true);
            setExerciseSeconds(0);
            setRestSeconds(restDuration);
            setShouldPlayBeep(false);
          }
        } else {
          setExerciseSeconds(next);
          setShouldPlayBeep(exerciseDuration - next <= 3);
        }
      }
    }, 1000);

    return () => clearInterval(id);
  }, [exerciseDuration, restDuration, exerciseCount]);

  const state: TimerState = {
    totalSeconds,
    exerciseSeconds,
    restSeconds,
    currentIndex,
    totalExercises: exerciseCount,
    isRest,
    isActive,
    finished,
  };

  return {
    state,
    toggleActive,
    start,
    pause,
    reset,
    goNext,
    goPrevious,
    shouldPlayBeep,
  };
};
