// Hook para construcción de rutina personalizada
import {useState, useCallback} from 'react';
import {
  RoutineSelection,
  ChainSelection,
  UserSelection,
  GeneratedExercise,
  GroupedRoutine,
} from '../data/types';
import {
  getGeneratedRoutine,
  getGeneratedRoutineShowableExercises,
} from '../data/queries';

export const useRoutineBuilder = () => {
  const [routines, setRoutines] = useState<RoutineSelection[]>([]);
  const [chains, setChains] = useState<ChainSelection[]>([]);

  const toggleRoutineSelection = useCallback((rid: string) => {
    setRoutines(prev =>
      prev.map(r => (r.rid === rid ? {...r, selected: !r.selected} : r)),
    );
  }, []);

  const setRoutineLevel = useCallback((rid: string, level: 1 | 2 | 3) => {
    setRoutines(prev =>
      prev.map(r => (r.rid === rid ? {...r, level} : r)),
    );
  }, []);

  const toggleChainSelection = useCallback((cid: string) => {
    setChains(prev =>
      prev.map(c => (c.cid === cid ? {...c, selected: !c.selected} : c)),
    );
  }, []);

  const setChainLevel = useCallback((cid: string, level: 1 | 2 | 3) => {
    setChains(prev =>
      prev.map(c => (c.cid === cid ? {...c, level} : c)),
    );
  }, []);

  const calculateTotalMinutes = useCallback((): number => {
    const userSelection: UserSelection = {routines, chains};
    const exercises = getGeneratedRoutine(userSelection);
    
    // 20s ejercicio + 10s descanso por ejercicio
    const totalSeconds = exercises.length * (20 + 10);
    return Math.ceil(totalSeconds / 60);
  }, [routines, chains]);

  const generateRoutine = useCallback((): GeneratedExercise[] => {
    const userSelection: UserSelection = {routines, chains};
    return getGeneratedRoutine(userSelection);
  }, [routines, chains]);

  const generateGroupedRoutine = useCallback((): GroupedRoutine => {
    const userSelection: UserSelection = {routines, chains};
    return getGeneratedRoutineShowableExercises(userSelection);
  }, [routines, chains]);

  return {
    routines,
    chains,
    setRoutines,
    setChains,
    toggleRoutineSelection,
    setRoutineLevel,
    toggleChainSelection,
    setChainLevel,
    calculateTotalMinutes,
    generateRoutine,
    generateGroupedRoutine,
  };
};
