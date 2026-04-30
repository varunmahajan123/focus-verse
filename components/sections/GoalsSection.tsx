"use client";

import { motion } from "framer-motion";
import { Medal } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { goals } from "@/lib/site-data";

export function GoalsSection() {
  return (
    <section className="relative overflow-hidden bg-cream px-5 py-24 md:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">Long-term goals</p>
          <h2 className="section-title">Daily loops that compound into bigger arcs.</h2>
          <p className="section-copy mx-auto">
            Competitive exam prep, DSA, a startup, fitness, or anything that needs a
            long attention span gets milestones, rings, XP, badges, and streaks.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {goals.map((goal, index) => {
            const Icon = goal.icon;
            return (
              <motion.div
                key={goal.label}
                className="goal-card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white">
                    <Icon size={19} />
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-lavender text-ink">
                    <Medal size={18} />
                  </span>
                </div>
                <div className="mt-10 grid place-items-center">
                  <div
                    className="progress-ring"
                    style={{ "--ring-progress": `${goal.progress}%` } as React.CSSProperties}
                  >
                    <span>{goal.progress}%</span>
                  </div>
                </div>
                <h3 className="mt-9 text-2xl font-black tracking-normal">{goal.label}</h3>
                <div className="mt-5 space-y-3">
                  {["Milestone 01", "Milestone 02", "Milestone 03"].map((item, itemIndex) => (
                    <div className="flex items-center gap-3 text-sm font-bold text-ink/55" key={item}>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          itemIndex * 28 < goal.progress ? "bg-ink" : "bg-ink/18"
                        }`}
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
