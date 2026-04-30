"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AppData,
  Goal,
  OnboardingPayload,
  PlannerBlock,
  PomodoroSession,
  Subtask,
  Task,
  UserProfile,
  WeeklyActivity
} from "@/types/focusverse";
import {
  clearFocusverseData,
  loadFocusverseData,
  saveFocusverseData
} from "@/lib/storage/focusverse-storage";
import { createDemoAppData, createInitialAppData } from "@/lib/productivity/sample-data";
import { analyzeBacklog, todayISO, uid, updateBadges } from "@/lib/productivity/metrics";
import { generatePlanner } from "@/lib/planner/generate-planner";

function emptyTodayActivity(): WeeklyActivity {
  return {
    date: todayISO(),
    completedTasks: 0,
    totalTasks: 0,
    focusMinutes: 0,
    plannedMinutes: 0,
    pomodoros: 0,
    backlogCompleted: 0
  };
}

function upsertTodayActivity(
  activity: WeeklyActivity[],
  updater: (today: WeeklyActivity) => WeeklyActivity
) {
  const date = todayISO();
  const existingIndex = activity.findIndex((day) => day.date === date);
  if (existingIndex === -1) {
    return [...activity, updater(emptyTodayActivity())].slice(-30);
  }
  return activity.map((day, index) => (index === existingIndex ? updater(day) : day));
}

