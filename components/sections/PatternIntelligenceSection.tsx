"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { rhythmInsights } from "@/lib/site-data";

export function PatternIntelligenceSection() {
  return (
    <section className="relative overflow-hidden bg-ink px-5 py-24 text-white md:py-36">
      <div className="absolute inset-0 intelligence-grid opacity-35" />
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          <p className="section-eyebrow text-mist">Pattern intelligence</p>
          <h2 className="section-title text-white">
            After 7 days, Focusverse learns your productivity rhythm.
          </h2>
          <p className="section-copy text-white/62">
            It watches when you start strong, drift, recover, and delay. Then it suggests
            a planner that respects the person actually doing the work.
          </p>
        </Reveal>

        <div className="relative mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rhythmInsights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={insight.label}
                className="rounded-[1.35rem] border border-white/12 bg-white/[0.07] p-5 backdrop-blur-xl"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.06 }}
                viewport={{ once: true, margin: "-18% 0px" }}
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-ink">
                    <Icon size={19} />
                  </span>
                  <span className="h-2 w-2 rounded-full bg-mist shadow-[0_0_20px_rgba(207,233,255,0.9)]" />
                </div>
                <p className="text-sm font-bold text-white/45">{insight.label}</p>
                <h3 className="mt-2 text-3xl font-black tracking-normal">{insight.value}</h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
