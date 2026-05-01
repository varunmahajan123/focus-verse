"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export function AppCard({
  children,
  className = "",
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`app-card ${className}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  copy,
  action
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="app-eyebrow">{eyebrow}</p>
        <h2 className="app-title">{title}</h2>
        {copy ? <p className="app-copy">{copy}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function SoftButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  className = ""
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "light";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const variants = {
    primary: "bg-foreground text-background shadow-soft hover:-translate-y-0.5 hover:bg-foreground/90",
    secondary: "bg-surface-elevated text-foreground border border-border hover:-translate-y-0.5",
    ghost: "bg-muted text-foreground hover:bg-muted/80",
    danger: "bg-coral/30 text-red-700 hover:bg-coral/40 dark:text-red-400",
    light: "bg-white text-night shadow-soft hover:-translate-y-0.5 hover:bg-white/90"
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function IconTile({
  icon: Icon,
  tone = "mist"
}: {
  icon: LucideIcon;
  tone?: "mist" | "sage" | "lavender" | "peach" | "cream" | "ink";
}) {
  const tones = {
    mist: "bg-accent-blue/50 text-foreground",
    sage: "bg-accent-sage/50 text-foreground",
    lavender: "bg-accent-lavender/50 text-foreground",
    peach: "bg-accent-peach/50 text-foreground",
    cream: "bg-surface text-foreground",
    ink: "bg-foreground text-background"
  };
  return (
    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${tones[tone]}`}>
      <Icon size={18} />
    </span>
  );
}

export function ProgressRing({
  value,
  size = "md",
  label
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const sizes = {
    sm: "h-20 w-20 text-xl",
    md: "h-28 w-28 text-3xl",
    lg: "h-40 w-40 text-5xl"
  };

  return (
    <div
      className={`grid place-items-center rounded-full bg-muted p-2 ${sizes[size]}`}
      style={{ background: `conic-gradient(var(--foreground) var(--value), var(--muted) 0)` } as React.CSSProperties}
    >
      <div className="grid h-full w-full place-items-center rounded-full bg-surface-elevated text-center shadow-inner">
        <div>
          <div className="font-black tracking-normal">{value}%</div>
          {label ? <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{label}</div> : null}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  copy,
  action
}: {
  icon: LucideIcon;
  title: string;
  copy: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-border bg-surface p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-muted text-foreground">
        <Icon size={20} />
      </div>
      <h3 className="mt-4 text-xl font-black">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-muted-foreground">{copy}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">{children}</label>;
}
