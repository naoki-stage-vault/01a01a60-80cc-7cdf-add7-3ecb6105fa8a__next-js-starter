"use client";

import React, { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import {
  GOALS,
  PILLARS,
  USERS,
  goalById,
  initiativesByGoal,
  userById,
} from "@/lib/data";
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
  Modal,
  PageHeader,
  PriorityBadge,
  ProgressBar,
  SearchInput,
  Select,
  StatusBadge,
  Tabs,
  Textarea,
  TrafficLight,
  Tooltip,
  Menu,
  Divider,
} from "@/components/ui";
import {
  IconAlertTriangle,
  IconCalendar,
  IconFlag,
  IconLightbulb,
  IconMessage,
  IconMore,
  IconPencil,
  IconPlus,
  IconSparkles,
  IconTarget,
  IconTrash,
  IconUsers,
  IconWallet,
} from "@/lib/icons";
import { useQueryAction, useQueryParams } from "@/lib/useQuery";
import {
  cn,
  daysUntil,
  formatCurrency,
  formatDate,
  formatPercent,
  initials,
  offsetISO,
  timeAgo,
  uid,
} from "@/lib/utils";
import type { Goal, Initiative, Kpi, Status } from "@/lib/types";

type GoalDraft = {
  title: string;
  pillar: string;
  description: string;
  why: string;
  ownerId: string;
  budget: string;
  end: string;
};

const emptyGoal: GoalDraft = {
  title: "",
  pillar: PILLARS[0],
  description: "",
  why: "",
  ownerId: "u-sarah",
  budget: "100000",
  end: offsetISO(730).slice(0, 10),
};

