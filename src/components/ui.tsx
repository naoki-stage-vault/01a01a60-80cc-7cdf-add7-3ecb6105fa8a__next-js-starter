"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Priority, Status } from "@/lib/types";
import { cn, formatPercent } from "@/lib/utils";
import { IconChevronLeft, IconChevronRight, IconSearch, IconX } from "@/lib/icons";

/* ------------------------------------------------------------------ */
/* Buttons                                                            */
/* ------------------------------------------------------------------ */

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "subtle";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg" | "icon";
}) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-emerald-600 text-white shadow-sm shadow-emerald-900/10 hover:bg-emerald-500 focus-visible:outline-emerald-600 disabled:bg-emerald-600/50",
    secondary:
      "bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white",
    outline:
      "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800",
    ghost:
      "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50",
    danger:
      "bg-rose-600 text-white hover:bg-rose-500 focus-visible:outline-rose-600",
    subtle:
      "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20",
  };
  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-9.5 px-4 text-sm gap-2",
    lg: "h-11 px-5 text-sm gap-2",
    icon: "h-9 w-9 justify-center",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconButton({
  className,
  children,
  label,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Card & headers                                                     */
/* ------------------------------------------------------------------ */

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-stone-200 bg-white shadow-sm shadow-stone-900/[0.03] dark:border-stone-800 dark:bg-stone-900",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3 px-5 pt-5", className)}>
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-stone-900 dark:text-stone-50">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("px-5 pb-5", className)}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Badges                                                             */
/* ------------------------------------------------------------------ */

export type Tone =
  | "emerald"
  | "amber"
  | "rose"
  | "sky"
  | "violet"
  | "stone"
  | "teal"
  | "indigo";

const toneClasses: Record<Tone, string> = {
  emerald:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20",
  amber:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-400/20",
  rose:
    "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-400/20",
  sky: "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-400/20",
  violet:
    "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-400/20",
  stone:
    "bg-stone-100 text-stone-600 ring-stone-500/20 dark:bg-stone-500/10 dark:text-stone-400 dark:ring-stone-400/20",
  teal: "bg-teal-50 text-teal-700 ring-teal-600/20 dark:bg-teal-500/10 dark:text-teal-400 dark:ring-teal-400/20",
  indigo:
    "bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-400/20",
};

export function Badge({
  tone = "stone",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export const statusTone: Record<Status, Tone> = {
  "On track": "emerald",
  "At risk": "amber",
  Behind: "rose",
  Completed: "sky",
  Planned: "stone",
  "Not started": "stone",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge tone={statusTone[status]}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "On track" && "bg-emerald-500",
          status === "At risk" && "bg-amber-500",
          status === "Behind" && "bg-rose-500",
          status === "Completed" && "bg-sky-500",
          (status === "Planned" || status === "Not started") && "bg-stone-400"
        )}
      />
      {status}
    </Badge>
  );
}

export const priorityTone: Record<Priority, Tone> = {
  High: "rose",
  Medium: "amber",
  Low: "sky",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge tone={priorityTone[priority]}>{priority}</Badge>;
}

export const riskStatusTone: Record<string, Tone> = {
  Monitoring: "sky",
  Mitigating: "amber",
  New: "violet",
  "On track": "emerald",
  Closed: "stone",
};

export function TrafficLight({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    "On track": "bg-emerald-500",
    "At risk": "bg-amber-500",
    Behind: "bg-rose-500",
    Completed: "bg-sky-500",
    Planned: "bg-stone-400",
    "Not started": "bg-stone-300 dark:bg-stone-600",
  };
  return (
    <span
      className={cn("inline-block h-2.5 w-2.5 rounded-full", map[status])}
      title={status}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Avatar                                                             */
/* ------------------------------------------------------------------ */

export function Avatar({
  name,
  color,
  size = "md",
  className,
}: {
  name: string;
  color: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
  const sizes = {
    xs: "h-5 w-5 text-[9px]",
    sm: "h-6.5 w-6.5 text-[10px]",
    md: "h-8 w-8 text-[11px]",
    lg: "h-10 w-10 text-sm",
  };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        color,
        sizes[size],
        className
      )}
      title={name}
    >
      {initials}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Progress                                                           */
/* ------------------------------------------------------------------ */

export function ProgressBar({
  value,
  className,
  barClassName,
  showLabel,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
}) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
        <div
          className={cn(
            "h-full rounded-full bg-emerald-500 transition-all duration-500",
            barClassName
          )}
          style={{ width: `${v}%` }}
        />
      </div>
      {showLabel && (
        <span className="w-9 shrink-0 text-right text-xs font-medium tabular-nums text-stone-500 dark:text-stone-400">
          {formatPercent(v)}
        </span>
      )}
    </div>
  );
}

