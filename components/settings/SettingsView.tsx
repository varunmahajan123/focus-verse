"use client";

import { FormEvent, useState } from "react";
import { RotateCcw, Settings } from "lucide-react";
import { UserProfile } from "@/types/focusverse";
import { AppCard, FieldLabel, IconTile, SectionHeader, SoftButton } from "@/components/shared/ProductPrimitives";

export function SettingsView({
  profile,
  demoMode,
  updateProfile,
  resetApp,
  loadDemoData,
  clearDemoData,
  exportData
}: {
  profile: UserProfile;
  demoMode?: boolean;
  updateProfile: (profile: Partial<UserProfile>) => void;
  resetApp: () => void;
  loadDemoData: () => void;
  clearDemoData: () => void;
  exportData: () => void;
}) {
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    updateProfile(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const confirmReset = () => {
    if (window.confirm("Reset all local Focusverse data? This clears tasks, goals, sessions, planner blocks, and onboarding on this browser.")) {
      resetApp();
    }
  };

  const confirmLoadDemo = () => {
    if (window.confirm("Load demo data? This replaces the current local Focusverse workspace with sample tasks, reports, goals, and sessions.")) {
      loadDemoData();
    }
  };

  const confirmClearDemo = () => {
    if (!demoMode) return;
    if (window.confirm("Clear demo data? This removes sample tasks, goals, sessions, reports, and planner blocks while keeping your profile setup.")) {
      clearDemoData();
    }
  };

  return (
    <section className="app-section">
      <SectionHeader
        eyebrow="Settings"
        title="Tune Focusverse to your actual rhythm."
        copy="Preferences are stored locally in your browser for now."
      />

      <AppCard>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2 flex items-center gap-3">
            <IconTile icon={Settings} tone="mist" />
            <div>
              <h3 className="text-xl font-black">Profile and planning preferences</h3>
              <p className="text-sm font-bold text-ink/45">Small settings change the shape of your day.</p>
            </div>
          </div>
          <div className="space-y-2">
            <FieldLabel>Name</FieldLabel>
            <input className="app-input" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          </div>
          <div className="space-y-2">
            <FieldLabel>Pomodoro preference</FieldLabel>
            <select className="app-input" value={draft.pomodoroStyle} onChange={(event) => setDraft({ ...draft, pomodoroStyle: event.target.value as UserProfile["pomodoroStyle"] })}>
              <option>25/5</option>
              <option>50/10</option>
              <option>90/15</option>
              <option>Custom</option>
            </select>
          </div>
          <div className="space-y-2">
            <FieldLabel>Daily available hours</FieldLabel>
            <input className="app-input" type="number" min={1} max={14} step={0.5} value={draft.dailyAvailableHours} onChange={(event) => setDraft({ ...draft, dailyAvailableHours: Number(event.target.value) })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <FieldLabel>Wake time</FieldLabel>
              <input className="app-input" type="time" value={draft.wakeTime} onChange={(event) => setDraft({ ...draft, wakeTime: event.target.value })} />
            </div>
            <div className="space-y-2">
              <FieldLabel>Sleep time</FieldLabel>
              <input className="app-input" type="time" value={draft.sleepTime} onChange={(event) => setDraft({ ...draft, sleepTime: event.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <FieldLabel>Best focus time</FieldLabel>
            <select className="app-input" value={draft.bestFocusTime} onChange={(event) => setDraft({ ...draft, bestFocusTime: event.target.value as UserProfile["bestFocusTime"] })}>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
              <option>Night</option>
            </select>
          </div>
          <div className="space-y-2">
            <FieldLabel>Theme preference</FieldLabel>
            <select className="app-input" value={draft.theme} onChange={(event) => setDraft({ ...draft, theme: event.target.value as UserProfile["theme"] })}>
              <option>Calm Light</option>
              <option>Soft Dark</option>
            </select>
          </div>
          <div className="space-y-2">
            <FieldLabel>Biggest struggle</FieldLabel>
            <select className="app-input" value={draft.biggestStruggle} onChange={(event) => setDraft({ ...draft, biggestStruggle: event.target.value as UserProfile["biggestStruggle"] })}>
              <option>Procrastination</option>
              <option>Backlog</option>
              <option>No Planning</option>
              <option>Inconsistency</option>
              <option>Distractions</option>
            </select>
          </div>
          <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 border-t border-ink/8 pt-5">
            <div className="text-sm font-bold text-ink/52">{saved ? "Settings saved." : "Changes apply instantly after save."}</div>
            <div className="flex gap-2">
              <SoftButton type="submit">Save settings</SoftButton>
              <SoftButton variant="ghost" onClick={exportData}>Export JSON</SoftButton>
              <SoftButton variant="secondary" onClick={confirmLoadDemo}>Load demo data</SoftButton>
              <SoftButton variant="ghost" onClick={confirmClearDemo} disabled={!demoMode}>Clear demo data</SoftButton>
              <SoftButton variant="danger" onClick={confirmReset}><RotateCcw size={16} /> Reset app data</SoftButton>
            </div>
          </div>
        </form>
      </AppCard>
    </section>
  );
}
