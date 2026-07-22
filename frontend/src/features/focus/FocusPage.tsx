import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MOCK_TASKS, MOCK_FOCUS_SESSIONS } from '../../api/mockData';
import type { TaskItem } from '../../types';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Shield,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FocusPage: React.FC = () => {
  // Timer State
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [customInput, setCustomInput] = useState('30');
  const [isMuted, setIsMuted] = useState(false);

  // Focus Mode Fullscreen Overlay State
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);

  // Selected Current Task
  const [selectedTask, setSelectedTask] = useState<TaskItem>(MOCK_TASKS[0]);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);

  // Timer Tick Interval Effect
  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft((sec) => sec - 1), 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      // Play completion chime simulation
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  // Preset Handlers
  const handlePreset = (mins: number) => {
    setIsCustom(false);
    setMinutes(mins);
    setSecondsLeft(mins * 60);
    setIsActive(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = Math.max(1, Math.min(180, Number(customInput) || 25));
    setMinutes(mins);
    setSecondsLeft(mins * 60);
    setIsActive(false);
    setIsCustom(false);
  };

  const handleToggleTimer = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  const handleResetTimer = useCallback(() => {
    setIsActive(false);
    setSecondsLeft(minutes * 60);
  }, [minutes]);

  const handleCompleteTask = useCallback(() => {
    setIsTaskCompleted(true);
    setIsActive(false);
    setTimeout(() => setIsTaskCompleted(false), 2500);
  }, []);

  const handleToggleFullscreen = () => {
    setIsFullscreenMode((prev) => !prev);
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'Escape') {
        setIsFullscreenMode(false);
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleToggleTimer();
      } else if (e.key.toLowerCase() === 'r') {
        handleResetTimer();
      } else if (e.key.toLowerCase() === 'c') {
        handleCompleteTask();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleTimer, handleResetTimer, handleCompleteTask]);

  // Time Formatter
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate Progress Percentage for Circular Ring
  const totalSecondsForPreset = minutes * 60;
  const progressPercent = Math.round(
    ((totalSecondsForPreset - secondsLeft) / totalSecondsForPreset) * 100
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/50 border border-cyan-500/20 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">DEEP WORK ENGINE</span>
            <Badge variant="blue" pulse>
              FLOW STATE ACTIVE
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Distraction-Free Focus Mode
          </h1>
          <p className="text-xs text-slate-400 font-light">
            Operate in timed focus cycles with keyboard shortcuts and fullscreen isolation.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleToggleFullscreen}
          leftIcon={<Maximize2 className="w-4 h-4" />}
        >
          Enter Fullscreen Focus
        </Button>
      </div>

      {/* Main Focus Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Cyber Pomodoro Interface */}
        <Card glow="blue" className="lg:col-span-2 flex flex-col items-center justify-center p-8 lg:p-12 space-y-8 text-center relative overflow-hidden">
          {/* Current Task Selector Header */}
          <div className="w-full max-w-md space-y-2">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
              CURRENT FOCUS MISSION
            </span>
            <select
              value={selectedTask.id}
              onChange={(e) => {
                const found = MOCK_TASKS.find((t) => t.id === e.target.value);
                if (found) setSelectedTask(found);
              }}
              className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-100 focus:border-cyan-400 focus:outline-none"
            >
              {MOCK_TASKS.map((t) => (
                <option key={t.id} value={t.id}>
                  [{t.priority}] {t.title} ({t.category})
                </option>
              ))}
            </select>
          </div>

          {/* Pomodoro Duration Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[25, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                onClick={() => handlePreset(mins)}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                  minutes === mins && !isCustom
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                    : 'text-slate-400 bg-slate-950/60 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {mins} MIN
              </button>
            ))}

            <button
              onClick={() => setIsCustom(!isCustom)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                isCustom
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 bg-slate-950/60 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              CUSTOM
            </button>
          </div>

          {/* Custom Duration Input Form */}
          {isCustom && (
            <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 max-w-xs">
              <input
                type="number"
                min="1"
                max="180"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Minutes"
                className="w-24 px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-950 border border-slate-800 text-slate-100 focus:border-cyan-400 focus:outline-none"
              />
              <Button type="submit" variant="neon-green" size="sm">
                Set Timer
              </Button>
            </form>
          )}

          {/* Glowing Radial Timer Ring & Display */}
          <div className="relative flex items-center justify-center w-72 h-72 my-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="144"
                cy="144"
                r="120"
                className="stroke-slate-900"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="144"
                cy="144"
                r="120"
                className="stroke-cyan-400 transition-all duration-1000 ease-linear"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  filter: isActive ? 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.6))' : 'none',
                }}
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-6xl font-mono font-extrabold tracking-widest text-slate-100 drop-shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                {formatTime(secondsLeft)}
              </span>
              <p className="text-xs font-mono text-cyan-400 tracking-wider">
                {isActive ? '● IN FLOW STATE' : '○ SESSION PAUSED'}
              </p>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant={isActive ? 'secondary' : 'primary'}
              size="lg"
              onClick={handleToggleTimer}
              leftIcon={isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            >
              {isActive ? 'Pause (Space)' : 'Start (Space)'}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleResetTimer}
              leftIcon={<RotateCcw className="w-5 h-5" />}
            >
              Reset (R)
            </Button>

            <Button
              variant="neon-green"
              size="lg"
              onClick={handleCompleteTask}
              leftIcon={<CheckCircle2 className="w-5 h-5" />}
            >
              Complete (C)
            </Button>
          </div>

          {/* Task Completion Banner Toast */}
          <AnimatePresence>
            {isTaskCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Mission Task Completed & Logged to Telemetry!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyboard Shortcuts Legend */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-6 text-[11px] font-mono text-slate-500">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Space</kbd> Pause/Resume</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">R</kbd> Reset</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">C</kbd> Complete</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Esc</kbd> Exit</span>
          </div>
        </Card>

        {/* Right Column: Focus History & Ambient Sound Options */}
        <div className="space-y-6">
          <Card glow="green" className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-100">Completed Sessions</h3>
              <Badge variant="green" pulse>
                TELEMETRY LOG
              </Badge>
            </div>

            <div className="space-y-3">
              {MOCK_FOCUS_SESSIONS.map((session) => (
                <div
                  key={session.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span>{session.title}</span>
                    <span className="text-cyan-400 font-mono">{session.durationMinutes} min</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{session.completedAt}</span>
                    <span className="text-emerald-400">Rating: ★ {session.productivityRating}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Ambient Sound Controls */}
          <Card glow="none" className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Ambient Background Audio</span>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 rounded text-slate-400 hover:text-slate-200"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              </button>
            </div>
            <p className="text-xs text-slate-400 font-light">
              Deep work cyber white-noise audio generator active.
            </p>
          </Card>
        </div>
      </div>

      {/* FULLSCREEN DISTRACTION-FREE OVERLAY */}
      <AnimatePresence>
        {isFullscreenMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-8 sm:p-12 overflow-hidden selection:bg-cyan-500 selection:text-slate-950"
          >
            {/* Top Fullscreen Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-100 tracking-wider">
                    MOMENTUM
                  </span>
                  <span className="text-[10px] block font-mono text-cyan-400">
                    DISTRACTION-FREE FULLSCREEN FOCUS
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                  Press <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300">Esc</kbd> to exit
                </span>
                <button
                  onClick={handleToggleFullscreen}
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-100 hover:border-cyan-400 transition-colors"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Middle Big Timer & Current Task */}
            <div className="flex flex-col items-center justify-center text-center space-y-8 my-auto max-w-2xl mx-auto">
              <div className="space-y-2">
                <Badge variant="blue" pulse className="px-4 py-1 text-sm">
                  {selectedTask.category} • {selectedTask.priority} PRIORITY
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                  {selectedTask.title}
                </h2>
              </div>

              {/* Big Timer */}
              <div className="relative flex items-center justify-center w-80 h-80 sm:w-96 sm:h-96">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="192"
                    cy="192"
                    r="160"
                    className="stroke-slate-900"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="192"
                    cy="192"
                    r="160"
                    className="stroke-cyan-400 transition-all duration-1000 ease-linear"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 160}
                    strokeDashoffset={2 * Math.PI * 160 * (1 - progressPercent / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    style={{
                      filter: isActive ? 'drop-shadow(0 0 25px rgba(0, 240, 255, 0.7))' : 'none',
                    }}
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center space-y-2">
                  <span className="text-7xl sm:text-8xl font-mono font-extrabold tracking-widest text-slate-100 drop-shadow-[0_0_35px_rgba(0,240,255,0.5)]">
                    {formatTime(secondsLeft)}
                  </span>
                  <p className="text-sm font-mono text-cyan-400 tracking-wider">
                    {isActive ? '● IN DEEP FLOW STATE' : '○ TIMER PAUSED'}
                  </p>
                </div>
              </div>

              {/* Fullscreen Action Controls */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  variant={isActive ? 'secondary' : 'primary'}
                  size="lg"
                  className="px-8 py-4 text-base"
                  onClick={handleToggleTimer}
                  leftIcon={isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                >
                  {isActive ? 'Pause' : 'Start'}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 py-4 text-base"
                  onClick={handleResetTimer}
                  leftIcon={<RotateCcw className="w-6 h-6" />}
                >
                  Reset
                </Button>

                <Button
                  variant="neon-green"
                  size="lg"
                  className="px-8 py-4 text-base"
                  onClick={handleCompleteTask}
                  leftIcon={<CheckCircle2 className="w-6 h-6" />}
                >
                  Complete Mission
                </Button>
              </div>
            </div>

            {/* Bottom Keyboard Legend */}
            <div className="flex items-center justify-center gap-8 text-xs font-mono text-slate-500 border-t border-slate-900 pt-4">
              <span><kbd className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">Space</kbd> Toggle</span>
              <span><kbd className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">R</kbd> Reset</span>
              <span><kbd className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">C</kbd> Complete</span>
              <span><kbd className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">Esc</kbd> Exit Fullscreen</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
