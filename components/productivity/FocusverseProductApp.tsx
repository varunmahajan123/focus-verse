"use client";

import {
  BarChart3,
  CalendarDays,
  Flame,
  Home,
  Layers3,
  ListChecks,
  RotateCcw,
  Settings,
  Target,
  TimerReset,
  Moon,
  Sun
} from "lucide-react";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BacklogView } from "@/components/backlog/BacklogView";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { GoalsView } from "@/components/goals/GoalsView";
import { PlannerView } from "@/components/planner/PlannerView";
import { PomodoroTimerView } from "@/components/pomodoro/PomodoroTimerView";
import { ReportsView } from "@/components/reports/ReportsView";
import { SettingsView } from "@/components/settings/SettingsView";
import { SoftButton } from "@/components/shared/ProductPrimitives";
import { TaskDividerPanel } from "@/components/tasks/TaskDividerPanel";
import { TaskManager } from "@/components/tasks/TaskManager";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { useFocusverseApp } from "@/components/productivity/useFocusverseApp";
import { OnboardingPayload } from "@/types/focusverse";
import { useTheme } from "next-themes";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "tasks", label: "Tasks", icon: ListChecks },
  { id: "divider", label: "Divider", icon: Layers3 },
  { id: "planner", label: "Planner", icon: CalendarDays },
  { id: "pomodoro", label: "Pomodoro", icon: TimerReset },
  { id: "goals", label: "Goals", icon: Target },
  { id: "backlog", label: "Backlog", icon: RotateCcw },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings }
] as const;

type ViewId = (typeof navItems)[number]["id"];

