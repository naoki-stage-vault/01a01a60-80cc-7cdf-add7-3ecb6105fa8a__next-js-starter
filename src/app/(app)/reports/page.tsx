"use client";

import React, { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { userById } from "@/lib/data";
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
  SearchInput,
  Select,
  Tabs,
} from "@/components/ui";
import {
  IconCalendar,
  IconDownload,
  IconFileText,
  IconMore,
  IconPencil,
  IconPlus,
  IconPrinter,
  IconSparkles,
  IconTrash,
} from "@/lib/icons";
import { useQueryAction } from "@/lib/useQuery";
import { cn, formatDate, offsetISO, timeAgo, uid } from "@/lib/utils";
import type { Report } from "@/lib/types";

const REPORT_TYPES = ["Board", "Executive", "Quarterly", "Annual", "Program", "Risk"] as const;
const STATUSES = ["Draft", "Final", "Published"] as const;

export default function ReportsPage() {
  const { reports, addReport, updateReport, deleteReport, toast, user } = useApp();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const [modal, setModal] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useQueryAction("action", (v) => {
    if (v === "new-report") setModal(true);
  });

  const filtered = useMemo(() => {
    let list = [...reports];
    if (tab === "drafts") list = list.filter((r) => r.status === "Draft");
    if (tab === "final") list = list.filter((r) => r.status === "Final");
    if (tab === "published") list = list.filter((r) => r.status === "Published");
    if (q.trim()) {
      const ql = q.toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(ql) || r.type.toLowerCase().includes(ql) || r.period.toLowerCase().includes(ql));
    }
    list.sort((a, b) => (sortNewest ? new Date(b.date).getTime() - new Date(a.date).getTime() : new Date(a.date).getTime() - new Date(b.date).getTime()));
    return list;
  }, [reports, tab, q, sortNewest]);

  const preview = previewId ? reports.find((r) => r.id === previewId) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Reports"
        subtitle="Board-ready summaries, executive reports and export previews — all generated from live plan data."
        actions={
          <>
            <Button variant="outline" onClick={() => toast({ title: "Export queued", description: "All finalized reports will be packaged for download.", variant: "success" })}>
              <IconDownload size={15} /> Export all
            </Button>
            <Button onClick={() => setModal(true)}>
              <IconPlus size={15} /> New report
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          active={tab}
          onChange={setTab}
          tabs={[
            { id: "all", label: "All reports", count: reports.length },
            { id: "drafts", label: "Drafts" },
            { id: "final", label: "Final" },
            { id: "published", label: "Published" },
          ]}
        />
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setSortNewest(true)}
            className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", sortNewest ? "bg-emerald-600 text-white" : "text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800")}
          >
            Newest
          </button>
          <button
            onClick={() => setSortNewest(false)}
            className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", !sortNewest ? "bg-emerald-600 text-white" : "text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800")}
          >
            Oldest
          </button>
          <SearchInput value={q} onChange={setQ} placeholder="Search reports…" className="w-56" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<IconFileText size={20} />}
          title="No reports found"
          description="Try a different filter, or draft a new report."
          action={<Button onClick={() => setModal(true)}><IconPlus size={15} /> New report</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => {
            const author = userById(r.authorId);
            return (
              <Card key={r.id} className="flex flex-col p-5 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <ReportTypeBadge type={r.type} />
                    <ReportStatusBadge status={r.status} />
                  </div>
                  <Menu
                    trigger={
                      <Button variant="outline" size="icon" aria-label="Report actions" className="h-7 w-7">
                        <IconMore size={14} />
                      </Button>
                    }
                    items={[
                      { label: "Preview", icon: <IconFileText size={14} />, onClick: () => setPreviewId(r.id) },
                      ...(r.status === "Draft" ? [{ label: "Mark final", icon: <IconPencil size={14} />, onClick: () => { updateReport(r.id, { status: "Final" }); toast({ title: "Report finalized", description: `“${r.title}” moved to Final.`, variant: "success" }); } }] : []),
                      ...(r.status === "Final" ? [{ label: "Publish", icon: <IconSparkles size={14} />, onClick: () => { updateReport(r.id, { status: "Published" }); toast({ title: "Report published", description: `“${r.title}” is now public.`, variant: "success" }); } }] : []),
                      { label: "Export PDF", icon: <IconDownload size={14} />, onClick: () => toast({ title: "Export started", description: `“${r.title}” will download as PDF.`, variant: "success" }) },
                      { label: "Delete", icon: <IconTrash size={14} />, danger: true, onClick: () => setDeleteId(r.id) },
                    ]}
                  />
                </div>
                <button onClick={() => setPreviewId(r.id)} className="mt-3 text-left">
                  <h3 className="text-[14.5px] font-semibold leading-snug text-stone-900 hover:text-emerald-700 dark:text-stone-50 dark:hover:text-emerald-400">
                    {r.title}
                  </h3>
                </button>
                <p className="mt-1 text-[11px] text-stone-400">{r.period} · {r.pages} pages</p>
                <p className="mt-2.5 line-clamp-3 flex-1 text-xs leading-relaxed text-stone-500 dark:text-stone-400">{r.summary}</p>
                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 dark:border-stone-800">
                  <span className="inline-flex items-center gap-1.5">
                    <Avatar name={author.name} color={author.color} size="xs" />
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">{author.name.split(" ")[0]} · {formatDate(r.date)}</span>
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setPreviewId(r.id)}>
                    Preview <IconMore size={13} className="ml-1 rotate-90" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* New report modal */}
      <NewReportModal
        open={modal}
        onClose={() => setModal(false)}
        onCreate={(r) => {
          addReport(r);
          setModal(false);
        }}
      />

      {/* Preview drawer */}
      <ReportPreview report={preview} onClose={() => setPreviewId(null)} />

      {/* Delete */}
      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            const r = reports.find((x) => x.id === deleteId);
            deleteReport(deleteId);
            if (previewId === deleteId) setPreviewId(null);
            if (r) toast({ title: "Report deleted", description: `“${r.title}” was removed.`, variant: "info" });
          }
        }}
        title="Delete this report?"
        message="The report and its sections will be permanently removed."
      />
    </div>
  );
}

