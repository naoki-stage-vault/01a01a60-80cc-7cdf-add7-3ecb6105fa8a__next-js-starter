"use client";

import React, { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { STAKEHOLDER_GROUPS, groupById, userById } from "@/lib/data";
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
  ProgressBar,
  ScoreBar,
  SearchInput,
  Select,
  Tabs,
  Tooltip,
} from "@/components/ui";
import { DonutChart, LineChart } from "@/components/charts";
import {
  IconCheck,
  IconDownload,
  IconHeart,
  IconMessage,
  IconMore,
  IconPencil,
  IconPlus,
  IconQuote,
  IconSend,
  IconSparkles,
  IconTrash,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
  IconX,
} from "@/lib/icons";
import { useQueryAction } from "@/lib/useQuery";
import { cn, formatDate, formatPercent, offsetISO, timeAgo, uid } from "@/lib/utils";
import type { Survey } from "@/lib/types";

export default function StakeholdersPage() {
  const { surveys, groups, swot, meetingNotes, addSurvey, updateSurvey, deleteSurvey, toast } = useApp();
  const [tab, setTab] = useState("groups");
  const [q, setQ] = useState("");
  const [surveyModal, setSurveyModal] = useState(false);
  const [surveyId, setSurveyId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useQueryAction("action", (v) => {
    if (v === "new-survey") setSurveyModal(true);
  });

  const filteredGroups = useMemo(() => {
    let list = groups;
    if (q.trim()) {
      const ql = q.toLowerCase();
      list = list.filter((g) => g.name.toLowerCase().includes(ql));
    }
    return list;
  }, [groups, q]);

  const stats = useMemo(() => {
    const published = surveys.filter((s) => s.status !== "Draft");
    const responses = published.reduce((s, x) => s + x.responses, 0);
    const avgSentiment = Math.round(groups.reduce((s, g) => s + g.sentiment, 0) / groups.length);
    const participation = published.length
      ? Math.round(published.reduce((s, x) => s + x.participation, 0) / published.length)
      : 0;
    return { responses, avgSentiment, participation, active: surveys.filter((s) => s.status === "Published" || s.status === "Analyzing").length };
  }, [surveys, groups]);

  const survey = surveyId ? surveys.find((s) => s.id === surveyId) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Stakeholder Engagement"
        subtitle="Surveys, interviews and SWOT across six stakeholder groups."
        actions={
          <Button onClick={() => setSurveyModal(true)}>
            <IconPlus size={15} /> Create survey
          </Button>
        }
      />

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Responses collected</p>
          <p className="mt-2 text-2xl font-semibold text-stone-900 tabular-nums dark:text-stone-50">{stats.responses.toLocaleString()}</p>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">across published surveys</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Avg sentiment</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">{stats.avgSentiment}</p>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">/100 · ▲ 2 pts vs last quarter</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Avg participation</p>
          <p className="mt-2 text-2xl font-semibold text-stone-900 tabular-nums dark:text-stone-50">{formatPercent(stats.participation)}</p>
          <ProgressBar value={stats.participation} className="mt-3" />
          <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">above the 30% nonprofit benchmark</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Active surveys</p>
          <p className="mt-2 text-2xl font-semibold text-stone-900 tabular-nums dark:text-stone-50">{stats.active}</p>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">1 draft ready to launch</p>
        </Card>
      </div>

      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "groups", label: "Stakeholder groups", count: groups.length },
          { id: "surveys", label: "Surveys", count: surveys.length },
          { id: "swot", label: "SWOT analysis" },
          { id: "interviews", label: "Interviews & meetings", count: meetingNotes.length },
        ]}
      />

      {tab === "groups" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-stone-500 dark:text-stone-400">Sentiment is a 0–100 composite of survey scores, interview themes and participation signals.</p>
            <SearchInput value={q} onChange={setQ} placeholder="Search groups…" className="w-60" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredGroups.map((g) => (
              <Card key={g.id} className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[14.5px] font-semibold text-stone-900 dark:text-stone-50">{g.name}</p>
                    <p className="mt-0.5 text-xs text-stone-400">{g.members.toLocaleString()} members · last touch {timeAgo(g.lastTouch)}</p>
                  </div>
                  <PriorityPill p={g.priority} />
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <SentimentRing value={g.sentiment} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-stone-400">Sentiment</p>
                    <p className="text-xl font-bold tabular-nums text-stone-900 dark:text-stone-50">{g.sentiment}<span className="text-xs font-normal text-stone-400">/100</span></p>
                    <p className={cn("mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium", g.trend >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                      {g.trend >= 0 ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}
                      {g.trend >= 0 ? "+" : ""}{g.trend} pts vs Q2
                    </p>
                  </div>
                </div>
                <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">{g.notes}</p>
                <div className="mt-4 flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => setTab("surveys")}>
                    View surveys <IconTrendingUp size={13} className="ml-1" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSurveyModal(true)}>
                    <IconSend size={13} /> Survey group
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "surveys" && (
        <div className="space-y-4">
          {surveys.length === 0 ? (
            <EmptyState icon={<IconMessage size={20} />} title="No surveys yet" description="Create your first stakeholder survey to start collecting feedback." action={<Button onClick={() => setSurveyModal(true)}><IconPlus size={15} /> Create survey</Button>} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {surveys.map((s) => {
                const group = groupById(s.groupId);
                return (
                  <Card key={s.id} className="flex flex-col p-5 transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between gap-2">
                      <Badge tone="stone">{group.name}</Badge>
                      <SurveyStatusBadge status={s.status} />
                    </div>
                    <button onClick={() => setSurveyId(s.id)} className="mt-3 text-left">
                      <h3 className="text-[14.5px] font-semibold leading-snug text-stone-900 hover:text-emerald-700 dark:text-stone-50 dark:hover:text-emerald-400">
                        {s.title}
                      </h3>
                    </button>
                    <p className="mt-1 text-[11px] text-stone-400">
                      {formatDate(s.launched)} → {formatDate(s.closed)}
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-500 dark:text-stone-400">Responses</span>
                        <span className="font-semibold tabular-nums text-stone-800 dark:text-stone-100">{s.responses.toLocaleString()} / {s.sent.toLocaleString()}</span>
                      </div>
                      <ProgressBar value={s.participation} showLabel />
                    </div>
                    <div className="mt-4 flex items-center gap-4 border-t border-stone-100 pt-3 text-xs dark:border-stone-800">
                      {s.nps !== undefined && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="text-stone-400">NPS</span>
                          <span className={cn("font-bold tabular-nums", s.nps >= 50 ? "text-emerald-600 dark:text-emerald-400" : s.nps >= 30 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400")}>{s.nps}</span>
                        </span>
                      )}
                      {s.satisfaction !== undefined && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="text-stone-400">Satisfaction</span>
                          <span className="font-bold tabular-nums text-stone-800 dark:text-stone-100">{s.satisfaction.toFixed(1)}/5</span>
                        </span>
                      )}
                      <span className="ml-auto">
                        <Menu
                          trigger={
                            <Button variant="outline" size="icon" aria-label="Survey actions">
                              <IconMore size={15} />
                            </Button>
                          }
                          items={[
                            { label: "View results", icon: <IconMessage size={14} />, onClick: () => setSurveyId(s.id) },
                            ...(s.status === "Draft" ? [{ label: "Publish survey", icon: <IconSend size={14} />, onClick: () => { updateSurvey(s.id, { status: "Published" }); toast({ title: "Survey published", description: `“${s.title}” is now live.`, variant: "success" }); } }] : []),
                            ...(s.status === "Published" ? [{ label: "Mark analyzing", icon: <IconSparkles size={14} />, onClick: () => { updateSurvey(s.id, { status: "Analyzing" }); toast({ title: "Analyzing responses", description: "AI theme detection has started.", variant: "info" }); } }] : []),
                            { label: "Delete", icon: <IconTrash size={14} />, danger: true, onClick: () => setDeleteId(s.id) },
                          ]}
                        />
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "swot" && (
        <div className="grid gap-4 md:grid-cols-2">
          <SwotQuadrant title="Strengths" tone="emerald" icon={<IconHeart size={16} />} items={swot.Strengths} />
          <SwotQuadrant title="Weaknesses" tone="rose" icon={<IconTrendingDown size={16} />} items={swot.Weaknesses} />
          <SwotQuadrant title="Opportunities" tone="sky" icon={<IconTrendingUp size={16} />} items={swot.Opportunities} />
          <SwotQuadrant title="Threats" tone="amber" icon={<IconX size={16} />} items={swot.Threats} />
        </div>
      )}

      {tab === "interviews" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {meetingNotes.map((m) => (
            <Card key={m.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[14.5px] font-semibold text-stone-900 dark:text-stone-50">{m.title}</p>
                  <p className="mt-0.5 text-xs text-stone-400">{formatDate(m.date)}</p>
                </div>
                <div className="flex -space-x-1.5">
                  {m.participants.slice(0, 4).map((p, i) => (
                    <span key={i} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-stone-200 text-[9px] font-bold text-stone-600 dark:border-stone-900 dark:bg-stone-700 dark:text-stone-300" title={p}>
                      {initialsOf(p)}
                    </span>
                  ))}
                  {m.participants.length > 4 && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-stone-100 text-[9px] font-bold text-stone-500 dark:border-stone-900 dark:bg-stone-800 dark:text-stone-400">
                      +{m.participants.length - 4}
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-stone-600 dark:text-stone-300">{m.summary}</p>
              {m.decisions.length > 0 && (
                <div className="mt-3 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-500/10">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Decisions</p>
                  <ul className="mt-1.5 space-y-1">
                    {m.decisions.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-emerald-900/80 dark:text-emerald-200/80">
                        <IconCheck size={12} className="mt-0.5 shrink-0" /> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {m.actions.length > 0 && (
                <div className="mt-3 border-t border-stone-100 pt-3 dark:border-stone-800">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Action items</p>
                  <ul className="mt-1.5 space-y-1.5">
                    {m.actions.map((a, i) => (
                      <li key={i} className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-stone-600 dark:text-stone-300">{a.text}</span>
                        <span className="flex shrink-0 items-center gap-1.5">
                          <Avatar name={userById(a.ownerId).name} color={userById(a.ownerId).color} size="xs" />
                          <span className="text-[10px] text-stone-400">{formatDate(a.due)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Survey create modal */}
      <SurveyModal open={surveyModal} onClose={() => setSurveyModal(false)} onCreate={(s) => { addSurvey(s); setSurveyModal(false); }} />

      {/* Survey detail drawer */}
      <SurveyDetailDrawer survey={survey} onClose={() => setSurveyId(null)} />

      {/* Delete survey */}
      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            const s = surveys.find((x) => x.id === deleteId);
            deleteSurvey(deleteId);
            if (surveyId === deleteId) setSurveyId(null);
            if (s) toast({ title: "Survey deleted", description: `“${s.title}” was removed.`, variant: "info" });
          }
        }}
        title="Delete this survey?"
        message="Responses and highlights for this survey will be permanently removed."
      />
    </div>
  );
}

function groupById(id: string) {
  return STAKEHOLDER_GROUPS.find((g) => g.id === id) ?? STAKEHOLDER_GROUPS[0]!;
}

function initialsOf(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");
}

function PriorityPill({ p }: { p: "High" | "Medium" | "Low" }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
        p === "High" && "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
        p === "Medium" && "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
        p === "Low" && "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400"
      )}
    >
      {p} priority
    </span>
  );
}

function SentimentRing({ value }: { value: number }) {
  const r = 26;
  const C = 2 * Math.PI * r;
  const frac = value / 100;
  const color = value >= 70 ? "#059669" : value >= 50 ? "#f59e0b" : "#f43f5e";
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0">
      <circle cx="32" cy="32" r={r} fill="none" strokeWidth="7" className="stroke-stone-100 dark:stroke-stone-800" />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${frac * C} ${C}`}
        transform="rotate(-90 32 32)"
        className="transition-all duration-700"
      />
    </svg>
  );
}

function SurveyStatusBadge({ status }: { status: Survey["status"] }) {
  const map: Record<Survey["status"], { tone: "stone" | "sky" | "violet" | "emerald"; label: string }> = {
    Draft: { tone: "stone", label: "Draft" },
    Published: { tone: "sky", label: "Live" },
    Analyzing: { tone: "violet", label: "Analyzing" },
    Completed: { tone: "emerald", label: "Completed" },
  };
  return <Badge tone={map[status].tone}>{map[status].label}</Badge>;
}

function SwotQuadrant({
  title,
  tone,
  icon,
  items,
}: {
  title: string;
  tone: "emerald" | "rose" | "sky" | "amber";
  icon: React.ReactNode;
  items: { id: string; text: string; tag?: string }[];
}) {
  const tones = {
    emerald: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/25 dark:bg-emerald-500/5",
    rose: "border-rose-200 bg-rose-50/50 dark:border-rose-500/25 dark:bg-rose-500/5",
    sky: "border-sky-200 bg-sky-50/50 dark:border-sky-500/25 dark:bg-sky-500/5",
    amber: "border-amber-200 bg-amber-50/50 dark:border-amber-500/25 dark:bg-amber-500/5",
  };
  const head = {
    emerald: "text-emerald-700 dark:text-emerald-400",
    rose: "text-rose-700 dark:text-rose-400",
    sky: "text-sky-700 dark:text-sky-400",
    amber: "text-amber-700 dark:text-amber-400",
  };
  return (
    <div className={cn("rounded-xl border p-5", tones[tone])}>
      <div className={cn("flex items-center gap-2", head[tone])}>
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="ml-auto text-[10px] font-medium opacity-60">{items.length} items</span>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it.id} className="flex items-start gap-2 rounded-lg bg-white/70 p-2.5 text-[12.5px] leading-relaxed text-stone-700 shadow-sm dark:bg-stone-900/60 dark:text-stone-200">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-40" />
            <span className="flex-1">{it.text}</span>
            {it.tag && <Badge tone="stone" className="mt-0.5 shrink-0">{it.tag}</Badge>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SurveyModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (s: Omit<Survey, "id">) => void;
}) {
  const { groups } = useApp();
  const [title, setTitle] = useState("");
  const [groupId, setGroupId] = useState(groups[0]?.id ?? "");
  const [questions, setQuestions] = useState<string[]>([""]);

  React.useEffect(() => {
    if (open) {
      setTitle("");
      setGroupId(groups[0]?.id ?? "");
      setQuestions([""]);
    }
  }, [open, groups]);

  const validQuestions = questions.map((x) => x.trim()).filter(Boolean);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create survey"
      subtitle="Send a feedback survey to one stakeholder group."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            disabled={!title.trim() || validQuestions.length === 0}
            onClick={() =>
              onCreate({
                title: title.trim(),
                groupId,
                status: "Draft",
                sent: 0,
                responses: 0,
                participation: 0,
                launched: new Date().toISOString().slice(0, 10),
                closed: offsetISO(14).slice(0, 10),
                questions: validQuestions.map((text, i) => ({ id: uid("q"), text, avg: 0, max: 5 })),
                highlights: [],
              })
            }
          >
            Create draft
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Survey title">
          <Input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Donor Satisfaction Survey 2026" />
        </Field>
        <Field label="Stakeholder group">
          <Select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name} · {g.members.toLocaleString()} members</option>
            ))}
          </Select>
        </Field>
        <div>
          <p className="mb-1.5 text-xs font-medium text-stone-700 dark:text-stone-300">Questions <span className="text-stone-400">(rated 1–5)</span></p>
          <div className="space-y-2">
            {questions.map((q, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-bold text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                  {i + 1}
                </span>
                <Input
                  value={q}
                  onChange={(e) => setQuestions((prev) => prev.map((x, xi) => (xi === i ? e.target.value : x)))}
                  placeholder={`Question ${i + 1}…`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove question"
                  className="shrink-0 text-stone-400"
                  disabled={questions.length === 1}
                  onClick={() => setQuestions((prev) => prev.filter((_, xi) => xi !== i))}
                >
                  <IconTrash size={15} />
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => setQuestions((prev) => [...prev, ""])}
          >
            <IconPlus size={14} /> Add question
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function SurveyDetailDrawer({ survey, onClose }: { survey: Survey | null; onClose: () => void }) {
  const { toast } = useApp();
  if (!survey) return null;
  const group = groupById(survey.groupId);

  const segments = [
    { label: "Promoters (9–10)", value: 48, color: "#059669" },
    { label: "Passives (7–8)", value: 32, color: "#f59e0b" },
    { label: "Detractors (0–6)", value: 20, color: "#f43f5e" },
  ];

  return (
    <Drawer
      open={survey !== null}
      onClose={onClose}
      title={survey.title}
      subtitle={`${group.name} · launched ${formatDate(survey.launched)} · ${survey.responses.toLocaleString()} responses`}
      width="max-w-2xl"
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => {
              toast({ title: "Export queued", description: "CSV export of responses will download shortly.", variant: "success" });
            }}
          >
            <IconDownload size={15} /> Export CSV
          </Button>
          <Button
            onClick={() => {
              toast({ title: "Analysis refreshed", description: "AI theme detection re-ran on latest responses.", variant: "success" });
            }}
          >
            <IconSparkles size={15} /> Refresh AI analysis
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-stone-50 p-4 text-center dark:bg-stone-800/60">
            <p className="text-2xl font-bold tabular-nums text-stone-900 dark:text-stone-50">{formatPercent(survey.participation)}</p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-400">Participation</p>
          </div>
          <div className="rounded-xl bg-stone-50 p-4 text-center dark:bg-stone-800/60">
            <p className={cn("text-2xl font-bold tabular-nums", (survey.nps ?? 0) >= 50 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>{survey.nps ?? "—"}</p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-400">NPS</p>
          </div>
          <div className="rounded-xl bg-stone-50 p-4 text-center dark:bg-stone-800/60">
            <p className="text-2xl font-bold tabular-nums text-stone-900 dark:text-stone-50">{survey.satisfaction?.toFixed(1) ?? "—"}</p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-400">Satisfaction /5</p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">NPS segments</p>
          <DonutChart data={segments} centerValue={String(survey.nps ?? 0)} centerLabel="NPS" />
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">Question scores</p>
          <div className="space-y-3.5 rounded-xl border border-stone-100 p-4 dark:border-stone-800">
            {survey.questions.map((question) => (
              <ScoreBar key={question.id} label={question.text} avg={question.avg} max={question.max} />
            ))}
          </div>
        </div>

        {survey.highlights.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">Top quotes</p>
            <div className="space-y-2.5">
              {survey.highlights.map((h, i) => (
                <figure key={i} className="flex items-start gap-2.5 rounded-xl bg-violet-50 p-3.5 dark:bg-violet-500/10">
                  <IconQuote size={16} className="mt-0.5 shrink-0 text-violet-400" />
                  <blockquote className="text-[13px] leading-relaxed text-violet-900/80 dark:text-violet-200/80">“{h}”</blockquote>
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
