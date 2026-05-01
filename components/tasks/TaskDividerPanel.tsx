"use client";

import { FormEvent, useState } from "react";
import { Layers3, Sparkles } from "lucide-react";
import { Subtask, TaskCategory, TaskPriority } from "@/types/focusverse";
import { divideTask } from "@/lib/productivity/task-divider";
import { AppCard, FieldLabel, IconTile, SectionHeader, SoftButton } from "@/components/shared/ProductPrimitives";

const categories: TaskCategory[] = ["Study", "Coding", "Work", "Fitness", "Personal", "Exam"];
const priorities: TaskPriority[] = ["Low", "Medium", "High"];

export function TaskDividerPanel({
  addSubtasks
}: {
  addSubtasks: (subtasks: Subtask[], deadline: string) => void;
}) {
  const [title, setTitle] = useState("Complete DSA Arrays chapter");
  const [category, setCategory] = useState<TaskCategory>("Coding");
  const [priority, setPriority] = useState<TaskPriority>("High");
  const [estimatedMinutes, setEstimatedMinutes] = useState(120);
  const [deadline, setDeadline] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [addedMessage, setAddedMessage] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubtasks(divideTask({ title, category, priority, estimatedMinutes, deadline }));
    setAddedMessage("");
  };

  return (
    <section className="app-section">
      <SectionHeader
        eyebrow="Smart task divider"
        title="Turn overwhelming work into focused Pomodoro-sized steps."
        copy="Rule-based breakdowns adapt to category, estimate, and deadline pressure."
      />

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <AppCard>
          <form onSubmit={submit} className="space-y-4">
            <div className="flex items-center gap-3">
              <IconTile icon={Layers3} tone="lavender" />
              <div>
                <h3 className="text-xl font-black">Break down a big task</h3>
                <p className="text-sm font-bold text-muted-foreground">The output can be added to your task feeder.</p>
              </div>
            </div>
            <div className="space-y-2">
              <FieldLabel>Big task</FieldLabel>
              <input className="app-input" value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <FieldLabel>Category</FieldLabel>
                <select className="app-input" value={category} onChange={(event) => setCategory(event.target.value as TaskCategory)}>
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <FieldLabel>Priority</FieldLabel>
                <select className="app-input" value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
                  {priorities.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <FieldLabel>Estimated minutes</FieldLabel>
                <input className="app-input" type="number" min={15} value={estimatedMinutes} onChange={(event) => setEstimatedMinutes(Number(event.target.value))} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Deadline</FieldLabel>
                <input className="app-input" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
              </div>
            </div>
            <SoftButton type="submit">
              <Sparkles size={16} />
              Generate breakdown
            </SoftButton>
          </form>
        </AppCard>

        <AppCard>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-muted-foreground">Generated subtasks</p>
              <h3 className="text-2xl font-black">{subtasks.length ? `${subtasks.length} focused blocks` : "Ready when you are"}</h3>
            </div>
            <SoftButton
              disabled={!subtasks.length}
              onClick={() => {
                addSubtasks(subtasks, deadline);
                setAddedMessage(`${subtasks.length} subtasks added to your task feeder.`);
                setSubtasks([]);
              }}
            >
              Add to task list
            </SoftButton>
          </div>

          <div className="space-y-3">
            {subtasks.length ? subtasks.map((subtask, index) => (
              <div key={subtask.id} className="flex items-center justify-between rounded-[1.15rem] bg-surface-elevated p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-surface text-foreground text-sm font-black">{index + 1}</span>
                  <div>
                    <h4 className="font-black">{subtask.title}</h4>
                    <p className="mt-1 text-xs font-bold text-muted-foreground">{subtask.estimatedMinutes} min • {subtask.category}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${subtask.urgent ? "bg-coral/60 text-foreground" : "bg-sage text-foreground"}`}>
                  {subtask.urgent ? "Urgent" : subtask.priority}
                </span>
              </div>
            )) : (
              <div className="rounded-[1.25rem] bg-muted p-6 text-sm font-bold leading-6 text-muted-foreground">
                {addedMessage || "Try a large study or coding task. If it is over 90 minutes, Focusverse splits it into 3-5 blocks."}
              </div>
            )}
          </div>
        </AppCard>
      </div>
    </section>
  );
}
