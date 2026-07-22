import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi, type CreateTaskPayload } from '../../api/tasksApi';
import type { TaskItem } from '../../types';
import { MOCK_TASKS } from '../../api/mockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TaskModal } from './TaskModal';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Edit2,
  Trash2,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TasksPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch tasks using TanStack Query
  const { data: serverTasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getTasks,
  });

  // Local fallback if server returns empty list initially
  const [localTasks, setLocalTasks] = useState<TaskItem[]>(MOCK_TASKS);
  const tasks = (serverTasks && serverTasks.length > 0) ? serverTasks : localTasks;

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title' | 'estimatedMinutes'>('dueDate');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateTaskPayload) => tasksApi.createTask(data),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setLocalTasks((prev) => [newTask, ...prev]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTaskPayload> }) =>
      tasksApi.updateTask(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setLocalTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setLocalTasks((prev) => prev.filter((t) => t.id !== id));
    },
  });

  // Modal Handlers
  const handleOpenCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (task: TaskItem) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = async (data: CreateTaskPayload, id?: string) => {
    if (id) {
      await updateMutation.mutateAsync({ id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleToggleComplete = async (task: TaskItem) => {
    const nextStatus = task.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
    try {
      await updateMutation.mutateAsync({ id: task.id, data: { status: nextStatus } });
    } catch {
      setLocalTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this operational task from backlog?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch {
        setLocalTasks((prev) => prev.filter((t) => t.id !== id));
      }
    }
  };

  // Priority weight for sorting
  const priorityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

  // Filter & Sort Logic (Memoized to prevent unnecessary re-computations on re-render)
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.category.toLowerCase().includes(search.toLowerCase()) ||
          (task.description || '').toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        if (sortBy === 'estimatedMinutes') {
          return (b.estimatedMinutes || b.estimated_minutes || 0) - (a.estimatedMinutes || a.estimated_minutes || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return new Date(a.dueDate || a.due_date || 0).getTime() - new Date(b.dueDate || b.due_date || 0).getTime();
      });
  }, [tasks, search, statusFilter, priorityFilter, sortBy]);

  // Progress metrics calculation
  const { completedCount, totalCount, progressPercent } = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const total = tasks.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completedCount: completed, totalCount: total, progressPercent: percent };
  }, [tasks]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Mission Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/50 border border-cyan-500/20 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">MISSION BACKLOG</span>
            <Badge variant="blue" pulse>
              DRF INTEGRATED
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Operational Task Management
          </h1>
          <p className="text-xs text-slate-400 font-light">
            Create, prioritize, execute, and monitor operational security tasks.
          </p>
        </div>

        {/* Progress Counter & Button */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 font-mono text-xs">
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">BACKLOG PROGRESS</span>
              <span className="text-cyan-400 font-bold">
                {completedCount} / {totalCount} ({progressPercent}%)
              </span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-cyan-400/40 flex items-center justify-center font-bold text-xs text-cyan-400">
              {progressPercent}%
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreate}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Sorting */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="w-full lg:w-96">
            <Input
              placeholder="Search by title, category, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" /> Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none"
            >
              <option value="dueDate">Due Date (Earliest)</option>
              <option value="priority">Priority (Highest)</option>
              <option value="estimatedMinutes">Duration (Longest)</option>
              <option value="title">Title (Alphabetical)</option>
            </select>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs">
          {/* Status Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-slate-500 font-mono mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" /> Status:
            </span>
            {(['ALL', 'TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-2.5 py-1 rounded-lg font-mono transition-all ${
                  statusFilter === tab
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Priority Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <span className="text-slate-500 font-mono mr-1">Priority:</span>
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded-lg font-mono transition-all ${
                  priorityFilter === p
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-xs">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          SYNCHRONIZING TASK BACKLOG FROM BACKEND...
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  glow={task.priority === 'CRITICAL' ? 'amber' : 'none'}
                  className="p-5 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left Checkbox & Info */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className={`mt-0.5 p-1.5 rounded-xl border transition-all ${
                          task.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(0,255,157,0.2)]'
                            : 'border-slate-700 text-slate-500 hover:border-cyan-400 hover:text-cyan-400'
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className={`text-base font-semibold transition-all ${
                              task.status === 'COMPLETED'
                                ? 'line-through text-slate-500'
                                : 'text-slate-100'
                            }`}
                          >
                            {task.title}
                          </h3>
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
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </div>

                        {task.description && (
                          <p className="text-xs text-slate-400 font-light leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 pt-1 flex-wrap">
                          <span className="text-cyan-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                            {task.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> {task.estimatedMinutes}m est
                          </span>
                          <span>Due: {task.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Actions Menu */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(task)}
                        leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                        onClick={() => handleDelete(task.id)}
                        leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTasks.length === 0 && (
            <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl space-y-2">
              <AlertTriangle className="w-8 h-8 mx-auto text-amber-400" />
              <p className="text-sm font-medium text-slate-300">No operational tasks match your filters.</p>
              <p className="text-xs text-slate-500 font-mono">
                Try resetting search parameters or create a new task.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('ALL');
                  setPriorityFilter('ALL');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveTask}
        initialData={editingTask}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};
