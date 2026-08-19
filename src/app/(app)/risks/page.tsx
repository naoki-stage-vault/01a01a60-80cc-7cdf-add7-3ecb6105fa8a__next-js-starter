"use client";

import React, { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { RISK_CATEGORIES, USERS, goalById, userById } from "@/lib/data";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  ConfirmDialog,
  Drawer,
  EmptyState,
  Field,
  Input,
  Menu,
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  Table,
  THead,
  Th,
  Td,
  Textarea,
  Tooltip,
} from "@/components/ui";
import { RiskMatrix } from "@/components/charts";
import {
  IconAlertTriangle,
  IconArrowDown,
  IconArrowUp,
  IconCheck,
  IconChevronRight,
  IconFlag,
  IconMore,
  IconPencil,
  IconPlus,
  IconShield,
  IconShieldAlert,
  IconTarget,
  IconTrash,
  IconTrendingDown,
  IconTrendingUp,
} from "@/lib/icons";
import { useQueryAction } from "@/lib/useQuery";
import { cn, formatDate, offsetISO, timeAgo, uid } from "@/lib/utils";
import type { Risk, RiskStatus } from "@/lib/types";

const STATUSES: RiskStatus[] = ["Monitoring", "Mitigating", "New", "On track", "Closed"];

const probLabel = ["", "Rare", "Unlikely", "Possible", "Likely", "Almost certain"];
const impactLabel = ["", "Negligible", "Minor", "Moderate", "Major", "Severe"];

type SortKey = "score" | "title" | "status" | "owner";

const emptyRisk = {
  title: "",
  category: RISK_CATEGORIES[0],
  description: "",
  probability: 3,
  impact: 3,
  ownerId: "u-olivia",
  status: "New" as RiskStatus,
  mitigation: "",
};

