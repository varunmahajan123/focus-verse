"use client";

import { Calendar, Flame, ListTodo, TimerReset, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { dashboardMetrics } from "@/lib/site-data";

export function DashboardPreview() {
  return (
    <section className="relative overflow-hidden bg-cream px-5 py-24 md:py-32">
      <div className="absolute left-0 top-0 h-52 w-full bg-gradient-to-b from-night to-transparent opacity-10" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.82fr_1.18fr]">
        <Reveal>
          <p className="section-eyebrow">Command center</p>
          <h2 className="section-title">A planner that feels like a cockpit, not a spreadsheet.</h2>
          <p className="section-copy">
            Focusverse turns tasks, breaks, goals, and backlogs into one calm daily surface.
            Muted UI, sharp signals, and a tiny hit of momentum every time you finish.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["Task feeder", "Smart planner", "XP streaks", "Motivation engine"].map(
              (item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              )
            )}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="dashboard-shell">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-ink/45">
                Focus cockpit
              </p>
              <h3 className="mt-1 text-2xl font-black tracking-normal">Today's loop</h3>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">
              <Flame size={16} className="text-coral" />
              11 day streak
            </div>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-4">
            {dashboardMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                className={`${metric.tone} rounded-[1.2rem] p-4 shadow-sm`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.55 }}
                viewport={{ once: true }}
              >
                <p className="min-h-10 text-sm font-semibold leading-5 text-ink/62">
                  {metric.label}
                </p>
                <div className="mt-5 flex items-end gap-1">
                  <span className="text-4xl font-black tracking-normal">{metric.value}</span>
                  <span className="pb-1 text-base font-black">{metric.suffix}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-4 p-5 pt-0 lg:grid-cols-[1fr_0.82fr]">
            <div className="rounded-[1.25rem] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-mist">
                    <TimerReset size={19} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink/50">Pomodoro timer</p>
                    <h4 className="text-xl font-black">18:42</h4>
                  </div>
                </div>
                <span className="rounded-full bg-sage px-3 py-1 text-xs font-black text-ink/70">
                  deep work
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-ink/8">
                <div className="h-full w-[68%] rounded-full bg-ink" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-bold text-ink/50">
                <span>25/5</span>
                <span>50/10</span>
                <span>90/15</span>
              </div>
            </div>

            <div className="rounded-[1.25rem] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-lavender">
                  <ListTodo size={19} />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink/50">Task feeder</p>
                  <h4 className="text-xl font-black">Next 3 moves</h4>
                </div>
              </div>
              {["Revise arrays", "Draft pitch notes", "Workout blocks"].map((item) => (
                <div
                  key={item}
                  className="mb-2 flex items-center justify-between rounded-2xl bg-cream px-3 py-3 text-sm font-bold"
                >
                  <span>{item}</span>
                  <span className="h-2 w-2 rounded-full bg-ink/40" />
                </div>
              ))}
            </div>

            <div className="rounded-[1.25rem] bg-white p-5 shadow-sm lg:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-coral/60">
                    <TrendingUp size={19} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink/50">Backlog warning</p>
                    <h4 className="text-xl font-black">2 tasks need recovery planning</h4>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-black text-ink/55">
                  <Calendar size={16} />
                  Friday buffer added
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
