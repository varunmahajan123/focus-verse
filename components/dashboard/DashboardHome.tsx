"use client";

import {
  AlarmClock,
  BadgeCheck,
  CalendarDays,
  Flame,
  Leaf,
  ListChecks,
  TimerReset,
  TrendingUp,
  Trophy
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { AppData } from "@/types/focusverse";
import { AppCard, EmptyState, IconTile, ProgressRing, SectionHeader, SoftButton } from "@/components/shared/ProductPrimitives";
import { useTheme } from "next-themes";
import {
  analyzeBacklog,
  completionPercentage,
  goalProgress,
  motivationNudge,
  productivityLabel,
  productivityScore,
  timeAwareBreakReminder
} from "@/lib/productivity/metrics";

export function DashboardHome({
  data,
  onNavigate,
  onGeneratePlanner
}: {
  data: AppData;
  onNavigate: (view: string) => void;
  onGeneratePlanner: () => void;
}) {
  const score = productivityScore(data.activity, data.streak);
  const backlog = analyzeBacklog(data.tasks, data.goals);
  const pending = data.tasks.filter((task) => !task.completed).slice(0, 4);
  const topGoal = data.goals[0];
  const completedPercent = completionPercentage(data.tasks);
  const nudge = motivationNudge(score, backlog.count);
  const { theme } = useTheme();
  const chartStroke = theme === "dark" ? "#60A5FA" : "#08111f";

  return (
    <section className="app-section">
      <SectionHeader
        eyebrow="Dashboard"
        title={`Hi ${data.profile.name || "there"}, your focus loop is ready.`}
        copy="A calm daily cockpit for planning, deep work, recovery, and long-term momentum."
        action={
          <div className="flex gap-2">
            <SoftButton onClick={() => onNavigate("tasks")}>Start Planning</SoftButton>
            <SoftButton variant="secondary" onClick={() => onNavigate("pomodoro")}>Try Pomodoro</SoftButton>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <AppCard className="overflow-hidden bg-surface p-0 flex flex-col">
          <div className="grid gap-5 p-5 md:grid-cols-[auto_1fr] md:p-6">
            <ProgressRing value={score} size="md" label="focus score" />
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-sage px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-ink/58">
                    {productivityLabel(score)}
                  </span>
                  <span className="rounded-full bg-lavender px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-ink/58">
                    Level {data.level}
                  </span>
                </div>
                <h3 className="mt-5 text-3xl font-black leading-tight tracking-normal md:text-4xl">
                  Your day, divided intelligently.
                </h3>
                <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-ink/58">
                  Plan tasks, recover backlog, focus with Pomodoro, and improve every week.
                </p>
              </div>
              <div className="mt-6 rounded-[1.2rem] bg-cream p-4 text-sm font-bold leading-6 text-ink/62">
                {nudge}
              </div>
            </div>
          </div>
        </AppCard>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <AppCard className="bg-mist/75">
            <div className="flex items-center justify-between">
              <IconTile icon={TimerReset} tone="ink" />
              <span className="text-sm font-black text-ink/48">{data.profile.pomodoroStyle}</span>
            </div>
            <h3 className="mt-8 text-3xl font-black tracking-normal">{data.pomodoroSessions.length} sessions</h3>
            <p className="mt-2 text-sm font-bold text-ink/58">Pomodoro history saved locally.</p>
          </AppCard>
          <AppCard className="bg-surface flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <IconTile icon={Flame} tone="peach" />
              <span className="rounded-full bg-ink px-3 py-1 text-xs font-black text-white">{data.xp} XP</span>
            </div>
            <h3 className="mt-8 text-3xl font-black tracking-normal">{data.streak} day streak</h3>
            <p className="mt-2 text-sm font-bold text-ink/58">Keep it gentle. Keep it alive.</p>
          </AppCard>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-4">
        <AppCard className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconTile icon={ListChecks} tone="sage" />
              <div>
                <p className="text-sm font-black text-ink/45">Task feeder</p>
                <h3 className="text-xl font-black">Next clean moves</h3>
              </div>
            </div>
            <SoftButton variant="ghost" onClick={() => onNavigate("tasks")}>Open</SoftButton>
          </div>
          <div className="space-y-2">
            {pending.length ? pending.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-2xl bg-cream/70 px-4 py-3">
                <div>
                  <p className="font-black">{task.title}</p>
                  <p className="mt-1 text-xs font-bold text-ink/45">{task.category} • {task.estimatedMinutes} min</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${task.priority === "High" ? "bg-coral/60" : task.priority === "Medium" ? "bg-lavender" : "bg-sage"}`}>
                  {task.priority}
                </span>
              </div>
            )) : (
              <EmptyState
                icon={ListChecks}
                title="Add your first task"
                copy="Your task feeder is empty. Capture one small task and the dashboard will come alive."
                action={<SoftButton onClick={() => onNavigate("tasks")}>Add task</SoftButton>}
              />
            )}
          </div>
        </AppCard>

        <AppCard>
          <div className="flex items-center justify-between">
            <IconTile icon={CalendarDays} tone="lavender" />
            <SoftButton variant="ghost" onClick={() => { onGeneratePlanner(); onNavigate("planner"); }}>Generate</SoftButton>
          </div>
          <h3 className="mt-8 text-2xl font-black">Smart planner</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-ink/58">
            {data.plannerBlocks.length ? `${data.plannerBlocks.length} blocks planned today.` : "Generate a calm schedule from your task feeder."}
          </p>
        </AppCard>

        <AppCard>
          <div className="flex items-center justify-between">
            <IconTile icon={AlarmClock} tone="peach" />
            <span className="text-3xl font-black">{backlog.count}</span>
          </div>
          <h3 className="mt-8 text-2xl font-black">Backlog alert</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-ink/58">
            {backlog.count ? `${backlog.estimatedHours}h recovery estimate.` : "No urgent recovery needed."}
          </p>
        </AppCard>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <AppCard className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconTile icon={TrendingUp} tone="mist" />
              <h3 className="text-xl font-black">Weekly productivity</h3>
            </div>
            <span className="text-sm font-black text-ink/45">{completedPercent}% task completion</span>
          </div>
          {data.activity.length ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.activity.map((day) => ({ ...day, score: day.totalTasks ? Math.round((day.completedTasks / day.totalTasks) * 100) : 0 }))}>
                  <defs>
                    <linearGradient id="dashScore" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#9fb996" stopOpacity={0.42} />
                      <stop offset="100%" stopColor="#9fb996" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <Area dataKey="score" stroke={chartStroke} strokeWidth={4} fill="url(#dashScore)" type="monotone" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={TrendingUp}
              title="Reports unlock as you use Focusverse"
              copy="Complete a task or Pomodoro and your first real trend appears here."
            />
          )}
        </AppCard>

        <div className="grid gap-5">
          <AppCard>
            <div className="flex items-center gap-3">
              <IconTile icon={Leaf} tone="sage" />
              <div>
                <p className="text-sm font-black text-ink/45">Break reminder</p>
                <h3 className="text-lg font-black">{timeAwareBreakReminder()}</h3>
              </div>
            </div>
          </AppCard>
          <AppCard>
            <div className="flex items-center gap-3">
              <IconTile icon={Trophy} tone="lavender" />
              <div>
                <p className="text-sm font-black text-ink/45">Goal progress</p>
                <h3 className="text-lg font-black">
                  {topGoal ? `${topGoal.title}: ${goalProgress(topGoal)}%` : "Add a goal to start compounding."}
                </h3>
              </div>
            </div>
          </AppCard>
          <AppCard>
            <div className="flex items-center gap-3">
              <IconTile icon={BadgeCheck} tone="peach" />
              <div>
                <p className="text-sm font-black text-ink/45">Badges</p>
                <h3 className="text-lg font-black">
                  {data.badges.filter((badge) => badge.unlocked).length}/{data.badges.length} unlocked
                </h3>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </section>
  );
}
