"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";

export function SectionTransition() {
  return (
    <section className="relative overflow-hidden bg-night px-5 py-32 text-white md:py-44">
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black via-night to-transparent" />
      <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-2/3 rounded-full border border-white/12 shadow-[0_0_120px_rgba(0,109,255,0.24)]" />
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="relative flex items-center gap-5">
            <span className="h-px flex-1 bg-white/18" />
            <span className="text-xs font-bold uppercase tracking-[0.5em] text-white/45">
              Dark loop exit
            </span>
            <span className="h-px flex-1 bg-white/18" />
          </div>
        </Reveal>
        <motion.h2
          className="mx-auto mt-14 max-w-6xl text-center text-[clamp(3.1rem,10vw,9rem)] font-thin uppercase leading-[0.9] tracking-normal text-white"
          initial={{ opacity: 0, filter: "blur(16px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-15% 0px" }}
        >
          YOUR DAY. DIVIDED SMARTLY.
        </motion.h2>
        <Reveal delay={0.2}>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-3 gap-3">
            {["plan", "focus", "recover"].map((item) => (
              <div
                className="border-y border-white/14 py-4 text-center text-xs font-bold uppercase tracking-[0.35em] text-white/55"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
