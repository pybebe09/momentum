import React, { useState, useEffect } from 'react';
import type { GoalItem, GoalMilestone } from '../../types';
import type { CreateGoalPayload } from '../../api/goalsApi';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { X, Target, Plus, Trash2, Save, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGoalPayload, id?: string) => Promise<void>;
  initialData?: GoalItem | null;
  isLoading?: boolean;
}

const CATEGORIES = ['Japan', 'Cybersecurity', 'IELTS', 'SAT', 'Productivity', 'Mindfulness'];

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Japan');
  const [targetMetric, setTargetMetric] = useState('');
  const [currentProgress, setCurrentProgress] = useState(0);
  const [targetValue, setTargetValue] = useState(100);
  const [unit, setUnit] = useState('%');
  const [deadline, setDeadline] = useState('Q4 2026');
  const [status, setStatus] = useState<'ON_TRACK' | 'AT_RISK' | 'COMPLETED'>('ON_TRACK');
  const [milestones, setMilestones] = useState<GoalMilestone[]>([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'Japan');
      setTargetMetric(initialData.targetMetric || '');
      setCurrentProgress(initialData.currentProgress || 0);
      setTargetValue(initialData.targetValue || 100);
      setUnit(initialData.unit || '%');
      setDeadline(initialData.deadline || 'Q4 2026');
      setStatus(initialData.status);
      setMilestones(initialData.milestones || []);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Japan');
      setTargetMetric('Target Milestone Completion');
      setCurrentProgress(0);
      setTargetValue(100);
      setUnit('%');
      setDeadline('Q4 2026');
      setStatus('ON_TRACK');
      setMilestones([
        { id: 'm1', title: 'Phase 1 Core Foundations', isCompleted: false },
        { id: 'm2', title: 'Phase 2 Practice & Examination', isCompleted: false },
      ]);
    }
    setError('');
  }, [initialData, isOpen]);

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    setMilestones((prev) => [
      ...prev,
      { id: 'm_' + Date.now(), title: newMilestoneTitle.trim(), isCompleted: false },
    ]);
    setNewMilestoneTitle('');
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleToggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isCompleted: !m.isCompleted } : m))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Goal title is required.');
      return;
    }

    try {
      await onSubmit(
        {
          title,
          description,
          category,
          targetMetric,
          currentProgress: Number(currentProgress),
          targetValue: Number(targetValue),
          unit,
          deadline,
          status,
          milestones,
        },
        initialData?.id
      );
      onClose();
    } catch {
      setError('Failed to save goal.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto"
          >
            <Card glow="green" className="p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">
                      {initialData ? 'Edit Strategic Goal' : 'Create Strategic Goal'}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {initialData ? `GOAL_ID: ${initialData.id}` : 'PROVISION NEW MILESTONE TARGET'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                    {error}
                  </div>
                )}

                <Input
                  label="GOAL TITLE"
                  placeholder="e.g. Japan Relocation & JLPT N2 Proficiency"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-300 tracking-wide uppercase">
                      CATEGORY
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-300 tracking-wide uppercase">
                      STATUS
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="ON_TRACK">ON TRACK</option>
                      <option value="AT_RISK">AT RISK</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="PROGRESS (%)"
                    type="number"
                    value={currentProgress}
                    onChange={(e) => setCurrentProgress(Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                  <Input
                    label="DEADLINE"
                    placeholder="e.g. Q4 2026"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>

                <Input
                  label="TARGET METRIC"
                  placeholder="e.g. JLPT Modules & Visa Documentation"
                  value={targetMetric}
                  onChange={(e) => setTargetMetric(e.target.value)}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-300 tracking-wide uppercase">
                    DESCRIPTION
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the scope and objective of this strategic goal..."
                    className="w-full px-4 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>

                {/* Milestones Builder Section */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-medium text-slate-300 tracking-wide uppercase block">
                    MILESTONES & BREAKDOWN ({milestones.filter((m) => m.isCompleted).length}/{milestones.length})
                  </span>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add sub-milestone task..."
                      value={newMilestoneTitle}
                      onChange={(e) => setNewMilestoneTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMilestone();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                    <Button type="button" variant="neon-green" size="sm" onClick={handleAddMilestone}>
                      Add
                    </Button>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
                    {milestones.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleMilestone(m.id)}
                            className={`p-1 rounded ${
                              m.isCompleted ? 'text-emerald-400' : 'text-slate-600 hover:text-slate-400'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <span className={m.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}>
                            {m.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(m.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="neon-green"
                    size="md"
                    isLoading={isLoading}
                    leftIcon={initialData ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  >
                    {initialData ? 'Save Goal' : 'Create Goal'}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
