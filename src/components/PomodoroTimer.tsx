import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Flame, Bell } from 'lucide-react';

export const PomodoroTimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const MODE_TIMES = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      if (soundEnabled) {
        playBellSound();
      }
      if (mode === 'work') {
        setSessionsCompleted(prev => prev + 1);
        setMode('shortBreak');
        setTimeLeft(MODE_TIMES.shortBreak);
      } else {
        setMode('work');
        setTimeLeft(MODE_TIMES.work);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, soundEnabled]);

  const playBellSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      // Ignore if audio blocked
    }
  };

  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setTimeLeft(MODE_TIMES[newMode]);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalForMode = MODE_TIMES[mode];
  const progressPercent = ((totalForMode - timeLeft) / totalForMode) * 100;

  return (
    <div className="relative">
      {/* Compact Header Pill Trigger */}
      <button
        id="pomodoro-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-medium text-xs sm:text-sm border border-purple-500/20 transition-all cursor-pointer"
        title="Pomodoro Focus Timer"
      >
        <Flame className={`w-4 h-4 ${isRunning ? 'animate-pulse text-amber-500' : 'text-purple-500'}`} />
        <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
        {sessionsCompleted > 0 && (
          <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
            {sessionsCompleted}
          </span>
        )}
      </button>

      {/* Expanded Modal Popover */}
      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-80 p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Pomodoro Focus Timer</h4>
            </div>
            <div className="flex items-center gap-1">
              <button
                id="toggle-sound-btn"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                id="close-pomodoro-btn"
                onClick={() => setIsOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1.5"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl mb-4 text-xs font-medium">
            <button
              id="mode-work-btn"
              onClick={() => switchMode('work')}
              className={`py-1.5 rounded-lg transition-all ${
                mode === 'work'
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Focus (25m)
            </button>
            <button
              id="mode-short-break-btn"
              onClick={() => switchMode('shortBreak')}
              className={`py-1.5 rounded-lg transition-all ${
                mode === 'shortBreak'
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Short (5m)
            </button>
            <button
              id="mode-long-break-btn"
              onClick={() => switchMode('longBreak')}
              className={`py-1.5 rounded-lg transition-all ${
                mode === 'longBreak'
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Long (15m)
            </button>
          </div>

          {/* Timer Display Circle */}
          <div className="relative flex flex-col items-center justify-center my-4 py-3">
            <div className="text-4xl font-extrabold font-mono tracking-tight text-slate-800 dark:text-white">
              {formatTime(timeLeft)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 capitalize font-medium">
              {mode === 'work' ? '🧠 Deep Study Session' : '☕ Rest & Hydrate'}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mt-2">
            <button
              id="toggle-timer-btn"
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md hover:shadow-purple-500/25 transition-all"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              {isRunning ? 'Pause' : 'Start Focus'}
            </button>
            <button
              id="reset-timer-btn"
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(MODE_TIMES[mode]);
              }}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
