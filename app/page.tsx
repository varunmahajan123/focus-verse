import dynamic from "next/dynamic";
import { FocusverseProductApp } from "@/components/productivity/FocusverseProductApp";

const FocusUniverseHero = dynamic(() => import("@/components/FocusUniverseHero"), {
  ssr: false,
  loading: () => (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-electric text-white">
      <div className="absolute inset-0 hero-grid opacity-70" />
      <div className="portal-fallback" />
      <div className="relative z-10 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.5em] text-white/70">
          Loading focus loop
        </p>
        <h1 className="text-6xl font-black tracking-normal md:text-8xl">FOCUSVERSE</h1>
      </div>
    </section>
  )
});

export default function Home() {
  return (
    <main className="bg-cream text-ink">
      <FocusUniverseHero />
      <FocusverseProductApp />
    </main>
  );
}
