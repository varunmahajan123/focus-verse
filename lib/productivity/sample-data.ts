import { AppData, Badge, Goal, Task, UserProfile, WeeklyActivity } from "@/types/focusverse";

const today = new Date();

function isoOffset(days: number) {
  const date = new Date(today);
  date.setDate(today.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function id(prefix: string, index: number) {
  return `${prefix}-${index}-${today.getFullYear()}`;
}

export const defaultProfile: UserProfile = {
  name: "",
  purpose: "Study",
  productivityLevel: "Average",
  dailyAvailableHours: 4,
  wakeTime: "07:30",
  sleepTime: "23:00",
  bestFocusTime: "Morning",
  pomodoroStyle: "25/5",
  customFocusMinutes: 35,
  customBreakMinutes: 8,
  biggestStruggle: "Procrastination",
  theme: "Calm Light",
  onboarded: false
};

export const defaultBadges: Badge[] = [
  {
    id: "first-pomodoro",
    title: "First Pomodoro",
    description: "Completed your first focus loop.",
    unlocked: false
  },
  {
    id: "three-day-streak",
    title: "3-Day Streak",
    description: "Showed up three days in a row.",
    unlocked: false
  },
  {
    id: "backlog-fighter",
    title: "Backlog Fighter",
    description: "Recovered delayed tasks calmly.",
    unlocked: false
  },
  {
    id: "deep-work-hero",
    title: "Deep Work Hero",
    description: "Crossed 3 focused hours in one day.",
    unlocked: false
  },
  {
    id: "weekly-warrior",
    title: "Weekly Warrior",
    description: "Built a full week of momentum.",
    unlocked: false
  },
  {
    id: "goal-crusher",
    title: "Goal Crusher",
    description: "Finished a long-term milestone.",
    unlocked: false
  }
];

export const sampleTasks: Task[] = [
  {
    id: id("task", 1),
    title: "Complete DSA Arrays chapter",
    category: "Coding",
    priority: "High",
    estimatedMinutes: 120,
    deadline: isoOffset(1),
    completed: false,
    snoozedCount: 1,
    createdAt: isoOffset(-2),
    updatedAt: isoOffset(-1)
  },
  {
    id: id("task", 2),
    title: "Revise operating systems notes",
    category: "Exam",
    priority: "Medium",
    estimatedMinutes: 70,
    deadline: isoOffset(2),
    completed: false,
    snoozedCount: 0,
    createdAt: isoOffset(-1),
    updatedAt: isoOffset(-1)
  },
  {
    id: id("task", 3),
    title: "Prepare weekly product roadmap",
    category: "Work",
    priority: "Medium",
    estimatedMinutes: 55,
    deadline: isoOffset(0),
    completed: false,
    snoozedCount: 0,
    createdAt: isoOffset(-1),
    updatedAt: isoOffset(0)
  },
  {
    id: id("task", 4),
    title: "30-minute mobility workout",
    category: "Fitness",
    priority: "Low",
    estimatedMinutes: 30,
    deadline: isoOffset(0),
    completed: true,
    snoozedCount: 0,
    createdAt: isoOffset(-1),
    updatedAt: isoOffset(0),
    completedAt: new Date().toISOString()
  },
  {
    id: id("task", 5),
    title: "Clean up inbox and admin backlog",
    category: "Personal",
    priority: "Low",
    estimatedMinutes: 45,
    deadline: isoOffset(-2),
    completed: false,
    snoozedCount: 3,
    createdAt: isoOffset(-5),
    updatedAt: isoOffset(-1)
  }
];

export const sampleGoals: Goal[] = [
  {
    id: id("goal", 1),
    title: "Learn DSA",
    type: "Learn DSA",
    targetDate: isoOffset(68),
    weeklyTarget: "12 problems and two revision loops",
    dailySuggestion: "Solve one array/string problem and review mistakes.",
    createdAt: isoOffset(-18),
    milestones: [
      { id: id("milestone", 1), title: "Arrays and strings", targetDate: isoOffset(8), completed: true },
      { id: id("milestone", 2), title: "Linked lists", targetDate: isoOffset(22), completed: false },
      { id: id("milestone", 3), title: "Trees and graphs", targetDate: isoOffset(48), completed: false }
    ]
  },
  {
    id: id("goal", 2),
    title: "Fitness transformation",
    type: "Fitness transformation",
    targetDate: isoOffset(90),
    weeklyTarget: "4 workouts and 3 walks",
    dailySuggestion: "Move for 30 minutes and stretch before sleep.",
    createdAt: isoOffset(-12),
    milestones: [
      { id: id("milestone", 4), title: "Build workout rhythm", targetDate: isoOffset(14), completed: true },
      { id: id("milestone", 5), title: "Increase strength baseline", targetDate: isoOffset(44), completed: false },
      { id: id("milestone", 6), title: "Maintain 4-week streak", targetDate: isoOffset(80), completed: false }
    ]
  }
];

export const sampleActivity: WeeklyActivity[] = Array.from({ length: 7 }).map((_, index) => {
  const completedTasks = [5, 7, 4, 8, 6, 7, 9][index];
  const totalTasks = [8, 9, 8, 9, 8, 8, 10][index];
  const focusMinutes = [95, 140, 70, 165, 130, 145, 190][index];
  return {
    date: isoOffset(index - 6),
    completedTasks,
    totalTasks,
    focusMinutes,
    plannedMinutes: 210,
    pomodoros: [4, 6, 3, 7, 5, 6, 8][index],
    backlogCompleted: [0, 1, 0, 2, 1, 1, 2][index],
    delayedCategory: ["Coding", "Personal", "Exam", "Coding", "Work", "Study", "Personal"][index] as WeeklyActivity["delayedCategory"]
  };
});

export function createInitialAppData(): AppData {
  return {
    profile: defaultProfile,
    tasks: [],
    pomodoroSessions: [],
    goals: [],
    plannerBlocks: [],
    activity: [],
    badges: defaultBadges,
    xp: 0,
    streak: 0,
    level: 1,
    demoMode: false
  };
}

export function createDemoAppData(profile?: Partial<UserProfile>): AppData {
  return {
    profile: {
      ...defaultProfile,
      ...profile,
      name: profile?.name || "Aarav",
      onboarded: true
    },
    tasks: sampleTasks,
    pomodoroSessions: [
      { id: id("pomodoro", 1), focusMinutes: 25, breakMinutes: 5, mode: "25/5", completedAt: isoOffset(-1) },
      { id: id("pomodoro", 2), focusMinutes: 50, breakMinutes: 10, mode: "50/10", completedAt: isoOffset(0) }
    ],
    goals: sampleGoals,
    plannerBlocks: [],
    activity: sampleActivity,
    badges: defaultBadges.map((badge) =>
      ["first-pomodoro", "three-day-streak", "deep-work-hero", "weekly-warrior"].includes(badge.id)
        ? { ...badge, unlocked: true, unlockedAt: isoOffset(-1) }
        : badge
    ),
    xp: 1280,
    streak: 4,
    level: 7,
    demoMode: true
  };
}
