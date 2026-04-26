// Tipos para el modelo de datos de la app

export interface Chain {
  cid: string;
  name: string;
  imageKey: string; // Referencia al asset, no el módulo directamente
}

export interface Exercise {
  eid: string;
  showable: boolean;
  showableName: string;
  name: string;
  description: string;
  gifKey: string; // Referencia al asset, no el módulo directamente
  cid: string; // FK a Chain
}

export interface Routine {
  rid: string;
  type: 'general' | 'sport';
  name: string;
  sid: string | null; // FK a Sport, null para rutina general
}

export interface Sport {
  sid: string;
  name: string;
}

export interface ExerciseRoutine {
  erid: string;
  rid: string; // FK a Routine
  eid: string; // FK a Exercise
  position?: number; // Orden explícito (nuevo, no existía)
}

// Tipo para toda la base de datos
export interface Database {
  chains: Chain[];
  exercises: Exercise[];
  routines: Routine[];
  sports: Sport[];
  exercises_routines: ExerciseRoutine[];
}

// Tipos extendidos para uso en la app (con assets cargados)
export interface ChainWithAsset extends Omit<Chain, 'imageKey'> {
  image: any; // ImageSourcePropType de React Native
}

export interface ExerciseWithAsset extends Omit<Exercise, 'gifKey'> {
  gif: any; // ImageSourcePropType de React Native
}

// Tipos para perfil de usuario
export interface SportSelection {
  sid: string;
  name: string;
  checked: boolean;
}

export interface Profile {
  status: boolean; // practica deporte
  sports?: SportSelection[];
}

// Tipos para construcción de rutina
export interface RoutineSelection {
  rid: string;
  name: string;
  type: 'general' | 'sport';
  selected: boolean;
  level: 1 | 2 | 3;
  exercisesLength?: number;
  sid?: string | null;
}

export interface ChainSelection {
  cid: string;
  name: string;
  selected: boolean;
  level: 1 | 2 | 3;
  imageKey: string;
}

export interface UserSelection {
  routines: RoutineSelection[];
  chains?: ChainSelection[];
}

// Tipos para ejecución de rutina
export interface GeneratedExercise extends ExerciseWithAsset {
  rid?: string;
  group_name?: string;
}

export interface GroupedRoutine {
  [groupName: string]: GeneratedExercise[];
}

// Tipo para sesión completada (historial)
export interface CompletedSession {
  id: string;
  date: string; // ISO string
  totalSeconds: number;
  exercisesDone: number;
  routineNames: string[];
}
