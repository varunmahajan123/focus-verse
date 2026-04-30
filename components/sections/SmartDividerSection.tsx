"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Scissors, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { taskBreakdown } from "@/lib/site-data";

export function SmartDividerSection() {
  const targetRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  const parentScale = useTransform(scrollYProgress, [0.1, 0.4], [1, 0.86]);
  const parentOpacity = useTransform(scrollYProgress, [0.35, 0.58], [1, 0.28]);
  const splitY = useTransform(scrollYProgress, [0.25, 0.72], [60, 0]);

  return (
    <section ref={targetRef} className="relative overflow-hidden bg-[#f5f7fb] px-5 py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="section-eyebrow">Smart task divider</p>
          <h2 className="section-title">Big tasks become clean little wins.</h2>
          <p className="section-copy">
            Focusverse detects when a task is too vague, then breaks it into smaller
            sessions that fit your energy, deadline, and available Pomodoros.
          </p>
        </Reveal>

        <div className="relative min-h-[620px] overflow-hidden rounded-[1.5rem] border border-ink/8 bg-white p-5 shadow-soft md:p-8">
          <div className="absolute inset-0 divider-grid opacity-60" />
          <motion.div
            className="absolute left-1/2 top-12 z-10 w-[min(28rem,78vw)] -translate-x-1/2 rounded-[1.4rem] border border-ink/10 bg-ink p-6 text-white shadow-glow"
            style={{ scale: parentScale, opacity: parentOpacity }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-ink">
                <Scissors size={20} />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.34em] text-white/50">
                Split task
              </span>
            </div>
            <h3 className="text-3xl font-black tracking-normal">Prepare DSA Arrays</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">
              3.5 hours estimated. Too large for one loop.
            </p>
          </motion.div>

          <div className="relative z-20 grid min-h-[560px] place-items-center pt-44">
            <div className="grid w-full max-w-2xl gap-4">
              {taskBreakdown.map((task, index) => {
                const xOffset = index % 2 === 0 ? -34 : 34;
                const rotate = index % 2 === 0 ? -3 : 3;
                return (
                  <motion.div
                    key={task}
                    className="flex items-center justify-between rounded-[1.1rem] border border-ink/8 bg-cream/95 p-4 shadow-sm backdrop-blur"
                    initial={{ opacity: 0, x: xOffset, rotate }}
                    whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ duration: 0.65, delay: 0.1 + index * 0.08 }}
                    viewport={{ once: true, margin: "-20% 0px" }}
                    style={{ y: splitY }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white text-sm font-black">
                        {index + 1}
                      </span>
                      <span className="font-black">{task}</span>
                    </div>
                    <span className="rounded-full bg-sage px-3 py-1 text-xs font-black text-ink/62">
                      {index < 2 ? "study" : "practice"}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-ink/50 shadow-sm">
            <Sparkles size={14} />
            5 loops generated
          </div>
        </div>
      </div>
    </section>
  );
}
