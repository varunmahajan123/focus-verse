"use client";

import { FormEvent, useState } from "react";
import { Flag, Plus, Target, Trophy } from "lucide-react";
import { Goal } from "@/types/focusverse";
import { goalProgress } from "@/lib/productivity/metrics";
import { AppCard, EmptyState, FieldLabel, IconTile, ProgressRing, SectionHeader, SoftButton } from "@/components/shared/ProductPrimitives";

const goalTypes = [
  "Competitive exam",
  "Learn DSA",
  "Complete semester syllabus",
  "Build startup website",
  "Fitness transformation",
  "Custom goal"
];

export function GoalsView({
  goals,
  addGoal,
  addMilestone,
  toggleMilestone,
  createTaskFromGoal
}: {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => void;
  addMilestone: (goalId: string, title: string, targetDate: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  createTaskFromGoal: (goal: Goal) => void;
}) {
  const [title, setTitle] = useState("Build startup website");
  const [type, setType] = useState(goalTypes[3]);
  const [targetDate, setTargetDate] = useState(new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10));
  const [weeklyTarget, setWeeklyTarget] = useState("Ship 2 focused milestones");
  const [dailySuggestion, setDailySuggestion] = useState("Spend 35 minutes on the next product task.");
  const [milestoneDrafts, setMilestoneDrafts] = useState<Record<string, string>>({});

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    addGoal({
      title,
      type,
      targetDate,
      weeklyTarget,
      dailySuggestion,
      milestones: [
        { id: `temp-${Date.now()}-1`, title: "Define first milestone", targetDate, completed: false }
      ]
    });
    setTitle("");
  };

  return (
    <section className="app-section">
      <SectionHeader
        eyebrow="Long-term goals"
        title="Make big ambitions visible, gentle, and trackable."
        copy="Create goals, add milestones, mark progress, and generate daily tasks that keep the long game alive."
      />

      <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <AppCard className="h-fit">
          <form onSubmit={submit} className="space-y-4">
            <div className="flex items-center gap-3">
              <IconTile icon={Target} tone="sage" />
              <div>
                <h3 className="text-xl font-black">Create goal</h3>
                <p className="text-sm font-bold text-ink/45">Milestones turn dreams into handles.</p>
              </div>
            </div>
            <div className="space-y-2">
              <FieldLabel>Goal title</FieldLabel>
              <input className="app-input" value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <FieldLabel>Type</FieldLabel>
                <select className="app-input" value={type} onChange={(event) => setType(event.target.value)}>
                  {goalTypes.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <FieldLabel>Target date</FieldLabel>
                <input className="app-input" type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <FieldLabel>Weekly target</FieldLabel>
              <input className="app-input" value={weeklyTarget} onChange={(event) => setWeeklyTarget(event.target.value)} />
            </div>
            <div className="space-y-2">
              <FieldLabel>Daily task suggestion</FieldLabel>
              <input className="app-input" value={dailySuggestion} onChange={(event) => setDailySuggestion(event.target.value)} />
            </div>
            <SoftButton type="submit"><Plus size={16} /> Add goal</SoftButton>
          </form>
        </AppCard>

        <div className="space-y-4">
          {goals.length ? goals.map((goal) => {
            const progress = goalProgress(goal);
            return (
              <AppCard key={goal.id}>
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <ProgressRing value={progress} size="sm" />
                    <div>
                      <div className="mb-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-lavender px-3 py-1 text-xs font-black text-ink/55">{goal.type}</span>
                        <span className="rounded-full bg-sage px-3 py-1 text-xs font-black text-ink/55">{goal.targetDate}</span>
                      </div>
                      <h3 className="text-2xl font-black tracking-normal">{goal.title}</h3>
                      <p className="mt-2 text-sm font-bold leading-6 text-ink/55">{goal.weeklyTarget}</p>
                    </div>
                  </div>
                  <SoftButton variant="secondary" onClick={() => createTaskFromGoal(goal)}>Generate daily task</SoftButton>
                </div>

                <div className="mt-6 space-y-2">
                  {goal.milestones.map((milestone) => (
                    <button
                      key={milestone.id}
                      className="flex w-full items-center justify-between rounded-2xl bg-cream/75 p-3 text-left transition hover:bg-mist/70"
                      onClick={() => toggleMilestone(goal.id, milestone.id)}
                    >
                      <span className={`font-black ${milestone.completed ? "line-through opacity-60" : ""}`}>{milestone.title}</span>
                      <span className="text-xs font-bold text-ink/42">{milestone.targetDate}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    className="app-input"
                    placeholder="Add milestone"
                    value={milestoneDrafts[goal.id] ?? ""}
                    onChange={(event) => setMilestoneDrafts({ ...milestoneDrafts, [goal.id]: event.target.value })}
                  />
                  <SoftButton
                    variant="ghost"
                    onClick={() => {
                      const value = (milestoneDrafts[goal.id] ?? "").trim();
                      if (!value) return;
                      addMilestone(goal.id, value, goal.targetDate);
                      setMilestoneDrafts({ ...milestoneDrafts, [goal.id]: "" });
                    }}
                  >
                    <Plus size={16} />
                  </SoftButton>
                </div>
              </AppCard>
            );
          }) : (
            <EmptyState icon={Flag} title="No goals yet" copy="Add a goal and Focusverse will help convert it into weekly targets and daily moves." />
          )}
        </div>
      </div>
    </section>
  );
}
