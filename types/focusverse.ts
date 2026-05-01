export type Purpose =
  | "Study"
  | "Work"
  | "Exam Prep"
  | "Coding"
  | "Fitness"
  | "Personal Goals";

export type ProductivityLevel = "Beginner" | "Average" | "Disciplined";
export type PomodoroStyle = "25/5" | "50/10" | "90/15" | "Custom";
export type BestFocusTime = "Morning" | "Afternoon" | "Evening" | "Night";
export type Struggle =
  | "Procrastination"
  | "Backlog"
  | "No Planning"
  | "Inconsistency"
  | "Distractions";

export type TaskCategory = "Study" | "Coding" | "Work" | "Fitness" | "Personal" | "Exam";
export type TaskPriority = "Low" | "Medium" | "High";
export type ThemePreference = "Calm Light" | "Midnight Focus" | "System";

export type UserProfile = {
  name: string;
  purpose: Purpose;
  productivityLevel: ProductivityLevel;
  dailyAvailableHours: number;
  wakeTime: string;
  sleepTime: string;
  bestFocusTime: BestFocusTime;
  pomodoroStyle: PomodoroStyle;
  customFocusMinutes: number;
  customBreakMinutes: number;
  biggestStruggle: Struggle;
  theme: ThemePreference;
  onboarded: boolean;
};

export type Task = {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimatedMinutes: number;
  deadline: string;
  completed: boolean;
  snoozedCount: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  source?: "manual" | "divider" | "goal" | "recovery";
};

export type Subtask = {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimatedMinutes: number;
  urgent: boolean;
};

export type PomodoroSession = {
  id: string;
  focusMinutes: number;
  breakMinutes: number;
  mode: PomodoroStyle;
  completedAt: string;
};

export type Milestone = {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
};

export type Goal = {
  id: string;
  title: string;
  type: string;
  targetDate: string;
  weeklyTarget: string;
  dailySuggestion: string;
  milestones: Milestone[];
  createdAt: string;
};

export type PlannerBlockType =
  | "deep-work"
  | "pomodoro"
  | "break"
  | "lunch"
  | "review"
  | "shutdown"
  | "recovery";

export type PlannerBlock = {
  id: string;
  start: string;
  end: string;
  title: string;
  type: PlannerBlockType;
  taskId?: string;
  completed: boolean;
};

export type WeeklyActivity = {
  date: string;
  completedTasks: number;
  totalTasks: number;
  focusMinutes: number;
  plannedMinutes: number;
  pomodoros: number;
  backlogCompleted: number;
  delayedCategory?: TaskCategory;
};

export type BadgeId =
  | "first-pomodoro"
  | "three-day-streak"
  | "backlog-fighter"
  | "deep-work-hero"
  | "weekly-warrior"
  | "goal-crusher";

export type Badge = {
  id: BadgeId;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
};

export type AppData = {
  profile: UserProfile;
  tasks: Task[];
  pomodoroSessions: PomodoroSession[];
  goals: Goal[];
  plannerBlocks: PlannerBlock[];
  activity: WeeklyActivity[];
  badges: Badge[];
  xp: number;
  streak: number;
  level: number;
  demoMode?: boolean;
};

export type TaskFilters = {
  search: string;
  priority: "All" | TaskPriority;
  category: "All" | TaskCategory;
  status: "All" | "Open" | "Completed";
};

export type OnboardingTaskInput = {
  title: string;
  estimatedMinutes: number;
  priority: TaskPriority;
  deadline: string;
  category: TaskCategory;
};

export type OnboardingPayload = {
  profile: UserProfile;
  firstGoal?: {
    title: string;
    targetDate: string;
    weeklyTarget: string;
  };
  firstTasks: OnboardingTaskInput[];
};
