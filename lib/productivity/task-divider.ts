import { Subtask, TaskCategory, TaskPriority } from "@/types/focusverse";
import { isDeadlineNear, uid } from "@/lib/productivity/metrics";

const studySteps = [
  "Understand concept",
  "Make notes",
  "Practice questions",
  "Revise mistakes",
  "Quick test"
];

const codingSteps = [
  "Watch/read concept",
  "Implement basics",
  "Solve easy problems",
  "Solve medium problems",
  "Review bugs"
];

const generalSteps = [
  "Clarify outcome",
  "Break into first action",
  "Complete focused work block",
  "Review and polish",
  "Plan next step"
];

export function divideTask(input: {
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimatedMinutes: number;
  deadline: string;
}): Subtask[] {
  const urgent = isDeadlineNear(input.deadline);
  const base =
    input.category === "Study" || input.category === "Exam"
      ? studySteps
      : input.category === "Coding"
        ? codingSteps
        : generalSteps;
  const blockCount = input.estimatedMinutes > 90 ? Math.min(5, Math.max(3, Math.ceil(input.estimatedMinutes / 45))) : 3;
  const chosen = base.slice(0, blockCount);
  const minutes = Math.max(15, Math.round(input.estimatedMinutes / chosen.length / 5) * 5);

  return chosen.map((title, index) => ({
    id: uid("subtask"),
    title: `${title}: ${input.title}`,
    category: input.category,
    priority: urgent ? "High" : input.priority,
    estimatedMinutes: minutes,
    urgent: urgent || index === 0
  }));
}