export default function PlanPage() {
  const {
    goals,
    initiatives,
    addGoal,
    updateGoal,
    deleteGoal,
    addInitiative,
    updateInitiative,
    deleteInitiative,
    addComment,
    comments,
    aiRecs,
    toast,
  } = useApp();

  const params = useQueryParams();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [goalModal, setGoalModal] = useState<{ mode: "create" | "edit"; draft: GoalDraft; goalId?: string } | null>(null);
  const [initModal, setInitModal] = useState<{ goalId: string } | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);
  const [deleteInitId, setDeleteInitId] = useState<string | null>(null);

  // deep links
  useQueryAction("action", (v) => {
    if (v === "new-goal") setGoalModal({ mode: "create", draft: emptyGoal });
    if (v === "new-initiative") setInitModal({ goalId: goals[0]?.id ?? GOALS[0].id });
  });
  useQueryAction("goal", (v) => setDetailId(v));

  const filtered = useMemo(() => {
    let list = goals;
    if (tab === "on-track") list = list.filter((g) => g.status === "On track");
    if (tab === "at-risk") list = list.filter((g) => g.status === "At risk" || g.status === "Behind");
    if (tab === "completed") list = list.filter((g) => g.status === "Completed");
    if (q.trim()) {
      const ql = q.toLowerCase();
      list = list.filter(
        (g) => g.title.toLowerCase().includes(ql) || g.pillar.toLowerCase().includes(ql)
      );
    }
    return list;
  }, [goals, tab, q]);

  const openCreate = () => setGoalModal({ mode: "create", draft: emptyGoal });
  const openEdit = (g: Goal) =>
    setGoalModal({
      mode: "edit",
      goalId: g.id,
      draft: {
        title: g.title,
        pillar: g.pillar,
        description: g.description,
        why: g.why,
        ownerId: g.ownerId,
        budget: String(g.budget),
        end: g.end.slice(0, 10),
      },
    });

  const submitGoal = () => {
    if (!goalModal) return;
    const d = goalModal.draft;
    if (!d.title.trim()) {
      toast({ title: "Title required", description: "Give the goal a clear title.", variant: "error" });
      return;
    }
    if (goalModal.mode === "create") {
      addGoal({
        title: d.title.trim(),
        pillar: d.pillar,
        description: d.description.trim() || "No description provided yet.",
        why: d.why.trim() || "Linked to the board-approved strategic plan.",
        ownerId: d.ownerId,
        budget: Number(d.budget) || 0,
        spent: 0,
        start: new Date().toISOString().slice(0, 10),
        end: d.end || offsetISO(730).slice(0, 10),
        progress: 0,
        status: "Not started",
        kpis: [
          { id: uid("k"), name: "Goal outcome measure", current: 0, target: 100, unit: "%", trend: 0, format: "percent" },
        ],
        initiativeIds: [],
      });
      setGoalModal(null);
    } else if (goalModal.goalId) {
      updateGoal(goalModal.goalId, {
        title: d.title.trim(),
        pillar: d.pillar,
        description: d.description.trim(),
        why: d.why.trim(),
        ownerId: d.ownerId,
        budget: Number(d.budget) || 0,
        end: d.end,
      });
      toast({ title: "Goal updated", description: "Changes were saved.", variant: "success" });
      setGoalModal(null);
    }
  };

  const detailGoal = detailId ? goalById(detailId) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Strategic Plan"
        subtitle={`${orgPlanSubtitle(goals.length)} · plan period ${goals[0]?.start.slice(0, 4) ?? "2025"} – ${goals[0]?.end.slice(0, 4) ?? "2027"}`}
        actions={
          <>
            <Button variant="outline" onClick={() => setInitModal({ goalId: goals[0]?.id ?? GOALS[0].id })}>
              <IconPlus size={15} /> New initiative
            </Button>
            <Button onClick={openCreate}>
              <IconPlus size={15} /> New goal
            </Button>
          </>
        }
      />

      {/* Summary strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Active goals" value={String(goals.filter((g) => g.status !== "Completed").length)} sub={`${goals.filter((g) => g.status === "Completed").length} completed`} icon={<IconTarget size={16} />} tone="text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400" />
        <SummaryCard label="Initiatives in flight" value={String(initiatives.length)} sub={`${initiatives.filter((i) => i.status === "At risk" || i.status === "Behind").length} need attention`} icon={<IconFlag size={16} />} tone="text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400" />
        <SummaryCard label="Plan budget" value={formatCurrency(goals.reduce((s, g) => s + g.budget, 0), true)} sub={`${formatCurrency(goals.reduce((s, g) => s + g.spent, 0), true)} committed`} icon={<IconWallet size={16} />} tone="text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400" />
        <SummaryCard label="AI suggestions" value={String(aiRecs.length)} sub="2 high-impact ready to apply" icon={<IconSparkles size={16} />} tone="text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-400" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          active={tab}
          onChange={setTab}
          tabs={[
            { id: "all", label: "All goals", count: goals.length },
            { id: "on-track", label: "On track" },
            { id: "at-risk", label: "At risk / behind" },
            { id: "completed", label: "Completed" },
          ]}
        />
        <SearchInput value={q} onChange={setQ} placeholder="Search goals…" className="ml-auto w-64" />
      </div>

      {/* Goals */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<IconTarget size={20} />}
          title="No goals match your filters"
          description="Try a different tab or search term, or create a new strategic goal."
          action={<Button onClick={openCreate}><IconPlus size={15} /> New goal</Button>}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((g) => {
            const owner = userById(g.ownerId);
            const inits = initiativesByGoal(g.id);
            const progressSum = inits.length ? inits.reduce((s, i) => s + i.progress, 0) / inits.length : g.progress;
            const upcoming = inits
              .flatMap((i) => i.milestones)
              .filter((m) => m.status === "Upcoming")
              .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())[0];
            return (
              <Card key={g.id} className="transition-shadow hover:shadow-md">
                <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="stone">{g.pillar}</Badge>
                      <StatusBadge status={g.status} />
                      {g.progress >= 100 && <Badge tone="sky">Complete</Badge>}
                    </div>
                    <button onClick={() => setDetailId(g.id)} className="mt-2 block text-left">
                      <h3 className="text-[15px] font-semibold text-stone-900 transition-colors hover:text-emerald-700 dark:text-stone-50 dark:hover:text-emerald-400">
                        {g.title}
                      </h3>
                    </button>
                    <p className="mt-1 line-clamp-1 max-w-3xl text-xs text-stone-500 dark:text-stone-400">{g.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-stone-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Avatar name={owner.name} color={owner.color} size="xs" /> {owner.name} · {owner.title}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <IconCalendar size={12} /> {formatDate(g.start)} – {formatDate(g.end)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <IconFlag size={12} /> {formatCurrency(g.budget, true)} budget
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <IconUsers size={12} /> {inits.length} initiatives
                      </span>
                    </div>
                    {upcoming && (
                      <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                        <IconAlertTriangle size={11} /> Next milestone: {upcoming.title} · {formatDate(upcoming.due)} ({daysUntil(upcoming.due)}d)
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-6 lg:w-72 lg:justify-end">
                    <div className="w-36">
                      <div className="mb-1.5 flex justify-between text-[11px] text-stone-500 dark:text-stone-400">
                        <span>Progress</span>
                        <span className="font-semibold text-stone-700 dark:text-stone-200">{formatPercent(g.progress)}</span>
                      </div>
                      <ProgressBar value={g.progress} />
                      <p className="mt-1.5 text-[10px] text-stone-400">
                        Initiatives avg {formatPercent(Math.round(progressSum))}
                      </p>
                    </div>
                    <Menu
                      trigger={
                        <Button variant="outline" size="icon" aria-label="Goal actions">
                          <IconMore size={16} />
                        </Button>
                      }
                      items={[
                        { label: "View details", icon: <IconTarget size={14} />, onClick: () => setDetailId(g.id) },
                        { label: "Edit goal", icon: <IconPencil size={14} />, onClick: () => openEdit(g) },
                        { label: "Add initiative", icon: <IconPlus size={14} />, onClick: () => setInitModal({ goalId: g.id }) },
                        { label: "Delete goal", icon: <IconTrash size={14} />, danger: true, onClick: () => setDeleteGoalId(g.id) },
                      ]}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Goal create/edit modal */}
      <Modal
        open={goalModal !== null}
        onClose={() => setGoalModal(null)}
        title={goalModal?.mode === "edit" ? "Edit goal" : "New strategic goal"}
        subtitle="Goals sit at the top of the plan and group initiatives under a pillar."
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setGoalModal(null)}>Cancel</Button>
            <Button onClick={submitGoal}>{goalModal?.mode === "edit" ? "Save changes" : "Create goal"}</Button>
          </>
        }
      >
        {goalModal && (
          <div className="space-y-4">
            <Field label="Goal title">
              <Input
                autoFocus
                value={goalModal.draft.title}
                onChange={(e) => setGoalModal({ ...goalModal, draft: { ...goalModal.draft, title: e.target.value } })}
                placeholder="e.g. Increase donor retention by 20%"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Pillar">
                <Select
                  value={goalModal.draft.pillar}
                  onChange={(e) => setGoalModal({ ...goalModal, draft: { ...goalModal.draft, pillar: e.target.value } })}
                >
                  {PILLARS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Owner">
                <Select
                  value={goalModal.draft.ownerId}
                  onChange={(e) => setGoalModal({ ...goalModal, draft: { ...goalModal.draft, ownerId: e.target.value } })}
                >
                  {USERS.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} — {u.title}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Description">
              <Textarea
                value={goalModal.draft.description}
                onChange={(e) => setGoalModal({ ...goalModal, draft: { ...goalModal.draft, description: e.target.value } })}
                placeholder="What does success look like for this goal?"
              />
            </Field>
            <Field label="Why this goal matters">
              <Textarea
                value={goalModal.draft.why}
                onChange={(e) => setGoalModal({ ...goalModal, draft: { ...goalModal.draft, why: e.target.value } })}
                placeholder="Connect the goal to mission impact and the board-approved plan."
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Budget ($)">
                <Input
                  type="number"
                  value={goalModal.draft.budget}
                  onChange={(e) => setGoalModal({ ...goalModal, draft: { ...goalModal.draft, budget: e.target.value } })}
                />
              </Field>
              <Field label="End date">
                <Input
                  type="date"
                  value={goalModal.draft.end}
                  onChange={(e) => setGoalModal({ ...goalModal, draft: { ...goalModal.draft, end: e.target.value } })}
                />
              </Field>
              <Field label="Start date">
                <Input value={new Date().toISOString().slice(0, 10)} disabled />
              </Field>
            </div>
          </div>
        )}
      </Modal>

      {/* Initiative create modal */}
      <InitiativeModal
        open={initModal !== null}
        defaultGoalId={initModal?.goalId ?? GOALS[0].id}
        onClose={() => setInitModal(null)}
        onSubmit={(d) => {
          addInitiative(d);
          setInitModal(null);
        }}
      />

      {/* Goal detail drawer */}
      <GoalDetailDrawer
        goalId={detailId}
        onClose={() => setDetailId(null)}
        onEdit={(g) => {
          setDetailId(null);
          openEdit(g);
        }}
        onAddInitiative={(g) => {
          setDetailId(null);
          setInitModal({ goalId: g.id });
        }}
        onDeleteInitiative={(id) => setDeleteInitId(id)}
      />

      {/* Confirm delete goal */}
      <ConfirmDialog
        open={deleteGoalId !== null}
        onClose={() => setDeleteGoalId(null)}
        onConfirm={() => {
          if (deleteGoalId) {
            const g = goalById(deleteGoalId);
            deleteGoal(deleteGoalId);
            if (detailId === deleteGoalId) setDetailId(null);
            toast({ title: "Goal deleted", description: `“${g.title}” and its initiatives were removed.`, variant: "info" });
          }
        }}
        title="Delete this goal?"
        message={
          <>
            <span className="font-semibold text-stone-900 dark:text-stone-100">{deleteGoalId ? goalById(deleteGoalId).title : ""}</span> and its
            linked initiatives will be removed from the plan. This can't be undone.
          </>
        }
      />

      {/* Confirm delete initiative */}
      <ConfirmDialog
        open={deleteInitId !== null}
        onClose={() => setDeleteInitId(null)}
        onConfirm={() => {
          if (deleteInitId) {
            const i = initiatives.find((x) => x.id === deleteInitId);
            deleteInitiative(deleteInitId);
            if (i) toast({ title: "Initiative deleted", description: `“${i.title}” was removed.`, variant: "info" });
          }
        }}
        title="Delete this initiative?"
        message="The initiative and its milestones will be removed from the goal. This can't be undone."
      />
    </div>
  );
}

function orgPlanSubtitle(count: number) {
  return `${count} strategic goals across 5 pillars`;
}

function SummaryCard({
  label,
  value,
  sub,
  icon,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">{label}</p>
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", tone)}>{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 tabular-nums dark:text-stone-50">{value}</p>
      <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{sub}</p>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Initiative modal                                                   */
/* ------------------------------------------------------------------ */

function InitiativeModal({
  open,
  defaultGoalId,
  onClose,
  onSubmit,
}: {
  open: boolean;
  defaultGoalId: string;
  onClose: () => void;
  onSubmit: (d: Omit<Initiative, "id">) => void;
}) {
  const { goals } = useApp();
  const [title, setTitle] = useState("");
  const [goalId, setGoalId] = useState(defaultGoalId);
  const [ownerId, setOwnerId] = useState("u-david");
  const [budget, setBudget] = useState("50000");
  const [deadline, setDeadline] = useState(offsetISO(180).slice(0, 10));
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [description, setDescription] = useState("");

  React.useEffect(() => {
    if (open) {
      setGoalId(defaultGoalId);
      setTitle("");
      setDescription("");
      setBudget("50000");
      setDeadline(offsetISO(180).slice(0, 10));
      setPriority("Medium");
      setOwnerId("u-david");
    }
  }, [open, defaultGoalId]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New initiative"
      subtitle="Initiatives are the concrete workstreams that move a goal forward."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (!title.trim()) return;
              onSubmit({
                title: title.trim(),
                goalId,
                ownerId,
                budget: Number(budget) || 0,
                spent: 0,
                deadline,
                start: new Date().toISOString().slice(0, 10),
                priority,
                progress: 0,
                status: "Not started",
                description: description.trim() || "Workstream defined in the current planning cycle.",
                kpis: [
                  { id: uid("k"), name: "Success measure", current: 0, target: 100, unit: "%", trend: 0, format: "percent" },
                ],
                milestones: [],
              });
            }}
          >
            Create initiative
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Initiative title">
          <Input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Regional expansion — Southwest" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Linked goal">
            <Select value={goalId} onChange={(e) => setGoalId(e.target.value)}>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </Select>
          </Field>
          <Field label="Owner">
            <Select value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
              {USERS.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Description">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Scope, audience and expected outcome…" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Budget ($)">
            <Input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
          </Field>
          <Field label="Deadline">
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </Field>
          <Field label="Priority">
            <Select value={priority} onChange={(e) => setPriority(e.target.value as "High" | "Medium" | "Low")}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </Select>
          </Field>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Goal detail drawer                                                 */
/* ------------------------------------------------------------------ */

function GoalDetailDrawer({
  goalId,
  onClose,
  onEdit,
  onAddInitiative,
  onDeleteInitiative,
}: {
  goalId: string | null;
  onClose: () => void;
  onEdit: (g: Goal) => void;
  onAddInitiative: (g: Goal) => void;
  onDeleteInitiative: (id: string) => void;
}) {
  const { addComment, comments, updateInitiative, toast } = useApp();
  const [tab, setTab] = useState("overview");
  const [comment, setComment] = useState("");
  const goal = goalId ? goalById(goalId) : null;

  React.useEffect(() => {
    setTab("overview");
    setComment("");
  }, [goalId]);

  const setStatus = (i: Initiative, status: Status) => {
    updateInitiative(i.id, { status });
    toast({
      title: `Marked \u201c${i.title}\u201d as ${status}`,
      description: status === "On track" ? "The initiative is back on track." : "The initiative now needs attention.",
      variant: status === "On track" ? "success" : "warning",
    });
  };

  if (!goal) return null;
  const inits = initiativesByGoal(goal.id);
  const goalComments = comments.filter((c) => c.targetId === goal.id);
  const ai = aiSuggestionFor(goal.id);

  return (
    <Drawer
      open={goalId !== null}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          {goal.title}
          <StatusBadge status={goal.status} />
        </span>
      }
      subtitle={`${goal.pillar} · owned by ${userById(goal.ownerId).name}`}
      width="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={() => onAddInitiative(goal)}>
            <IconPlus size={15} /> Add initiative
          </Button>
          <Button onClick={() => onEdit(goal)}>
            <IconPencil size={15} /> Edit goal
          </Button>
        </>
      }
    >
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "initiatives", label: "Initiatives", count: inits.length },
          { id: "kpis", label: "KPIs", count: goal.kpis.length },
          { id: "comments", label: "Comments", count: goalComments.length },
        ]}
      />

      {tab === "overview" && (
        <div className="space-y-5 pt-4">
          <div className="rounded-xl bg-stone-50 p-4 dark:bg-stone-800/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Why this goal</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-stone-700 dark:text-stone-200">{goal.why}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Description</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600 dark:text-stone-300">{goal.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Fact label="Owner" value={userById(goal.ownerId).name.split(" ")[0]} sub={userById(goal.ownerId).title} />
            <Fact label="Progress" value={formatPercent(goal.progress)} sub="overall" />
            <Fact label="Budget" value={formatCurrency(goal.budget, true)} sub={`${formatCurrency(goal.spent, true)} spent`} />
            <Fact label="Timeline" value={goal.start.slice(0, 4)} sub={`→ ${goal.end.slice(0, 4)}`} />
          </div>
          {ai && (
            <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-500/30 dark:bg-violet-500/10">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-violet-700 dark:text-violet-300">
                <IconSparkles size={13} /> AI recommendation
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-violet-900/80 dark:text-violet-200/80">{ai.body}</p>
            </div>
          )}
        </div>
      )}

      {tab === "initiatives" && (
        <div className="space-y-3 pt-4">
          {inits.length === 0 && (
            <EmptyState
              icon={<IconFlag size={20} />}
              title="No initiatives yet"
              description="Add an initiative to start executing this goal."
              action={<Button onClick={() => onAddInitiative(goal)}><IconPlus size={15} /> Add initiative</Button>}
            />
          )}
          {inits.map((i) => {
            const owner = userById(i.ownerId);
            return (
              <Card key={i.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13.5px] font-semibold text-stone-900 dark:text-stone-50">{i.title}</p>
                      <PriorityBadge priority={i.priority} />
                      <StatusBadge status={i.status} />
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-stone-500 dark:text-stone-400">{i.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-stone-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Avatar name={owner.name} color={owner.color} size="xs" /> {owner.name}
                      </span>
                      <span className="inline-flex items-center gap-1"><IconCalendar size={11} /> due {formatDate(i.deadline)}</span>
                      <span className="inline-flex items-center gap-1"><IconWallet size={11} /> {formatCurrency(i.budget, true)}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="w-24">
                      <ProgressBar value={i.progress} showLabel />
                    </div>
                    <Menu
                      trigger={
                        <Button variant="outline" size="icon" aria-label="Initiative actions">
                          <IconMore size={15} />
                        </Button>
                      }
                      items={[
                        { label: "Mark on track", icon: <IconFlag size={14} />, onClick: () => setStatus(i, "On track") },
                        { label: "Mark at risk", icon: <IconAlertTriangle size={14} />, onClick: () => setStatus(i, "At risk") },
                        { label: "Delete", icon: <IconTrash size={14} />, danger: true, onClick: () => onDeleteInitiative(i.id) },
                      ]}
                    />
                  </div>
                </div>
                {i.milestones.length > 0 && (
                  <div className="mt-3 border-t border-stone-100 pt-3 dark:border-stone-800">
                    <div className="space-y-1.5">
                      {i.milestones.map((m) => (
                        <div key={m.id} className="flex items-center gap-2.5 text-xs">
                          <span
                            className={cn(
                              "flex h-4 w-4 items-center justify-center rounded-full border",
                              m.status === "Done" && "border-emerald-500 bg-emerald-500 text-white",
                              m.status === "In progress" && "border-amber-500 text-amber-500",
                              (m.status === "Upcoming" || m.status === "Overdue") && "border-stone-300 text-transparent dark:border-stone-600"
                            )}
                          >
                            {m.status === "Done" && <IconCheck size={10} />}
                          </span>
                          <span
                            className={cn(
                              "flex-1",
                              m.status === "Done" && "text-stone-400 line-through",
                              m.status === "Overdue" && "text-rose-600 dark:text-rose-400"
                            )}
                          >
                            {m.title}
                          </span>
                          <span className="text-[10px] text-stone-400">{formatDate(m.due)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {tab === "kpis" && (
        <div className="space-y-3 pt-4">
          {goal.kpis.map((k) => (
            <Card key={k.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-stone-800 dark:text-stone-100">{k.name}</p>
                <p className="text-[11px] text-stone-400">vs last period: {k.trend >= 0 ? "+" : ""}{k.trend}%</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold tabular-nums text-stone-900 dark:text-stone-50">
                  {k.format === "currency" ? formatCurrency(k.current) : k.format === "percent" ? formatPercent(k.current) : k.current}
                  <span className="text-xs font-normal text-stone-400"> / {k.format === "currency" ? formatCurrency(k.target) : k.format === "percent" ? formatPercent(k.target) : k.target}{k.unit}</span>
                </p>
                <div className="mt-1.5 h-1.5 w-32 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      (k.current / Math.max(k.target, 1)) >= 0.9 ? "bg-emerald-500" : (k.current / Math.max(k.target, 1)) >= 0.6 ? "bg-amber-500" : "bg-rose-500"
                    )}
                    style={{ width: `${Math.min(100, (k.current / Math.max(k.target, 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
          {goal.kpis.length === 0 && (
            <EmptyState icon={<IconTarget size={20} />} title="No KPIs defined" description="Add success measures to track this goal." />
          )}
        </div>
      )}

      {tab === "comments" && (
        <div className="space-y-4 pt-4">
          <div className="flex gap-3">
            <Avatar name="Sarah Johnson" color="bg-emerald-600" size="sm" />
            <div className="flex-1">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment, update, or question…"
                className="w-full resize-none rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <Button
                  size="sm"
                  disabled={!comment.trim()}
                  onClick={() => {
                    if (comment.trim()) {
                      addComment(goal.id, comment.trim());
                      setComment("");
                    }
                  }}
                >
                  Post comment
                </Button>
              </div>
            </div>
          </div>
          <Divider />
          {goalComments.length === 0 ? (
            <p className="py-6 text-center text-xs text-stone-400">No comments yet — start the conversation.</p>
          ) : (
            goalComments.map((c) => {
              const author = userById(c.authorId);
              return (
                <div key={c.id} className="flex gap-3">
                  <Avatar name={author.name} color={author.color} size="sm" />
                  <div className="min-w-0 flex-1 rounded-xl bg-stone-50 p-3 dark:bg-stone-800/60">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-stone-800 dark:text-stone-100">{author.name}</p>
                      <span className="text-[10px] text-stone-400">{timeAgo(c.time)}</span>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-stone-600 dark:text-stone-300">{c.text}</p>
                    {c.replies?.map((r) => {
                      const ra = userById(r.authorId);
                      return (
                        <div key={r.id} className="mt-3 flex gap-2.5 border-l-2 border-stone-200 pl-3 dark:border-stone-700">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-semibold text-stone-700 dark:text-stone-200">{ra.name}</p>
                              <span className="text-[10px] text-stone-400">{timeAgo(r.time)}</span>
                            </div>
                            <p className="mt-0.5 text-[12.5px] leading-relaxed text-stone-500 dark:text-stone-400">{r.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </Drawer>
  );
}

function aiSuggestionFor(goalId: string) {
  return aiRecsLocal.find((r) => r.goalId === goalId);
}

const aiRecsLocal = [
  {
    goalId: "g3",
    body: "This goal is at risk because the Phoenix regional coordinator role has been open 8 weeks. Historical data across similar nonprofits suggests the hiring window closes at 12 weeks — pre-approve an offer band and move in 48 hours to protect the launch window.",
  },
  {
    goalId: "g1",
    body: "Retention is tracking 4 points ahead of plan. The mid-year renewal push is the highest-leverage remaining action this cycle — approve creative early for a full test window.",
  },
];

function Fact({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg bg-stone-50 px-3 py-2.5 dark:bg-stone-800/60">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-stone-900 dark:text-stone-50">{value}</p>
      <p className="text-[10px] text-stone-400">{sub}</p>
    </div>
  );
}

function IconCheck({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
