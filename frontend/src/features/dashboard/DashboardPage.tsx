import React, { useState } from 'react';
import { AICoachWidget } from '../ai_coach/AICoachWidget';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  MOCK_TASKS,
  MOCK_ANALYTICS_DATA,
  MOCK_TELEMETRY,
} from '../../api/mockData';
import {
  Target,
  Timer,
  Plus,
  ArrowRight,
  Flame,
  Bot,
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState(MOCK_TASKS);

  // Time of day calculation
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const nextTask = tasks.find((t) => t.status === 'TODO' || t.status === 'IN_PROGRESS') || tasks[0];

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED' }
          : t
      )
    );
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Mission Control Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/60 border border-cyan-500/25 shadow-[0_0_30px_rgba(0,240,255,0.08)] overflow-hidden backdrop-blur-2xl">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="blue" pulse>
                MISSION CONTROL ACTIVE
              </Badge>
              <span className="text-xs font-mono text-cyan-400/90 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {currentDateFormatted}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
              {getGreeting()},{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                {user?.firstName || 'Operator'}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 font-light max-w-xl">
              System telemetry is synchronized. Your focus rating is performing at optimal efficiency today.
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/focus')}
              leftIcon={<Timer className="w-4 h-4" />}
            >
              Start Focus
            </Button>
            <Button
              variant="neon-green"
              size="sm"
              onClick={() => navigate('/tasks')}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Task
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/goals')}
              leftIcon={<Target className="w-4 h-4 text-amber-400" />}
            >
              New Goal
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/journal')}
              leftIcon={<BookOpen className="w-4 h-4 text-cyan-400" />}
            >
              Journal
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Widget 1: Momentum Score */}
        <Card glow="blue" className="p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              MOMENTUM SCORE
            </span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono text-cyan-400 drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              94
            </span>
            <span className="text-xs font-mono text-slate-500">/ 100</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-emerald-400 font-semibold">+5.2% vs last cycle</span>
              <span className="text-cyan-400">OPTIMAL</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 w-[94%]" />
            </div>
          </div>
        </Card>

        {/* Widget 2: Today's Mission */}
        <Card glow="green" className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              TODAY'S MISSION
            </span>
            <Badge variant="green" pulse>
              ACTIVE
            </Badge>
          </div>

          <div className="my-2">
            <p className="text-sm font-semibold text-slate-100 line-clamp-2">
              Deploy Zero-Trust Authentication Protocol
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Priority: Critical</p>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
            <span className="text-cyan-400 font-mono">Progress: 65%</span>
            <button
              onClick={() => navigate('/tasks')}
              className="text-[11px] font-semibold text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              Execute <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </Card>

        {/* Widget 3: Next Task */}
        <Card glow="amber" className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              NEXT UP TASK
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>

          <div className="my-2">
            <p className="text-sm font-semibold text-slate-100 truncate">
              {nextTask.title}
            </p>
            <span className="text-xs font-mono text-amber-400 block mt-0.5">
              Est: {nextTask.estimatedMinutes} mins
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
            <span className="text-slate-400 text-[11px]">Due Today</span>
            <button
              onClick={() => toggleTask(nextTask.id)}
              className="text-[11px] font-semibold text-cyan-400 hover:underline flex items-center gap-0.5"
            >
              Complete <CheckCircle2 className="w-3 h-3" />
            </button>
          </div>
        </Card>

        {/* Widget 4: Focus Time Today */}
        <Card glow="blue" className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              FOCUS TIME TODAY
            </span>
            <Timer className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-100">
              4.5 <span className="text-xs font-normal text-slate-400">hrs</span>
            </span>
            <span className="text-xs font-mono text-cyan-400">/ 6.0 goal</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>3 Sessions Completed</span>
              <span className="text-emerald-400">75%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
              <div className="h-full rounded-full bg-cyan-400 w-[75%]" />
            </div>
          </div>
        </Card>

        {/* Widget 5: Current Streak */}
        <Card glow="amber" className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              CURRENT STREAK
            </span>
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              14
            </span>
            <span className="text-xs font-mono text-slate-400">Days Active</span>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-1">
            <span>Multiplier: 1.5x</span>
            <span className="text-emerald-400 font-semibold">BEST RECORD</span>
          </div>
        </Card>
      </div>

      {/* Main Analytics Visualization & AI Insight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Animated Recharts Weekly Progress Chart */}
        <Card glow="blue" className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-100">
                  Weekly Operational Progress
                </h3>
                <Badge variant="blue">TELEMETRY</Badge>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                MONITORING FOCUS HOURS VS EFFICIENCY INDEX
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Focus Hours
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Efficiency %
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ANALYTICS_DATA}>
                <defs>
                  <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00ff9d" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(56, 189, 248, 0.3)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="focusHours"
                  stroke="#00f0ff"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#focusGradient)"
                  name="Focus Hours"
                />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#00ff9d"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#efficiencyGradient)"
                  name="Efficiency %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right 1 Column: AI Intelligence Insight Card & System Telemetry */}
        <div className="space-y-6">
          {/* AI Intelligence Card */}
          <Card glow="green" className="p-6 relative overflow-hidden space-y-4 border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">AI Operational Insight</h3>
                  <span className="text-[10px] font-mono text-emerald-400">NEURAL TELEMETRY ENGINE</span>
                </div>
              </div>
              <Badge variant="green" pulse>
                AI_READY
              </Badge>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <p className="text-slate-200 leading-relaxed font-light">
                "Analysis indicates your peak flow productivity occurs between <span className="text-cyan-400 font-mono font-semibold">09:00 AM – 11:30 AM</span>. Completing high-complexity security tasks during this window increases weekly velocity by <span className="text-emerald-400 font-bold">+18%</span>."
              </p>
            </div>

            <Button
              variant="neon-green"
              size="sm"
              className="w-full justify-between"
              onClick={() => navigate('/focus')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Schedule Recommended Focus
            </Button>
          </Card>

          {/* System Security Telemetry Widget */}
          <Card glow="none" className="p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">System Telemetry</span>
              <span className="text-cyan-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SECURE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">CPU ALLOCATION</span>
                <span className="text-cyan-400 font-bold text-sm">{MOCK_TELEMETRY.cpuUsage}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">MEMORY POOL</span>
                <span className="text-emerald-400 font-bold text-sm">{MOCK_TELEMETRY.memoryUsage}%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* AI Coach Intelligence & Advisory Section */}
      <AICoachWidget />

      {/* Operational Task Workflows Feed */}
      <Card glow="none" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              Active Security & Operation Tasks
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              REAL-TIME MISSION BACKLOG & STATUS
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/tasks')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Manage Backlog
          </Button>
        </div>

        <div className="space-y-2.5">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              whileHover={{ x: 3 }}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 flex items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`p-1 rounded-lg border transition-colors ${
                    task.status === 'COMPLETED'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'border-slate-700 text-slate-500 hover:border-cyan-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="min-w-0">
                  <span
                    className={`text-sm font-semibold block truncate ${
                      task.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-slate-200'
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                    <span className="text-cyan-400">{task.category}</span>
                    <span>Due: {task.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant={
                    task.priority === 'CRITICAL'
                      ? 'red'
                      : task.priority === 'HIGH'
                      ? 'amber'
                      : 'blue'
                  }
                  pulse={task.priority === 'CRITICAL'}
                >
                  {task.priority}
                </Badge>
                <Badge
                  variant={
                    task.status === 'COMPLETED'
                      ? 'green'
                      : task.status === 'IN_PROGRESS'
                      ? 'blue'
                      : 'slate'
                  }
                >
                  {task.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};