export function FocusverseProductApp() {
  const app = useFocusverseApp();
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const [setupOpen, setSetupOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { theme, setTheme } = useTheme();

  const isViewId = (view: string): view is ViewId => navItems.some((item) => item.id === view);

  const switchView = (view: string) => {
    if (isViewId(view)) {
      setActiveView(view);
      window.requestAnimationFrame(() => {
        const top = contentRef.current?.getBoundingClientRect().top ?? 0;
        if (top < 0 || top > window.innerHeight * 0.24) {
          contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  };

  const openViewFromIntro = (view: string) => {
    if (!isViewId(view)) return;
    setActiveView(view);
    window.setTimeout(
      () => contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      30
    );
  };

  const completeOnboarding = (payload: OnboardingPayload) => {
    app.completeOnboarding(payload);
    setSetupOpen(false);
    setActiveView("dashboard");
    window.setTimeout(
      () => contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      80
    );
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(app.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "focusverse-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!app.hydrated) {
    return (
      <section className="grid min-h-[60vh] place-items-center bg-background px-5">
        <div className="rounded-[2rem] bg-surface-elevated p-8 text-center shadow-soft">
          <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-mist" />
          <p className="text-sm font-black uppercase tracking-[0.24em] text-muted-foreground">Loading Focusverse</p>
        </div>
      </section>
    );
  }

  const active = navItems.find((item) => item.id === activeView) ?? navItems[0];
  const ActiveIcon = active.icon;

  return (
    <section className="focus-app-shell transition-colors duration-300">
      {setupOpen ? (
        <OnboardingWizard onComplete={completeOnboarding} onClose={() => setSetupOpen(false)} />
      ) : null}

      <div className="relative overflow-hidden bg-night px-5 py-24 text-white md:py-32">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-2/3 rounded-full border border-white/12 shadow-[0_0_120px_rgba(0,109,255,0.22)]" />
        <div className="relative mx-auto max-w-7xl text-center">
          <p className="app-eyebrow text-mist">Welcome to the planner</p>
          <h2 className="mx-auto mt-4 max-w-5xl text-balance text-[clamp(2.75rem,6.8vw,6rem)] font-black leading-[0.94] tracking-normal">
            Your day, divided intelligently.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg font-medium leading-8 text-white/62">
            Plan tasks, recover backlog, focus with Pomodoro, and improve every week.
          </p>
          {app.data.demoMode ? (
            <div className="mx-auto mt-5 w-fit rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/72">
              Demo data enabled
            </div>
          ) : null}
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            {app.data.profile.onboarded ? (
              <>
                <SoftButton variant="light" onClick={() => openViewFromIntro("tasks")}>Start Planning</SoftButton>
                <SoftButton variant="secondary" onClick={() => openViewFromIntro("pomodoro")} className="border-white/20 bg-white/10 text-white hover:bg-white/15">Try Pomodoro</SoftButton>
              </>
            ) : (
              <>
                <SoftButton variant="light" onClick={() => setSetupOpen(true)}>Start Setup</SoftButton>
                <SoftButton variant="secondary" onClick={() => { app.loadDemoData(); openViewFromIntro("dashboard"); }} className="border-white/20 bg-white/10 text-white hover:bg-white/15">Try Demo Data</SoftButton>
              </>
            )}
          </div>
        </div>
      </div>

      {!app.data.profile.onboarded ? (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Real dashboard", "Starts empty and fills with your setup data."],
              ["Local-first", "Tasks, goals, sessions, and reports save in this browser."],
              ["No fake pressure", "Reports unlock as your real activity grows."]
            ].map(([title, copy]) => (
              <div key={title} className="app-card">
                <h3 className="text-xl font-black tracking-normal">{title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {!app.data.profile.onboarded ? null : (
        <div ref={contentRef} data-testid="app-content" className="mx-auto flex max-w-7xl gap-5 px-4 py-6 pb-40 md:px-6 md:pb-24 lg:py-8">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 rounded-[2rem] border border-border bg-surface p-3 shadow-soft backdrop-blur-xl lg:block flex-col justify-between flex">
          <div>
          <div className="mb-4 rounded-[1.5rem] bg-foreground p-4 text-background">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-background/60">
              <Flame size={14} />
              Focusverse
            </div>
            <p className="mt-4 text-2xl font-black tracking-normal">Level {app.data.level}</p>
            <p className="text-sm font-bold text-background/80">{app.data.xp} XP • {app.data.streak} day streak</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`app-nav-item ${activeView === item.id ? "active" : ""}`}
                  onClick={() => switchView(item.id)}
                  type="button"
                  aria-current={activeView === item.id ? "page" : undefined}
                  data-testid={`nav-${item.id}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          </div>
          <div className="pt-3 mt-3 border-t border-border">
            <button
              className="app-nav-item"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              type="button"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="sticky top-3 z-30 mb-5 hidden items-center justify-between rounded-full border border-border bg-surface-elevated px-3 py-2 shadow-soft backdrop-blur-xl md:flex lg:hidden">
            <div className="flex items-center gap-2 pl-2 text-sm font-black">
              <ActiveIcon size={17} />
              {active.label}
            </div>
            <div className="flex max-w-[72vw] gap-1 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${activeView === item.id ? "bg-foreground text-background" : "text-muted-foreground"}`}
                    onClick={() => switchView(item.id)}
                    type="button"
                    title={item.label}
                    aria-label={item.label}
                    aria-current={activeView === item.id ? "page" : undefined}
                  >
                    <Icon size={17} />
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              data-testid={`view-${activeView}`}
              data-active-view={activeView}
              className="min-h-[calc(100vh-3rem)]"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeView === "dashboard" ? (
                <DashboardHome data={app.data} onNavigate={switchView} onGeneratePlanner={app.regeneratePlanner} />
              ) : null}
              {activeView === "tasks" ? (
                <TaskManager
                  tasks={app.data.tasks}
                  addTask={app.addTask}
                  updateTask={app.updateTask}
                  deleteTask={app.deleteTask}
                  toggleTask={app.toggleTask}
                  snoozeTask={app.snoozeTask}
                />
              ) : null}
              {activeView === "divider" ? <TaskDividerPanel addSubtasks={app.addSubtasks} /> : null}
              {activeView === "planner" ? (
                <PlannerView
                  blocks={app.data.plannerBlocks}
                  regeneratePlanner={app.regeneratePlanner}
                  toggleBlock={app.toggleBlock}
                />
              ) : null}
              {activeView === "pomodoro" ? (
                <PomodoroTimerView
                  data={app.data}
                  updateProfile={app.updateProfile}
                  addPomodoroSession={app.addPomodoroSession}
                />
              ) : null}
              {activeView === "goals" ? (
                <GoalsView
                  goals={app.data.goals}
                  addGoal={app.addGoal}
                  addMilestone={app.addMilestone}
                  toggleMilestone={app.toggleMilestone}
                  createTaskFromGoal={app.createTaskFromGoal}
                />
              ) : null}
              {activeView === "backlog" ? <BacklogView data={app.data} addRecoveryPlan={app.addRecoveryPlan} /> : null}
              {activeView === "reports" ? <ReportsView data={app.data} /> : null}
              {activeView === "settings" ? (
                <SettingsView
                  profile={app.data.profile}
                  demoMode={app.data.demoMode}
                  updateProfile={app.updateProfile}
                  resetApp={app.resetApp}
                  loadDemoData={app.loadDemoData}
                  clearDemoData={app.clearDemoData}
                  exportData={exportData}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
        </div>
      )}

      {app.data.profile.onboarded ? (
        <>
          <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 gap-1 rounded-[1.6rem] border border-border bg-surface p-2 shadow-soft backdrop-blur-xl md:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`grid min-h-12 place-items-center rounded-[1.1rem] px-1 text-[9px] font-black ${activeView === item.id ? "bg-foreground text-background" : "text-muted-foreground"}`}
                  onClick={() => switchView(item.id)}
                  type="button"
                  aria-current={activeView === item.id ? "page" : undefined}
                >
                  <Icon size={17} />
                  <span className="mt-1">{item.label === "Dashboard" ? "Home" : item.label}</span>
                </button>
              );
            })}
          </nav>
        </>
      ) : null}
    </section>
  );
}
