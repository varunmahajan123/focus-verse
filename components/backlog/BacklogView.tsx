"use client";

import { AlertTriangle, ArrowRight, Route } from "lucide-react";
import { AppData } from "@/types/focusverse";
import { analyzeBacklog } from "@/lib/productivity/metrics";
import { AppCard, EmptyState, IconTile, SectionHeader, SoftButton } from "@/components/shared/ProductPrimitives";

export function BacklogView({
  data,
  addRecoveryPlan
}: {
  data: AppData;
  addRecoveryPlan: () => void;
}) {
  const backlog = analyzeBacklog(data.tasks, data.goals);
  const summary = backlog.count
    ? `You have ${backlog.count} backlog items requiring around ${backlog.estimatedHours} hours. Complete ${backlog.suggestedDailyTarget} tasks daily for ${backlog.recoveryDays} days to recover.`
    : "No major backlog detected. Keep your plan light and protect your next session.";

  return (
    <section className="app-section">
      <SectionHeader
        eyebrow="Backlog analyzer"
        title="Recover without turning your day into a punishment."
        copy="Focusverse detects overdue tasks, repeated snoozes, stale tasks, and delayed milestones."
        action={<SoftButton onClick={addRecoveryPlan} disabled={!backlog.count}>Create recovery plan</SoftButton>}
      />

      <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <AppCard className="bg-foreground text-background">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-coral/80 text-background dark:text-foreground">
              <AlertTriangle size={22} />
            </span>
            <div>
              <p className="text-sm font-black text-background/60">Recovery summary</p>
              <h3 className="text-3xl font-black tracking-normal">{backlog.count} items</h3>
            </div>
          </div>
          <p className="mt-8 text-xl font-black leading-8">{summary}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.2rem] bg-background/20 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-background/60">Hours</p>
              <p className="mt-3 text-3xl font-black">{backlog.estimatedHours}h</p>
            </div>
            <div className="rounded-[1.2rem] bg-background/20 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-background/60">Category</p>
              <p className="mt-3 text-2xl font-black">{backlog.mostDelayedCategory}</p>
            </div>
            <div className="rounded-[1.2rem] bg-background/20 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-background/60">Daily target</p>
              <p className="mt-3 text-3xl font-black">{backlog.suggestedDailyTarget}</p>
            </div>
          </div>
        </AppCard>

        <AppCard>
          <div className="mb-5 flex items-center gap-3">
            <IconTile icon={Route} tone="sage" />
            <div>
              <p className="text-sm font-black text-muted-foreground">Recovery roadmap</p>
              <h3 className="text-2xl font-black">Small steps, not panic work</h3>
            </div>
          </div>

          {backlog.count ? (
            <div className="space-y-3">
              {["Audit what is late", "Compress into 25–45 minute blocks", "Place one recovery block daily", "Review and remove guilt debt"].map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-[1.2rem] bg-surface-elevated p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-sm font-black text-background">{index + 1}</span>
                  <span className="font-black">{step}</span>
                  {index < 3 ? <ArrowRight className="ml-auto hidden text-muted-foreground md:block" size={18} /> : null}
                </div>
              ))}
              <div className="mt-5 rounded-[1.2rem] bg-muted p-4 text-sm font-bold leading-6 text-muted-foreground">
                Recovery tasks will be added to your task feeder and planner with high priority.
              </div>
            </div>
          ) : (
            <EmptyState icon={Route} title="Backlog is calm" copy="Nothing needs urgent rescue. Use this space when tasks slip or milestones drift." />
          )}
        </AppCard>
      </div>
    </section>
  );
}