export function useFocusverseApp() {
  const [data, setData] = useState<AppData>(() => createInitialAppData());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadFocusverseData();
    setData(stored ?? createInitialAppData());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveFocusverseData(data);
    }
  }, [data, hydrated]);

  const patchData = (updater: (current: AppData) => AppData) => {
    setData((current) => {
      const next = updater(current);
      return { ...next, badges: updateBadges(next) };
    });
  };

  const completeOnboarding = (payload: OnboardingPayload) => {
    const now = new Date().toISOString();
    const initialTasks: Task[] = payload.firstTasks
      .filter((task) => task.title.trim())
      .map((task) => ({
        id: uid("task"),
        title: task.title.trim(),
        category: task.category,
        priority: task.priority,
        estimatedMinutes: task.estimatedMinutes,
        deadline: task.deadline,
        completed: false,
        snoozedCount: 0,
        createdAt: now,
        updatedAt: now,
        source: "manual"
      }));
    const firstGoal: Goal | null = payload.firstGoal?.title.trim()
      ? {
          id: uid("goal"),
          title: payload.firstGoal.title.trim(),
          type: payload.profile.purpose,
          targetDate: payload.firstGoal.targetDate,
          weeklyTarget: payload.firstGoal.weeklyTarget || "Make steady weekly progress",
          dailySuggestion: `Spend 25 minutes on ${payload.firstGoal.title.trim()}.`,
          createdAt: now,
          milestones: [
            {
              id: uid("milestone"),
              title: "First meaningful milestone",
              targetDate: payload.firstGoal.targetDate,
              completed: false
            }
          ]
        }
      : null;

    patchData((current) => ({
      ...current,
      profile: { ...payload.profile, onboarded: true },
      tasks: initialTasks,
      goals: firstGoal ? [firstGoal] : [],
      activity: initialTasks.length
        ? upsertTodayActivity(current.activity, (day) => ({
            ...day,
            totalTasks: Math.max(day.totalTasks, initialTasks.length),
            plannedMinutes: initialTasks.reduce((sum, task) => sum + task.estimatedMinutes, 0)
          }))
        : current.activity,
      demoMode: false
    }));
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    patchData((current) => ({
      ...current,
      profile: { ...current.profile, ...profile }
    }));
  };

  const addTask = (task: Omit<Task, "id" | "completed" | "snoozedCount" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    patchData((current) => ({
      ...current,
      tasks: [
        {
          ...task,
          id: uid("task"),
          completed: false,
          snoozedCount: 0,
          createdAt: now,
          updatedAt: now
        },
        ...current.tasks
      ],
      activity: upsertTodayActivity(current.activity, (day) => ({
        ...day,
        totalTasks: day.totalTasks + 1,
        plannedMinutes: day.plannedMinutes + task.estimatedMinutes
      }))
    }));
  };

  const addSubtasks = (subtasks: Subtask[], deadline: string) => {
    const now = new Date().toISOString();
    patchData((current) => ({
      ...current,
      tasks: [
        ...subtasks.map((subtask) => ({
          id: uid("task"),
          title: subtask.title,
          category: subtask.category,
          priority: subtask.priority,
          estimatedMinutes: subtask.estimatedMinutes,
          deadline,
          completed: false,
          snoozedCount: 0,
          createdAt: now,
          updatedAt: now,
          source: "divider" as const
        })),
        ...current.tasks
      ],
      activity: upsertTodayActivity(current.activity, (day) => ({
        ...day,
        totalTasks: day.totalTasks + subtasks.length,
        plannedMinutes:
          day.plannedMinutes + subtasks.reduce((sum, subtask) => sum + subtask.estimatedMinutes, 0)
      }))
    }));
  };

  const updateTask = (taskId: string, patch: Partial<Task>) => {
    patchData((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId ? { ...task, ...patch, updatedAt: new Date().toISOString() } : task
      )
    }));
  };

  const deleteTask = (taskId: string) => {
    patchData((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== taskId)
    }));
  };

  const toggleTask = (taskId: string) => {
    patchData((current) => {
      const tasks = current.tasks.map((task) => {
        if (task.id !== taskId) return task;
        const completed = !task.completed;
        return {
          ...task,
          completed,
          completedAt: completed ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString()
        };
      });
      const completedNow = tasks.find((task) => task.id === taskId)?.completed;
      const activity = upsertTodayActivity(current.activity, (day) =>
        completedNow
          ? {
              ...day,
              completedTasks: day.completedTasks + 1,
              totalTasks: Math.max(day.totalTasks, tasks.length)
            }
          : {
              ...day,
              completedTasks: Math.max(0, day.completedTasks - 1),
              totalTasks: Math.max(day.totalTasks, tasks.length)
            }
      );
      return {
        ...current,
        tasks,
        activity,
        xp: completedNow ? current.xp + 35 : Math.max(0, current.xp - 20)
      };
    });
  };

  const snoozeTask = (taskId: string) => {
    patchData((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              snoozedCount: task.snoozedCount + 1,
              deadline: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
              updatedAt: new Date().toISOString()
            }
          : task
      )
    }));
  };

  const regeneratePlanner = () => {
    patchData((current) => ({
      ...current,
      plannerBlocks: generatePlanner(current)
    }));
  };

  const addPlannerBlocks = (blocks: PlannerBlock[]) => {
    patchData((current) => ({
      ...current,
      plannerBlocks: [...blocks, ...current.plannerBlocks]
    }));
  };

  const toggleBlock = (blockId: string) => {
    patchData((current) => ({
      ...current,
      plannerBlocks: current.plannerBlocks.map((block) =>
        block.id === blockId ? { ...block, completed: !block.completed } : block
      )
    }));
  };

  const addPomodoroSession = (session: Omit<PomodoroSession, "id" | "completedAt">) => {
    patchData((current) => {
      const newSession: PomodoroSession = {
        ...session,
        id: uid("session"),
        completedAt: new Date().toISOString()
      };
      const activity = upsertTodayActivity(current.activity, (day) =>
        {
          const plannedMinutes = Math.max(day.plannedMinutes, current.profile.dailyAvailableHours * 60);
          return {
            ...day,
            focusMinutes: day.focusMinutes + session.focusMinutes,
            plannedMinutes,
            pomodoros: day.pomodoros + 1,
            totalTasks: Math.max(day.totalTasks, current.tasks.length)
          };
        }
      );
      return {
        ...current,
        pomodoroSessions: [newSession, ...current.pomodoroSessions],
        activity,
        xp: current.xp + session.focusMinutes * 2,
        streak: Math.max(1, current.streak),
        level: Math.max(current.level, Math.floor((current.xp + session.focusMinutes * 2) / 400) + 1)
      };
    });
  };

  const addGoal = (goal: Omit<Goal, "id" | "createdAt">) => {
    patchData((current) => ({
      ...current,
      goals: [
        {
          ...goal,
          id: uid("goal"),
          createdAt: new Date().toISOString()
        },
        ...current.goals
      ]
    }));
  };

  const addMilestone = (goalId: string, title: string, targetDate: string) => {
    patchData((current) => ({
      ...current,
      goals: current.goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              milestones: [
                ...goal.milestones,
                { id: uid("milestone"), title, targetDate, completed: false }
              ]
            }
          : goal
      )
    }));
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    patchData((current) => ({
      ...current,
      goals: current.goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              milestones: goal.milestones.map((milestone) =>
                milestone.id === milestoneId
                  ? { ...milestone, completed: !milestone.completed }
                  : milestone
              )
            }
          : goal
      )
    }));
  };

  const createTaskFromGoal = (goal: Goal) => {
    addTask({
      title: goal.dailySuggestion,
      category: goal.type.toLowerCase().includes("fitness") ? "Fitness" : goal.type.toLowerCase().includes("dsa") ? "Coding" : "Study",
      priority: "Medium",
      estimatedMinutes: 35,
      deadline: todayISO(),
      source: "goal"
    });
  };

  const addRecoveryPlan = () => {
    const now = new Date().toISOString();
    patchData((current) => {
      const backlog = analyzeBacklog(current.tasks, current.goals);
      const delayedTaskBlocks = backlog.backlogTasks.slice(0, 3).map((task, index) => ({
        ...task,
        id: uid("task"),
        title: `Recovery block ${index + 1}: ${task.title}`,
        estimatedMinutes: Math.min(45, task.estimatedMinutes),
        priority: "High" as const,
        deadline: new Date(Date.now() + (index + 1) * 86400000).toISOString().slice(0, 10),
        completed: false,
        snoozedCount: 0,
        createdAt: now,
        updatedAt: now,
        source: "recovery" as const
      }));
      const milestoneBlocks = backlog.behindMilestones
        .slice(0, Math.max(0, 3 - delayedTaskBlocks.length))
        .map((milestone, index) => ({
          id: uid("task"),
          title: `Recovery milestone ${index + 1}: ${milestone.title}`,
          category: "Study" as const,
          priority: "High" as const,
          estimatedMinutes: 45,
          deadline: new Date(Date.now() + (delayedTaskBlocks.length + index + 1) * 86400000)
            .toISOString()
            .slice(0, 10),
          completed: false,
          snoozedCount: 0,
          createdAt: now,
          updatedAt: now,
          source: "recovery" as const
        }));
      const recoveryTasks = [...delayedTaskBlocks, ...milestoneBlocks];
      const next = {
        ...current,
        tasks: [...recoveryTasks, ...current.tasks],
        activity: upsertTodayActivity(current.activity, (day) => ({
          ...day,
          totalTasks: day.totalTasks + recoveryTasks.length,
          plannedMinutes:
            day.plannedMinutes + recoveryTasks.reduce((sum, task) => sum + task.estimatedMinutes, 0)
        }))
      };
      return {
        ...next,
        plannerBlocks: recoveryTasks.length ? generatePlanner(next) : current.plannerBlocks
      };
    });
  };

  const resetApp = () => {
    clearFocusverseData();
    setData(createInitialAppData());
  };

  const loadDemoData = () => {
    setData(createDemoAppData(data.profile));
  };

  const clearDemoData = () => {
    const empty = createInitialAppData();
    setData({
      ...empty,
      profile: {
        ...empty.profile,
        ...data.profile,
        onboarded: true,
        name: data.profile.name || "Focus friend"
      },
      demoMode: false
    });
  };

  return useMemo(
    () => ({
      data,
      hydrated,
      completeOnboarding,
      updateProfile,
      addTask,
      addSubtasks,
      updateTask,
      deleteTask,
      toggleTask,
      snoozeTask,
      regeneratePlanner,
      addPlannerBlocks,
      toggleBlock,
      addPomodoroSession,
      addGoal,
      addMilestone,
      toggleMilestone,
      createTaskFromGoal,
      addRecoveryPlan,
      resetApp,
      loadDemoData,
      clearDemoData
    }),
    [data, hydrated]
  );
}
