"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  Sparkles,
  Target
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import {
  OnboardingPayload,
  OnboardingTaskInput,
  BestFocusTime,
  ProductivityLevel,
  Purpose,
  Struggle,
  UserProfile
} from "@/types/focusverse";
import { defaultProfile } from "@/lib/defaults";
import { FieldLabel, IconTile, SoftButton } from "@/components/shared/ProductPrimitives";

const purposes: Purpose[] = ["Study", "Work", "Exam Prep", "Coding", "Fitness", "Personal Goals"];
const levels: ProductivityLevel[] = ["Beginner", "Average", "Disciplined"];
const struggles: Struggle[] = ["Procrastination", "Backlog", "No Planning", "Inconsistency", "Distractions"];
const focusTimes = ["Morning", "Afternoon", "Evening", "Night"] as const;
const pomodoroStyles = ["25/5", "50/10", "90/15", "Custom"] as const;

const stepMeta = [
  { title: "Welcome", icon: Sparkles },
  { title: "Routine", icon: Clock3 },
  { title: "Focus Style", icon: Flame },
  { title: "First Goal", icon: Target },
  { title: "First Tasks", icon: CalendarDays },
  { title: "Finish", icon: CheckCircle2 }
];

function nextDate(days: number) {
  return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
}

function blankTask(index: number): OnboardingTaskInput {
  return {
    title: index === 0 ? "Plan my first Focusverse day" : "",
    estimatedMinutes: index === 0 ? 25 : 30,
    priority: index === 0 ? "Medium" : "Low",
    deadline: nextDate(0),
    category: "Personal"
  };
}

