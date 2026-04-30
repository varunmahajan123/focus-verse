"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="relative grid min-h-screen overflow-hidden bg-night px-5 py-24 text-white">
      <div className="absolute inset-0 cta-stars" />
      <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-electric/35 shadow-[0_0_160px_rgba(0,109,255,0.35)]" />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[29rem] w-[29rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/22"
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{ rotate: { duration: 24, repeat: Infinity, ease: "linear" }, scale: { duration: 5, repeat: Infinity } }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/25 blur-3xl"
        animate={{ opacity: [0.45, 0.9, 0.45] }}
        transition={{ duration: 3.8, repeat: Infinity }}
      />

      <div className="relative z-10 mx-auto grid max-w-5xl place-items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <div className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-white/65 backdrop-blur-xl">
            <Sparkles size={14} />
            Exit the loop
          </div>
          <h2 className="text-balance text-[clamp(3rem,8vw,8rem)] font-black leading-[0.9] tracking-normal">
            Ready to enter your most focused version?
          </h2>
          <button className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-base font-black text-ink shadow-glow transition hover:-translate-y-1 hover:bg-mist">
            Start Building Focus
            <ArrowRight className="transition group-hover:translate-x-1" size={19} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
