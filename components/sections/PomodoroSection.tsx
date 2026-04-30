"use client";

import { useMemo, useState } from "react";
import { Pause, Play, RotateCcw, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { breakReminders } from "@/lib/site-data";

const modes = [
  { label: "25/5", minutes: 25 },
  { label: "50/10", minutes: 50 },
  { label: "90/15", minutes: 90 }
];

export function PomodoroSection() {
  const [activeMode, setActiveMode] = useState(modes[0]);
  const [isRunning, setIsRunning] = useState(true);
  const progress = useMemo(() => (activeMode.minutes === 25 ? 64 : activeMode.minutes === 50 ? 38 : 22), [activeMode]);

  return (
    <section className="relative overflow-hidden bg-cream px-5 py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        <Reveal className="order-2 lg:order-1">
          <div className="pomodoro-shell">
            <div className="absolute inset-0 pomodoro-noise" />
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="section-eyebrow">Pomodoro timer</p>
                <h3 className="text-3xl font-black tracking-normal md:text-4xl">Deep work loop</h3>
              </div>
              <span className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-ink/60 shadow-sm">
                <ShieldCheck size={16} />
                break-safe
              </span>
            </div>

            <div className="relative z-10 mt-10 grid gap-8 md:grid-cols-[1fr_0.82fr]">
              <div className="grid place-items-center">
                <div
                  className="timer-ring"
                  style={{ "--timer-progress": `${progress}%` } as React.CSSProperties}
                >
                  <motion.div
                    className="orb-mascot"
                    animate={{ y: [0, -12, 0], rotate: [0, 4, -4, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-[0.28em] text-ink/45">
                      focus
                    </p>
                    <div className="mt-2 text-6xl font-black tracking-normal">
                      {activeMode.minutes === 25 ? "18:42" : activeMode.minutes === 50 ? "31:05" : "70:16"}
                    </div>
                    <p className="mt-3 text-sm font-bold text-ink/50">
                      Session {isRunning ? "running" : "paused"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-5">
                <div className="rounded-[1.25rem] bg-white/75 p-3 shadow-sm">
                  <div className="grid grid-cols-3 gap-2">
                    {modes.map((mode) => (
                      <button
                        key={mode.label}
                        className={`rounded-full px-3 py-3 text-sm font-black transition ${
                          mode.label === activeMode.label
                            ? "bg-ink text-white"
                            : "bg-transparent text-ink/55 hover:bg-ink/6"
                        }`}
                        onClick={() => setActiveMode(mode)}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    aria-label="Start"
                    className="icon-button"
                    onClick={() => setIsRunning(true)}
                    title="Start"
                  >
                    <Play size={19} />
                  </button>
                  <button
                    aria-label="Pause"
                    className="icon-button"
                    onClick={() => setIsRunning(false)}
                    title="Pause"
                  >
                    <Pause size={19} />
                  </button>
                  <button
                    aria-label="Reset"
                    className="icon-button"
                    onClick={() => setIsRunning(false)}
                    title="Reset"
                  >
                    <RotateCcw size={19} />
                  </button>
                </div>

                <div className="rounded-[1.25rem] bg-white/75 p-5 shadow-sm">
                  <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-ink/45">
                    break reminders
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {breakReminders.map((reminder) => (
                      <span className="rounded-full bg-sage px-3 py-2 text-sm font-black text-ink/62" key={reminder}>
                        {reminder}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={0.12}>
          <p className="section-eyebrow">Calm, addictive pacing</p>
          <h2 className="section-title">Cute where it helps. Serious where it counts.</h2>
          <p className="section-copy">
            Sessions feel tactile and rewarding, while reminders keep the rhythm healthy.
            The timer is built for repeated use, not novelty.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
