import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useStudy } from '../context/StudyContext';
import {
  Brain,
  Flame,
  Clock,
  Layers,
  HelpCircle,
  FileText,
  Plus,
  ArrowRight,
  CheckSquare,
  Sparkles,
  BookOpen,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface DashboardViewProps {
  onOpenUpload: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenUpload }) => {
  const { user } = useAuth();
  const {
    materials,
    setActiveMaterialId,
    flashcards,
    quizzes,
    setActiveQuizId,
    tasks,
    toggleTaskCompleted,
    stats,
    setViewMode
  } = useStudy();

  const activeTasks = tasks.filter(t => !t.completed);
  const masteredCardsCount = flashcards.filter(c => c.mastered).length;
  const masteryPercentage = flashcards.length > 0 ? Math.round((masteredCardsCount / flashcards.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>StudyMate AI Active Session</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Scholar'}! 👋
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              You're on a <strong className="text-amber-400">{stats.activeStreak}-day streak</strong>! You have {activeTasks.length} study tasks scheduled for today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              id="dash-upload-cta-btn"
              onClick={onOpenUpload}
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Material</span>
            </button>
            <button
              id="dash-workspace-cta-btn"
              onClick={() => setViewMode('workspace')}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>AI Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Overview Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Hours */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Hours Studied</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {stats.totalHoursStudied}h
            </span>
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Goal: {user?.studyGoalHours || 25}h / week</p>
        </div>

        {/* Active Streak */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Streak</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {stats.activeStreak} Days
            </span>
            <span className="text-xs font-semibold text-amber-500">🔥 Hot</span>
          </div>
          <p className="text-[11px] text-slate-400">Personal best: 14 days</p>
        </div>

        {/* Flashcard Mastery */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Cards Mastered</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {masteredCardsCount} / {flashcards.length}
            </span>
            <span className="text-xs font-semibold text-indigo-500">{masteryPercentage}%</span>
          </div>
          <p className="text-[11px] text-slate-400">Leitner box spaced repetition</p>
        </div>

        {/* Quiz Score */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Quiz Avg. Score</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {stats.averageQuizScore}%
            </span>
            <span className="text-xs font-semibold text-emerald-500">Grade A</span>
          </div>
          <p className="text-[11px] text-slate-400">{stats.quizzesCompleted} quizzes completed</p>
        </div>
      </div>

      {/* Main Content Split: Recent Materials & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Study Materials (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span>Recent Study Materials</span>
            </h3>
            <button
              id="dash-view-all-materials-btn"
              onClick={() => setViewMode('workspace')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {materials.map(mat => (
              <div
                key={mat.id}
                onClick={() => {
                  setActiveMaterialId(mat.id);
                  setViewMode('workspace');
                }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold text-xs uppercase flex items-center justify-center shrink-0">
                    {mat.fileType}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {mat.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                        {mat.subject}
                      </span>
                      <span>•</span>
                      <span>{mat.pageCount || 10} pages</span>
                      <span>•</span>
                      <span>{mat.readProgress}% read</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    id={`open-mat-${mat.id}-btn`}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs group-hover:bg-purple-600 group-hover:text-white transition-all"
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Study Schedule Tasks & Quick Quiz (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Today's Study Schedule</span>
            </h3>
            <button
              id="dash-planner-view-btn"
              onClick={() => setViewMode('planner')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
            >
              Open Planner
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            {tasks.map(task => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-slate-100 dark:border-slate-800/60"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompleted(task.id)}
                  className="mt-1 w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 ${
                      task.completed ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="font-medium text-purple-600 dark:text-purple-400">{task.subject}</span>
                    <span>•</span>
                    <span>⏱ {task.estimatedMinutes}m</span>
                    {task.aiSuggested && (
                      <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold text-[10px]">
                        AI Suggested
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Quiz Card Banner */}
          {quizzes.length > 0 && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Recommended Practice Quiz
                </span>
                <span className="text-xs font-semibold text-amber-400">Score: {quizzes[0].lastScore || 85}%</span>
              </div>
              <h4 className="font-extrabold text-base">{quizzes[0].title}</h4>
              <p className="text-xs text-slate-300">{quizzes[0].questions.length} Questions • Instant AI Feedback</p>
              <button
                id="dash-start-quiz-btn"
                onClick={() => {
                  setActiveQuizId(quizzes[0].id);
                  setViewMode('quizzes');
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Start Practice Quiz Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
