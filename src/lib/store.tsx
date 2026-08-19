"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ACTIVITY,
  AI_CHAT_SEED,
  AI_RECS,
  COMMENTS,
  CURRENT_USER_ID,
  getAIReply,
  GOALS,
  INITIATIVES,
  MEETING_NOTES,
  NOTIFICATIONS,
  ORGS,
  REPORTS,
  RISKS,
  STAKEHOLDER_GROUPS,
  SURVEYS,
  SWOT,
  userById,
} from "./data";
import type {
  ActivityItem,
  AiMessage,
  Comment,
  Goal,
  Initiative,
  NotificationItem,
  Org,
  Report,
  Risk,
  Survey,
} from "./types";
import { cn, uid } from "./utils";

export type ToastVariant = "success" | "error" | "info" | "warning";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type AppContextValue = {
  // core
  org: Org;
  user: ReturnType<typeof userById>;
  theme: "light" | "dark";
  toggleTheme: () => void;
  switchOrg: (orgId: string) => void;
  // data
  goals: Goal[];
  initiatives: Initiative[];
  risks: Risk[];
  surveys: Survey[];
  notifications: NotificationItem[];
  activity: ActivityItem[];
  comments: Comment[];
  aiMessages: AiMessage[];
  reports: Report[];
  aiRecs: typeof AI_RECS;
  groups: typeof STAKEHOLDER_GROUPS;
  swot: typeof SWOT;
  meetingNotes: typeof MEETING_NOTES;
  // goal CRUD
  addGoal: (g: Omit<Goal, "id">) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  // initiative CRUD
  addInitiative: (i: Omit<Initiative, "id">) => void;
  updateInitiative: (id: string, patch: Partial<Initiative>) => void;
  deleteInitiative: (id: string) => void;
  // risk CRUD
  addRisk: (r: Omit<Risk, "id">) => void;
  updateRisk: (id: string, patch: Partial<Risk>) => void;
  deleteRisk: (id: string) => void;
  // survey
  addSurvey: (s: Omit<Survey, "id">) => void;
  updateSurvey: (id: string, patch: Partial<Survey>) => void;
  deleteSurvey: (id: string) => void;
  // notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  // activity
  pushActivity: (a: Omit<ActivityItem, "id" | "time" | "actorId">) => void;
  // comments
  addComment: (targetId: string, text: string) => void;
  // AI
  sendAiMessage: (text: string) => void;
  // toasts
  toast: (t: Omit<Toast, "id">) => void;
  toasts: Toast[];
  dismissToast: (id: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

const toastStyles: Record<ToastVariant, string> = {
  success:
    "border-emerald-200 bg-white text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950 dark:text-emerald-100",
  error:
    "border-rose-200 bg-white text-rose-900 dark:border-rose-800/60 dark:bg-rose-950 dark:text-rose-100",
  info: "border-sky-200 bg-white text-sky-900 dark:border-sky-800/60 dark:bg-sky-950 dark:text-sky-100",
  warning:
    "border-amber-200 bg-white text-amber-900 dark:border-amber-800/60 dark:bg-amber-950 dark:text-amber-100",
};

const toastDot: Record<ToastVariant, string> = {
  success: "bg-emerald-500",
  error: "bg-rose-500",
  info: "bg-sky-500",
  warning: "bg-amber-500",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [orgId, setOrgId] = useState<string>(ORGS[0]!.id);
  const [goals, setGoals] = useState<Goal[]>(GOALS);
  const [initiatives, setInitiatives] = useState<Initiative[]>(INITIATIVES);
  const [risks, setRisks] = useState<Risk[]>(RISKS);
  const [surveys, setSurveys] = useState<Survey[]>(SURVEYS);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(NOTIFICATIONS);
  const [activity, setActivity] = useState<ActivityItem[]>(ACTIVITY);
  const [comments, setComments] = useState<Comment[]>(COMMENTS);
  const [aiMessages, setAiMessages] = useState<AiMessage[]>(AI_CHAT_SEED);
  const [reports, setReports] = useState<Report[]>(REPORTS);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const org = useMemo(() => ORGS.find((o) => o.id === orgId) ?? ORGS[0]!, [orgId]);
  const user = useMemo(() => userById(CURRENT_USER_ID), []);

  /* theme ------------------------------------------------------------ */
  useEffect(() => {
    const stored = localStorage.getItem("sf-theme");
    const initial = stored === "dark" ? "dark" : "light";
    setTheme(initial);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("sf-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  /* toasts ----------------------------------------------------------- */
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = uid("toast");
      setToasts((prev) => [...prev.slice(-4), { ...t, id }]);
      window.setTimeout(() => dismissToast(id), 4200);
    },
    [dismissToast]
  );

  /* org switching ---------------------------------------------------- */
  const switchOrg = useCallback(
    (id: string) => {
      setOrgId(id);
      toast({
        title: `Switched workspace`,
        description: `You are now viewing ${ORGS.find((o) => o.id === id)?.name}.`,
        variant: "success",
      });
    },
    [toast]
  );

  /* activity + notifications helpers --------------------------------- */
  const pushActivity = useCallback(
    (a: Omit<ActivityItem, "id" | "time" | "actorId">) => {
      setActivity((prev) => [
        {
          ...a,
          id: uid("act"),
          actorId: CURRENT_USER_ID,
          time: new Date().toISOString(),
        },
        ...prev,
      ]);
    },
    []
  );

  const notify = useCallback((title: string, description?: string, type: NotificationItem["type"] = "info") => {
    setNotifications((prev) => [
      { id: uid("n"), title, description, time: new Date().toISOString(), type, read: false },
      ...prev,
    ]);
  }, []);

  /* goal CRUD -------------------------------------------------------- */
  const addGoal = useCallback(
    (g: Omit<Goal, "id">) => {
      const id = uid("g");
      setGoals((prev) => [{ ...g, id }, ...prev]);
      pushActivity({ verb: "created", target: `goal “${g.title}”`, type: "goal" });
      notify(`Goal created`, `“${g.title}” was added to the ${org.planPeriod} plan.`, "success");
    },
    [notify, org.planPeriod, pushActivity]
  );

  const updateGoal = useCallback(
    (id: string, patch: Partial<Goal>) => {
      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
    },
    []
  );

  const deleteGoal = useCallback(
    (id: string) => {
      const goal = goals.find((g) => g.id === id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
      if (goal) {
        pushActivity({ verb: "deleted", target: `goal “${goal.title}”`, type: "goal" });
        toast({ title: "Goal deleted", description: `“${goal.title}” was removed.`, variant: "info" });
      }
    },
    [goals, pushActivity, toast]
  );

  /* initiative CRUD -------------------------------------------------- */
  const addInitiative = useCallback(
    (i: Omit<Initiative, "id">) => {
      const id = uid("i");
      setInitiatives((prev) => [{ ...i, id }, ...prev]);
      // link to goal
      setGoals((prev) =>
        prev.map((g) =>
          g.id === i.goalId ? { ...g, initiativeIds: [id, ...g.initiativeIds] } : g
        )
      );
      pushActivity({ verb: "created", target: `initiative “${i.title}”`, type: "initiative" });
      notify(`Initiative created`, `“${i.title}” was added.`, "success");
    },
    [notify, pushActivity]
  );

  const updateInitiative = useCallback(
    (id: string, patch: Partial<Initiative>) => {
      setInitiatives((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...patch } : i))
      );
    },
    []
  );

  const deleteInitiative = useCallback(
    (id: string) => {
      const init = initiatives.find((i) => i.id === id);
      setInitiatives((prev) => prev.filter((i) => i.id !== id));
      if (init) {
        setGoals((prev) =>
          prev.map((g) => ({
            ...g,
            initiativeIds: g.initiativeIds.filter((x) => x !== id),
          }))
        );
        pushActivity({ verb: "deleted", target: `initiative “${init.title}”`, type: "initiative" });
        toast({ title: "Initiative deleted", description: `“${init.title}” was removed.`, variant: "info" });
      }
    },
    [initiatives, pushActivity, toast]
  );

  /* risk CRUD -------------------------------------------------------- */
  const addRisk = useCallback(
    (r: Omit<Risk, "id">) => {
      const id = uid("r");
      setRisks((prev) => [{ ...r, id }, ...prev]);
      pushActivity({ verb: "added", target: `risk “${r.title}”`, type: "risk" });
      notify(`Risk added`, `“${r.title}” (score ${r.score}) added to the register.`, "warning");
    },
    [notify, pushActivity]
  );

  const updateRisk = useCallback((id: string, patch: Partial<Risk>) => {
    setRisks((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const deleteRisk = useCallback(
    (id: string) => {
      const risk = risks.find((r) => r.id === id);
      setRisks((prev) => prev.filter((r) => r.id !== id));
      if (risk) {
        pushActivity({ verb: "removed", target: `risk “${risk.title}”`, type: "risk" });
        toast({ title: "Risk removed", description: `“${risk.title}” was deleted.`, variant: "info" });
      }
    },
    [risks, pushActivity, toast]
  );

  /* survey CRUD ------------------------------------------------------ */
  const addSurvey = useCallback(
    (s: Omit<Survey, "id">) => {
      const id = uid("s");
      setSurveys((prev) => [{ ...s, id }, ...prev]);
      pushActivity({ verb: "created", target: `survey “${s.title}”`, type: "survey" });
      toast({ title: "Survey created", description: `“${s.title}” is ready to publish.`, variant: "success" });
    },
    [pushActivity, toast]
  );

  const updateSurvey = useCallback((id: string, patch: Partial<Survey>) => {
    setSurveys((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const deleteSurvey = useCallback(
    (id: string) => {
      const survey = surveys.find((s) => s.id === id);
      setSurveys((prev) => prev.filter((s) => s.id !== id));
      if (survey) {
        pushActivity({ verb: "deleted", target: `survey “${survey.title}”`, type: "survey" });
        toast({ title: "Survey deleted", description: `“${survey.title}” was removed.`, variant: "info" });
      }
    },
    [surveys, pushActivity, toast]
  );

  /* notifications ---------------------------------------------------- */
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  /* comments --------------------------------------------------------- */
  const addComment = useCallback(
    (targetId: string, text: string) => {
      setComments((prev) => [
        {
          id: uid("c"),
          targetId,
          authorId: CURRENT_USER_ID,
          text,
          time: new Date().toISOString(),
        },
        ...prev,
      ]);
      pushActivity({ verb: "commented on", target: `an item in the plan`, type: "comment" });
      toast({ title: "Comment added", description: "Your comment was posted.", variant: "success" });
    },
    [pushActivity, toast]
  );

  /* AI chat ---------------------------------------------------------- */
  const sendAiMessage = useCallback((text: string) => {
    const userMsg: AiMessage = {
      id: uid("ai"),
      role: "user",
      text,
      time: new Date().toISOString(),
    };
    setAiMessages((prev) => [...prev, userMsg]);
    window.setTimeout(() => {
      const reply: AiMessage = {
        id: uid("ai"),
        role: "assistant",
        text: getAIReply(text),
        time: new Date().toISOString(),
      };
      setAiMessages((prev) => [...prev, reply]);
    }, 1100);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      org,
      user,
      theme,
      toggleTheme,
      switchOrg,
      goals,
      initiatives,
      risks,
      surveys,
      notifications,
      activity,
      comments,
      aiMessages,
      reports,
      aiRecs: AI_RECS,
      groups: STAKEHOLDER_GROUPS,
      swot: SWOT,
      meetingNotes: MEETING_NOTES,
      addGoal,
      updateGoal,
      deleteGoal,
      addInitiative,
      updateInitiative,
      deleteInitiative,
      addRisk,
      updateRisk,
      deleteRisk,
      addSurvey,
      updateSurvey,
      deleteSurvey,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      pushActivity,
      addComment,
      sendAiMessage,
      toast,
      toasts,
      dismissToast,
    }),
    [
      org,
      user,
      theme,
      toggleTheme,
      switchOrg,
      goals,
      initiatives,
      risks,
      surveys,
      notifications,
      activity,
      comments,
      aiMessages,
      reports,
      addGoal,
      updateGoal,
      deleteGoal,
      addInitiative,
      updateInitiative,
      deleteInitiative,
      addRisk,
      updateRisk,
      deleteRisk,
      addSurvey,
      updateSurvey,
      deleteSurvey,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      pushActivity,
      addComment,
      sendAiMessage,
      toast,
      toasts,
      dismissToast,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      {/* Toast viewport */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto animate-toast-in flex items-start gap-3 rounded-xl border p-3.5 shadow-lg shadow-stone-900/5",
              toastStyles[t.variant]
            )}
          >
            <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", toastDot[t.variant])} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-xs leading-relaxed opacity-80">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="rounded-md p-1 opacity-50 transition hover:opacity-100"
              aria-label="Dismiss"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
