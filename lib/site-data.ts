import {
  AlarmClock,
  BarChart3,
  BrainCircuit,
  CalendarDays,
  Flag,
  Layers3,
  ListChecks,
  Target,
  TimerReset,
  Trophy,
  Zap
} from "lucide-react";

// Edit these arrays to update the landing-page copy and mock product data.
export const focusFeatureCards = [
  {
    title: "Pomodoro Timer",
    eyebrow: "25/5 deep work",
    detail: "Focus sessions, breaks, and streak XP synced to your day.",
    icon: TimerReset
  },
  {
    title: "Smart Planner",
    eyebrow: "Auto arranged",
    detail: "Tasks land in the right energy windows before the day begins.",
    icon: CalendarDays
  },
  {
    title: "Task Divider",
    eyebrow: "One task to five steps",
    detail: "Large goals split into doable moves with clean estimates.",
    icon: Layers3
  },
  {
    title: "Backlog Analyzer",
    eyebrow: "Recovery mode",
    detail: "Missed work becomes a realistic plan instead of a guilt stack.",
    icon: ListChecks
  },
  {
    title: "Weekly Reports",
    eyebrow: "Signal over noise",
    detail: "Focus hours, completion rates, and momentum all in one cockpit.",
    icon: BarChart3
  },
  {
    title: "Goal Tracker",
    eyebrow: "Long game",
    detail: "Milestones, badges, and compounding progress toward bigger arcs.",
    icon: Target
  }
];

export const dashboardMetrics = [
  { label: "Today's focus score", value: "92", suffix: "%", tone: "bg-mist" },
  { label: "Weekly productivity", value: "84", suffix: "%", tone: "bg-lavender" },
  { label: "Focus hours", value: "18.5", suffix: "h", tone: "bg-sage" },
  { label: "XP streak", value: "11", suffix: "d", tone: "bg-coral/60" }
];

export const taskBreakdown = [
  "Watch lecture",
  "Make notes",
  "Solve 5 easy questions",
  "Solve 3 medium questions",
  "Revise mistakes"
];

export const breakReminders = ["water", "stretch", "lunch", "eyes rest"];

export const rhythmInsights = [
  { label: "Best focus time", value: "8:10 AM", icon: Zap },
  { label: "Least productive time", value: "3:40 PM", icon: AlarmClock },
  { label: "Average Pomodoros", value: "7.4", icon: TimerReset },
  { label: "Delayed categories", value: "DSA, Admin", icon: BrainCircuit },
  { label: "Productivity score", value: "88%", icon: Trophy },
  { label: "Suggested planner", value: "Morning heavy", icon: CalendarDays }
];

export const weeklyChartData = [
  { day: "Mon", productivity: 72, tasks: 9, hours: 4.5, backlog: 11 },
  { day: "Tue", productivity: 81, tasks: 12, hours: 5.2, backlog: 8 },
  { day: "Wed", productivity: 68, tasks: 8, hours: 3.9, backlog: 10 },
  { day: "Thu", productivity: 91, tasks: 14, hours: 6.4, backlog: 6 },
  { day: "Fri", productivity: 86, tasks: 13, hours: 5.9, backlog: 5 },
  { day: "Sat", productivity: 77, tasks: 10, hours: 4.7, backlog: 4 },
  { day: "Sun", productivity: 94, tasks: 15, hours: 6.8, backlog: 2 }
];

export const recoverySteps = [
  { title: "Missed tasks", value: "14", detail: "clustered by urgency" },
  { title: "Recovery plan", value: "4 days", detail: "without overload" },
  { title: "Estimated hours", value: "8.5h", detail: "split into sessions" },
  { title: "Daily target", value: "2.1h", detail: "plus buffer slots" }
];

export const goals = [
  { label: "Competitive exam", progress: 72, icon: Flag },
  { label: "Learn DSA", progress: 58, icon: BrainCircuit },
  { label: "Build startup", progress: 41, icon: Zap },
  { label: "Fitness", progress: 64, icon: Target }
];
