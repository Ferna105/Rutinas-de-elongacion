// Queries tipadas para acceso a datos
// Corrige bugs del original: sin mutaciones, sin variables globales, defensas contra datos faltantes

import {database, getChainWithAsset, getExerciseWithAsset} from './database';
import {
  Chain,
  Exercise,
  Routine,
  Sport,
  ExerciseRoutine,
  Profile,
  UserSelection,
  ChainWithAsset,
  ExerciseWithAsset,
  GeneratedExercise,
  GroupedRoutine,
  RoutineSelection,
  ChainSelection,
} from './types';

// Duración (segundos) de cada ejercicio + descanso
export const EXERCISE_SECONDS = 20;
export const REST_SECONDS = 10;
export const EXERCISE_BLOCK_SECONDS = EXERCISE_SECONDS + REST_SECONDS;

// ========== QUERIES BÁSICAS ==========

export const getChains = (): ChainWithAsset[] => {
  return database.chains.map(getChainWithAsset);
};

export const getExercises = (): ExerciseWithAsset[] => {
  return database.exercises.map(getExerciseWithAsset);
};

export const getShowableExercises = (): ExerciseWithAsset[] => {
  return database.exercises
    .filter(ex => ex.showable)
    .map(getExerciseWithAsset);
};

// Corrige bug: variable global implícita del original
export const getExerciseByCid = (cid: string): ExerciseWithAsset[] => {
  const chainExercises = database.exercises.filter(ex => ex.cid === cid);
  return chainExercises.map(getExerciseWithAsset);
};

export const getSports = (): Sport[] => {
  return [...database.sports]; // Copia defensiva
};

// ========== QUERIES DE RUTINAS ==========

export const getRoutinesByType = (
  type: 'general' | 'sport',
): Routine & {exercisesLength: number} | null => {
  const routine = database.routines.find(r => r.type === type);
  if (!routine) return null;

  const exercisesLength = getRoutineLength(routine.rid);
  
  // No mutar: devolver nuevo objeto
  return {
    ...routine,
    exercisesLength,
  };
};

export const getRoutineBySid = (
  sid: string,
): Routine & {exercisesLength: number} | null => {
  const routine = database.routines.find(r => r.sid === sid);
  if (!routine) return null;

  const exercisesLength = getRoutineLength(routine.rid);
  
  return {
    ...routine,
    exercisesLength,
  };
};

interface RoutineWithExercises extends Routine {
  exercises: Array<
    ExerciseRoutine & {
      data: ExerciseWithAsset;
    }
  >;
}

export const getRoutineByRid = (rid: string): RoutineWithExercises | null => {
  const routine = database.routines.find(r => r.rid === rid);
  if (!routine) return null;

  const exerciseLinks = database.exercises_routines
    .filter(er => er.rid === rid)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  const exercisesWithData = exerciseLinks.map(link => {
    const exercise = database.exercises.find(ex => ex.eid === link.eid);
    return {
      ...link,
      data: exercise ? getExerciseWithAsset(exercise) : null!,
    };
  }).filter(item => item.data); // Filtrar nulls por seguridad

  // No mutar: devolver nuevo objeto
  return {
    ...routine,
    exercises: exercisesWithData,
  };
};

export const getRoutineLength = (rid: string): number => {
  return database.exercises_routines.filter(er => er.rid === rid).length;
};

// ========== HELPERS DE DURACIÓN EN MINUTOS ==========

// Minutos para una rutina/cadena de N ejercicios repetida `level` veces.
export const minutesForLevel = (
  exercisesLength: number,
  level: 1 | 2 | 3,
): number => {
  return Math.ceil(
    (level * exercisesLength * EXERCISE_BLOCK_SECONDS) / 60,
  );
};

// Calcula minutos totales para una selección parcial (rutinas y/o cadenas).
export const calculateTotalMinutes = (
  routines: RoutineSelection[] = [],
  chains: ChainSelection[] = [],
): number => {
  const exercises = getGeneratedRoutine({routines, chains});
  const totalSeconds = exercises.length * EXERCISE_BLOCK_SECONDS;
  return Math.ceil(totalSeconds / 60);
};

