import { axiosClient } from './axiosClient';
import type { JournalEntry } from '../types';
import { MOCK_JOURNAL_ENTRIES } from './mockData';

export interface CreateJournalPayload {
  title: string;
  content: string;
  question1?: string;
  question2?: string;
  question3?: string;
  mood: 'OPTIMAL' | 'FOCUSED' | 'FATIGUED' | 'STRESSED';
  energyLevel: number;
  tags: string[];
  entryDate: string;
}

const STORAGE_KEY = 'momentum_journal';

const getStoredEntries = (): JournalEntry[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse stored journal entries:", e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_JOURNAL_ENTRIES));
  return MOCK_JOURNAL_ENTRIES;
};

const saveStoredEntries = (entries: JournalEntry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error("Failed to save journal entries to storage:", e);
  }
};

export const journalApi = {
  getEntries: async (): Promise<JournalEntry[]> => {
    try {
      const response = await axiosClient.get<any>('/journal/');
      const rawData = Array.isArray(response.data) ? response.data : (response.data?.results || null);
      if (rawData !== null && Array.isArray(rawData)) {
        const fetchedEntries: JournalEntry[] = rawData.map((item) => ({
          id: String(item.id),
          title: item.title,
          content: item.content || '',
          question1: item.question_1 || '',
          question2: item.question_2 || '',
          question3: item.question_3 || '',
          mood: item.mood || 'FOCUSED',
          energyLevel: item.energy_level || 8,
          tags: item.tags || [],
          entryDate: item.entry_date || new Date().toISOString().split('T')[0],
          createdAt: item.created_at || new Date().toISOString(),
        }));
        saveStoredEntries(fetchedEntries);
        return fetchedEntries;
      }
    } catch (e) {
      console.warn("Backend unavailable, loading local persistence store.", e);
    }
    return getStoredEntries();
  },

  createEntry: async (payload: CreateJournalPayload): Promise<JournalEntry> => {
    const backendData = {
      title: payload.title,
      content: payload.content,
      question_1: payload.question1 || '',
      question_2: payload.question2 || '',
      question_3: payload.question3 || '',
      mood: payload.mood,
      energy_level: payload.energyLevel,
      tags: payload.tags,
      entry_date: payload.entryDate,
    };

    let newEntry: JournalEntry;
    try {
      const response = await axiosClient.post<any>('/journal/', backendData);
      const item = response.data;
      newEntry = {
        id: String(item.id),
        title: item.title,
        content: item.content || '',
        question1: item.question_1 || payload.question1 || '',
        question2: item.question_2 || payload.question2 || '',
        question3: item.question_3 || payload.question3 || '',
        mood: item.mood || payload.mood,
        energyLevel: item.energy_level || payload.energyLevel,
        tags: item.tags || payload.tags,
        entryDate: item.entry_date || payload.entryDate,
        createdAt: item.created_at || new Date().toISOString(),
      };
    } catch {
      newEntry = {
        id: `jnl-local-${Date.now()}`,
        title: payload.title,
        content: payload.content,
        question1: payload.question1 || '',
        question2: payload.question2 || '',
        question3: payload.question3 || '',
        mood: payload.mood,
        energyLevel: payload.energyLevel,
        tags: payload.tags,
        entryDate: payload.entryDate,
        createdAt: new Date().toISOString(),
      };
    }

    const current = getStoredEntries();
    const updated = [newEntry, ...current];
    saveStoredEntries(updated);
    return newEntry;
  },

  updateEntry: async (id: string, payload: Partial<CreateJournalPayload>): Promise<JournalEntry> => {
    const backendData: any = {};
    if (payload.title !== undefined) backendData.title = payload.title;
    if (payload.content !== undefined) backendData.content = payload.content;
    if (payload.question1 !== undefined) backendData.question_1 = payload.question1;
    if (payload.question2 !== undefined) backendData.question_2 = payload.question2;
    if (payload.question3 !== undefined) backendData.question_3 = payload.question3;
    if (payload.mood !== undefined) backendData.mood = payload.mood;
    if (payload.energyLevel !== undefined) backendData.energy_level = payload.energyLevel;
    if (payload.tags !== undefined) backendData.tags = payload.tags;

    try {
      await axiosClient.patch<any>(`/journal/${id}/`, backendData);
    } catch (e) {
      console.warn("Backend update journal error, updating local store.", e);
    }

    const current = getStoredEntries();
    let updatedEntry: JournalEntry | null = null;
    const updated = current.map((e) => {
      if (e.id === id) {
        updatedEntry = { ...e, ...payload };
        return updatedEntry;
      }
      return e;
    });
    saveStoredEntries(updated);
    return updatedEntry || { id, title: 'Updated', content: '', mood: 'FOCUSED', energyLevel: 8, tags: [], entryDate: '', createdAt: '', ...payload };
  },

  deleteEntry: async (id: string): Promise<void> => {
    try {
      await axiosClient.delete(`/journal/${id}/`);
    } catch (e) {
      console.warn("Backend delete journal error, removing from local store.", e);
    }

    const current = getStoredEntries();
    const updated = current.filter((e) => e.id !== id);
    saveStoredEntries(updated);
  },
};