export function progressColor(status: Status): string {
  switch (status) {
    case "On track":
      return "bg-emerald-500";
    case "At risk":
      return "bg-amber-500";
    case "Behind":
      return "bg-rose-500";
    case "Completed":
      return "bg-sky-500";
    default:
      return "bg-stone-400";
  }
}

/* ------------------------------------------------------------------ */
/* KPI card                                                           */
/* ------------------------------------------------------------------ */

export function KpiCard({
  label,
  value,
  delta,
  deltaGood = true,
  icon,
  sub,
  tone = "emerald",
}: {
  label: string;
  value: React.ReactNode;
  delta?: number;
  deltaGood?: boolean;
  icon?: React.ReactNode;
  sub?: string;
  tone?: Tone;
}) {
  const up = (delta ?? 0) >= 0;
  const positive = up === deltaGood;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
          {label}
        </p>
        {icon && (
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              toneClasses[tone]
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 tabular-nums dark:text-stone-50">
        {value}
      </p>
      <div className="mt-1.5 flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span
            className={cn(
              "font-medium",
              positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            )}
          >
            {up ? "▲" : "▼"} {Math.abs(delta)}
            {sub && !sub.includes("%") ? "%" : ""}
          </span>
        )}
        <span className="text-stone-500 dark:text-stone-400">{sub ?? "vs last quarter"}</span>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Skeletons & empty states                                           */
/* ------------------------------------------------------------------ */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-md", className)} />;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 px-6 py-12 text-center dark:border-stone-700",
        className
      )}
    >
      {icon && (
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">{title}</p>
      {description && (
        <p className="max-w-sm text-xs leading-relaxed text-stone-500 dark:text-stone-400">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tooltip                                                            */
/* ------------------------------------------------------------------ */

export function Tooltip({
  label,
  children,
  side = "top",
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom";
}) {
  return (
    <span className="group/tip relative inline-flex">
      {children}
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-md bg-stone-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tip:opacity-100 dark:bg-stone-100 dark:text-stone-900",
          side === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"
        )}
      >
        {label}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Forms                                                              */
/* ------------------------------------------------------------------ */

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-medium text-stone-700 dark:text-stone-300">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-stone-400">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder:text-stone-500";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClass, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn(inputClass, "min-h-[88px] resize-y", className)} {...props} />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(inputClass, "appearance-none pr-8", className)} {...props}>
      {children}
    </select>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <IconSearch
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(inputClass, "pl-8.5")}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-stone-400 hover:text-stone-600"
          aria-label="Clear search"
        >
          <IconX size={13} />
        </button>
      )}
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5.5 w-10 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-emerald-600" : "bg-stone-300 dark:bg-stone-700"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-1"
        )}
      />
      {label && <span className="sr-only">{label}</span>}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs & segmented control                                           */
/* ------------------------------------------------------------------ */

export function Tabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: { id: string; label: React.ReactNode; count?: number }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 overflow-x-auto rounded-lg border border-stone-200 bg-stone-100/70 p-1 dark:border-stone-800 dark:bg-stone-800/60",
        className
      )}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            active === t.id
              ? "bg-white text-stone-900 shadow-sm dark:bg-stone-900 dark:text-stone-50"
              : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
          )}
        >
          {t.label}
          {t.count !== undefined && (
            <span
              className={cn(
                "rounded-full px-1.5 text-[10px] font-semibold tabular-nums",
                active === t.id
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                  : "bg-stone-200 text-stone-500 dark:bg-stone-700 dark:text-stone-400"
              )}
            >
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function Segmented({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 overflow-x-auto rounded-lg border border-stone-200 bg-stone-100/70 p-1 dark:border-stone-800 dark:bg-stone-800/60",
        className
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            value === o.value
              ? "bg-white text-stone-900 shadow-sm dark:bg-stone-900 dark:text-stone-50"
              : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Table                                                              */
/* ------------------------------------------------------------------ */

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-stone-200 dark:border-stone-800">{children}</tr>
    </thead>
  );
}

export function Th({
  children,
  className,
  onClick,
  sortable,
  sortDir,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  sortable?: boolean;
  sortDir?: "asc" | "desc";
}) {
  return (
    <th
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400",
        sortable && "cursor-pointer select-none hover:text-stone-800 dark:hover:text-stone-200",
        className
      )}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortable && (
          <span className="text-[9px]">
            {sortDir === "asc" ? "▲" : sortDir === "desc" ? "▼" : "↕"}
          </span>
        )}
      </span>
    </th>
  );
}

