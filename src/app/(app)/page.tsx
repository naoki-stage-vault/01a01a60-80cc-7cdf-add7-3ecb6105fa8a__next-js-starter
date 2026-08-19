"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import {
  GOALS,
  INITIATIVES,
  MONTHS,
  TRENDS,
  userById,
  goalById,
  initiativeById,
} from "@/lib/data";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  PageHeader,
  ProgressBar,
  StatusBadge,
  TrafficLight,
  Avatar,
  EmptyState,
} from "@/components/ui";
import {
  BarChart,
  Gauge,
  Legend,
  LineChart,
  Sparkline,
} from "@/components/charts";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconCalendar,
  IconClock,
  IconFlag,
  IconPlus,
  IconSparkles,
  IconTarget,
  IconTrendingUp,
  IconUsers,
  IconZap,
  IconShieldAlert,
} from "@/lib/icons";
import { cn, daysUntil, formatCurrency, formatShortDate, formatPercent, timeAgo } from "@/lib/utils";

export default function DashboardPage() {
  const { org, user, goals, initiatives, risks, activity, toast } = useApp();
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(t);
  }, []);

  const stats = useMemo(() => {
    const totalBudget = goals.reduce((s, g) => s + g.budget, 0);
    const totalSpent = goals.reduce((s, g) => s + g.spent, 0);
    const avgProgress = Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length);
    const openRisks = risks.filter((r) => r.status !== "Closed").length;
    const highRisks = risks.filter((r) => r.score >= 15).length;
    const atRisk = goals.filter((g) => g.status === "At risk" || g.status === "Behind").length;
    return {
      totalBudget,
      totalSpent,
      utilization: Math.round((totalSpent / totalBudget) * 100),
      avgProgress,
      openRisks,
      highRisks,
      atRisk,
    };
  }, [goals, risks]);

  const upcomingMilestones = useMemo(
    () =>
      INITIATIVES.flatMap((i) =>
        i.milestones
          .filter((m) => m.status === "Upcoming" || m.status === "In progress")
          .map((m) => ({ ...m, initiative: i }))
      )
        .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
        .slice(0, 6),
    []
  );

  const alerts = useMemo(() => {
    const list: { tone: "amber" | "rose" | "sky"; title: string; desc: string; href: string }[] = [];
    risks
      .filter((r) => r.status !== "Closed")
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .forEach((r) =>
        list.push({
          tone: r.score >= 15 ? "rose" : "amber",
          title: r.title,
          desc: `Score ${r.score}/25 · ${r.category} · owned by ${userById(r.ownerId).name.split(" ")[0]}`,
          href: `/risks?risk=${r.id}`,
        })
      );
    if (stats.atRisk > 0)
      list.push({
        tone: "amber",
        title: `${stats.atRisk} goal${stats.atRisk > 1 ? "s" : ""} need attention`,
        desc: "Review flagged goals to keep the plan on course.",
        href: "/plan",
      });
    return list.slice(0, 4);
  }, [risks, stats.atRisk]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-72 rounded-lg" />
        <div className="skeleton h-24 w-full rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="skeleton h-80 rounded-xl lg:col-span-2" />
          <div className="skeleton h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Good morning, ${user.name.split(" ")[0]}`}
        subtitle={`Here's how ${org.name}'s strategic plan is performing ${org.planPeriod}.`}
        actions={
          <>
            <Link href="/advisor">
              <Button variant="outline">
                <IconSparkles size={15} /> Ask AI
              </Button>
            </Link>
            <Link href="/plan?action=new-goal">
              <Button>
                <IconPlus size={15} /> New goal
              </Button>
            </Link>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Strategy health</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <IconTarget size={16} />
            </span>
          </div>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-2xl font-semibold tracking-tight text-stone-900 tabular-nums dark:text-stone-50">78</p>
            <span className="mb-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">▲ 4 pts</span>
          </div>
          <ProgressBar value={78} className="mt-3" />
          <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">4 of 5 goals on track</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Donor retention</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
              <IconTrendingUp size={16} />
            </span>
          </div>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-2xl font-semibold tracking-tight text-stone-900 tabular-nums dark:text-stone-50">62%</p>
            <span className="mb-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">▲ 10 pts YoY</span>
          </div>
          <Sparkline data={TRENDS.retention} className="mt-3 w-full" color="#0ea5e9" width={200} height={36} />
          <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">Target 75% by Dec 2027</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Plan budget</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <IconFlag size={16} />
            </span>
          </div>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-2xl font-semibold tracking-tight text-stone-900 tabular-nums dark:text-stone-50">{formatPercent(stats.utilization)}</p>
            <span className="mb-1 text-xs font-medium text-stone-400">utilized</span>
          </div>
          <p className="mt-3 text-xs tabular-nums text-stone-500 dark:text-stone-400">
            {formatCurrency(stats.totalSpent)} of {formatCurrency(stats.totalBudget)}
          </p>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">3 quarters elapsed</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Open risks</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              <IconShieldAlert size={16} />
            </span>
          </div>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-2xl font-semibold tracking-tight text-stone-900 tabular-nums dark:text-stone-50">{stats.openRisks}</p>
            <span className={cn("mb-1 text-xs font-medium", stats.highRisks > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400")}>
              {stats.highRisks} high
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
              <span>Avg exposure</span>
              <span className="font-semibold tabular-nums text-stone-700 dark:text-stone-200">10.2 / 25</span>
            </div>
            <ProgressBar value={(10.2 / 25) * 100} barClassName="bg-amber-500" />
          </div>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Donor retention trend"
            subtitle="Monthly retention rate across the 2025–2027 plan"
            action={<Legend items={[{ label: "Retention %", color: "#0ea5e9" }]} />}
          />
          <CardBody className="pt-2">
            <LineChart
              series={[{ name: "Retention", color: "#0ea5e9", data: TRENDS.retention }]}
              labels={MONTHS}
              height={230}
              yFormatter={(n) => `${n}%`}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Strategy health" subtitle="Composite score across goals, risks & execution" />
          <CardBody className="flex flex-col items-center pt-2">
            <Gauge value={78} label="of 100" size={200} />
            <div className="mt-2 grid w-full grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-stone-50 px-2 py-2.5 dark:bg-stone-800">
                <p className="text-sm font-bold text-stone-900 tabular-nums dark:text-stone-50">4</p>
                <p className="text-[10px] text-stone-500">On track</p>
              </div>
              <div className="rounded-lg bg-stone-50 px-2 py-2.5 dark:bg-stone-800">
                <p className="text-sm font-bold text-amber-600 tabular-nums">1</p>
                <p className="text-[10px] text-stone-500">At risk</p>
              </div>
              <div className="rounded-lg bg-stone-50 px-2 py-2.5 dark:bg-stone-800">
                <p className="text-sm font-bold text-stone-900 tabular-nums dark:text-stone-50">10</p>
                <p className="text-[10px] text-stone-500">Open risks</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Upcoming deadlines */}
        <Card>
          <CardHeader
            title="Upcoming milestones"
            subtitle="Next 90 days"
            action={
              <Link href="/progress" className="text-xs font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
                View all
              </Link>
            }
          />
          <CardBody className="pt-2">
            <ul className="divide-y divide-stone-100 dark:divide-stone-800">
              {upcomingMilestones.slice(0, 5).map((m) => {
                const d = daysUntil(m.due);
                return (
                  <li key={m.id} className="flex items-center gap-3 py-2.5">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg border text-center",
                        d <= 7
                          ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400"
                          : "border-stone-200 bg-stone-50 text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                      )}
                    >
                      <span className="text-[10px] font-bold leading-none">{d}</span>
                      <span className="text-[8px] uppercase">d</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-stone-800 dark:text-stone-100">{m.title}</p>
                      <p className="truncate text-[11px] text-stone-400">{m.initiative.title}</p>
                    </div>
                    <TrafficLight status={m.initiative.status} />
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader title="Alerts" subtitle="What needs your attention" />
          <CardBody className="pt-2">
            <ul className="space-y-2.5">
              {alerts.map((a, i) => (
                <li key={i}>
                  <Link
                    href={a.href}
                    className="flex items-start gap-3 rounded-lg border border-stone-100 p-3 transition-colors hover:border-stone-200 hover:bg-stone-50 dark:border-stone-800 dark:hover:border-stone-700 dark:hover:bg-stone-800/60"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                        a.tone === "rose" && "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
                        a.tone === "amber" && "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
                        a.tone === "sky" && "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"
                      )}
                    >
                      <IconAlertTriangle size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold leading-snug text-stone-800 dark:text-stone-100">{a.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-stone-500 dark:text-stone-400">{a.desc}</p>
                    </div>
                    <IconArrowRight size={14} className="mt-1 shrink-0 text-stone-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader title="Recent activity" subtitle="Across the workspace" />
          <CardBody className="pt-2">
            <ul className="divide-y divide-stone-100 dark:divide-stone-800">
              {activity.slice(0, 6).map((a) => {
                const actor = userById(a.actorId);
                return (
                  <li key={a.id} className="flex items-start gap-3 py-2.5">
                    <Avatar name={actor.name} color={actor.color} size="sm" className="mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] leading-snug text-stone-700 dark:text-stone-200">
                        <span className="font-semibold text-stone-900 dark:text-stone-50">{actor.name.split(" ")[0]}</span>{" "}
                        {a.verb} <span className="text-stone-500 dark:text-stone-400">{a.target}</span>
                      </p>
                      <p className="mt-0.5 text-[11px] text-stone-400">{timeAgo(a.time)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>
      </div>

      {/* Goals quick strip */}
      <Card>
        <CardHeader
          title="Strategic goals"
          subtitle="Execution status across the plan"
          action={
            <Link href="/plan">
              <Button variant="ghost" size="sm">
                Open plan <IconArrowRight size={13} />
              </Button>
            </Link>
          }
        />
        <CardBody className="pt-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {goals.slice(0, 6).map((g) => {
              const owner = userById(g.ownerId);
              const initCount = g.initiativeIds.length;
              return (
                <Link
                  key={g.id}
                  href={`/plan?goal=${g.id}`}
                  className="rounded-xl border border-stone-200 p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-stone-800 dark:hover:border-emerald-700"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone="stone">{g.pillar}</Badge>
                    <TrafficLight status={g.status} />
                  </div>
                  <p className="mt-2.5 line-clamp-1 text-[13.5px] font-semibold text-stone-900 dark:text-stone-50">{g.title}</p>
                  <div className="mt-3">
                    <ProgressBar value={g.progress} showLabel />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Avatar name={owner.name} color={owner.color} size="xs" /> {owner.name.split(" ")[0]}
                    </span>
                    <span>{initCount} initiatives</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
