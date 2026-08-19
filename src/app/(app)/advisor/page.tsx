"use client";

import React, { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/store";
import { AI_STARTER_MESSAGES, userById } from "@/lib/data";
import { Avatar, Badge, Button, Card, CardBody, CardHeader, PageHeader, Tooltip } from "@/components/ui";
import {
  IconBot,
  IconCheck,
  IconClock,
  IconFileText,
  IconSend,
  IconSparkles,
  IconThumbsUp,
  IconZap,
} from "@/lib/icons";
import { cn, timeAgo } from "@/lib/utils";

export default function AdvisorPage() {
  const { aiMessages, sendAiMessage, aiRecs, pushActivity, toast, user, reports } = useApp();
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const send = (text: string) => {
    const t = text.trim();
    if (!t || thinking) return;
    sendAiMessage(t);
    setInput("");
    setThinking(true);
    window.setTimeout(() => setThinking(false), 1350);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [aiMessages, thinking]);

  const applyRec = (id: string, title: string) => {
    if (applied.has(id)) return;
    setApplied((prev) => new Set(prev).add(id));
    pushActivity({ verb: "applied", target: `AI recommendation “${title}”`, type: "ai" });
    toast({ title: "Recommendation applied", description: `“${title}” was added to the action log.`, variant: "success" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="AI Advisor"
        subtitle="Your strategy copilot — reads your plan, risks, surveys and reports, and turns them into action."
        actions={
          <Badge tone="violet" className="px-2.5 py-1">
            <IconSparkles size={12} /> Strategy advisor · 2025–2027 plan
          </Badge>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        {/* Chat */}
        <Card className="flex flex-col xl:col-span-2">
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                  <IconBot size={15} />
                </span>
                StrategyFlow Advisor
              </span>
            }
            subtitle="Contextual to GreenFuture Foundation's live plan data"
            action={<span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"><span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-500" /> Online</span>}
          />
          <CardBody className="flex min-h-[520px] flex-col p-0">
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5" style={{ maxHeight: 520 }}>
              {aiMessages.map((m) => (
                <ChatBubble key={m.id} role={m.role} text={m.text} time={m.time} userName={user.name} userColor={user.color} />
              ))}
              {thinking && <TypingBubble />}
            </div>

            {/* Starter prompts */}
            {aiMessages.length <= 1 && (
              <div className="px-5 pb-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">Try asking</p>
                <div className="flex flex-wrap gap-2">
                  {AI_STARTER_MESSAGES.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-stone-100 p-4 dark:border-stone-800">
              <div className="flex items-end gap-2 rounded-xl border border-stone-200 bg-stone-50 p-2 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-stone-700 dark:bg-stone-800">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  rows={1}
                  placeholder="Ask about your plan, risks, donors, programs…"
                  className="max-h-32 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none dark:text-stone-100"
                />
                <Button onClick={() => send(input)} disabled={!input.trim() || thinking} className="shrink-0">
                  <IconSend size={15} />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </div>
              <p className="mt-2 text-[10px] text-stone-400">
                AI suggestions are generated from your live plan data. Review before acting — the advisor never edits without your approval.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Right rail */}
        <div className="space-y-4">
          {/* Recommendations */}
          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <IconSparkles size={15} className="text-violet-500" /> Recommendations
                </span>
              }
              subtitle="Ranked by expected impact"
            />
            <CardBody className="pt-2">
              <ul className="space-y-3">
                {aiRecs.map((r) => (
                  <li key={r.id} className="rounded-xl border border-stone-100 p-3.5 transition-colors hover:border-violet-200 dark:border-stone-800 dark:hover:border-violet-500/30">
                    <div className="flex items-center gap-2">
                      <Badge tone={r.impact === "High" ? "rose" : r.impact === "Medium" ? "amber" : "sky"}>{r.impact} impact</Badge>
                      <Badge tone="stone">{r.effort} effort</Badge>
                    </div>
                    <p className="mt-2 text-[13px] font-semibold leading-snug text-stone-900 dark:text-stone-50">{r.title}</p>
                    <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-stone-500 dark:text-stone-400">{r.body}</p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <Badge tone="violet" className="bg-transparent ring-violet-500/30 dark:bg-transparent">{r.category}</Badge>
                      <button
                        onClick={() => applyRec(r.id, r.title)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors",
                          applied.has(r.id)
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                            : "bg-stone-900 text-white hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
                        )}
                      >
                        {applied.has(r.id) ? <IconCheck size={12} /> : <IconZap size={12} />}
                        {applied.has(r.id) ? "Applied" : "Apply"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Document summaries */}
          <Card>
            <CardHeader title={<span className="flex items-center gap-2"><IconFileText size={15} className="text-sky-500" /> Document summaries</span>} subtitle="Recently analyzed" />
            <CardBody className="pt-2">
              <ul className="space-y-2.5">
                {reports.slice(0, 4).map((r) => (
                  <li key={r.id} className="rounded-lg border border-stone-100 p-3 dark:border-stone-800">
                    <p className="text-xs font-semibold text-stone-800 dark:text-stone-100">{r.title}</p>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-stone-500 dark:text-stone-400">{r.summary}</p>
                    <p className="mt-1.5 text-[10px] text-stone-400">{r.period} · {r.pages} pages · summarized by AI</p>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Follow-up reminders */}
          <Card>
            <CardHeader title={<span className="flex items-center gap-2"><IconClock size={15} className="text-amber-500" /> Follow-up reminders</span>} />
            <CardBody className="pt-2">
              <ul className="space-y-2">
                {[
                  { text: "Approve renewal-push creative", when: "Due in 3 days", by: "Sarah" },
                  { text: "Decision: Phoenix offer band", when: "Due Friday", by: "Michael" },
                  { text: "Publish Donor Survey analysis", when: "Recommended this week", by: "Nina" },
                ].map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 rounded-lg border border-dashed border-stone-200 p-3 dark:border-stone-700">
                    <IconClock size={14} className="mt-0.5 shrink-0 text-amber-500" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-stone-700 dark:text-stone-200">{r.text}</p>
                      <p className="text-[10px] text-stone-400">{r.when} · from {r.by}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({
  role,
  text,
  time,
  userName,
  userColor,
}: {
  role: "user" | "assistant";
  text: string;
  time: string;
  userName: string;
  userColor: string;
}) {
  const isUser = role === "user";
  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      {isUser ? (
        <Avatar name={userName} color={userColor} size="sm" />
      ) : (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm">
          <IconBot size={14} />
        </span>
      )}
      <div className={cn("max-w-[82%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed", isUser ? "rounded-tr-sm bg-emerald-600 text-white" : "rounded-tl-sm border border-stone-200 bg-stone-50 text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200")}>
        {text.split("\n").map((line, i) => (
          <p key={i} className={cn(line.trim() === "" && "h-2", line.trim() !== "" && "mb-1 last:mb-0")}>
            {renderInline(line)}
          </p>
        ))}
        <p className={cn("mt-1.5 text-[10px]", isUser ? "text-emerald-100/80" : "text-stone-400")}>{timeAgo(time)}</p>
      </div>
    </div>
  );
}

function renderInline(line: string) {
  if (line.trim() === "") return null;
  // bold "• ..." bullets
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm">
        <IconBot size={14} />
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-stone-200 bg-stone-50 px-4 py-3.5 dark:border-stone-700 dark:bg-stone-800">
        <span className="h-1.5 w-1.5 animate-typing rounded-full bg-stone-400" />
        <span className="h-1.5 w-1.5 animate-typing rounded-full bg-stone-400" style={{ animationDelay: "0.15s" }} />
        <span className="h-1.5 w-1.5 animate-typing rounded-full bg-stone-400" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>
  );
}
