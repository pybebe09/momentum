import React, { useState, useEffect } from 'react';
import type { TaskItem } from '../../types';
import type { CreateTaskPayload } from '../../api/tasksApi';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { X, CheckSquare, Plus, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskPayload, id?: string) => Promise<void>;
  initialData?: TaskItem | null;
  isLoading?: boolean;
}

const CATEGORIES = [
  'Security Architecture',
  'Telemetry',
  'UI/UX Design',
  'Backend Pipeline',
  'Analytics',
  'Infrastructure',
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED'>('TODO');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [category, setCategory] = useState('Security Architecture');
  const [dueDate, setDueDate] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setStatus(initialData.status);
      setPriority(initialData.priority);
      setCategory(initialData.category || 'Security Architecture');
      setDueDate(initialData.dueDate || new Date().toISOString().split('T')[0]);
      setEstimatedMinutes(initialData.estimatedMinutes || 60);
    } else {
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');
      setCategory('Security Architecture');
      setDueDate(new Date().toISOString().split('T')[0]);
      setEstimatedMinutes(60);
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      await onSubmit(
        {
          title,
          description,
          status,
          priority,
          category,
          dueDate,
          estimatedMinutes: Number(estimatedMinutes),
        },
        initialData?.id
      );
      onClose();
    } catch {
      setError('Failed to save task.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg z-10"
          >
            <Card glow="blue" className="p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">
                      {initialData ? 'Edit Operational Task' : 'Create Operational Task'}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {initialData ? `TASK_ID: ${initialData.id}` : 'PROVISION NEW MISSION BACKLOG ITEM'}
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
                  label="TASK TITLE"
                  placeholder="e.g. Audit Zero-Trust JWT Security Policies"
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
                      PRIORITY LEVEL
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-300 tracking-wide uppercase">
                      STATUS
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="TODO">TO DO</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="BLOCKED">BLOCKED</option>
                    </select>
                  </div>

                  <Input
                    label="ESTIMATED MINUTES"
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    min={5}
                  />
                </div>

                <Input
                  label="DUE DATE"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-300 tracking-wide uppercase">
                    DESCRIPTION & SCOPE
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide operational context and requirements..."
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                    leftIcon={initialData ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  >
                    {initialData ? 'Save Task' : 'Create Task'}
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
