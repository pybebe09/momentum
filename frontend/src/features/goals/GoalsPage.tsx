import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi, type CreateGoalPayload } from '../../api/goalsApi';
import type { GoalItem } from '../../types';
import { MOCK_GOALS } from '../../api/mockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { GoalModal } from './GoalModal';
import {
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  Edit2,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GoalsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // TanStack Query for Goals
  const { data: serverGoals, isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: goalsApi.getGoals,
  });

  // Local state fallback for initial display
  const [localGoals, setLocalGoals] = useState<GoalItem[]>(MOCK_GOALS);
  const goals = (serverGoals && serverGoals.length > 0) ? serverGoals : localGoals;

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateGoalPayload) => goalsApi.createGoal(data),
    onSuccess: (newGoal) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setLocalGoals((prev) => [newGoal, ...prev]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGoalPayload> }) =>
      goalsApi.updateGoal(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setLocalGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => goalsApi.deleteGoal(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setLocalGoals((prev) => prev.filter((g) => g.id !== id));
    },
  });

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (goal: GoalItem) => {
    setEditingGoal(goal);
    setModalOpen(true);
  };

  const handleSaveGoal = async (data: CreateGoalPayload, id?: string) => {
    if (id) {
      await updateMutation.mutateAsync({ id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (window.confirm('Delete this strategic target goal?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch {
        setLocalGoals((prev) => prev.filter((g) => g.id !== id));
      }
    }
  };

  const handleToggleMilestone = async (goal: GoalItem, milestoneId: string) => {
    if (!goal.milestones) return;
    const updatedMilestones = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m
    );

    const completedCount = updatedMilestones.filter((m) => m.isCompleted).length;
    const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);

    const updatedData: Partial<CreateGoalPayload> = {
      milestones: updatedMilestones,
      currentProgress: newProgress,
      status: newProgress === 100 ? 'COMPLETED' : goal.status,
    };

    try {
      await updateMutation.mutateAsync({ id: goal.id, data: updatedData });
    } catch {
      setLocalGoals((prev) =>
        prev.map((g) =>
          g.id === goal.id
            ? { ...g, milestones: updatedMilestones, currentProgress: newProgress }
            : g
        )
      );
    }
  };

  // Filtered Goals list
  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      goal.title.toLowerCase().includes(search.toLowerCase()) ||
      goal.category.toLowerCase().includes(search.toLowerCase()) ||
      (goal.description && goal.description.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = categoryFilter === 'ALL' || goal.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', 'Japan', 'Cybersecurity', 'IELTS', 'SAT', 'Productivity', 'Mindfulness'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/50 border border-emerald-500/20 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400">MILESTONE TRACKER</span>
            <Badge variant="green" pulse>
              DRF SYNCHRONIZED
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Strategic Objectives & Goals
          </h1>
          <p className="text-xs text-slate-400 font-light">
            Track key milestones for Japan Relocation, Cybersecurity Certifications, IELTS & SAT Exams.
          </p>
        </div>

        <Button
          variant="neon-green"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          New Strategic Goal
        </Button>
      </div>

      {/* Control Bar: Search & Category Chips */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-3">
        <Input
          placeholder="Search goals by title, category (e.g. Japan, IELTS, SAT, Cybersecurity)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                categoryFilter === cat
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(0,255,157,0.2)]'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Goals Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-xs">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          FETCHING STRATEGIC OBJECTIVES...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGoals.map((goal) => {
              const percentage = Math.round(goal.currentProgress || goal.current_progress || 0);
              return (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card
                    glow={goal.status === 'ON_TRACK' ? 'green' : 'amber'}
                    className="p-6 space-y-4 flex flex-col justify-between h-full hover:border-emerald-500/40 transition-all"
                  >
                    <div className="space-y-3">
                      {/* Category & Status Row */}
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            goal.status === 'COMPLETED'
                              ? 'green'
                              : goal.status === 'ON_TRACK'
                              ? 'green'
                              : 'amber'
                          }
                          pulse={goal.status === 'ON_TRACK'}
                        >
                          {goal.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                          {goal.category}
                        </span>
                      </div>

                      {/* Goal Title & Description */}
                      <div>
                        <h3 className="text-lg font-bold text-slate-100">{goal.title}</h3>
                        {goal.description && (
                          <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
                            {goal.description}
                          </p>
                        )}
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-400">{goal.targetMetric}</span>
                          <span className="text-emerald-400 font-bold">{percentage}%</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              goal.status === 'COMPLETED' || goal.status === 'ON_TRACK'
                                ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_12px_rgba(0,255,157,0.4)]'
                                : 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Milestones Sub-List */}
                      {goal.milestones && goal.milestones.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-800">
                          <span className="text-[11px] font-mono text-slate-500 uppercase block">
                            Milestones Breakdown ({goal.milestones.filter((m) => m.isCompleted).length}/
                            {goal.milestones.length})
                          </span>
                          <div className="space-y-1">
                            {goal.milestones.map((m) => (
                              <div
                                key={m.id}
                                onClick={() => handleToggleMilestone(goal, m.id)}
                                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/40 border border-slate-800/80 hover:border-emerald-500/30 cursor-pointer text-xs transition-colors"
                              >
                                <CheckCircle2
                                  className={`w-4 h-4 shrink-0 ${
                                    m.isCompleted ? 'text-emerald-400' : 'text-slate-600'
                                  }`}
                                />
                                <span
                                  className={`truncate ${
                                    m.isCompleted ? 'line-through text-slate-500' : 'text-slate-300'
                                  }`}
                                >
                                  {m.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Row */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Deadline: {goal.deadline}
                      </span>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(goal)}
                          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                          onClick={() => handleDeleteGoal(goal.id)}
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredGoals.length === 0 && (
        <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl space-y-2">
          <AlertTriangle className="w-8 h-8 mx-auto text-amber-400" />
          <p className="text-sm font-medium text-slate-300">No strategic goals match your search or filter.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              setSearch('');
              setCategoryFilter('ALL');
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Goal Modal */}
      <GoalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveGoal}
        initialData={editingGoal}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};
