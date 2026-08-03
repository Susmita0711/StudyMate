import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Settings,
  User,
  Brain,
  Database,
  Moon,
  Sun,
  Save,
  CheckCircle2,
  Trash2,
  Download
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || 'Stanford University');
  const [major, setMajor] = useState(user?.major || 'Computer Science');
  const [goalHours, setGoalHours] = useState(user?.studyGoalHours || 25);
  const [aiPersona, setAiPersona] = useState('academic');

  // Supabase credentials setting state
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');

  const [savedAlert, setSavedAlert] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      college,
      major,
      studyGoalHours: Number(goalHours)
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        user,
        materials: localStorage.getItem('studymate_materials'),
        flashcards: localStorage.getItem('studymate_flashcards'),
        quizzes: localStorage.getItem('studymate_quizzes')
      })
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "studymate_ai_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-purple-600" />
          <span>Profile & Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage user profile, AI persona preferences, and optional cloud database sync.
        </p>
      </div>

      {savedAlert && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Profile Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Student Profile</h3>
            <p className="text-xs text-slate-400">Update personal information</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email</label>
              <input
                type="email"
                disabled
                value={user?.email || 'student@university.edu'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-xs opacity-70"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">University / College</label>
              <input
                type="text"
                value={college}
                onChange={e => setCollege(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Major / Degree</label>
              <input
                type="text"
                value={major}
                onChange={e => setMajor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* AI Tutor Persona & Supabase Config */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AI Tutor Style */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-base">AI Tutor Persona</h3>
          </div>
          <div className="space-y-2">
            {[
              { id: 'academic', title: 'Rigorous Academic', desc: 'University professor style with precise terms.' },
              { id: 'eli5', title: 'ELI5 & Visual Analogies', desc: 'Explains complex topics using everyday metaphors.' },
              { id: 'socratic', title: 'Socratic Tutor', desc: 'Asks guiding questions to stimulate deep thinking.' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setAiPersona(p.id)}
                className={`w-full text-left p-3 rounded-2xl border text-xs transition-all cursor-pointer ${
                  aiPersona === p.id
                    ? 'border-purple-500 bg-purple-500/10 font-bold text-purple-600 dark:text-purple-300'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="font-bold">{p.title}</div>
                <div className="text-[11px] text-slate-400 font-normal">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Data & Appearance */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base">Data & Appearance</h3>
          </div>

          <div className="space-y-3">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer"
            >
              <span>Appearance Mode</span>
              <span className="flex items-center gap-1.5 text-purple-600">
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span className="capitalize">{theme} Mode</span>
              </span>
            </button>

            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              <span>Backup Study Data (JSON)</span>
              <Download className="w-4 h-4 text-purple-600" />
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 font-bold text-xs cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
