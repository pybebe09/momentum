export type UserRole = 'CEO' | 'ADMIN' | 'ANALYST';
export type ThemeMode = 'dark' | 'light';

export interface SystemTelemetry {
  momentumScore?: number;
  todayTasksCompleted?: number;
  todayTasksTotal?: number;
  focusMinutesToday?: number;
  currentStreakDays?: number;
  efficiencyIndex?: number;
  cpuUsage?: string | number;
  memoryUsage?: string | number;
  activeNodes?: number;
  syncLatencyMs?: number;
  uptimePercent?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  role?: UserRole;
  avatarUrl?: string;
  avatar_url?: string;
  isEmailVerified?: boolean;
  is_email_verified?: boolean;
  authProvider?: string;
  auth_provider?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  dueDate?: string;
  due_date?: string;
  estimatedMinutes?: number;
  estimated_minutes?: number;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export type GoalStatus = 'ON_TRACK' | 'AT_RISK' | 'COMPLETED';

export interface GoalMilestone {
  id: string;
  title: string;
  completed?: boolean;
  isCompleted?: boolean;
}

export interface GoalItem {
  id: string;
  title: string;
  description?: string;
  targetMetric?: string;
  target_metric?: string;
  currentProgress?: number;
  current_progress?: number;
  targetValue?: number;
  target_value?: number;
  unit: string;
  deadline: string;
  status: GoalStatus;
  category: string;
  milestones: GoalMilestone[];
  createdAt?: string;
  created_at?: string;
}

export type SessionType = 'POMODORO' | 'DEEP_WORK' | 'BREAK';

export interface FocusSession {
  id: string;
  title: string;
  durationMinutes?: number;
  duration_minutes?: number;
  sessionType?: SessionType;
  session_type?: SessionType;
  type?: SessionType;
  productivityRating?: number;
  productivity_rating?: number;
  completedAt?: string;
  completed_at?: string;
  task?: string | null;
  createdAt?: string;
  created_at?: string;
}

export type JournalMood = 'OPTIMAL' | 'FOCUSED' | 'FATIGUED' | 'STRESSED';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  question1?: string;
  question_1?: string;
  question2?: string;
  question_2?: string;
  question3?: string;
  question_3?: string;
  mood: JournalMood;
  energyLevel?: number;
  energy_level?: number;
  tags: string[];
  entryDate?: string;
  entry_date?: string;
  createdAt?: string;
  created_at?: string;
}

export interface UserSettings {
  theme: ThemeMode;
  language: string;
  timezone: string;
  email_digest?: boolean;
  emailDigest?: boolean;
  task_reminders?: boolean;
  taskReminders?: boolean;
  focus_alarms?: boolean;
  focusAlarms?: boolean;
  private_profile?: boolean;
  privateProfile?: boolean;
  share_telemetry?: boolean;
  shareTelemetry?: boolean;
}
