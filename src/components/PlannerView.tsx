import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import {
  Calendar,
  CheckSquare,
  Plus,
  Sparkles,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Filter
} from 'lucide-react';

export const PlannerView: React.FC = () => {
  const { tasks, toggleTaskCompleted, addTask, deleteTask, materials } = useStudy();

  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Artificial Intelligence');
  const [dueDate, setDueDate] = useState('2026-08-05');
  const [minutes, setMinutes] = useState(45);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('high');

  const filteredTasks = tasks.filter(t =>
    filterPriority === 'all' ? true : t.priority === filterPriority
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      subject,
      dueDate,
      estimatedMinutes: Number(minutes),
      priority,
      completed: false,
      aiSuggested: false
    });

    setTitle('');
    setShowAddModal(false);
  };

  const handleGenerateAiSchedule = () => {
    if (materials.length > 0) {
      materials.forEach((mat, i) => {
        addTask({
          title: `AI Block: Deep Review ${mat.title.slice(0, 24)}...`,
          subject: mat.subject,
          dueDate: new Date(Date.now() + (i + 1) * 86400000).toISOString().split('T')[0],
          estimatedMinutes: 50,
          priority: i === 0 ? 'high' : 'medium',
          completed: false,
          aiSuggested: true
        });
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-indigo-600" />
            <span>AI Study Planner</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Organize study blocks, exam prep deadlines, and daily Pomodoro sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="planner-gen-ai-schedule-btn"
            onClick={handleGenerateAiSchedule}
            className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Auto-Schedule with AI</span>
          </button>
          <button
            id="planner-add-task-btn"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-all cursor-pointer"
          >
            + New Task
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        {(['all', 'high', 'medium', 'low'] as const).map(p => (
          <button
            key={p}
            id={`filter-priority-${p}-btn`}
            onClick={() => setFilterPriority(p)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer capitalize ${
              filterPriority === p
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {p === 'all' ? 'All Deadlines' : `${p} Priority`}
          </button>
        ))}
      </div>

      {/* Task List Table / Cards */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-4 transition-all hover:bg-slate-100/60 dark:hover:bg-slate-800/80"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompleted(task.id)}
                  className="mt-1 w-5 h-5 accent-purple-600 rounded cursor-pointer shrink-0"
                />
                <div className="min-w-0">
                  <p
                    className={`font-semibold text-sm text-slate-900 dark:text-slate-100 ${
                      task.completed ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      {task.subject}
                    </span>
                    <span>•</span>
                    <span>Due: {task.dueDate}</span>
                    <span>•</span>
                    <span>⏱ {task.estimatedMinutes} mins</span>
                    {task.aiSuggested && (
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold text-[10px]">
                        AI Auto Scheduled
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                    task.priority === 'high'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : task.priority === 'medium'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {task.priority}
                </span>

                <button
                  id={`delete-task-${task.id}-btn`}
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">
            No study tasks in this view. Click + New Task to create one!
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Add New Study Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read Chapter 4 & solve exercise 3.2"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Est. Minutes</label>
                  <input
                    type="number"
                    value={minutes}
                    onChange={e => setMinutes(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