// ========== QUERIES PARA UI DE USUARIO ==========

export const getUserRoutines = (profile: Profile): RoutineSelection[] => {
  const routines: RoutineSelection[] = [];

  // Siempre incluir rutina general
  const generalRoutine = getRoutinesByType('general');
  if (generalRoutine) {
    routines.push({
      ...generalRoutine,
      selected: true, // Pre-seleccionada por defecto
      level: 1,
    });
  }

  // Corrige bug: defensas contra profile.status true pero sports faltante/vacío
  if (profile.status && profile.sports && profile.sports.length > 0) {
    profile.sports.forEach(sport => {
      const sportRoutine = getRoutineBySid(sport.sid);
      if (sportRoutine) {
        routines.push({
          ...sportRoutine,
          selected: false,
          level: 1,
        });
      }
    });
  }

  return routines;
};

// ========== GENERACIÓN DE RUTINA PARA EJECUCIÓN ==========

export const getGeneratedRoutine = (
  userSelection: UserSelection,
): GeneratedExercise[] => {
  const exercises: GeneratedExercise[] = [];

  // Procesar rutinas seleccionadas
  if (userSelection.routines) {
    userSelection.routines
      .filter(r => r.selected)
      .forEach(routine => {
        const routineData = getRoutineByRid(routine.rid);
        if (!routineData) return;

        // Repetir según nivel
        for (let i = 0; i < routine.level; i++) {
          routineData.exercises.forEach(ex => {
            exercises.push(ex.data);
          });
        }
      });
  }

  // Procesar cadenas accesorias seleccionadas
  if (userSelection.chains) {
    userSelection.chains
      .filter(c => c.selected)
      .forEach(chain => {
        const chainExercises = getExerciseByCid(chain.cid);

        // Repetir según nivel
        for (let i = 0; i < chain.level; i++) {
          chainExercises.forEach(ex => {
            exercises.push(ex);
          });
        }
      });
  }

  return exercises;
};

export const getGeneratedRoutineShowableExercises = (
  userSelection: UserSelection,
): GroupedRoutine => {
  const exercisesWithGroup: Array<GeneratedExercise & {group_name: string}> = [];

  // Procesar rutinas seleccionadas
  if (userSelection.routines) {
    userSelection.routines
      .filter(r => r.selected)
      .forEach(routine => {
        const routineData = getRoutineByRid(routine.rid);
        if (!routineData) return;

        // Repetir según nivel
        for (let i = 0; i < routine.level; i++) {
          routineData.exercises.forEach(ex => {
            exercisesWithGroup.push({
              ...ex.data,
              rid: routine.rid,
              group_name: routine.name,
            });
          });
        }
      });
  }

  // Procesar cadenas accesorias
  if (userSelection.chains) {
    userSelection.chains
      .filter(c => c.selected)
      .forEach(chain => {
        const chainExercises = getExerciseByCid(chain.cid);

        for (let i = 0; i < chain.level; i++) {
          chainExercises.forEach(ex => {
            exercisesWithGroup.push({
              ...ex,
              rid: '0', // Indicador de accesorio
              group_name: 'Accesorios',
            });
          });
        }
      });
  }

  // Deduplicar por eid
  const uniqueMap = new Map<string, GeneratedExercise & {group_name: string}>();
  exercisesWithGroup.forEach(ex => {
    if (ex.showable && !uniqueMap.has(ex.eid)) {
      uniqueMap.set(ex.eid, ex);
    }
  });

  // Agrupar por group_name
  const grouped: GroupedRoutine = {};
  Array.from(uniqueMap.values()).forEach(ex => {
    const groupName = ex.group_name || 'Sin grupo';
    if (!grouped[groupName]) {
      grouped[groupName] = [];
    }
    grouped[groupName].push(ex);
  });

  return grouped;
};