function ReportTypeBadge({ type }: { type: Report["type"] }) {
  const tones: Record<Report["type"], "emerald" | "sky" | "violet" | "amber" | "teal" | "rose"> = {
    Board: "emerald",
    Executive: "sky",
    Quarterly: "violet",
    Annual: "amber",
    Program: "teal",
    Risk: "rose",
  };
  return <Badge tone={tones[type]}>{type}</Badge>;
}

function ReportStatusBadge({ status }: { status: Report["status"] }) {
  const map: Record<Report["status"], { tone: "stone" | "sky" | "emerald"; label: string }> = {
    Draft: { tone: "stone", label: "Draft" },
    Final: { tone: "sky", label: "Final" },
    Published: { tone: "emerald", label: "Published" },
  };
  return <Badge tone={map[status].tone}>{map[status].label}</Badge>;
}

function NewReportModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (r: Omit<Report, "id" | "authorId" | "date" | "pages" | "sections" | "summary"> & { summary: string }) => void;
}) {
  const { user } = useApp();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<Report["type"]>("Board");
  const [period, setPeriod] = useState("Q4 2025");
  const [summary, setSummary] = useState("");

  React.useEffect(() => {
    if (open) {
      setTitle("");
      setType("Board");
      setPeriod("Q4 2025");
      setSummary("");
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Draft a report"
      subtitle="Reports are drafted from live plan data; AI can help fill the narrative."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            disabled={!title.trim()}
            onClick={() =>
              onCreate({
                title: title.trim(),
                type,
                period,
                status: "Draft",
                summary: summary.trim() || "Draft report — sections will be generated from current plan data.",
              })
            }
          >
            <IconPlus size={15} /> Create draft
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Report title">
          <Input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Board Summary — Q4 2025" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Type">
            <Select value={type} onChange={(e) => setType(e.target.value as Report["type"])}>
              {REPORT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </Field>
          <Field label="Period">
            <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
              {["Q4 2025", "Q1 2026", "Q2 2026", "FY 2025", "FY 2026", "H2 2025"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
          </Field>
          <Field label="Author">
            <Input value={user.name} disabled />
          </Field>
        </div>
        <Field label="Summary (shown on the cover)">
          <Input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="One or two sentences summarizing this report…" />
        </Field>
      </div>
    </Modal>
  );
}

function ReportPreview({ report, onClose }: { report: Report | null; onClose: () => void }) {
  const { toast, user } = useApp();
  if (!report) return null;
  const author = userById(report.authorId);

  return (
    <Drawer
      open={report !== null}
      onClose={onClose}
      title={report.title}
      subtitle={`${report.type} report · ${report.period} · ${report.pages} pages`}
      width="max-w-3xl"
      footer={
        <>
          <Button variant="outline" onClick={() => toast({ title: "Sent to print", description: "Print dialog opened for this report.", variant: "info" })}>
            <IconPrinter size={15} /> Print
          </Button>
          <Button onClick={() => toast({ title: "Export started", description: `“${report.title}” will download as PDF.`, variant: "success" })}>
            <IconDownload size={15} /> Export PDF
          </Button>
        </>
      }
    >
      {/* Cover */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white dark:border-stone-700">
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-widest text-emerald-100/80">
          <span>StrategyFlow · {report.period}</span>
          <span>{report.status}</span>
        </div>
        <h2 className="mt-6 text-xl font-bold leading-snug">{report.title}</h2>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-emerald-50/90">{report.summary}</p>
        <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-3 text-[11px]">
          <span className="inline-flex items-center gap-2">
            <Avatar name={author.name} color="bg-white/20" size="xs" />
            {author.name} · {author.title}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconCalendar size={12} /> {formatDate(report.date)} · {report.pages} pages
          </span>
        </div>
      </div>

      {/* Sections */}
      <div className="mt-5 space-y-5">
        {report.sections.map((s, i) => (
          <section key={i} className="rounded-xl border border-stone-200 p-5 dark:border-stone-800">
            <p className="flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-stone-50">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                {i + 1}
              </span>
              {s.heading}
            </p>
            {s.body && <p className="mt-2.5 text-[13px] leading-relaxed text-stone-600 dark:text-stone-300">{s.body}</p>}
            {s.bullets && (
              <ul className="mt-2.5 space-y-1.5">
                {s.bullets.map((b, bi) => (
                  <li key={bi} className="flex items-start gap-2 text-[13px] leading-relaxed text-stone-600 dark:text-stone-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <div className="rounded-xl border border-dashed border-stone-300 p-5 text-center text-xs text-stone-400 dark:border-stone-700">
          <IconSparkles size={16} className="mx-auto mb-1.5 text-violet-400" />
          AI note: this preview renders from live plan data. Export PDF for the full formatted document ({report.pages} pages).
        </div>
      </div>
    </Drawer>
  );
}