export default function RisksPage() {
  const { risks, addRisk, updateRisk, deleteRisk, toast } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{ mode: "create" | "edit"; riskId?: string } | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const PAGE_SIZE = 6;

  useQueryAction("action", (v) => {
    if (v === "new-risk") setModal({ mode: "create" });
  });
  useQueryAction("risk", (v) => setDetailId(v));

  const filtered = useMemo(() => {
    let list = [...risks];
    if (q.trim()) {
      const ql = q.toLowerCase();
      list = list.filter(
        (r) => r.title.toLowerCase().includes(ql) || r.description.toLowerCase().includes(ql) || r.category.toLowerCase().includes(ql)
      );
    }
    if (cat !== "all") list = list.filter((r) => r.category === cat);
    if (status !== "all") list = list.filter((r) => r.status === status);
    list.sort((a, b) => {
      let cmp = 0;
      if (sort === "score") cmp = a.score - b.score;
      if (sort === "title") cmp = a.title.localeCompare(b.title);
      if (sort === "status") cmp = a.status.localeCompare(b.status);
      if (sort === "owner") cmp = userById(a.ownerId).name.localeCompare(userById(b.ownerId).name);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [risks, q, cat, status, sort, sortDir]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sort === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSort(key);
      setSortDir(key === "title" || key === "status" || key === "owner" ? "asc" : "desc");
    }
  };

  const stats = useMemo(() => {
    const open = risks.filter((r) => r.status !== "Closed");
    return {
      open: open.length,
      high: open.filter((r) => r.score >= 15).length,
      avg: Math.round((open.reduce((s, r) => s + r.score, 0) / Math.max(1, open.length)) * 10) / 10,
      mitigated: risks.filter((r) => r.status === "Mitigating").length,
    };
  }, [risks]);

  const matrixRisks = risks
    .filter((r) => r.status !== "Closed")
    .map((r) => ({ id: r.id, title: r.title, p: r.probability, i: r.impact, score: r.score, color: "" }));

  const detailRisk = detailId ? risks.find((r) => r.id === detailId) : null;

  const submit = (d: typeof emptyRisk & { riskId?: string }) => {
    if (!d.title.trim()) {
      toast({ title: "Title required", description: "Give the risk a clear title.", variant: "error" });
      return;
    }
    const score = d.probability * d.impact;
    if (d.riskId) {
      updateRisk(d.riskId, {
        title: d.title.trim(),
        category: d.category,
        description: d.description.trim() || "No description provided.",
        probability: d.probability,
        impact: d.impact,
        score,
        ownerId: d.ownerId,
        status: d.status,
        mitigation: d.mitigation ? d.mitigation.split("\n").filter(Boolean) : [],
      });
      toast({ title: "Risk updated", description: "Changes saved to the register.", variant: "success" });
    } else {
      addRisk({
        title: d.title.trim(),
        category: d.category,
        description: d.description.trim() || "No description provided.",
        probability: d.probability,
        impact: d.impact,
        score,
        ownerId: d.ownerId,
        status: d.status,
        trend: "stable",
        mitigation: d.mitigation ? d.mitigation.split("\n").filter(Boolean) : [],
        lastReviewed: new Date().toISOString(),
      });
    }
    setModal(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Risk Management"
        subtitle="Live risk register with mitigation tracking, linked to strategic goals."
        actions={
          <Button onClick={() => setModal({ mode: "create" })}>
            <IconPlus size={15} /> Log risk
          </Button>
        }
      />

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Open risks</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400">
              <IconShield size={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-stone-900 tabular-nums dark:text-stone-50">{stats.open}</p>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">in the active register</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">High exposure</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
              <IconShieldAlert size={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-rose-600 tabular-nums dark:text-rose-400">{stats.high}</p>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">score ≥ 15 / 25</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Avg exposure</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
              <IconAlertTriangle size={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-stone-900 tabular-nums dark:text-stone-50">{stats.avg}</p>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">across open risks (of 25)</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">In mitigation</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <IconTrendingDown size={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-stone-900 tabular-nums dark:text-stone-50">{stats.mitigated}</p>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">active mitigation plans</p>
        </Card>
      </div>

      {/* Matrix + register */}
      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <CardHeader title="Risk matrix" subtitle="Probability × impact · click a dot to inspect" />
          <CardBody className="pt-3">
            <RiskMatrix
              risks={matrixRisks}
              onSelect={(id) => setDetailId(id)}
            />
          </CardBody>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader
            title="Risk register"
            subtitle="Filter, sort and manage your risks"
            action={
              <div className="flex items-center gap-2">
                <Select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }} className="h-8 w-auto py-1 text-xs">
                  <option value="all">All categories</option>
                  {RISK_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
                <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="h-8 w-auto py-1 text-xs">
                  <option value="all">All statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </div>
            }
          />
          <CardBody className="pt-2">
            <SearchInput value={q} onChange={setQ} placeholder="Search risks…" className="mb-3 w-full" />
            <Table>
              <THead>
                <Th sortable sortDir={sort === "title" ? sortDir : undefined} onClick={() => toggleSort("title")}>Risk</Th>
                <Th>Category</Th>
                <Th sortable sortDir={sort === "score" ? sortDir : undefined} onClick={() => toggleSort("score")}>Score</Th>
                <Th>Owner</Th>
                <Th sortable sortDir={sort === "status" ? sortDir : undefined} onClick={() => toggleSort("status")}>Status</Th>
                <Th>Trend</Th>
                <Th className="w-10" />
              </THead>
              <tbody>
                {pageRows.map((r) => {
                  const owner = userById(r.ownerId);
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setDetailId(r.id)}
                      className="cursor-pointer border-b border-stone-100 transition-colors hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/50"
                    >
                      <Td>
                        <p className="font-medium text-stone-800 dark:text-stone-100">{r.title}</p>
                        <p className="mt-0.5 line-clamp-1 max-w-[260px] text-[11px] text-stone-400">{r.description}</p>
                      </Td>
                      <Td><Badge tone="stone">{r.category}</Badge></Td>
                      <Td>
                        <ScorePill score={r.score} />
                        <p className="mt-0.5 text-[10px] text-stone-400">
                          {probLabel[r.probability]} × {impactLabel[r.impact]}
                        </p>
                      </Td>
                      <Td>
                        <span className="inline-flex items-center gap-1.5">
                          <Avatar name={owner.name} color={owner.color} size="xs" />
                          <span className="text-xs text-stone-600 dark:text-stone-300">{owner.name.split(" ")[0]}</span>
                        </span>
                      </Td>
                      <Td>
                        <RiskStatusBadge status={r.status} />
                      </Td>
                      <Td>
                        <TrendIcon trend={r.trend} />
                      </Td>
                      <Td onClick={(e) => e.stopPropagation()}>
                        <Menu
                          trigger={
                            <Button variant="outline" size="icon" aria-label="Risk actions">
                              <IconMore size={15} />
                            </Button>
                          }
                          items={[
                            { label: "View details", icon: <IconChevronRight size={14} />, onClick: () => setDetailId(r.id) },
                            { label: "Edit risk", icon: <IconPencil size={14} />, onClick: () => setModal({ mode: "edit", riskId: r.id }) },
                            { label: "Mark mitigating", icon: <IconFlag size={14} />, onClick: () => { updateRisk(r.id, { status: "Mitigating" }); toast({ title: "Status updated", description: "Risk moved to Mitigating.", variant: "success" }); } },
                            { label: "Mark closed", icon: <IconCheck size={14} />, onClick: () => { updateRisk(r.id, { status: "Closed" }); toast({ title: "Risk closed", description: "Closed risks drop out of exposure calculations.", variant: "success" }); } },
                            { label: "Delete", icon: <IconTrash size={14} />, danger: true, onClick: () => setDeleteId(r.id) },
                          ]}
                        />
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {pageRows.length === 0 && (
              <EmptyState
                className="mt-2"
                icon={<IconShield size={20} />}
                title="No risks match"
                description="Adjust your filters, or log a new risk."
                action={<Button size="sm" onClick={() => setModal({ mode: "create" })}><IconPlus size={14} /> Log risk</Button>}
              />
            )}
            <Pagination page={safePage} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} className="mt-4" />
          </CardBody>
        </Card>
      </div>

      {/* Create / edit modal */}
      <RiskModal
        key={modal?.riskId ?? "create"}
        open={modal !== null}
        risk={modal?.mode === "edit" && modal.riskId ? risks.find((r) => r.id === modal.riskId) : undefined}
        onClose={() => setModal(null)}
        onSubmit={(d) => submit({ ...d, riskId: modal?.riskId })}
      />

      {/* Detail drawer */}
      <Drawer
        open={detailRisk !== null}
        onClose={() => setDetailId(null)}
        title={detailRisk?.title}
        subtitle={
          detailRisk ? (
            <span className="inline-flex items-center gap-2">
              <RiskStatusBadge status={detailRisk.status} /> {detailRisk.category} · {probLabel[detailRisk.probability]} × {impactLabel[detailRisk.impact]}
            </span>
          ) : undefined
        }
        footer={
          detailRisk && (
            <>
              <Button variant="outline" onClick={() => setDeleteId(detailRisk.id)}>
                <IconTrash size={15} /> Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  updateRisk(detailRisk.id, { status: detailRisk.status === "Closed" ? "Monitoring" : "Closed" });
                  toast({
                    title: detailRisk.status === "Closed" ? "Risk reopened" : "Risk closed",
                    description: detailRisk.status === "Closed" ? "Back on the active register." : "Removed from active exposure.",
                    variant: "success",
                  });
                }}
              >
                {detailRisk.status === "Closed" ? "Reopen risk" : "Mark closed"}
              </Button>
              <Button onClick={() => { setDetailId(null); setModal({ mode: "edit", riskId: detailRisk.id }); }}>
                <IconPencil size={15} /> Edit risk
              </Button>
            </>
          )
        }
      >
        {detailRisk && (
          <div className="space-y-5">
            <div className="rounded-xl bg-stone-50 p-4 dark:bg-stone-800/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Description</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-stone-700 dark:text-stone-200">{detailRisk.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MiniStat label="Score" value={String(detailRisk.score)} sub="/ 25" highlight={detailRisk.score >= 15 ? "text-rose-600" : detailRisk.score >= 8 ? "text-amber-600" : "text-emerald-600"} />
              <MiniStat label="Probability" value={String(detailRisk.probability)} sub={probLabel[detailRisk.probability]} />
              <MiniStat label="Impact" value={String(detailRisk.impact)} sub={impactLabel[detailRisk.impact]} />
              <MiniStat label="Trend" value={detailRisk.trend === "increasing" ? "▲" : detailRisk.trend === "decreasing" ? "▼" : "→"} sub={detailRisk.trend} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Owner & review</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-stone-600 dark:text-stone-300">
                <span className="inline-flex items-center gap-2">
                  <Avatar name={userById(detailRisk.ownerId).name} color={userById(detailRisk.ownerId).color} size="sm" />
                  {userById(detailRisk.ownerId).name} · {userById(detailRisk.ownerId).title}
                </span>
                <span className="text-xs text-stone-400">Last reviewed {timeAgo(detailRisk.lastReviewed)}</span>
              </div>
            </div>

            {detailRisk.goalId && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Linked strategic goal</p>
                <LinkToGoal goalId={detailRisk.goalId} />
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Mitigation plan</p>
              {detailRisk.mitigation.length === 0 ? (
                <p className="mt-2 text-xs text-stone-400">No mitigation actions logged yet.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {detailRisk.mitigation.map((m, i) => (
                    <li key={i} className="flex items-start gap-2.5 rounded-lg border border-stone-100 p-3 text-[13px] text-stone-700 dark:border-stone-800 dark:text-stone-200">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                        {i + 1}
                      </span>
                      {m}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            const r = risks.find((x) => x.id === deleteId);
            deleteRisk(deleteId);
            if (detailId === deleteId) setDetailId(null);
            if (r) toast({ title: "Risk removed", description: `“${r.title}” was deleted from the register.`, variant: "info" });
          }
        }}
        title="Delete this risk?"
        message="The risk and its mitigation plan will be removed from the register. This can't be undone."
      />
    </div>
  );
}

function LinkToGoal({ goalId }: { goalId: string }) {
  const g = goalById(goalId);
  return (
    <a href={`/plan?goal=${goalId}`} className="mt-2 inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-[13px] font-medium text-stone-700 transition-colors hover:border-emerald-300 hover:text-emerald-700 dark:border-stone-700 dark:text-stone-200 dark:hover:border-emerald-700 dark:hover:text-emerald-400">
      <IconTarget size={14} className="text-emerald-600" />
      {g.title}
      <span className="text-[10px] text-stone-400">{g.pillar}</span>
    </a>
  );
}

function ScorePill({ score }: { score: number }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-sm font-bold tabular-nums",
        score >= 15 && "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
        score >= 8 && score < 15 && "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
        score < 8 && "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
      )}
    >
      {score}
    </span>
  );
}

function RiskStatusBadge({ status }: { status: RiskStatus }) {
  const tones: Record<RiskStatus, "sky" | "amber" | "violet" | "emerald" | "stone"> = {
    Monitoring: "sky",
    Mitigating: "amber",
    New: "violet",
    "On track": "emerald",
    Closed: "stone",
  };
  return <Badge tone={tones[status]}>{status}</Badge>;
}

function TrendIcon({ trend }: { trend: Risk["trend"] }) {
  if (trend === "increasing")
    return (
      <Tooltip label="Trending up (worse)">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
          <IconArrowUp size={12} /> rising
        </span>
      </Tooltip>
    );
  if (trend === "decreasing")
    return (
      <Tooltip label="Trending down (improving)">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <IconArrowDown size={12} /> falling
        </span>
      </Tooltip>
    );
  return (
    <Tooltip label="Stable">
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-400">
        <IconTrendingUp size={12} className="opacity-40" /> stable
      </span>
    </Tooltip>
  );
}

function MiniStat({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight?: string }) {
  return (
    <div className="rounded-lg bg-stone-50 px-3 py-2.5 dark:bg-stone-800/60">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">{label}</p>
      <p className={cn("mt-0.5 text-base font-bold tabular-nums", highlight ?? "text-stone-900 dark:text-stone-50")}>{value}</p>
      <p className="text-[10px] capitalize text-stone-400">{sub}</p>
    </div>
  );
}

function RiskModal({
  open,
  risk,
  onClose,
  onSubmit,
}: {
  open: boolean;
  risk?: Risk;
  onClose: () => void;
  onSubmit: (d: { title: string; category: string; description: string; probability: number; impact: number; ownerId: string; status: RiskStatus; mitigation: string }) => void;
}) {
  const [d, setD] = useState(() => ({
    title: risk?.title ?? "",
    category: risk?.category ?? RISK_CATEGORIES[0],
    description: risk?.description ?? "",
    probability: risk?.probability ?? 3,
    impact: risk?.impact ?? 3,
    ownerId: risk?.ownerId ?? "u-olivia",
    status: (risk?.status ?? "New") as RiskStatus,
    mitigation: risk?.mitigation.join("\n") ?? "",
  }));

  React.useEffect(() => {
    setD({
      title: risk?.title ?? "",
      category: risk?.category ?? RISK_CATEGORIES[0],
      description: risk?.description ?? "",
      probability: risk?.probability ?? 3,
      impact: risk?.impact ?? 3,
      ownerId: risk?.ownerId ?? "u-olivia",
      status: (risk?.status ?? "New") as RiskStatus,
      mitigation: risk?.mitigation.join("\n") ?? "",
    });
  }, [risk, open]);

  const score = d.probability * d.impact;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={risk ? "Edit risk" : "Log a risk"}
      subtitle="Risks are scored 1–5 on probability and impact; the product is the score."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSubmit(d)}>{risk ? "Save changes" : "Add to register"}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Risk title">
          <Input autoFocus value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} placeholder="e.g. Revenue concentration in top donors" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <Select value={d.category} onChange={(e) => setD({ ...d, category: e.target.value })}>
              {RISK_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Owner">
            <Select value={d.ownerId} onChange={(e) => setD({ ...d, ownerId: e.target.value })}>
              {USERS.map((u) => (
                <option key={u.id} value={u.id}>{u.name} — {u.title}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Description">
          <Textarea value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} placeholder="What could happen, and what would the consequence be?" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={`Probability — ${probLabel[d.probability]}`}>
            <input
              type="range"
              min={1}
              max={5}
              value={d.probability}
              onChange={(e) => setD({ ...d, probability: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
            <div className="mt-1 flex justify-between text-[10px] text-stone-400">
              <span>Rare</span><span>Almost certain</span>
            </div>
          </Field>
          <Field label={`Impact — ${impactLabel[d.impact]}`}>
            <input
              type="range"
              min={1}
              max={5}
              value={d.impact}
              onChange={(e) => setD({ ...d, impact: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
            <div className="mt-1 flex justify-between text-[10px] text-stone-400">
              <span>Negligible</span><span>Severe</span>
            </div>
          </Field>
          <Field label="Status">
            <Select value={d.status} onChange={(e) => setD({ ...d, status: e.target.value as RiskStatus })}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-3.5 dark:bg-stone-800/60">
          <span
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold",
              score >= 15 && "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
              score >= 8 && score < 15 && "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
              score < 8 && "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
            )}
          >
            {score}
          </span>
          <div>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">Risk score: {score}/25</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {score >= 15 ? "High exposure — escalate to leadership." : score >= 8 ? "Medium exposure — mitigation plan required." : "Low exposure — monitor routinely."}
            </p>
          </div>
        </div>
        <Field label="Mitigation actions" hint="One action per line. These become your mitigation plan.">
          <Textarea value={d.mitigation} onChange={(e) => setD({ ...d, mitigation: e.target.value })} placeholder={"Grow mid-level donor pipeline\nAdd two new institutional funders per quarter"} />
        </Field>
      </div>
    </Modal>
  );
}
