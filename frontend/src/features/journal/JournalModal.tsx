import React, { useState, useEffect } from 'react';
import type { JournalEntry } from '../../types';
import type { CreateJournalPayload } from '../../api/journalApi';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { X, BookOpen, Save, Plus, Zap, Eye, Edit3, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJournalPayload, id?: string) => Promise<void>;
  initialData?: JournalEntry | null;
  isLoading?: boolean;
}

const MOOD_OPTIONS = ['OPTIMAL', 'FOCUSED', 'FATIGUED', 'STRESSED'] as const;

export const JournalModal: React.FC<JournalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');
  const [question3, setQuestion3] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<'OPTIMAL' | 'FOCUSED' | 'FATIGUED' | 'STRESSED'>('OPTIMAL');
  const [energyLevel, setEnergyLevel] = useState(8);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState<string[]>(['Architecture', 'Focus']);
  const [newTagInput, setNewTagInput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [autosavedTime, setAutosavedTime] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setQuestion1(initialData.question1 || '');
      setQuestion2(initialData.question2 || '');
      setQuestion3(initialData.question3 || '');
      setContent(initialData.content || '');
      setMood(initialData.mood);
      setEnergyLevel(initialData.energyLevel || 8);
      setEntryDate(initialData.entryDate || new Date().toISOString().split('T')[0]);
      setTags(initialData.tags || []);
    } else {
      setTitle(`Daily Reflection — ${new Date().toLocaleDateString()}`);
      setQuestion1('');
      setQuestion2('');
      setQuestion3('');
      setContent('');
      setMood('OPTIMAL');
      setEnergyLevel(8);
      setEntryDate(new Date().toISOString().split('T')[0]);
      setTags(['Focus', 'Telemetry']);
    }
    setPreviewMode(false);
    setError('');
  }, [initialData, isOpen]);

  // Debounced Autosave Simulation Effect
  useEffect(() => {
    if (!isOpen || !title) return;
    const timer = setTimeout(() => {
      const timeStr = new Date().toLocaleTimeString();
      setAutosavedTime(timeStr);
    }, 2000);
    return () => clearTimeout(timer);
  }, [title, question1, question2, question3, content, mood, energyLevel, isOpen]);

  const handleAddTag = () => {
    const trimmed = newTagInput.trim().replace(/^#/, '');
    if (!trimmed || tags.includes(trimmed)) return;
    setTags([...tags, trimmed]);
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Reflection log title is required.');
      return;
    }

    try {
      await onSubmit(
        {
          title,
          content,
          question1,
          question2,
          question3,
          mood,
          energyLevel: Number(energyLevel),
          tags,
          entryDate,
        },
        initialData?.id
      );
      onClose();
    } catch {
      setError('Failed to save reflection entry.');
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
            className="relative w-full max-w-2xl z-10 max-h-[92vh] overflow-y-auto"
          >
            <Card glow="blue" className="p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">
                      {initialData ? 'Edit Daily Reflection' : 'New Daily Reflection Log'}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                      <span>REFLECT & SYNTHESIZE</span>
                      {autosavedTime && (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Autosaved at {autosavedTime}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-mono bg-slate-950 border border-slate-800 text-slate-300 hover:border-cyan-400/40"
                  >
                    {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{previewMode ? 'Editor' : 'Markdown Preview'}</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="REFLECTION TITLE"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <Input
                    label="ENTRY DATE"
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                  />
                </div>

                {/* Mood & Energy Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300 tracking-wide uppercase block">
                      OPERATOR MOOD
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {MOOD_OPTIONS.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMood(m)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                            mood === m
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                              : 'text-slate-400 bg-slate-900 border border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300 uppercase">ENERGY LEVEL:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3" /> {energyLevel}/10
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={energyLevel}
                      onChange={(e) => setEnergyLevel(Number(e.target.value))}
                      className="w-full accent-cyan-400 bg-slate-900 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Three Questions Prompts */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                    DAILY THREE QUESTIONS PROMPT
                  </span>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 block">
                      1. What was your main victory/accomplishment today?
                    </label>
                    <textarea
                      rows={2}
                      value={question1}
                      onChange={(e) => setQuestion1(e.target.value)}
                      placeholder="Today I successfully deployed..."
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 block">
                      2. What challenge or bottleneck did you face?
                    </label>
                    <textarea
                      rows={2}
                      value={question2}
                      onChange={(e) => setQuestion2(e.target.value)}
                      placeholder="Faced minor latency bottleneck during..."
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 block">
                      3. What is your primary focus for tomorrow?
                    </label>
                    <textarea
                      rows={2}
                      value={question3}
                      onChange={(e) => setQuestion3(e.target.value)}
                      placeholder="Tomorrow my primary objective is..."
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* General Markdown Content */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 tracking-wide uppercase block">
                    GENERAL NOTES & MARKDOWN SYNTHESIS
                  </label>

                  {previewMode ? (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-[120px] text-xs text-slate-200 font-light leading-relaxed prose prose-invert">
                      {content ? (
                        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
                      ) : (
                        <p className="text-slate-500 italic">No markdown content written yet.</p>
                      )}
                    </div>
                  ) : (
                    <textarea
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write additional markdown notes, code snippets, or architectural thoughts..."
                      className="w-full px-4 py-2.5 rounded-xl text-xs font-mono bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none resize-none"
                    />
                  )}
                </div>

                {/* Tag Manager */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-medium text-slate-300 tracking-wide uppercase block">
                    TAGS ({tags.length})
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add tag (e.g. Architecture, Security)..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                      Add Tag
                    </Button>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-rose-400 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
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
                    {initialData ? 'Save Reflection' : 'Post Reflection'}
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
