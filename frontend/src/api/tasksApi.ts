import { axiosClient } from './axiosClient';
import type { TaskItem } from '../types';
import { MOCK_TASKS } from './mockData';

export interface CreateTaskPayload {
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  dueDate: string;
  estimatedMinutes: number;
}

const STORAGE_KEY = 'momentum_tasks';

const getStoredTasks = (): TaskItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse stored tasks:", e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_TASKS));
  return MOCK_TASKS;
};

const saveStoredTasks = (tasks: TaskItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks to storage:", e);
  }
};

export const tasksApi = {
  getTasks: async (): Promise<TaskItem[]> => {
    try {
      const response = await axiosClient.get<any[]>('/tasks/');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const fetchedTasks: TaskItem[] = response.data.map((item) => ({
          id: String(item.id),
          title: item.title,
          description: item.description || '',
          status: item.status || 'TODO',
          priority: item.priority || 'MEDIUM',
          category: item.category || 'General',
          dueDate: item.due_date || new Date().toISOString().split('T')[0],
          estimatedMinutes: item.estimated_minutes || 30,
        }));
        saveStoredTasks(fetchedTasks);
        return fetchedTasks;
      }
    } catch (e) {
      console.warn("Backend unavailable, loading local persistence store.", e);
    }
    return getStoredTasks();
  },

  createTask: async (payload: CreateTaskPayload): Promise<TaskItem> => {
    const backendData = {
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
      category: payload.category,
      due_date: payload.dueDate,
      estimated_minutes: payload.estimatedMinutes,
    };

    let newTask: TaskItem;
    try {
      const response = await axiosClient.post<any>('/tasks/', backendData);
      const item = response.data;
      newTask = {
        id: String(item.id),
        title: item.title,
        description: item.description || '',
        status: item.status || 'TODO',
        priority: item.priority || 'MEDIUM',
        category: item.category || 'General',
        dueDate: item.due_date || payload.dueDate,
        estimatedMinutes: item.estimated_minutes || payload.estimatedMinutes,
      };
    } catch {
      newTask = {
        id: `tsk-local-${Date.now()}`,
        ...payload,
      };
    }

    const current = getStoredTasks();
    const updated = [newTask, ...current];
    saveStoredTasks(updated);
    return newTask;
  },

  updateTask: async (id: string, payload: Partial<CreateTaskPayload>): Promise<TaskItem> => {
    const backendData: any = {};
    if (payload.title !== undefined) backendData.title = payload.title;
    if (payload.description !== undefined) backendData.description = payload.description;
    if (payload.status !== undefined) backendData.status = payload.status;
    if (payload.priority !== undefined) backendData.priority = payload.priority;
    if (payload.category !== undefined) backendData.category = payload.category;
    if (payload.dueDate !== undefined) backendData.due_date = payload.dueDate;
    if (payload.estimatedMinutes !== undefined) backendData.estimated_minutes = payload.estimatedMinutes;

    try {
      await axiosClient.patch<any>(`/tasks/${id}/`, backendData);
    } catch (e) {
      console.warn("Backend update error, updating local store.", e);
    }

    const current = getStoredTasks();
    let updatedTask: TaskItem | null = null;
    const updated = current.map((t) => {
      if (t.id === id) {
        updatedTask = { ...t, ...payload };
        return updatedTask;
      }
      return t;
    });
    saveStoredTasks(updated);
    return updatedTask || { id, title: 'Updated', description: '', status: 'TODO', priority: 'MEDIUM', category: 'General', dueDate: '', estimatedMinutes: 30, ...payload };
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      await axiosClient.delete(`/tasks/${id}/`);
    } catch (e) {
      console.warn("Backend delete error, removing from local store.", e);
    }

    const current = getStoredTasks();
    const updated = current.filter((t) => t.id !== id);
    saveStoredTasks(updated);
  },
};
