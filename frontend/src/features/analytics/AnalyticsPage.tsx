import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../../api/analyticsApi';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import {
  Zap,
  CheckCircle2,
  Flame,
  BookOpen,
  Sparkles,
  PieChart as PieChartIcon,
  Grid,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('7d');

  const { data: telemetry } = useQuery({
    queryKey: ['analytics_telemetry'],
    queryFn: analyticsApi.getTelemetry,
  });

  const overview = telemetry?.overview || {
    totalFocusHours: 42.5,
    totalStudyHours: 28.0,
    tasksCompleted: 54,
    currentStreakDays: 14,
    momentumScore: 94,
  };

  const dailyData = telemetry?.dailyData || [];
  const weeklyData = telemetry?.weeklyData || [];
  const monthlyData = telemetry?.monthlyData || [];
  const taskDistribution = telemetry?.taskStatusDistribution || [];
  const goalDistribution = telemetry?.goalProgressDistribution || [];

  const getCellDateString = (w: number, d: number) => {
    const today = new Date();
    const daysAgo = (51 - w) * 7 + (6 - d);
    const date = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return date.toISOString().split('T')[0];
  };

  // Generate 52 weeks x 7 days heatmap cells using real activeDates
  const generateHeatmapGrid = () => {
    const activeDatesSet = new Set(telemetry?.activeDates || []);
    const cells = [];
    for (let w = 0; w < 52; w++) {
      for (let d = 0; d < 7; d++) {
        const dateStr = getCellDateString(w, d);
        const isActive = activeDatesSet.has(dateStr);
        const intensity = isActive ? 3 : 0;
        cells.push({ week: w, day: d, intensity, date: dateStr });
      }
    }
    return cells;
  };

  const heatmapCells = generateHeatmapGrid();

  const getHeatmapColor = (intensity: number) => {
    switch (intensity) {
      case 4:
        return 'bg-emerald-400 shadow-[0_0_8px_rgba(0,255,157,0.8)]';
      case 3:
        return 'bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.6)]';
      case 2:
        return 'bg-cyan-500/50';
      case 1:
        return 'bg-slate-800';
      default:
        return 'bg-slate-900/60';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/50 border border-cyan-500/20 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">TELEMETRY ANALYTICS ENGINE</span>
            <Badge variant="blue" pulse>
              REALTIME DRF SYNCHRONIZED
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Performance Analytics & Insights
          </h1>
          <p className="text-xs text-slate-400 font-light">
            Comprehensive metric visualizations for Daily/Weekly completions, Focus vs Study time, Task status, and Activity Heatmap.
          </p>
        </div>

        {/* Time Range Filter Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                timeRange === range
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Top 5 Stat Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Focus Time"
          value={`${overview.totalFocusHours} hrs`}
          change="+14.2%"
          trend="up"
          accentColor="blue"
          icon={<Zap className="w-5 h-5 text-cyan-400" />}
        />
        <StatCard
          title="Total Study Time"
          value={`${overview.totalStudyHours} hrs`}
          change="+8.5%"
          trend="up"
          accentColor="green"
          icon={<BookOpen className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          title="Tasks Completed"
          value={overview.tasksCompleted}
          change="+12 this cycle"
          trend="up"
          accentColor="green"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          title="Current Streak"
          value={`${overview.currentStreakDays} Days`}
          change="Record"
          trend="neutral"
          accentColor="amber"
          icon={<Flame className="w-5 h-5 text-amber-400" />}
        />
        <StatCard
          title="Momentum Index"
          value={`${overview.momentumScore} / 100`}
          change="Peak State"
          trend="up"
          accentColor="blue"
          icon={<Sparkles className="w-5 h-5 text-cyan-400" />}
        />
      </div>

      {/* Row 1: Daily Completion & Focus vs Study Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Completion & Focus Area Chart */}
        <Card glow="blue" className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">Daily Completion & Focus Time</h3>
              <p className="text-xs text-slate-400 font-mono">HOURS SPENT IN FLOW STATE PER DAY</p>
            </div>
            <Badge variant="blue">Area Chart</Badge>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorDailyFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0.0} />
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
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="focusHours"
                  stroke="var(--accent-blue)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDailyFocus)"
                  name="Focus Hours"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Focus vs Study Time Bar Chart */}
        <Card glow="green" className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">Focus vs Academic Study Hours</h3>
              <p className="text-xs text-slate-400 font-mono">DEEP WORK VS JAPAN / IELTS / SAT DRILLS</p>
            </div>
            <Badge variant="green">Dual Bar Chart</Badge>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(0, 255, 157, 0.3)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="focusHours" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} name="Focus Hours" />
                <Bar dataKey="studyHours" fill="var(--accent-green)" radius={[4, 4, 0, 0]} name="Study Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2: Weekly & Monthly Completion Throughput */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Completion Bar Chart */}
        <Card glow="green" className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">Weekly Task Completion</h3>
              <p className="text-xs text-slate-400 font-mono">COMPLETED TASKS BY WEEK</p>
            </div>
            <Badge variant="green">Weekly Bar</Badge>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(0, 255, 157, 0.3)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="completedTasks" fill="var(--accent-green)" radius={[6, 6, 0, 0]} name="Tasks Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Completion Trend Area Chart */}
        <Card glow="blue" className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">Monthly Completion Trend</h3>
              <p className="text-xs text-slate-400 font-mono">MONTH-OVER-MONTH TASK OUTPUT</p>
            </div>
            <Badge variant="blue">Monthly Area</Badge>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(56, 189, 248, 0.3)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stroke="var(--accent-blue)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMonthly)"
                  name="Monthly Tasks"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 3: Task Status Distribution Pie Chart & Goal Progress Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Status Pie/Donut Chart */}
        <Card glow="blue" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">Task Status Distribution</h3>
              <p className="text-xs text-slate-400 font-mono">BACKLOG STATUS BREAKDOWN</p>
            </div>
            <PieChartIcon className="w-5 h-5 text-cyan-400" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(56, 189, 248, 0.3)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Goal Progress Distribution Bar Breakdown */}
        <Card glow="green" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">Goal Milestone Progress</h3>
              <p className="text-xs text-slate-400 font-mono">JAPAN, CYBERSECURITY, IELTS, SAT</p>
            </div>
            <Badge variant="green">Milestone Radar</Badge>
          </div>

          <div className="space-y-4 pt-2">
            {goalDistribution.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">{item.category} Objective</span>
                  <span className="text-emerald-400 font-bold">{item.progress}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_10px_rgba(0,255,157,0.4)]"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 4: 52-Week Glowing Activity Heatmap Grid */}
      <Card glow="green" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Annual Activity & Operational Heatmap</h3>
              <p className="text-xs text-slate-400 font-mono">52 WEEKS DEEP WORK & TASK EXECUTION MATRIX</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Less</span>
            <div className="flex gap-1">
              <span className="w-3 h-3 rounded bg-slate-900 border border-slate-800" />
              <span className="w-3 h-3 rounded bg-slate-800" />
              <span className="w-3 h-3 rounded bg-cyan-500/50" />
              <span className="w-3 h-3 rounded bg-cyan-400" />
              <span className="w-3 h-3 rounded bg-emerald-400" />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* 52 Columns Grid Container */}
        <div className="overflow-x-auto pt-2 pb-2">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-max">
            {heatmapCells.map((cell, idx) => (
              <div
                key={idx}
                title={`${cell.date}: ${cell.intensity > 0 ? 'Active Session / Task Completed' : 'No Activity'}`}
                className={`w-3.5 h-3.5 rounded-sm transition-all duration-200 hover:scale-125 cursor-pointer ${getHeatmapColor(
                  cell.intensity
                )}`}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
