import React from 'react';
import { useStudy } from '../context/StudyContext';
import {
  BarChart2,
  TrendingUp,
  Flame,
  Clock,
  Layers,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { stats, flashcards } = useStudy();

  const maxHours = Math.max(...stats.weeklyHours.map(w => w.hours), 5);

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      
      {/* Top Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <BarChart2 className="w-7 h-7 text-purple-600" />
          <span>Progress & Analytics Dashboard</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Track weekly study hours, subject mastery, and quiz retention metrics.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-slate-400">Total Study Time</span>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
            {stats.totalHoursStudied} Hours
          </div>
          <p className="text-xs text-slate-500">Across all uploaded materials</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-slate-400">Current Streak</span>
          <div className="text-3xl font-extrabold text-amber-500 flex items-center gap-2">
            <span>{stats.activeStreak} Days</span>
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <p className="text-xs text-slate-500">Daily active learning habit</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-slate-400">Quiz Accuracy</span>
          <div className="text-3xl font-extrabold text-emerald-500">
            {stats.averageQuizScore}%
          </div>
          <p className="text-xs text-slate-500">Based on {stats.quizzesCompleted} completed quizzes</p>
        </div>
      </div>

      {/* Main Charts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Study Hours Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span>Weekly Study Activity (Hours)</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">This Week</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 dark:border-slate-800 pb-2">
            {stats.weeklyHours.map((wh, idx) => {
              const heightPercent = (wh.hours / maxHours) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {wh.hours}h
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl h-full flex items-end overflow-hidden p-1">
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-xl transition-all duration-500 group-hover:from-purple-500 group-hover:to-indigo-400"
                      style={{ height: `${Math.max(10, heightPercent)}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{wh.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Mastery Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>Subject Mastery Breakdown</span>
          </h3>

          <div className="space-y-4">
            {stats.subjectProgress.map((sp, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{sp.subject}</span>
                  <span className="text-purple-600 dark:text-purple-400">{sp.progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500 rounded-full"
                    style={{ width: `${sp.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
