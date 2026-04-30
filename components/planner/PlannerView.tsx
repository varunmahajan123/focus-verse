"use client";

import { CalendarClock, CheckCircle2, RefreshCcw } from "lucide-react";
import { PlannerBlock } from "@/types/focusverse";
import { AppCard, EmptyState, IconTile, SectionHeader, SoftButton } from "@/components/shared/ProductPrimitives";

const typeLabels: Record<PlannerBlock["type"], string> = {
  "deep-work": "Deep work",
  pomodoro: "Pomodoro",
  break: "Break",
  lunch: "Lunch",
  review: "Review",
  shutdown: "Shutdown",
  recovery: "Recovery"
};

const typeTone: Record<PlannerBlock["type"], string> = {
  "deep-work": "bg-mist",
  pomodoro: "bg-lavender",
  break: "bg-sage",
  lunch: "bg-coral/50",
  review: "bg-cream",
  shutdown: "bg-ink text-white",
  recovery: "bg-coral/60"
};

export function PlannerView({
  blocks,
  regeneratePlanner,
  toggleBlock
}: {
  blocks: PlannerBlock[];
  regeneratePlanner: () => void;
  toggleBlock: (blockId: string) => void;
}) {
  const completed = blocks.filter((block) => block.completed).length;

  return (
    <section className="app-section">
      <SectionHeader
        eyebrow="Auto daily planner"
        title="A schedule that respects your time, breaks, and backlog."
        copy="Generated from wake time, sleep time, priority, deadline pressure, backlog, goals, and Pomodoro preference."
        action={<SoftButton onClick={regeneratePlanner}><RefreshCcw size={16} /> Regenerate planner</SoftButton>}
      />

      <div className="grid gap-5 lg:grid-cols-[0.32fr_0.68fr]">
        <AppCard className="h-fit">
          <IconTile icon={CalendarClock} tone="mist" />
          <h3 className="mt-8 text-4xl font-black tracking-normal">{blocks.length}</h3>
          <p className="mt-2 text-sm font-bold text-ink/55">time blocks today</p>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-ink/8">
            <div className="h-full rounded-full bg-ink" style={{ width: `${blocks.length ? (completed / blocks.length) * 100 : 0}%` }} />
          </div>
          <p className="mt-3 text-sm font-black text-ink/45">{completed}/{blocks.length || 0} complete</p>
        </AppCard>

        <AppCard>
          {blocks.length ? (
            <div className="relative space-y-3 before:absolute before:bottom-6 before:left-[5.15rem] before:top-6 before:w-px before:bg-ink/10 max-sm:before:left-[4.25rem]">
              {blocks.map((block) => (
                <div key={block.id} className="relative grid grid-cols-[4.6rem_1fr] gap-4 rounded-[1.25rem] bg-white/65 p-3 shadow-sm sm:grid-cols-[5.5rem_1fr_auto] sm:p-4">
                  <div className="text-sm font-black leading-6 text-ink/58">
                    <div>{block.start}</div>
                    <div>{block.end}</div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${typeTone[block.type]}`}>{typeLabels[block.type]}</span>
                      {block.completed ? <span className="rounded-full bg-sage px-3 py-1 text-xs font-black">Done</span> : null}
                    </div>
                    <h3 className={`mt-2 text-lg font-black ${block.completed ? "line-through opacity-60" : ""}`}>{block.title}</h3>
                  </div>
                  <button
                    className={`mini-icon ${block.completed ? "bg-sage" : ""}`}
                    onClick={() => toggleBlock(block.id)}
                    aria-label={block.completed ? "Mark block incomplete" : "Mark block complete"}
                  >
                    <CheckCircle2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarClock}
              title="No planner generated yet"
              copy="Generate a plan and Focusverse will place deep work, breaks, lunch, review, and shutdown blocks."
              action={<SoftButton onClick={regeneratePlanner}>Generate today</SoftButton>}
            />
          )}
        </AppCard>
      </div>
    </section>
  );
}
