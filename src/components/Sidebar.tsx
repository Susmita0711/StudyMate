import React from 'react';
import { useStudy } from '../context/StudyContext';
import { ViewMode } from '../types';
import {
  LayoutDashboard,
  Upload,
  FileText,
  Layers,
  HelpCircle,
  Calendar,
  BarChart2,
  Settings,
  Flame,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  onOpenUpload: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenUpload }) => {
  const { viewMode, setViewMode, stats, materials } = useStudy();

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'upload', label: 'Upload Notes', icon: <Upload className="w-5 h-5" /> },
    {
      id: 'workspace',
      label: 'PDF & AI Workspace',
      icon: <FileText className="w-5 h-5" />,
      badge: materials.length > 0 ? materials.length : undefined
    },
    { id: 'flashcards', label: 'Flashcards', icon: <Layers className="w-5 h-5" /> },
    { id: 'quizzes', label: 'Quiz Center', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'planner', label: 'Study Planner', icon: <Calendar className="w-5 h-5" /> },
    { id: 'progress', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleNavClick = (id: ViewMode) => {
    if (id === 'upload') {
      onOpenUpload();
    } else {
      setViewMode(id);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-4 min-h-[calc(100vh-4rem)] justify-between">
        <div className="space-y-6">
          
          {/* Active Streak Banner */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {stats.activeStreak} Day Study Streak!
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Keep learning daily</p>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const isActive = viewMode === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}-btn`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-purple-500/10 text-purple-600 dark:text-purple-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Tutor Mini Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-900/80 border border-purple-500/30 text-white space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Gemini 3.6 Flash</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            AI is ready to summarize, generate quizzes, and explain tough concepts.
          </p>
          <button
            id="sidebar-chat-prompt-btn"
            onClick={() => setViewMode('workspace')}
            className="w-full py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Open AI Workspace
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1 flex items-center justify-around">
        {navItems.slice(0, 5).map(item => {
          const isActive = viewMode === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}-btn`}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-1 truncate max-w-[64px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
