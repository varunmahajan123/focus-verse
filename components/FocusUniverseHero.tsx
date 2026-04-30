"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FallbackTunnel } from "@/components/FallbackTunnel";

const FocusUniverseScene = dynamic(
  () => import("@/components/three/FocusUniverseScene"),
  {
    ssr: false,
    loading: () => <FallbackTunnel />
  }
);

export default function FocusUniverseHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max(window.innerHeight * 6.2, 4300)}`,
        pin: true,
        scrub: 1.15,
        anticipatePin: 1,
        fastScrollEnd: true,
        onUpdate: (self) => setProgress(Number(self.progress.toFixed(4)))
      });
    }, section);

    return () => context.revert();
  }, []);

  const titleOpacity = Math.max(0, 1 - progress * 7.5);
  const titleScale = 1 + progress * 1.05;
  const titleY = progress * -44;
  const cardOpacity = Math.min(1, Math.max(0, (progress - 0.08) * 4.2));
  const warpOpacity =
    Math.min(0.72, Math.max(0, (progress - 0.05) * 2.6)) *
    Math.max(0.18, 1 - Math.max(0, progress - 0.74) * 2);
  const portalDarkness = Math.min(0.96, Math.max(0, (progress - 0.55) * 2.45));
  const stageLabels = ["portal lock", "timer stream", "planner orbit", "dark loop"];
  const stageIndex = Math.min(
    stageLabels.length - 1,
    Math.max(0, Math.floor(progress * stageLabels.length))
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-electric text-white"
      aria-label="Enter the Focus Loop"
    >
      <FocusUniverseScene progress={progress} />
      <div
        className="pointer-events-none absolute inset-0 warp-streaks"
        style={
          {
            opacity: warpOpacity,
            "--warp-progress": progress
          } as React.CSSProperties
        }
      />
      <div className="pointer-events-none absolute inset-0 hero-depth-halo" />
      <div className="pointer-events-none absolute inset-0 hero-vignette" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-night via-night/42 to-transparent"
        style={{ opacity: Math.min(1, progress * 1.4) }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-night transition-opacity duration-300"
        style={{ opacity: portalDarkness }}
      />

      <div className="absolute left-0 right-0 top-0 z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <div className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.34em] backdrop-blur-xl">
          FOCUSVERSE
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white/80 backdrop-blur-xl sm:flex">
          <Sparkles size={14} />
          Scroll-linked universe
        </div>
      </div>

      <div className="pointer-events-none relative z-10 flex h-full items-center justify-center px-5 text-center">
        <div
          className="max-w-5xl will-change-transform"
          style={{
            opacity: titleOpacity,
            transform: `translate3d(0, ${titleY}px, 0) scale(${titleScale})`
          }}
        >
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.58em] text-white/75 md:text-sm">
            Enter the Focus Loop
          </p>
          <h1 className="whitespace-nowrap text-[clamp(2.85rem,12.2vw,10.8rem)] font-black leading-[0.84] tracking-normal text-white drop-shadow-[0_0_34px_rgba(255,255,255,0.28)]">
            FOCUSVERSE
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-balance text-lg font-medium text-white/82 md:text-2xl">
            A scroll-powered productivity universe
          </p>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/35 bg-white/14 px-5 py-3 text-sm font-semibold text-white shadow-glow backdrop-blur-xl transition-opacity"
        style={{ opacity: Math.max(0, 1 - progress * 4) }}
      >
        <span>Scroll to enter the loop</span>
        <ArrowDown className="animate-bounce" size={17} />
      </div>

      <div
        className="absolute bottom-8 left-1/2 z-20 grid -translate-x-1/2 place-items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 backdrop-blur-xl transition-opacity"
        style={{ opacity: cardOpacity }}
      >
        Level {String(Math.max(1, Math.ceil(progress * 9))).padStart(2, "0")}
      </div>

      <div
        className="hero-flight-hud"
        style={{
          opacity: cardOpacity,
          transform: `translateY(${Math.max(0, 20 - progress * 70)}px)`
        }}
      >
        <span className="hero-stage-chip">{stageLabels[stageIndex]}</span>
        <div className="hero-status-rail" aria-hidden="true">
          <span style={{ width: `${Math.max(8, progress * 100)}%` }} />
        </div>
        <span className="font-black tabular-nums text-white/75">
          {String(Math.round(progress * 100)).padStart(2, "0")}%
        </span>
      </div>
    </section>
  );
}
