"use client";

import { FormEvent, useMemo, useState } from "react";
import { Check, Clock, Edit3, Plus, Search, Trash2, Undo2 } from "lucide-react";
import { Task, TaskCategory, TaskFilters, TaskPriority } from "@/types/focusverse";
import { AppCard, EmptyState, FieldLabel, IconTile, SectionHeader, SoftButton } from "@/components/shared/ProductPrimitives";

const categories: TaskCategory[] = ["Study", "Coding", "Work", "Fitness", "Personal", "Exam"];
const priorities: TaskPriority[] = ["Low", "Medium", "High"];

type DraftTask = {
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimatedMinutes: number;
  deadline: string;
};

const emptyDraft: DraftTask = {
  title: "",
  category: "Study",
  priority: "Medium",
  estimatedMinutes: 45,
  deadline: new Date().toISOString().slice(0, 10)
};

export function TaskManager({
  tasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTask,
  snoozeTask
}: {
  tasks: Task[];
  addTask: (task: DraftTask & { source?: "manual" }) => void;
  updateTask: (taskId: string, patch: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTask: (taskId: string) => void;
  snoozeTask: (taskId: string) => void;
}) {
  const [draft, setDraft] = useState<DraftTask>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    search: "",
    priority: "All",
    category: "All",
    status: "All"
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase());
      const matchesPriority = filters.priority === "All" || task.priority === filters.priority;
      const matchesCategory = filters.category === "All" || task.category === filters.category;
      const matchesStatus =
        filters.status === "All" ||
        (filters.status === "Completed" ? task.completed : !task.completed);
      return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
    });
  }, [tasks, filters]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim()) return;

    if (editingId) {
      updateTask(editingId, draft);
      setEditingId(null);
    } else {
      addTask({ ...draft, title: draft.title.trim(), source: "manual" });
    }
    setDraft(emptyDraft);
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setDraft({
      title: task.title,
      category: task.category,
      priority: task.priority,
      estimatedMinutes: task.estimatedMinutes,
      deadline: task.deadline
    });
  };

  return (
    <section className="app-section">
      <SectionHeader
        eyebrow="Task feeder"
        title="Capture, sort, and finish the next right thing."
        copy="Tasks persist locally and can be filtered, snoozed, edited, completed, or converted into planner blocks."
      />

      <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <AppCard className="h-fit">
          <form onSubmit={submit} className="space-y-4">
            <div className="flex items-center gap-3">
              <IconTile icon={Plus} tone="mist" />
              <div>
                <h3 className="text-xl font-black">{editingId ? "Edit task" : "Add task"}</h3>
                <p className="text-sm font-bold text-muted-foreground">Keep it small and specific.</p>
              </div>
            </div>
            <div className="space-y-2">
              <FieldLabel>Title</FieldLabel>
              <input className="app-input" value={draft.title} placeholder="e.g. Solve 5 array problems" onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <FieldLabel>Category</FieldLabel>
                <select className="app-input" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as TaskCategory })}>
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <FieldLabel>Priority</FieldLabel>
                <select className="app-input" value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as TaskPriority })}>
                  {priorities.map((priority) => <option key={priority}>{priority}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <FieldLabel>Estimated minutes</FieldLabel>
                <input className="app-input" type="number" min={5} value={draft.estimatedMinutes} onChange={(event) => setDraft({ ...draft, estimatedMinutes: Number(event.target.value) })} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Deadline</FieldLabel>
                <input className="app-input" type="date" value={draft.deadline} onChange={(event) => setDraft({ ...draft, deadline: event.target.value })} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <SoftButton type="submit">{editingId ? "Save task" : "Add task"}</SoftButton>
              {editingId ? <SoftButton variant="ghost" onClick={() => { setEditingId(null); setDraft(emptyDraft); }}>Cancel</SoftButton> : null}
            </div>
          </form>
        </AppCard>

        <AppCard>
          <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
              <input className="app-input pl-11" placeholder="Search tasks" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
            </div>
            <select className="app-input" value={filters.priority} onChange={(event) => setFilters({ ...filters, priority: event.target.value as TaskFilters["priority"] })}>
              <option>All</option>
              {priorities.map((priority) => <option key={priority}>{priority}</option>)}
            </select>
            <select className="app-input" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value as TaskFilters["category"] })}>
              <option>All</option>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
            <select className="app-input" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value as TaskFilters["status"] })}>
              <option>All</option>
              <option>Open</option>
              <option>Completed</option>
            </select>
          </div>

          {filteredTasks.length ? (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div key={task.id} className={`task-card ${task.completed ? "opacity-65" : ""}`}>
                  <button
                    aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition ${task.completed ? "border-sage bg-sage text-foreground" : "border-border bg-surface text-foreground"}`}
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.completed ? <Check size={18} /> : null}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`truncate text-lg font-black ${task.completed ? "line-through opacity-60" : ""}`}>{task.title}</h3>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-foreground">{task.category}</span>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${task.priority === "High" ? "bg-coral/60 text-red-900 dark:text-red-100" : task.priority === "Medium" ? "bg-lavender text-indigo-900 dark:text-indigo-100" : "bg-sage text-green-900 dark:text-green-100"}`}>{task.priority}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-muted-foreground">
                      <span>{task.deadline}</span>
                      <span>{task.estimatedMinutes} min</span>
                      <span>{task.completed ? "Completed" : "Open"}</span>
                      {task.snoozedCount ? <span>Snoozed {task.snoozedCount}x</span> : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button className="mini-icon" title="Snooze" aria-label="Snooze task" onClick={() => snoozeTask(task.id)}><Clock size={16} /></button>
                    <button className="mini-icon" title="Edit" aria-label="Edit task" onClick={() => startEdit(task)}><Edit3 size={16} /></button>
                    <button className="mini-icon danger" title="Delete" aria-label="Delete task" onClick={() => deleteTask(task.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Undo2}
              title="No tasks match that view"
              copy="Clear filters or add one tiny task. A focused list beats a perfect list."
            />
          )}
        </AppCard>
      </div>
    </section>
  );
}
