"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { BrainCircuit, ChartNoAxesCombined, Clock, Sparkles } from "lucide-react";
import { AppData, TaskCategory } from "@/types/focusverse";
import { analyzeBacklog, productivityLabel, productivityScore } from "@/lib/productivity/metrics";
import { AppCard, EmptyState, IconTile, SectionHeader } from "@/components/shared/ProductPrimitives";

const colors = ["#cfe9ff", "#dcd4ff", "#dbe8d0", "#ffb7a1", "#f8f1e8", "#9fb996"];

function categoryData(data: AppData) {
  const map = data.tasks.reduce<Record<TaskCategory, { name: TaskCategory; completed: number; total: number }>>((acc, task) => {
    acc[task.category] ??= { name: task.category, completed: 0, total: 0 };
    acc[task.category].total += 1;
    if (task.completed) acc[task.category].completed += 1;
    return acc;
  }, {} as Record<TaskCategory, { name: TaskCategory; completed: number; total: number }>);
  return Object.values(map).map((item) => ({
    name: item.name,
    value: item.total ? Math.round((item.completed / item.total) * 100) : 0
  }));
}

function patternSummary(data: AppData) {
  if (data.activity.length < 7) {
    return {
      locked: true,
      lines: [`${data.activity.length}/7 days recorded. Reports will become smarter as you use Focusverse.`]
    };
  }

  const best = [...data.activity].sort((a, b) => b.focusMinutes - a.focusMinutes)[0];
  const worst = [...data.activity].sort((a, b) => a.focusMinutes - b.focusMinutes)[0];
  const delayed = data.activity.reduce<Record<string, number>>((acc, day) => {
    if (day.delayedCategory) acc[day.delayedCategory] = (acc[day.delayedCategory] ?? 0) + 1;
    return acc;
  }, {});
  const mostDelayed = Object.entries(delayed).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Coding";

  return {
    locked: false,
    lines: [
      `Most productive day: ${best.date} with ${best.focusMinutes} focus minutes.`,
      `Least productive day: ${worst.date}; plan lighter recovery blocks there.`,
      `You delay ${mostDelayed} often, so Focusverse splits it into smaller Pomodoros.`,
      "Hard tasks are placed earlier because your morning blocks trend stronger."
    ]
  };
}

export function ReportsView({ data }: { data: AppData }) {
  const score = productivityScore(data.activity, data.streak);
  const backlog = analyzeBacklog(data.tasks, data.goals);
  const completedTasks = data.activity.reduce((sum, day) => sum + day.completedTasks, 0);
  const totalTasks = data.activity.reduce((sum, day) => sum + day.totalTasks, 0);
  const focusMinutes = data.activity.reduce((sum, day) => sum + day.focusMinutes, 0);
  const pomodoros = data.activity.reduce((sum, day) => sum + day.pomodoros, 0);
  const reportData = data.activity.map((day) => ({
    ...day,
    productivity: day.totalTasks ? Math.round((day.completedTasks / day.totalTasks) * 100) : 0,
    label: day.date.slice(5)
  }));
  const pattern = patternSummary(data);
  const hasActivity = completedTasks > 0 || focusMinutes > 0 || pomodoros > 0;
  const categoryBreakdown = categoryData(data);

  return (
    <section className="app-section">
      <SectionHeader
        eyebrow="Reports and intelligence"
        title="A weekly report that turns effort into signal."
        copy="Focus minutes, task completion, backlog trend, category productivity, streaks, and supportive suggestions."
      />

      <div className="grid gap-4 lg:grid-cols-5">
        {[
          ["Tasks completed", completedTasks, `${totalTasks} planned`],
          ["Pomodoros", pomodoros, "completed"],
          ["Focus hours", `${Math.round((focusMinutes / 60) * 10) / 10}h`, "logged"],
          ["Productivity", `${score}%`, productivityLabel(score)],
          ["Backlog completed", data.activity.reduce((sum, day) => sum + day.backlogCompleted, 0), `${backlog.count} remaining`]
        ].map(([label, value, sub]) => (
          <AppCard key={label as string}>
            <p className="text-sm font-black text-ink/45">{label}</p>
            <h3 className="mt-5 text-3xl font-black tracking-normal">{value}</h3>
            <p className="mt-1 text-sm font-bold text-ink/52">{sub}</p>
          </AppCard>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <AppCard>
          <div className="mb-5 flex items-center gap-3">
            <IconTile icon={ChartNoAxesCombined} tone="mist" />
            <h3 className="text-xl font-black">Daily productivity line</h3>
          </div>
          {hasActivity ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportData} margin={{ left: -20, right: 10 }}>
                  <CartesianGrid stroke="rgba(8,17,31,0.08)" vertical={false} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: "0", boxShadow: "0 20px 60px rgba(8,17,31,0.16)" }} />
                  <Line type="monotone" dataKey="productivity" stroke="#08111f" strokeWidth={4} dot={{ r: 5, fill: "#08111f" }} />
                  <Line type="monotone" dataKey="pomodoros" stroke="#9fb996" strokeWidth={4} dot={{ r: 5, fill: "#9fb996" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState icon={ChartNoAxesCombined} title="Reports unlock as you use Focusverse" copy="Complete tasks and Pomodoros to build your first real productivity chart." />
          )}
        </AppCard>

        <AppCard>
          <div className="mb-5 flex items-center gap-3">
            <IconTile icon={Clock} tone="lavender" />
            <h3 className="text-xl font-black">Focus hours</h3>
          </div>
          {hasActivity ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData}>
                  <defs>
                    <linearGradient id="focusReport" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#5874be" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#5874be" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <Area dataKey="focusMinutes" stroke="#5874be" strokeWidth={4} fill="url(#focusReport)" type="monotone" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState icon={Clock} title="No focus minutes yet" copy="Run your first Pomodoro and this chart will start breathing." />
          )}
        </AppCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <AppCard>
          <h3 className="mb-4 text-xl font-black">Category-wise productivity</h3>
          {categoryBreakdown.length ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={58} outerRadius={100} paddingAngle={4}>
                    {categoryBreakdown.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 16, border: "0", boxShadow: "0 20px 60px rgba(8,17,31,0.16)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState icon={ChartNoAxesCombined} title="No categories yet" copy="Add tasks and Focusverse will show where your attention goes." />
          )}
        </AppCard>

        <AppCard>
          <div className="mb-5 flex items-center gap-3">
            <IconTile icon={BrainCircuit} tone="sage" />
            <div>
              <p className="text-sm font-black text-ink/45">Pattern analysis after 7 days</p>
              <h3 className="text-2xl font-black">Rhythm intelligence</h3>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {pattern.lines.map((line) => (
              <div key={line} className="rounded-[1.2rem] bg-cream/75 p-4 text-sm font-bold leading-6 text-ink/62">
                <Sparkles className="mb-3 text-electric" size={16} />
                {line}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[1.2rem] bg-sage/60 p-4 text-sm font-black leading-6 text-ink/62">
            Motivational summary: {score > 80 ? "You are in peak flow. Protect your streak and do not overload tomorrow." : "Your comeback plan is ready. One clean block is enough to restart momentum."}
          </div>
        </AppCard>
      </div>
    </section>
  );
}
