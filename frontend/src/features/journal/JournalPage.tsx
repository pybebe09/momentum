import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalApi, type CreateJournalPayload } from '../../api/journalApi';
import type { JournalEntry } from '../../types';
import { MOCK_JOURNAL_ENTRIES } from '../../api/mockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { JournalModal } from './JournalModal';
import {
  Plus,
  Search,
  Tag as TagIcon,
  Calendar as CalendarIcon,
  Zap,
  Edit2,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const JournalPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch entries via TanStack Query
  const { data: serverEntries, isLoading } = useQuery({
    queryKey: ['journal'],
    queryFn: journalApi.getEntries,
  });

  // Local fallback if initial backend query returns empty array
  const [localEntries, setLocalEntries] = useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);
  const entries = (serverEntries && serverEntries.length > 0) ? serverEntries : localEntries;

  // Search & Tag Filter states
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateJournalPayload) => journalApi.createEntry(data),
    onSuccess: (newEntry) => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      setLocalEntries((prev) => [newEntry, ...prev]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateJournalPayload> }) =>
      journalApi.updateEntry(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      setLocalEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => journalApi.deleteEntry(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      setLocalEntries((prev) => prev.filter((e) => e.id !== id));
    },
  });

  const handleOpenCreate = () => {
    setEditingEntry(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setModalOpen(true);
  };

  const handleSaveEntry = async (data: CreateJournalPayload, id?: string) => {
    if (id) {
      await updateMutation.mutateAsync({ id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm('Delete this daily reflection log?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch {
        setLocalEntries((prev) => prev.filter((e) => e.id !== id));
      }
    }
  };

  // Collect all unique tags
  const allTags = Array.from(new Set(entries.flatMap((e) => e.tags || [])));

  // Filtered Entries
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.content.toLowerCase().includes(search.toLowerCase()) ||
      (entry.question1 && entry.question1.toLowerCase().includes(search.toLowerCase())) ||
      (entry.question2 && entry.question2.toLowerCase().includes(search.toLowerCase())) ||
      (entry.question3 && entry.question3.toLowerCase().includes(search.toLowerCase()));

    const matchesTag = selectedTag === 'ALL' || (entry.tags && entry.tags.includes(selectedTag));
    const matchesDate = !selectedDate || entry.entryDate === selectedDate;

    return matchesSearch && matchesTag && matchesDate;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/50 border border-cyan-500/20 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">DAILY REFLECTION LOG</span>
            <Badge variant="blue" pulse>
              AUTOSAVE ACTIVE
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Operational Reflection Journal
          </h1>
          <p className="text-xs text-slate-400 font-light">
            Synthesize daily victories, bottlenecks, and focus objectives using three-question prompts.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          New Reflection Log
        </Button>
      </div>

      {/* Control Bar: Search, Calendar Date Filter, and Tag Chips */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-96">
            <Input
              placeholder="Search entries, questions, or markdown notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Calendar View / Date Filter Input */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <CalendarIcon className="w-4 h-4 text-cyan-400 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="text-xs font-mono text-slate-400 hover:text-cyan-400"
              >
                Clear Date
              </button>
            )}
          </div>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-800/60">
            <span className="text-xs font-mono text-slate-500 flex items-center gap-1 shrink-0">
              <TagIcon className="w-3 h-3 text-cyan-400" /> Filter Tag:
            </span>
            <button
              onClick={() => setSelectedTag('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-mono transition-all shrink-0 ${
                selectedTag === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'text-slate-400 bg-slate-950 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              ALL TAGS
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition-all shrink-0 ${
                  selectedTag === tag
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'text-slate-400 bg-slate-950 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Journal Entry Cards */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-xs">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          SYNCHRONIZING DAILY REFLECTIONS...
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <Card glow="blue" className="p-6 space-y-4 hover:border-cyan-500/40 transition-all">
                  {/* Top Meta Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant={entry.mood === 'OPTIMAL' ? 'green' : 'blue'} pulse>
                        MOOD: {entry.mood}
                      </Badge>
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> Energy: {entry.energyLevel}/10
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" /> {entry.entryDate}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(entry)}
                          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                          onClick={() => handleDeleteEntry(entry.id)}
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Entry Title */}
                  <h3 className="text-xl font-bold text-slate-100">{entry.title}</h3>

                  {/* Three Questions Display Cards */}
                  {(entry.question1 || entry.question2 || entry.question3) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {entry.question1 && (
                        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                          <span className="text-[10px] font-mono text-cyan-400 uppercase block">
                            1. MAIN VICTORY
                          </span>
                          <p className="text-xs text-slate-300 font-light leading-relaxed">
                            {entry.question1}
                          </p>
                        </div>
                      )}
                      {entry.question2 && (
                        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                          <span className="text-[10px] font-mono text-amber-400 uppercase block">
                            2. CHALLENGE / BOTTLENECK
                          </span>
                          <p className="text-xs text-slate-300 font-light leading-relaxed">
                            {entry.question2}
                          </p>
                        </div>
                      )}
                      {entry.question3 && (
                        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                          <span className="text-[10px] font-mono text-emerald-400 uppercase block">
                            3. TOMORROW'S FOCUS
                          </span>
                          <p className="text-xs text-slate-300 font-light leading-relaxed">
                            {entry.question3}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Markdown Content */}
                  {entry.content && (
                    <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300 font-light leading-relaxed">
                      <div dangerouslySetInnerHTML={{ __html: entry.content.replace(/\n/g, '<br/>') }} />
                    </div>
                  )}

                  {/* Tags Footer */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-2">
                      <TagIcon className="w-3.5 h-3.5 text-slate-500" />
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredEntries.length === 0 && (
        <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl space-y-2">
          <AlertTriangle className="w-8 h-8 mx-auto text-amber-400" />
          <p className="text-sm font-medium text-slate-300">No daily reflection logs match your search or date filter.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              setSearch('');
              setSelectedTag('ALL');
              setSelectedDate('');
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Journal Modal */}
      <JournalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveEntry}
        initialData={editingEntry}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};
