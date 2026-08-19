"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { userById } from "@/lib/data";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  PageHeader,
  ProgressBar,
  StatusBadge,
  TrafficLight,
} from "@/components/ui";
import { BarChart, Legend, LineChart } from "@/components/charts";
import { IconArrowRight, IconCalendar, IconFlag, IconTarget, IconTrendingUp } from "@/lib/icons";
import { cn, daysUntil, formatDate, formatPercent, monthShort } from "@/lib/utils";
import type { Status } from "@/lib/types";

export default function ProgressPage() {
  const { goals, initiatives } = useApp();

  const overall = useMemo(
    () => Math.round(goals.reduce((s, g) => s + g.progress, 0) / Math.max(1, goals.length)),
    [goals]
  );

  const allMilestones = useMemo(() => {
    return initiatives
      .flatMap((i) => i.milestones.map((m) => ({ ...m, initiative: i })))
      .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
  }, [initiatives]);

  const upcoming = allMilestones.filter((m) => m.status === "Upcoming" || m.status === "In progress").slice(0, 5);
  const overdue = allMilestones.filter((m) => m.status === "Overdue");

  // Build a simple timeline across the plan window
  const timeline = useMemo(() => {
    const start = new Date(goals.reduce((min, g) => (new Date(g.start) < new Date(min) ? g.start : min), goals[0]?.start ?? new Date().toISOString()));
    const end = new Date(goals.reduce((max, g) => (new Date(g.end) > new Date(max) ? g.end : max), goals[0]?.end ?? new Date().toISOString()));
    const total = Math.max(1, end.getTime() - start.getTime());
    return initiatives.map((i) => ({
      i,
      start: new Date(i.start),
      end: new Date(i.deadline),
      left: Math.max(0, ((new Date(i.start).getTime() - start.getTime()) / total) * 100),
      width: Math.min(100 - Math.max(0, ((new Date(i.start).getTime() - start.getTime()) / total) * 100), ((new Date(i.deadline).getTime() - new Date(i.start).getTime()) / total) * 100),
    }));
  }, [goals, initiatives]);

  const statusCounts = useMemo(() => {
    const counts: Record<Status, number> = {
      "On track": 0,
      "At risk": 0,
      Behind: 0,
      Completed: 0,
      Planned: 0,
      "Not started": 0,
    };
    initiatives.forEach((i) => (counts[i.status] += 1));
    return counts;
  }, [initiatives]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Progress Tracking"
        subtitle="Objective completion, timeline health and performance trends across the plan."
        actions={
          <Link href="/plan?action=new-initiative">
            <Button variant="outline"><IconFlag size={15} /> New initiative</Button>
          </Link>
        }
      />

      {/* Overall completion */}
      <Card className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-5">
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
              <svg width="112" height="112" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r="48" fill="none" strokeWidth="12" className="stroke-stone-100 dark:stroke-stone-800" />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="none"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(overall / 100) * 2 * Math.PI * 48} ${2 * Math.PI * 48}`}
                  transform="rotate(-90 56 56)"
                  className="stroke-emerald-500 transition-all duration-700"
                />
                <text x="56" y="56" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="700" className="fill-stone-900 dark:fill-stone-50">
                  {overall}%
                </text>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">Plan completion</p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                Weighted average across {goals.length} strategic goals. Up 6 pts since Q2 — driven by donor retention and the cost-reduction goal.
              </p>
            </div>
          </div>
          <div className="grid flex-1 gap-2.5 lg:pl-6">
            {goals.map((g) => (
              <div key={g.id} className="flex items-center gap-3">
                <TrafficLight status={g.status} />
                <Link href={`/plan?goal=${g.id}`} className="w-56 truncate text-xs font-medium text-stone-700 hover:text-emerald-700 dark:text-stone-200 dark:hover:text-emerald-400">
                  {g.title}
                </Link>
                <ProgressBar value={g.progress} className="flex-1" />
                <span className="w-10 text-right text-xs font-semibold tabular-nums text-stone-600 dark:text-stone-300">
                  {formatPercent(g.progress)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Traffic lights + status mix */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Traffic-light status" subtitle="Live health of every initiative" />
          <CardBody className="pt-3">
            <ul className="space-y-2">
              {(
                [
                  ["On track", "bg-emerald-500", statusCounts["On track"]],
                  ["At risk", "bg-amber-500", statusCounts["At risk"]],
                  ["Behind", "bg-rose-500", statusCounts["Behind"]],
                  ["Completed", "bg-sky-500", statusCounts["Completed"]],
                  ["Planned / not started", "bg-stone-400", statusCounts["Planned"] + statusCounts["Not started"]],
                ] as const
              ).map(([label, dot, count]) => (
                <li key={label} className="flex items-center gap-3 rounded-lg border border-stone-100 px-3 py-2.5 dark:border-stone-800">
                  <span className={cn("h-2.5 w-2.5 rounded-full", dot)} />
                  <span className="flex-1 text-[13px] text-stone-700 dark:text-stone-200">{label}</span>
                  <span className="text-sm font-bold tabular-nums text-stone-900 dark:text-stone-50">{count}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Initiative timeline"
            subtitle="Scheduled start → deadline for all workstreams"
            action={<Legend items={[{ label: "On track", color: "#059669" }, { label: "At risk", color: "#f59e0b" }, { label: "Behind", color: "#f43f5e" }, { label: "Planned", color: "#a8a29e" }]} />}
          />
          <CardBody className="pt-4">
            <div className="space-y-2.5">
              {timeline.slice(0, 9).map(({ i, left, width }) => {
                const color = i.status === "On track" ? "bg-emerald-500" : i.status === "At risk" ? "bg-amber-500" : i.status === "Behind" ? "bg-rose-500" : i.status === "Completed" ? "bg-sky-500" : "bg-stone-300 dark:bg-stone-600";
                return (
                  <div key={i.id} className="flex items-center gap-3">
                    <span className="w-52 shrink-0 truncate text-right text-[11px] font-medium text-stone-600 dark:text-stone-300" title={i.title}>
                      {i.title.length > 28 ? i.title.slice(0, 27) + "…" : i.title}
                    </span>
                    <div className="relative h-5 flex-1 rounded-md bg-stone-100 dark:bg-stone-800">
                      <div
                        className={cn("absolute top-0 h-full rounded-md opacity-90", color)}
                        style={{ left: `${left}%`, width: `${Math.max(4, width)}%` }}
                        title={`${i.title}: ${formatDate(i.start)} → ${formatDate(i.deadline)} (${formatPercent(i.progress)})`}
                      />
                      <div
                        className="absolute top-0 h-full w-0.5 bg-stone-400"
                        style={{ left: `calc(${left + (width * i.progress) / 100}% )` }}
                      />
                    </div>
                    <span className="w-9 shrink-0 text-right text-[11px] font-semibold tabular-nums text-stone-500 dark:text-stone-400">
                      {i.progress}%
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[10px] text-stone-400">Vertical tick = current progress point on each initiative bar.</p>
          </CardBody>
        </Card>
      </div>

      {/* Performance trends */}
      <Card>
        <CardHeader
          title="Performance trends"
          subtitle="12-month view across key outcome metrics"
          action={<Legend items={[{ label: "Donor retention %", color: "#0ea5e9" }, { label: "Participants (k)", color: "#059669" }]} />}
        />
        <CardBody className="pt-2">
          <LineChart
            height={240}
            series={[
              { name: "Retention %", color: "#0ea5e9", data: [52, 53, 53, 54, 55, 56, 56, 58, 59, 60, 61, 62] },
              { name: "Participants (k)", color: "#059669", data: [6.4, 6.6, 6.9, 7.1, 7.2, 7.5, 7.8, 7.9, 8.1, 8.2, 8.3, 8.4] },
            ]}
            labels={["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]}
          />
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Upcoming milestones */}
        <Card>
          <CardHeader
            title="Upcoming milestones"
            subtitle="The next five deliverables on the calendar"
            action={
              <Link href="/plan" className="text-xs font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
                Open plan
              </Link>
            }
          />
          <CardBody className="pt-2">
            <ul className="divide-y divide-stone-100 dark:divide-stone-800">
              {upcoming.map((m) => {
                const d = daysUntil(m.due);
                return (
                  <li key={m.id} className="flex items-center gap-3 py-3">
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg border text-center",
                        d <= 7 ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-400" : "border-stone-200 bg-stone-50 text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                      )}
                    >
                      <span className="text-sm font-bold leading-none">{d}</span>
                      <span className="text-[9px] uppercase">days</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-stone-800 dark:text-stone-100">{m.title}</p>
                      <p className="truncate text-[11px] text-stone-400">{m.initiative.title} · {formatDate(m.due)}</p>
                    </div>
                    <StatusBadge status={m.initiative.status} />
                  </li>
                );
              })}
              {upcoming.length === 0 && (
                <li className="py-8 text-center text-xs text-stone-400">Nothing scheduled — enjoy the calm.</li>
              )}
            </ul>
          </CardBody>
        </Card>

        {/* Overdue / attention */}
        <Card>
          <CardHeader title="Needs attention" subtitle="Overdue milestones and at-risk workstreams" />
          <CardBody className="pt-2">
            <div className="space-y-3">
              {overdue.length > 0 && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 dark:border-rose-500/25 dark:bg-rose-500/10">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400">
                    <IconCalendar size={13} /> {overdue.length} overdue milestone{overdue.length > 1 ? "s" : ""}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {overdue.map((m) => (
                      <li key={m.id} className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-rose-900/80 dark:text-rose-200/80">{m.title}</span>
                        <span className="shrink-0 text-[10px] font-semibold text-rose-500">{formatDate(m.due)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {initiatives
                .filter((i) => i.status === "At risk" || i.status === "Behind")
                .map((i) => {
                  const owner = userById(i.ownerId);
                  return (
                    <Link key={i.id} href={`/plan?goal=${i.goalId}`} className="block rounded-xl border border-amber-200 bg-amber-50/60 p-4 transition-colors hover:border-amber-300 dark:border-amber-500/25 dark:bg-amber-500/10 dark:hover:border-amber-500/40">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-semibold text-amber-900 dark:text-amber-300">{i.title}</p>
                        <StatusBadge status={i.status} />
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <ProgressBar value={i.progress} className="flex-1" barClassName="bg-amber-500" />
                        <span className="text-xs font-semibold tabular-nums text-amber-800 dark:text-amber-300">{i.progress}%</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-amber-800/70 dark:text-amber-200/70">
                        <span className="inline-flex items-center gap-1.5">
                          <Avatar name={owner.name} color={owner.color} size="xs" /> {owner.name}
                        </span>
                        <span className="inline-flex items-center gap-1"><IconCalendar size={11} /> due {formatDate(i.deadline)}</span>
                      </div>
                    </Link>
                  );
                })}
              {overdue.length === 0 && initiatives.filter((i) => i.status === "At risk" || i.status === "Behind").length === 0 && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 text-center dark:border-emerald-500/25 dark:bg-emerald-500/10">
                  <IconTarget size={20} className="mx-auto text-emerald-500" />
                  <p className="mt-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">All clear</p>
                  <p className="mt-0.5 text-xs text-emerald-700/70 dark:text-emerald-200/70">No overdue milestones or at-risk initiatives right now.</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
