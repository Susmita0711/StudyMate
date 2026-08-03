import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useStudy } from '../context/StudyContext';
import { PomodoroTimer } from './PomodoroTimer';
import {
  Sparkles,
  Sun,
  Moon,
  Upload,
  User as UserIcon,
  Search,
  BookOpen,
  Brain,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings
} from 'lucide-react';

interface HeaderProps {
  onOpenUpload: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenUpload, onOpenAuth }) => {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { viewMode, setViewMode } = useStudy();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            id="brand-logo-btn"
            onClick={() => setViewMode(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-500 dark:from-purple-400 dark:to-indigo-300 bg-clip-text text-transparent">
                StudyMate <span className="font-light text-purple-600 dark:text-purple-400">AI</span>
              </span>
              <span className="block text-[10px] font-medium text-slate-400 -mt-1 tracking-wider uppercase">
                Smart Tutor
              </span>
            </div>
          </button>
        </div>

        {/* Global Action Bar / Pomodoro & Upload */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Pomodoro Timer */}
          <PomodoroTimer />

          {/* Quick Upload CTA */}
          <button
            id="header-upload-btn"
            onClick={onOpenUpload}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs sm:text-sm shadow-sm hover:shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Notes</span>
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Toggle Light/Dark Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* User Auth Profile / Login Button */}
          {isAuthenticated && user ? (
            <button
              id="user-profile-header-btn"
              onClick={() => setViewMode('settings')}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-purple-500/40"
              />
              <span className="hidden md:block text-xs font-semibold text-slate-700 dark:text-slate-200">
                {user.name}
              </span>
            </button>
          ) : (
            <button
              id="header-login-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
