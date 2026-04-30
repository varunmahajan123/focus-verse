"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Pause, Play, RotateCcw, Sparkles, TimerReset } from "lucide-react";
import { AppData, PomodoroStyle } from "@/types/focusverse";
import { getPomodoroDurations, timeAwareBreakReminder } from "@/lib/productivity/metrics";
import { AppCard, FieldLabel, IconTile, SectionHeader, SoftButton } from "@/components/shared/ProductPrimitives";

const modes: PomodoroStyle[] = ["25/5", "50/10", "90/15", "Custom"];
type TimerPhase = "focus" | "break";
type TimerStatus = "idle" | "running" | "paused" | "completed";

export function PomodoroTimerView({
  data,
  updateProfile,
  addPomodoroSession
}: {
  data: AppData;
  updateProfile: (profile: Partial<AppData["profile"]>) => void;
  addPomodoroSession: (session: { focusMinutes: number; breakMinutes: number; mode: PomodoroStyle }) => void;
}) {
  const [mode, setMode] = useState<PomodoroStyle>(data.profile.pomodoroStyle);
  const durations = useMemo(() => getPomodoroDurations(mode, data.profile), [mode, data.profile]);
  const [phase, setPhase] = useState<TimerPhase>("focus");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [secondsLeft, setSecondsLeft] = useState(durations.focus * 60);
  const [celebrate, setCelebrate] = useState(false);
  const [breakReminder, setBreakReminder] = useState(timeAwareBreakReminder());
  const intervalRef = useRef<number | null>(null);
  const endAtRef = useRef<number | null>(null);
  const remainingRef = useRef(durations.focus * 60);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const nextSeconds = durations.focus * 60;
    clearTimer();
    setPhase("focus");
    remainingRef.current = nextSeconds;
    endAtRef.current = null;
    setSecondsLeft(nextSeconds);
    setStatus("idle");
  }, [clearTimer, durations.focus, durations.break]);

  const completePhase = useCallback(() => {
    clearTimer();
    if (phase === "focus") {
      addPomodoroSession({ focusMinutes: durations.focus, breakMinutes: durations.break, mode });
      setBreakReminder(timeAwareBreakReminder());
      setCelebrate(true);
      window.setTimeout(() => setCelebrate(false), 1800);
      const breakSeconds = durations.break * 60;
      remainingRef.current = breakSeconds;
      endAtRef.current = Date.now() + breakSeconds * 1000;
      setSecondsLeft(breakSeconds);
      setPhase("break");
      setStatus("running");
      return;
    }

    const focusSeconds = durations.focus * 60;
    remainingRef.current = focusSeconds;
    endAtRef.current = null;
    setSecondsLeft(focusSeconds);
    setPhase("focus");
    setStatus("completed");
  }, [addPomodoroSession, clearTimer, durations.break, durations.focus, mode, phase]);

  useEffect(() => {
    if (status !== "running") {
      clearTimer();
      return;
    }

    if (!endAtRef.current) {
      endAtRef.current = Date.now() + remainingRef.current * 1000;
    }

    clearTimer();
    intervalRef.current = window.setInterval(() => {
      if (!endAtRef.current) return;
      const next = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      remainingRef.current = next;
      setSecondsLeft(next);
      if (next <= 0) {
        completePhase();
      }
    }, 250);

    return clearTimer;
  }, [clearTimer, completePhase, status]);

  useEffect(() => clearTimer, [clearTimer]);

  const totalSeconds = (phase === "focus" ? durations.focus : durations.break) * 60;
  const progress = totalSeconds ? Math.min(100, Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100)) : 0;
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  const statusLabel =
    status === "running"
      ? phase === "focus"
        ? "Focus running"
        : "Break running"
      : status === "paused"
        ? "Paused"
        : status === "completed"
          ? "Break complete. Ready to focus."
          : "Idle and ready";

  const reset = () => {
    clearTimer();
    endAtRef.current = null;
    remainingRef.current = totalSeconds;
    setStatus("idle");
    setSecondsLeft(totalSeconds);
  };

  const start = () => {
    if (status === "running") return;
    endAtRef.current = Date.now() + remainingRef.current * 1000;
    setStatus("running");
  };

  const pause = () => {
    if (status !== "running") return;
    clearTimer();
    endAtRef.current = null;
    remainingRef.current = secondsLeft;
    setStatus("paused");
  };

  const changeMode = (nextMode: PomodoroStyle) => {
    clearTimer();
    setMode(nextMode);
    updateProfile({ pomodoroStyle: nextMode });
    setPhase("focus");
    setStatus("idle");
  };

  return (
    <section className="app-section">
      <SectionHeader
        eyebrow="Pomodoro"
        title="A calm, cute focus loop that actually tracks sessions."
        copy="Start, pause, reset, customize durations, and save completed focus minutes into reports."
      />

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <AppCard className="relative overflow-hidden bg-lavender/55">
          {celebrate ? <div className="confetti-burst" /> : null}
          <div className="absolute inset-0 pomodoro-noise opacity-70" />
          <div className="relative z-10 grid gap-8 md:grid-cols-[1fr_0.85fr]">
            <div className="grid place-items-center">
              <div
                className="product-timer-ring"
                style={{ "--timer-value": `${progress}%` } as React.CSSProperties}
              >
                <div className="product-orb" />
                <div className="text-center">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-ink/42">{phase === "focus" ? "Focus" : "Break"}</p>
                  <div className="mt-2 text-6xl font-black tracking-normal md:text-7xl">{minutes}:{seconds}</div>
                  <p className="mt-3 text-sm font-black text-ink/48">{statusLabel}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4">
              <div className="rounded-[1.4rem] bg-white/70 p-3 shadow-sm">
                <div className="grid grid-cols-4 gap-2">
                  {modes.map((item) => (
                    <button
                      key={item}
                      className={`rounded-full px-3 py-3 text-sm font-black transition ${mode === item ? "bg-ink text-white" : "text-ink/55 hover:bg-ink/6"}`}
                      onClick={() => changeMode(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {mode === "Custom" ? (
                <div className="grid grid-cols-2 gap-3 rounded-[1.4rem] bg-white/70 p-4 shadow-sm">
                  <div className="space-y-2">
                    <FieldLabel>Focus</FieldLabel>
                    <input className="app-input" type="number" min={1} step={1} value={data.profile.customFocusMinutes} onChange={(event) => updateProfile({ customFocusMinutes: Number(event.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Break</FieldLabel>
                    <input className="app-input" type="number" min={1} step={1} value={data.profile.customBreakMinutes} onChange={(event) => updateProfile({ customBreakMinutes: Number(event.target.value) })} />
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-3 gap-3">
                <button className="timer-action" aria-label="Start timer" onClick={start} disabled={status === "running"}><Play size={19} /><span>Start</span></button>
                <button className="timer-action" aria-label="Pause timer" onClick={pause} disabled={status !== "running"}><Pause size={19} /><span>Pause</span></button>
                <button className="timer-action" aria-label="Reset timer" onClick={reset}><RotateCcw size={19} /></button>
              </div>
              <div className="rounded-[1.4rem] bg-white/70 p-4 text-sm font-bold leading-6 text-ink/58 shadow-sm">
                <Sparkles className="mb-2 text-electric" size={18} />
                {phase === "break" ? breakReminder : "Protect this one loop. Your only job is to stay with the next minute."}
              </div>
            </div>
          </div>
        </AppCard>

        <div className="grid gap-4">
          <AppCard>
            <div className="flex items-center gap-3">
              <IconTile icon={TimerReset} tone="mist" />
              <div>
                <p className="text-sm font-black text-ink/45">Completed sessions</p>
                <h3 className="text-4xl font-black tracking-normal">{data.pomodoroSessions.length}</h3>
              </div>
            </div>
          </AppCard>
          <AppCard>
            <div className="flex items-center gap-3">
              <IconTile icon={CheckCircle2} tone="sage" />
              <div>
                <p className="text-sm font-black text-ink/45">Selected mode</p>
                <h3 className="text-2xl font-black tracking-normal">
                  {mode} • {durations.focus}/{durations.break} min
                </h3>
              </div>
            </div>
          </AppCard>
          <AppCard>
            <h3 className="text-xl font-black">Smart break system</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {["Drink water", "Stretch neck", "Walk 2 minutes", "Rest eyes", "Deep breaths", "Sleep warning late night"].map((item) => (
                <div key={item} className="rounded-2xl bg-cream/80 p-3 text-sm font-black text-ink/58">{item}</div>
              ))}
            </div>
          </AppCard>
          <AppCard className="bg-sage/65">
            <h3 className="text-xl font-black">Focus pet garden</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-ink/58">
              Every completed Pomodoro adds XP. The garden concept is represented by your growing streak, badges, and focus score.
            </p>
          </AppCard>
        </div>
      </div>
    </section>
  );
}
