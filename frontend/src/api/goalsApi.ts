import { axiosClient } from './axiosClient';
import type { GoalItem, GoalMilestone } from '../types';
import { MOCK_GOALS } from './mockData';

export interface CreateGoalPayload {
  title: string;
  description?: string;
  category: string;
  targetMetric: string;
  targetValue: number;
  currentProgress: number;
  unit: string;
  deadline: string;
  status: 'ON_TRACK' | 'AT_RISK' | 'COMPLETED';
  milestones?: GoalMilestone[];
}

const STORAGE_KEY = 'momentum_goals';

const getStoredGoals = (): GoalItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse stored goals:", e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_GOALS));
  return MOCK_GOALS;
};

const saveStoredGoals = (goals: GoalItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch (e) {
    console.error("Failed to save goals to storage:", e);
  }
};

export const goalsApi = {
  getGoals: async (): Promise<GoalItem[]> => {
    try {
      const response = await axiosClient.get<any>('/goals/');
      const rawData = Array.isArray(response.data) ? response.data : (response.data?.results || null);
      if (rawData !== null && Array.isArray(rawData)) {
        const fetchedGoals: GoalItem[] = rawData.map((item) => ({
          id: String(item.id),
          title: item.title,
          description: item.description || '',
          targetMetric: item.target_metric || 'Progress',
          currentProgress: item.current_progress || 0,
          targetValue: item.target_value || 100,
          unit: item.unit || '%',
          deadline: item.deadline || 'Q4 2026',
          status: item.status || 'ON_TRACK',
          category: item.category || 'General',
          milestones: item.milestones || [],
        }));
        saveStoredGoals(fetchedGoals);
        return fetchedGoals;
      }
    } catch (e) {
      console.warn("Backend unavailable, loading local persistence store.", e);
    }
    return getStoredGoals();
  },

  createGoal: async (payload: CreateGoalPayload): Promise<GoalItem> => {
    const backendData = {
      title: payload.title,
      description: payload.description,
      target_metric: payload.targetMetric,
      current_progress: payload.currentProgress,
      target_value: payload.targetValue,
      unit: payload.unit,
      deadline: payload.deadline,
      status: payload.status,
      category: payload.category,
      milestones: payload.milestones || [],
    };

    let newGoal: GoalItem;
    try {
      const response = await axiosClient.post<any>('/goals/', backendData);
      const item = response.data;
      newGoal = {
        id: String(item.id),
        title: item.title,
        description: item.description || '',
        targetMetric: item.target_metric || payload.targetMetric,
        currentProgress: item.current_progress || payload.currentProgress,
        targetValue: item.target_value || payload.targetValue,
        unit: item.unit || payload.unit,
        deadline: item.deadline || payload.deadline,
        status: item.status || payload.status,
        category: item.category || payload.category,
        milestones: item.milestones || payload.milestones || [],
      };
    } catch {
      newGoal = {
        id: `gl-local-${Date.now()}`,
        ...payload,
        milestones: payload.milestones || [],
      };
    }

    const current = getStoredGoals();
    const updated = [newGoal, ...current];
    saveStoredGoals(updated);
    return newGoal;
  },

  updateGoal: async (id: string, payload: Partial<CreateGoalPayload>): Promise<GoalItem> => {
    const backendData: any = {};
    if (payload.title !== undefined) backendData.title = payload.title;
    if (payload.description !== undefined) backendData.description = payload.description;
    if (payload.targetMetric !== undefined) backendData.target_metric = payload.targetMetric;
    if (payload.currentProgress !== undefined) backendData.current_progress = payload.currentProgress;
    if (payload.targetValue !== undefined) backendData.target_value = payload.targetValue;
    if (payload.unit !== undefined) backendData.unit = payload.unit;
    if (payload.deadline !== undefined) backendData.deadline = payload.deadline;
    if (payload.status !== undefined) backendData.status = payload.status;
    if (payload.category !== undefined) backendData.category = payload.category;
    if (payload.milestones !== undefined) backendData.milestones = payload.milestones;

    try {
      await axiosClient.patch<any>(`/goals/${id}/`, backendData);
    } catch (e) {
      console.warn("Backend update goal error, updating local store.", e);
    }

    const current = getStoredGoals();
    let updatedGoal: GoalItem | null = null;
    const updated = current.map((g) => {
      if (g.id === id) {
        updatedGoal = { ...g, ...payload };
        return updatedGoal;
      }
      return g;
    });
    saveStoredGoals(updated);
    return updatedGoal || { id, title: 'Updated', description: '', targetMetric: '', currentProgress: 0, targetValue: 100, unit: '%', deadline: '', status: 'ON_TRACK', category: '', milestones: [], ...payload };
  },

  deleteGoal: async (id: string): Promise<void> => {
    try {
      await axiosClient.delete(`/goals/${id}/`);
    } catch (e) {
      console.warn("Backend delete goal error, removing from local store.", e);
    }

    const current = getStoredGoals();
    const updated = current.filter((g) => g.id !== id);
    saveStoredGoals(updated);
  },
};
