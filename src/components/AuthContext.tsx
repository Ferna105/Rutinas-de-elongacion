// AuthContext: manejo de autenticación y perfil
import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {Profile} from '../data/types';
import {loadProfile, saveProfile, clearProfile} from '../storage';

interface AuthContextType {
  profile: Profile | null;
  isLoading: boolean;
  signIn: (profile: Profile) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Profile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredProfile();
  }, []);

  const loadStoredProfile = async () => {
    try {
      const stored = await loadProfile();
      setProfile(stored);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (newProfile: Profile) => {
    try {
      await saveProfile(newProfile);
      setProfile(newProfile);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await clearProfile();
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateProfile = async (updatedProfile: Profile) => {
    try {
      await saveProfile(updatedProfile);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        isLoading,
        signIn,
        signOut,
        updateProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
