"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { BarChart3, Clock, Flame, ListChecks } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { weeklyChartData } from "@/lib/site-data";

const tooltipStyle = {
  border: "1px solid rgba(8,17,31,0.08)",
  borderRadius: "16px",
  boxShadow: "0 18px 50px rgba(8,17,31,0.14)",
  fontWeight: 800
};

export function WeeklyReportsSection() {
  return (
    <section className="relative overflow-hidden bg-[#f6f2ff] px-5 py-24 md:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="section-eyebrow">Weekly reports</p>
            <h2 className="section-title">Analytics that make progress visible.</h2>
            <p className="section-copy">
              See percentage, tasks, focus hours, backlog trend, and streak health in a
              startup-grade dashboard that still feels personal.
            </p>
          </div>
          <div className="rounded-full bg-ink px-5 py-3 text-sm font-black text-white shadow-soft">
            94% Sunday peak
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-4">
          {[
            { label: "Productivity", value: "84%", icon: BarChart3, bg: "bg-mist" },
            { label: "Completed tasks", value: "81", icon: ListChecks, bg: "bg-sage" },
            { label: "Focus hours", value: "37.4h", icon: Clock, bg: "bg-cream" },
            { label: "Streaks", value: "11 days", icon: Flame, bg: "bg-coral/55" }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Reveal className={`${item.bg} rounded-[1.35rem] p-5 shadow-sm`} key={item.label}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-ink/52">{item.label}</span>
                  <Icon size={18} />
                </div>
                <p className="mt-6 text-4xl font-black tracking-normal">{item.value}</p>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="report-panel">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-black">Productivity percentage</h3>
              <span className="rounded-full bg-mist px-3 py-1 text-xs font-black text-ink/55">
                7 day trend
              </span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyChartData} margin={{ left: -20, right: 10, top: 10 }}>
                  <defs>
                    <linearGradient id="productivity" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#006dff" stopOpacity={0.42} />
                      <stop offset="100%" stopColor="#006dff" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(8,17,31,0.08)" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    dataKey="productivity"
                    stroke="#006dff"
                    fill="url(#productivity)"
                    strokeWidth={4}
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          <Reveal className="report-panel" delay={0.1}>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-black">Completed tasks</h3>
              <span className="rounded-full bg-sage px-3 py-1 text-xs font-black text-ink/55">
                81 total
              </span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData} margin={{ left: -20, right: 4, top: 10 }}>
                  <CartesianGrid stroke="rgba(8,17,31,0.08)" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="tasks" fill="#9fb996" radius={[10, 10, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          <Reveal className="report-panel lg:col-span-2" delay={0.15}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-black">Focus hours and backlog trend</h3>
              <span className="rounded-full bg-lavender px-3 py-1 text-xs font-black text-ink/55">
                backlog down 82%
              </span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyChartData} margin={{ left: -20, right: 12, top: 10 }}>
                  <CartesianGrid stroke="rgba(8,17,31,0.08)" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#08111f"
                    strokeWidth={4}
                    dot={{ fill: "#08111f", strokeWidth: 0, r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="backlog"
                    stroke="#ff8f73"
                    strokeWidth={4}
                    dot={{ fill: "#ff8f73", strokeWidth: 0, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
