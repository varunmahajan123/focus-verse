"use client";

import { motion } from "framer-motion";
import { ArrowRight, Route, ShieldAlert } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { recoverySteps } from "@/lib/site-data";

export function BacklogRecoverySection() {
  return (
    <section className="relative overflow-hidden bg-[#edf5f2] px-5 py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="section-eyebrow">Backlog recovery</p>
          <h2 className="section-title">Missed work turns into a roadmap.</h2>
          <p className="section-copy">
            Focusverse groups missed tasks, estimates the load, and builds a recovery
            plan that protects your current schedule from collapse.
          </p>
        </Reveal>

        <Reveal delay={0.12} className="rounded-[1.5rem] bg-ink p-5 text-white shadow-soft md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-coral text-ink">
                <ShieldAlert size={22} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.32em] text-white/42">
                  Analyzer
                </p>
                <h3 className="text-2xl font-black">Recovery scan complete</h3>
              </div>
            </div>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-ink">
              4 day plan
            </span>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {recoverySteps.map((step, index) => (
              <motion.div
                key={step.title}
                className="rounded-[1.15rem] border border-white/10 bg-white/[0.08] p-4"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.55 }}
                viewport={{ once: true }}
              >
                <p className="text-sm font-bold text-white/45">{step.title}</p>
                <p className="mt-4 text-3xl font-black">{step.value}</p>
                <p className="mt-2 text-sm leading-5 text-white/55">{step.detail}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.25rem] bg-white p-5 text-ink">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sage">
                <Route size={18} />
              </span>
              <h4 className="text-xl font-black">Recovery roadmap</h4>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {["Audit", "Compress", "Reschedule", "Protect"].map((item, index) => (
                <div className="flex items-center gap-3" key={item}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <span className="font-black">{item}</span>
                  {index < 3 ? <ArrowRight className="hidden text-ink/35 md:block" size={18} /> : null}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
