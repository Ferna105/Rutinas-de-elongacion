// Storage wrapper tipado para AsyncStorage
// Corrige el bug de JSON.parse('') al hacer logout

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Profile, CompletedSession} from '../data/types';

const PROFILE_KEY = '@profile';
const SESSIONS_KEY = '@sessions';

// ========== PROFILE STORAGE ==========

export const saveProfile = async (profile: Profile): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

export const loadProfile = async (): Promise<Profile | null> => {
  try {
    const value = await AsyncStorage.getItem(PROFILE_KEY);
    
    // Corrige bug: manejar string vacío y null correctamente
    if (!value || value === '') {
      return null;
    }
    
    return JSON.parse(value);
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
};

export const clearProfile = async (): Promise<void> => {
  try {
    // Corrige bug: usar removeItem en vez de setItem('')
    await AsyncStorage.removeItem(PROFILE_KEY);
  } catch (error) {
    console.error('Error clearing profile:', error);
    throw error;
  }
};

// ========== SESSIONS HISTORY STORAGE ==========

export const saveSessions = async (
  sessions: CompletedSession[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving sessions:', error);
    throw error;
  }
};

export const loadSessions = async (): Promise<CompletedSession[]> => {
  try {
    const value = await AsyncStorage.getItem(SESSIONS_KEY);
    if (!value || value === '') {
      return [];
    }
    return JSON.parse(value);
  } catch (error) {
    console.error('Error loading sessions:', error);
    return [];
  }
};

export const addSession = async (
  session: CompletedSession,
): Promise<void> => {
  try {
    const sessions = await loadSessions();
    sessions.unshift(session); // Agregar al principio (más reciente)
    
    // Mantener solo las últimas 50 sesiones
    const trimmed = sessions.slice(0, 50);
    await saveSessions(trimmed);
  } catch (error) {
    console.error('Error adding session:', error);
    throw error;
  }
};

export const clearSessions = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SESSIONS_KEY);
  } catch (error) {
    console.error('Error clearing sessions:', error);
    throw error;
  }
};
