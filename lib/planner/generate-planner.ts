import { AppData, PlannerBlock, Task } from "@/types/focusverse";
import { analyzeBacklog, getPomodoroDurations, uid } from "@/lib/productivity/metrics";

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTime(minutes: number) {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60).toString().padStart(2, "0");
  const m = (normalized % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function addBlock(blocks: PlannerBlock[], start: number, duration: number, block: Omit<PlannerBlock, "id" | "start" | "end" | "completed">) {
  blocks.push({
    id: uid("block"),
    start: toTime(start),
    end: toTime(start + duration),
    completed: false,
    ...block
  });
  return start + duration;
}

function taskWeight(task: Task) {
  const priority = task.priority === "High" ? 3 : task.priority === "Medium" ? 2 : 1;
  const deadlineDistance = Math.max(0, new Date(task.deadline).getTime() - Date.now()) / 86400000;
  const deadlineBoost = deadlineDistance <= 1 ? 4 : deadlineDistance <= 3 ? 2 : 0;
  return priority * 10 + deadlineBoost + task.snoozedCount * 2;
}

export function generatePlanner(data: AppData): PlannerBlock[] {
  const { focus, break: breakMinutes } = getPomodoroDurations(data.profile.pomodoroStyle, data.profile);
  const backlog = analyzeBacklog(data.tasks, data.goals);
  const pendingTasks = [...data.tasks]
    .filter((task) => !task.completed)
    .sort((a, b) => taskWeight(b) - taskWeight(a))
    .slice(0, 6);

  if (!pendingTasks.length && backlog.count === 0) {
    return [];
  }

  const blocks: PlannerBlock[] = [];
  const preferredStart = {
    Morning: toMinutes(data.profile.wakeTime) + 45,
    Afternoon: 13 * 60 + 30,
    Evening: 17 * 60 + 30,
    Night: 20 * 60
  }[data.profile.bestFocusTime ?? "Morning"];
  let cursor = Math.max(toMinutes(data.profile.wakeTime) + 30, preferredStart);
  const sleep = toMinutes(data.profile.sleepTime);
  const latest = sleep > cursor ? sleep - 70 : 22 * 60;
  const availableMinutes = Math.min(data.profile.dailyAvailableHours * 60, Math.max(120, latest - cursor));
  const stopAt = cursor + availableMinutes;

  if (backlog.count > 0) {
    cursor = addBlock(blocks, cursor, 25, {
      title: `Recovery scan: ${backlog.suggestedDailyTarget} small backlog tasks`,
      type: "recovery"
    });
    cursor = addBlock(blocks, cursor, 5, { title: "Water break", type: "break" });
  }

  for (const task of pendingTasks) {
    if (cursor + focus > stopAt) break;
    const sessions = Math.max(1, Math.min(3, Math.ceil(task.estimatedMinutes / focus)));
    for (let i = 0; i < sessions; i += 1) {
      if (cursor + focus > stopAt) break;
      cursor = addBlock(blocks, cursor, focus, {
        title: `${task.title} Pomodoro ${i + 1}`,
        type: i === 0 ? "deep-work" : "pomodoro",
        taskId: task.id
      });
      if (cursor + breakMinutes <= stopAt) {
        cursor = addBlock(blocks, cursor, breakMinutes, {
          title: i === 1 ? "Stretch and rest eyes" : "Water break",
          type: "break"
        });
      }
    }

    if (cursor < 13 * 60 && cursor + 30 >= 13 * 60) {
      cursor = addBlock(blocks, Math.max(cursor, 13 * 60), 35, {
        title: "Lunch and phone-away reset",
        type: "lunch"
      });
    }
  }

  if (blocks.every((block) => block.type !== "lunch") && cursor < stopAt - 40) {
    cursor = addBlock(blocks, Math.max(cursor, 13 * 60), 35, {
      title: "Lunch and walk reminder",
      type: "lunch"
    });
  }

  if (cursor + 20 <= stopAt) {
    cursor = addBlock(blocks, cursor, 20, {
      title: "Review notes and update task feeder",
      type: "review"
    });
  }

  if (cursor + 15 <= latest) {
    addBlock(blocks, cursor, 15, {
      title: "Shutdown routine: clear desk, choose tomorrow's first task",
      type: "shutdown"
    });
  }

  return blocks;
}