export function Td({
  children,
  className,
  colSpan,
}: {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td colSpan={colSpan} className={cn("px-4 py-3 align-middle", className)}>
      {children}
    </td>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  onChange,
  className,
}: {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  className?: string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const nums: number[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
  }
  const withGaps = nums.reduce<(number | "gap")[]>((acc, n, idx) => {
    if (idx > 0 && n - (acc[acc.length - 1] as number) > 1) acc.push("gap");
    acc.push(n);
    return acc;
  }, []);

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 px-1", className)}>
      <p className="text-xs text-stone-500 dark:text-stone-400">
        Showing <span className="font-medium text-stone-700 dark:text-stone-200">{from}–{to}</span> of{" "}
        <span className="font-medium text-stone-700 dark:text-stone-200">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 text-stone-500 transition-colors hover:bg-stone-50 disabled:opacity-40 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800"
          aria-label="Previous page"
        >
          <IconChevronLeft size={14} />
        </button>
        {withGaps.map((n, i) =>
          n === "gap" ? (
            <span key={`gap-${i}`} className="px-1 text-xs text-stone-400">…</span>
          ) : (
            <button
              key={n}
              onClick={() => onChange(n)}
              className={cn(
                "h-7 min-w-7 rounded-md px-1.5 text-xs font-medium transition-colors",
                n === page
                  ? "bg-emerald-600 text-white"
                  : "border border-stone-200 text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
              )}
            >
              {n}
            </button>
          )
        )}
        <button
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 text-stone-500 transition-colors hover:bg-stone-50 disabled:opacity-40 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800"
          aria-label="Next page"
        >
          <IconChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overlays: Modal, Drawer, Confirm                                   */
/* ------------------------------------------------------------------ */

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 animate-fade-in bg-stone-950/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative flex max-h-[92vh] w-full animate-scale-in flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-stone-900 sm:rounded-2xl",
          sizes[size]
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-stone-100 px-6 py-4 dark:border-stone-800">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-stone-900 dark:text-stone-50">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">{subtitle}</p>}
          </div>
          <IconButton label="Close" onClick={onClose} className="-mr-2 -mt-1">
            <IconX size={16} />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-stone-100 bg-stone-50/60 px-6 py-3.5 dark:border-stone-800 dark:bg-stone-800/40">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 animate-fade-in bg-stone-950/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute right-0 top-0 flex h-full w-full animate-slide-in-right flex-col bg-white shadow-2xl dark:bg-stone-900 sm:w-[520px]",
          width
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-stone-100 px-6 py-4 dark:border-stone-800">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-stone-900 dark:text-stone-50">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">{subtitle}</p>}
          </div>
          <IconButton label="Close" onClick={onClose} className="-mr-2 -mt-1">
            <IconX size={16} />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-stone-100 bg-stone-50/60 px-6 py-3.5 dark:border-stone-800 dark:bg-stone-800/40">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Delete",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">{message}</div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Page header                                                        */
/* ------------------------------------------------------------------ */

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-50 sm:text-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 max-w-2xl text-sm text-stone-500 dark:text-stone-400">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dropdown menu                                                      */
/* ------------------------------------------------------------------ */

export function Menu({
  trigger,
  items,
  align = "right",
  className,
}: {
  trigger: React.ReactNode;
  items: { label: string; icon?: React.ReactNode; danger?: boolean; onClick: () => void }[];
  align?: "left" | "right";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative inline-flex", className)}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 min-w-[180px] animate-scale-in overflow-hidden rounded-lg border border-stone-200 bg-white py-1 shadow-xl shadow-stone-900/5 dark:border-stone-700 dark:bg-stone-800",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
              className={cn(
                "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-medium transition-colors",
                item.danger
                  ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  : "text-stone-700 hover:bg-stone-50 dark:text-stone-200 dark:hover:bg-stone-700/60"
              )}
            >
              {item.icon && <span className="text-stone-400">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Misc                                                               */
/* ------------------------------------------------------------------ */

export function ScoreBar({
  label,
  avg,
  max = 5,
  tone = "emerald",
}: {
  label: string;
  avg: number;
  max?: number;
  tone?: Tone;
}) {
  const pct = max > 0 ? (avg / max) * 100 : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2 text-xs">
        <span className="text-stone-600 dark:text-stone-300">{label}</span>
        <span className="font-semibold tabular-nums text-stone-800 dark:text-stone-100">
          {avg.toFixed(1)}<span className="font-normal text-stone-400">/{max}</span>
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
        <div
          className={cn("h-full rounded-full transition-all duration-700", toneClasses[tone].split(" ")[0])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("my-4 h-px bg-stone-100 dark:bg-stone-800", className)} />;
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 items-center rounded border border-stone-300 bg-stone-50 px-1.5 font-sans text-[10px] font-medium text-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
      {children}
    </kbd>
  );
}
