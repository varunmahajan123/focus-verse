import {
  AppData,
  Badge,
  Goal,
  Task,
  TaskCategory,
  WeeklyActivity
} from "@/types/focusverse";

export function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function daysBetween(dateA: string, dateB: string) {
  const a = new Date(`${dateA}T00:00:00`);
  const b = new Date(`${dateB}T00:00:00`);
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function isDeadlineNear(deadline: string) {
  const days = daysBetween(todayISO(), deadline);
  return days >= 0 && days <= 2;
}

export function isOverdue(task: Task) {
  return !task.completed && daysBetween(todayISO(), task.deadline) < 0;
}

export function analyzeBacklog(tasks: Task[], goals: Goal[]) {
  const backlogTasks = tasks.filter((task) => {
    const age = Math.abs(daysBetween(task.createdAt.slice(0, 10), todayISO()));
    return !task.completed && (isOverdue(task) || task.snoozedCount >= 2 || age >= 6);
  });

  const categoryMinutes = backlogTasks.reduce<Record<string, number>>((acc, task) => {
    acc[task.category] = (acc[task.category] ?? 0) + task.estimatedMinutes;
    return acc;
  }, {});

  const mostDelayedCategory =
    (Object.entries(categoryMinutes).sort((a, b) => b[1] - a[1])[0]?.[0] as TaskCategory | undefined) ??
    "Personal";

  const behindMilestones = goals.flatMap((goal) =>
    goal.milestones.filter(
      (milestone) => !milestone.completed && daysBetween(todayISO(), milestone.targetDate) < 0
    )
  );

  const estimatedMinutes =
    backlogTasks.reduce((total, task) => total + task.estimatedMinutes, 0) +
    behindMilestones.length * 45;
  const estimatedHours = Math.max(0.5, Math.round((estimatedMinutes / 60) * 10) / 10);
  const suggestedDailyTarget = Math.max(1, Math.ceil(backlogTasks.length / 4));

  return {
    backlogTasks,
    behindMilestones,
    count: backlogTasks.length + behindMilestones.length,
    estimatedMinutes,
    estimatedHours,
    mostDelayedCategory,
    suggestedDailyTarget,
    recoveryDays: Math.max(1, Math.ceil(Math.max(backlogTasks.length, 1) / suggestedDailyTarget))
  };
}

export function getPomodoroDurations(style: AppData["profile"]["pomodoroStyle"], profile: AppData["profile"]) {
  if (style === "50/10") {
    return { focus: 50, break: 10 };
  }
  if (style === "90/15") {
    return { focus: 90, break: 15 };
  }
  if (style === "Custom") {
    return {
      focus: Math.max(1, profile.customFocusMinutes || 35),
      break: Math.max(1, profile.customBreakMinutes || 8)
    };
  }
  return { focus: 25, break: 5 };
}

export function productivityScore(activity: WeeklyActivity[], streak: number) {
  const recent = activity.slice(-7);
  const totalTasks = recent.reduce((sum, day) => sum + day.totalTasks, 0);
  const completedTasks = recent.reduce((sum, day) => sum + day.completedTasks, 0);
  const focusMinutes = recent.reduce((sum, day) => sum + day.focusMinutes, 0);
  const plannedMinutes = recent.reduce((sum, day) => sum + day.plannedMinutes, 0);
  const taskScore = totalTasks > 0 ? (completedTasks / totalTasks) * 50 : 0;
  const focusScore = plannedMinutes > 0 ? Math.min(30, (focusMinutes / plannedMinutes) * 30) : 0;
  const streakBonus = Math.min(20, streak * 4);
  return Math.min(100, Math.round(taskScore + focusScore + streakBonus));
}

export function productivityLabel(score: number) {
  if (score <= 30) return "Getting Started";
  if (score <= 60) return "Improving";
  if (score <= 80) return "Productive";
  return "Peak Flow";
}

export function completionPercentage(tasks: Task[]) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100);
}

export function goalProgress(goal: Goal) {
  if (!goal.milestones.length) return 0;
  return Math.round(
    (goal.milestones.filter((milestone) => milestone.completed).length / goal.milestones.length) * 100
  );
}

export function updateBadges(data: AppData): Badge[] {
  const completedPomodoros = data.pomodoroSessions.length;
  const backlog = analyzeBacklog(data.tasks, data.goals);
  const completedGoals = data.goals.filter((goal) => goalProgress(goal) === 100).length;
  const totalFocus = data.activity.reduce((sum, day) => sum + day.focusMinutes, 0);
  const completedThisWeek = data.activity.reduce((sum, day) => sum + day.completedTasks, 0);

  return data.badges.map((badge) => {
    const shouldUnlock =
      (badge.id === "first-pomodoro" && completedPomodoros >= 1) ||
      (badge.id === "three-day-streak" && data.streak >= 3) ||
      (badge.id === "backlog-fighter" && backlog.count <= 2 && data.tasks.some((task) => task.source === "recovery")) ||
      (badge.id === "deep-work-hero" && totalFocus >= 180) ||
      (badge.id === "weekly-warrior" && completedThisWeek >= 35) ||
      (badge.id === "goal-crusher" && completedGoals >= 1);

    if (badge.unlocked || !shouldUnlock) {
      return badge;
    }

    return { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
  });
}

export function timeAwareBreakReminder(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Drink water, stretch your neck, and take three deep breaths.";
  if (hour < 16) return "Eat lunch if you skipped it, then walk for two minutes.";
  if (hour < 21) return "Reset your posture, rest your eyes, and do a short walk.";
  return "Late night focus is costly. Consider a sleep-friendly shutdown after this break.";
}

export function motivationNudge(score: number, backlogCount: number) {
  if (score < 35) {
    return "You do not need a perfect day. Just complete one 25-minute session.";
  }
  if (backlogCount > 3) {
    return "Your comeback plan is ready. We will keep the load small and steady.";
  }
  if (score > 80) {
    return "Peak flow is showing up. Protect the rhythm and celebrate the streak.";
  }
  return "Small progress still counts. Today only needs the next clean step.";
}