export function OnboardingWizard({
  onComplete,
  onClose
}: {
  onComplete: (payload: OnboardingPayload) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [bestFocusTime, setBestFocusTime] = useState<BestFocusTime>("Morning");
  const [profile, setProfile] = useState<UserProfile>({
    ...defaultProfile,
    name: "",
    onboarded: false
  });
  const [goal, setGoal] = useState({
    title: "",
    targetDate: nextDate(60),
    weeklyTarget: "Three focused sessions each week"
  });
  const [tasks, setTasks] = useState<OnboardingTaskInput[]>([blankTask(0), blankTask(1), blankTask(2)]);

  const StepIcon = stepMeta[step].icon;
  const canContinue = useMemo(() => {
    if (step === 0) return profile.name.trim().length > 0;
    if (step === 4) return tasks.some((task) => task.title.trim());
    return true;
  }, [profile.name, step, tasks]);

  const finish = () => {
    onComplete({
      profile: {
        ...profile,
        name: profile.name.trim(),
        onboarded: true,
        dailyAvailableHours: Number(profile.dailyAvailableHours) || 3,
        biggestStruggle: profile.biggestStruggle,
        purpose: profile.purpose,
        bestFocusTime
      },
      firstGoal: goal.title.trim() ? goal : undefined,
      firstTasks: tasks.filter((task) => task.title.trim())
    });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (step < stepMeta.length - 1) {
      if (canContinue) setStep((value) => value + 1);
      return;
    }
    finish();
  };

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-ink/40 px-4 py-6 backdrop-blur-2xl">
      <form
        onSubmit={submit}
        className="wizard-card w-full max-w-[760px]"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <IconTile icon={StepIcon} tone={step === 5 ? "sage" : "mist"} />
            <div>
              <p className="text-xs font-black text-ink/42">Step {step + 1} of {stepMeta.length}</p>
              <h2 className="text-2xl font-black tracking-normal">{stepMeta[step].title}</h2>
            </div>
          </div>
          <button type="button" className="rounded-full bg-ink/5 px-3 py-2 text-xs font-black text-ink/55" onClick={onClose}>
            Later
          </button>
        </div>

        <div className="mb-7 grid grid-cols-6 gap-2">
          {stepMeta.map((item, index) => (
            <div key={item.title} className={`h-2 rounded-full transition ${index <= step ? "bg-ink" : "bg-ink/10"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-[330px]"
          >
            {step === 0 ? (
              <div>
                <h3 className="wizard-title">Let’s build a day that fits you.</h3>
                <p className="wizard-copy">Focusverse adapts to your rhythm — no shame, no pressure.</p>
                <div className="mt-7 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <FieldLabel>Name</FieldLabel>
                    <input className="app-input premium-input" placeholder="What should we call you?" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Main purpose</FieldLabel>
                    <select className="app-input premium-input" value={profile.purpose} onChange={(event) => setProfile({ ...profile, purpose: event.target.value as Purpose })}>
                      {purposes.map((purpose) => <option key={purpose}>{purpose}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div>
                <h3 className="wizard-title">Shape the routine gently.</h3>
                <p className="wizard-copy">We use this to place focus blocks without crowding your day.</p>
                <div className="mt-7 grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <FieldLabel>Wake-up time</FieldLabel>
                    <input className="app-input premium-input" type="time" value={profile.wakeTime} onChange={(event) => setProfile({ ...profile, wakeTime: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Sleep time</FieldLabel>
                    <input className="app-input premium-input" type="time" value={profile.sleepTime} onChange={(event) => setProfile({ ...profile, sleepTime: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Available hours</FieldLabel>
                    <input className="app-input premium-input" type="number" min={1} max={14} step={0.5} value={profile.dailyAvailableHours} onChange={(event) => setProfile({ ...profile, dailyAvailableHours: Number(event.target.value) })} />
                  </div>
                </div>
                <div className="mt-5">
                  <FieldLabel>Best focus time</FieldLabel>
                  <div className="mt-2 grid gap-2 sm:grid-cols-4">
                    {focusTimes.map((time) => (
                      <button
                        type="button"
                        key={time}
                        className={`wizard-choice ${bestFocusTime === time ? "selected" : ""}`}
                        onClick={() => setBestFocusTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <h3 className="wizard-title">Choose your focus style.</h3>
                <p className="wizard-copy">Average is a perfectly good starting point. The planner will stay realistic.</p>
                <div className="mt-7 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <FieldLabel>Productivity level</FieldLabel>
                    <select className="app-input premium-input" value={profile.productivityLevel} onChange={(event) => setProfile({ ...profile, productivityLevel: event.target.value as ProductivityLevel })}>
                      {levels.map((level) => <option key={level}>{level}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Pomodoro style</FieldLabel>
                    <select className="app-input premium-input" value={profile.pomodoroStyle} onChange={(event) => setProfile({ ...profile, pomodoroStyle: event.target.value as UserProfile["pomodoroStyle"] })}>
                      {pomodoroStyles.map((style) => <option key={style}>{style}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-5">
                  <FieldLabel>Biggest struggle</FieldLabel>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {struggles.map((struggle) => (
                      <button
                        type="button"
                        key={struggle}
                        className={`wizard-choice ${profile.biggestStruggle === struggle ? "selected" : ""}`}
                        onClick={() => setProfile({ ...profile, biggestStruggle: struggle })}
                      >
                        {struggle}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div>
                <h3 className="wizard-title">Add your first long-term goal.</h3>
                <p className="wizard-copy">Optional, but useful. You can always add more goals later.</p>
                <div className="mt-7 grid gap-4 md:grid-cols-[1fr_0.55fr]">
                  <div className="space-y-2">
                    <FieldLabel>Goal</FieldLabel>
                    <input className="app-input premium-input" placeholder="Learn DSA, exam prep, fitness..." value={goal.title} onChange={(event) => setGoal({ ...goal, title: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Target date</FieldLabel>
                    <input className="app-input premium-input" type="date" value={goal.targetDate} onChange={(event) => setGoal({ ...goal, targetDate: event.target.value })} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <FieldLabel>Weekly target</FieldLabel>
                    <input className="app-input premium-input" value={goal.weeklyTarget} onChange={(event) => setGoal({ ...goal, weeklyTarget: event.target.value })} />
                  </div>
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div>
                <h3 className="wizard-title">Add three tasks for today.</h3>
                <p className="wizard-copy">Start small. These become your real dashboard and planner data.</p>
                <div className="mt-6 space-y-3">
                  {tasks.map((task, index) => (
                    <div key={index} className="rounded-[1.25rem] bg-white/70 p-3 shadow-sm">
                      <div className="grid gap-3 md:grid-cols-[1fr_7rem_7rem_8rem]">
                        <input className="app-input premium-input" placeholder={`Task ${index + 1}`} value={task.title} onChange={(event) => setTasks(tasks.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))} />
                        <input className="app-input premium-input" type="number" min={5} value={task.estimatedMinutes} onChange={(event) => setTasks(tasks.map((item, itemIndex) => itemIndex === index ? { ...item, estimatedMinutes: Number(event.target.value) } : item))} />
                        <select className="app-input premium-input" value={task.priority} onChange={(event) => setTasks(tasks.map((item, itemIndex) => itemIndex === index ? { ...item, priority: event.target.value as OnboardingTaskInput["priority"] } : item))}>
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                        </select>
                        <input className="app-input premium-input" type="date" value={task.deadline} onChange={(event) => setTasks(tasks.map((item, itemIndex) => itemIndex === index ? { ...item, deadline: event.target.value } : item))} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 5 ? (
              <div className="grid min-h-[330px] place-items-center text-center">
                <div>
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-[1.4rem] bg-sage text-ink shadow-soft">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="wizard-title mt-6">Your Focusverse is ready.</h3>
                  <p className="wizard-copy mx-auto">
                    We created your real dashboard from your routine, first goal, and today’s tasks.
                  </p>
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between border-t border-ink/8 pt-5">
          <SoftButton variant="ghost" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>
            <ArrowLeft size={16} />
            Back
          </SoftButton>
          <SoftButton type="submit" disabled={!canContinue}>
            {step === stepMeta.length - 1 ? "Enter Dashboard" : "Next"}
            {step === stepMeta.length - 1 ? null : <ArrowRight size={16} />}
          </SoftButton>
        </div>
      </form>
    </div>
  );
}
