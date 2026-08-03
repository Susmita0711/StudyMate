import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import { INITIAL_USER } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  loginAsDemo: () => void;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('studymate_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  });

  const login = (email: string, name?: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name || email.split('@')[0] || 'Student',
      email,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`,
      college: 'University Scholar',
      major: 'Computer Science & Cognitive Science',
      studyGoalHours: 20,
      streakDays: 1,
    };
    setUser(newUser);
    localStorage.setItem('studymate_user', JSON.stringify(newUser));
  };

  const loginAsDemo = () => {
    setUser(INITIAL_USER);
    localStorage.setItem('studymate_user', JSON.stringify(INITIAL_USER));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studymate_user');
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!user) return;
    const newProfile = { ...user, ...updated };
    setUser(newProfile);
    localStorage.setItem('studymate_user', JSON.stringify(newProfile));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        loginAsDemo,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
