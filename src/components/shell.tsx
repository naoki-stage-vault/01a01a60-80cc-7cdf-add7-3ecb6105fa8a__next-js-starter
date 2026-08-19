"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import { ORGS, userById } from "@/lib/data";
import {
  IconBell,
  IconBot,
  IconBuilding,
  IconChevronDown,
  IconDashboard,
  IconFileText,
  IconHelp,
  IconMenu,
  IconMoon,
  IconPlus,
  IconSearch,
  IconSettings,
  IconShield,
  IconSparkles,
  IconSun,
  IconTarget,
  IconTrendingUp,
  IconUsers,
  IconX,
  IconZap,
  IconLogout,
} from "@/lib/icons";
import { Avatar, Badge, Kbd, Tooltip } from "@/components/ui";
import { cn, timeAgo } from "@/lib/utils";

const NAV_SECTIONS: {
  label: string;
  items: { href: string; label: string; icon: React.ReactNode; match?: string[] }[];
}[] = [
  {
    label: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: <IconDashboard size={17} />, match: ["/"] },
    ],
  },
  {
    label: "Strategy",
    items: [
      { href: "/plan", label: "Strategic Plan", icon: <IconTarget size={17} /> },
      { href: "/stakeholders", label: "Stakeholders", icon: <IconUsers size={17} /> },
      { href: "/risks", label: "Risk Management", icon: <IconShield size={17} /> },
      { href: "/progress", label: "Progress Tracking", icon: <IconTrendingUp size={17} /> },
    ],
  },
  {
    label: "Insights",
    items: [
      { href: "/reports", label: "Reports", icon: <IconFileText size={17} /> },
      { href: "/advisor", label: "AI Advisor", icon: <IconSparkles size={17} /> },
    ],
  },
  {
    label: "Workspace",
    items: [
      { href: "/settings", label: "Settings", icon: <IconSettings size={17} /> },
    ],
  },
];

const QUICK_ACTIONS: { label: string; desc: string; href: string }[] = [
  { label: "New goal", desc: "Add a strategic goal", href: "/plan?action=new-goal" },
  { label: "New initiative", desc: "Add an initiative", href: "/plan?action=new-initiative" },
  { label: "Log risk", desc: "Add to risk register", href: "/risks?action=new-risk" },
  { label: "Create survey", desc: "Stakeholder survey", href: "/stakeholders?action=new-survey" },
  { label: "Draft report", desc: "Start a report", href: "/reports?action=new-report" },
  { label: "Ask AI advisor", desc: "Open assistant", href: "/advisor" },
];

function OrgSwitcher() {
  const { org, switchOrg } = useApp();
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
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
      >
        <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white", org.color)}>
          {org.initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-stone-900 dark:text-stone-50">
            {org.name}
          </span>
          <span className="block truncate text-[11px] text-stone-500 dark:text-stone-400">
            {org.planPeriod} plan
          </span>
        </span>
        <IconChevronDown size={14} className="shrink-0 text-stone-400" />
      </button>
      {open && (
        <div className="absolute left-2 right-2 top-full z-50 mt-1 animate-scale-in overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl shadow-stone-900/5 dark:border-stone-700 dark:bg-stone-800">
          <p className="px-3.5 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-wide text-stone-400">
            Switch workspace
          </p>
          {ORGS.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                switchOrg(o.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors hover:bg-stone-50 dark:hover:bg-stone-700/50",
                o.id === org.id && "bg-emerald-50/60 dark:bg-emerald-500/10"
              )}
            >
              <span className={cn("flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold text-white", o.color)}>
                {o.initials}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-stone-800 dark:text-stone-100">{o.name}</span>
                <span className="block truncate text-[10px] text-stone-400">{o.sector}</span>
              </span>
              {o.id === org.id && (
                <span className="ml-auto text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Active</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useApp();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose]);

  const unread = notifications.filter((n) => !n.read).length;
  const toneMap = {
    info: "bg-sky-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-rose-500",
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => (open ? onClose() : undefined)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50"
        aria-label="Notifications"
      >
        <IconBell size={18} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[360px] max-w-[calc(100vw-2rem)] animate-scale-in overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xl shadow-stone-900/10 dark:border-stone-700 dark:bg-stone-800">
          <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3 dark:border-stone-700">
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">
              Notifications
              {unread > 0 && (
                <span className="ml-2 rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                  {unread} new
                </span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={markAllNotificationsRead} className="text-[11px] font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
                Mark all read
              </button>
              <button onClick={clearNotifications} className="text-[11px] font-medium text-stone-400 hover:text-stone-600 dark:hover:text-stone-300">
                Clear
              </button>
            </div>
          </div>
          <div className="max-h-[380px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <IconBell size={22} className="mx-auto mb-2 text-stone-300 dark:text-stone-600" />
                <p className="text-xs font-medium text-stone-500 dark:text-stone-400">You're all caught up</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-stone-50 px-4 py-3 text-left transition-colors hover:bg-stone-50 dark:border-stone-700/60 dark:hover:bg-stone-700/40",
                    !n.read && "bg-emerald-50/40 dark:bg-emerald-500/5"
                  )}
                >
                  <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", toneMap[n.type])} />
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-[13px] leading-snug", n.read ? "font-medium text-stone-600 dark:text-stone-300" : "font-semibold text-stone-900 dark:text-stone-50")}>
                      {n.title}
                    </span>
                    {n.description && (
                      <span className="mt-0.5 block text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                        {n.description}
                      </span>
                    )}
                    <span className="mt-1 block text-[10px] text-stone-400">{timeAgo(n.time)}</span>
                  </span>
                  {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { goals } = useApp();

  useEffect(() => {
    if (open) {
      setQ("");
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const ql = q.toLowerCase();
  const navResults = NAV_SECTIONS.flatMap((s) =>
    s.items
      .filter((i) => i.label.toLowerCase().includes(ql) || s.label.toLowerCase().includes(ql))
      .map((i) => ({ ...i, section: s.label }))
  );
  const goalResults = goals
    .filter((g) => g.title.toLowerCase().includes(ql) || g.pillar.toLowerCase().includes(ql))
    .slice(0, 4)
    .map((g) => ({ label: g.title, section: g.pillar, href: `/plan?goal=${g.id}` }));
  const actionResults = QUICK_ACTIONS.filter((a) => a.label.toLowerCase().includes(ql) || a.desc.toLowerCase().includes(ql));

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center p-4 pt-[12vh]">
      <div className="absolute inset-0 animate-fade-in bg-stone-950/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-xl animate-scale-in overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl dark:border-stone-700 dark:bg-stone-800">
        <div className="flex items-center gap-3 border-b border-stone-100 px-4 dark:border-stone-700">
          <IconSearch size={17} className="text-stone-400" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pages, goals, actions…"
            className="h-13 flex-1 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none dark:text-stone-100"
          />
          <Kbd>esc</Kbd>
        </div>
        <div className="max-h-[380px] overflow-y-auto p-2">
          {navResults.length === 0 && goalResults.length === 0 && actionResults.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-stone-400">No results for “{q}”</div>
          )}
          {navResults.length > 0 && (
            <ResultGroup label="Navigate">
              {navResults.map((r) => (
                <ResultRow key={r.href} icon={r.icon} label={r.label} sub={r.section} onPick={() => { onClose(); location.href = r.href; }} />
              ))}
            </ResultGroup>
          )}
          {goalResults.length > 0 && (
            <ResultGroup label="Goals">
              {goalResults.map((r) => (
                <ResultRow key={r.href} icon={<IconTarget size={15} />} label={r.label} sub={r.section} onPick={() => { onClose(); location.href = r.href; }} />
              ))}
            </ResultGroup>
          )}
          {actionResults.length > 0 && (
            <ResultGroup label="Quick actions">
              {actionResults.map((r) => (
                <ResultRow key={r.label} icon={<IconZap size={15} />} label={r.label} sub={r.desc} onPick={() => { onClose(); location.href = r.href; }} />
              ))}
            </ResultGroup>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-stone-400">{label}</p>
      {children}
    </div>
  );
}

function ResultRow({
  icon,
  label,
  sub,
  onPick,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  onPick: () => void;
}) {
  return (
    <button
      onClick={onPick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-stone-100 dark:hover:bg-stone-700/60"
    >
      <span className="text-stone-400">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-stone-800 dark:text-stone-100">{label}</span>
        <span className="block truncate text-[11px] text-stone-400">{sub}</span>
      </span>
    </button>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const { org, user, theme, toggleTheme, toast } = useApp();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const currentUser = useMemo(() => userById(user.id), [user.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [userMenuOpen]);

  useEffect(() => {
    setSidebarOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  const isActive = (href: string, match?: string[]) => {
    if (match) return match.some((m) => pathname === m);
    return pathname === href || pathname.startsWith(href + "/");
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 pb-4 pt-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-900/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.9 4.9l2.9 2.9M16.2 16.2l2.9 2.9M2 12h4M18 12h4" />
            <circle cx="12" cy="12" r="3.5" />
          </svg>
        </span>
        <div>
          <p className="text-[15px] font-bold tracking-tight text-stone-900 dark:text-white">
            Strategy<span className="text-emerald-600 dark:text-emerald-400">Flow</span>
          </p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">Strategic execution</p>
        </div>
      </div>

      <div className="px-3 pb-2">
        <OrgSwitcher />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href, item.match);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                        active
                          ? "bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                          : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50"
                      )}
                    >
                      <span className={cn(active ? "text-emerald-600 dark:text-emerald-400" : "text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300")}>
                        {item.icon}
                      </span>
                      {item.label}
                      {item.href === "/advisor" && (
                        <span className="ml-auto flex h-4 items-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-1.5 text-[8px] font-bold uppercase tracking-wide text-white">
                          AI
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-stone-100 p-3 dark:border-stone-800">
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-3.5 dark:from-emerald-500/10 dark:to-teal-500/10">
          <div className="flex items-center gap-2">
            <IconBot size={16} className="text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">Strategy health</p>
          </div>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-2xl font-bold tracking-tight text-emerald-900 dark:text-emerald-200">78</p>
            <p className="text-[10px] font-medium text-emerald-700/80 dark:text-emerald-400/80">▲ 4 pts vs Q2</p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-900/10 dark:bg-white/10">
            <div className="h-full w-[78%] rounded-full bg-emerald-500" />
          </div>
        </div>
        <button
          onClick={() => setPaletteOpen(true)}
          className="mt-3 flex w-full items-center gap-2 rounded-lg border border-stone-200 px-2.5 py-2 text-xs text-stone-400 transition-colors hover:border-stone-300 hover:text-stone-600 dark:border-stone-700 dark:hover:border-stone-600"
        >
          <IconSearch size={14} />
          <span className="flex-1 text-left">Search anything…</span>
          <Kbd>⌘K</Kbd>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50 dark:bg-stone-950">
      {/* Desktop sidebar */}
      <aside className="hidden w-[248px] shrink-0 border-r border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 lg:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-stone-950/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[272px] animate-fade-in bg-white shadow-2xl dark:bg-stone-900>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Close menu"
            >
              <IconX size={18} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-stone-200 bg-white/80 px-4 backdrop-blur dark:border-stone-800 dark:bg-stone-900/80 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 lg:hidden"
            aria-label="Open menu"
          >
            <IconMenu size={19} />
          </button>

          <div className="hidden items-center gap-2 md:flex">
            <span className={cn("flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold text-white", org.color)}>
              {org.initials}
            </span>
            <div className="leading-tight">
              <p className="text-[13px] font-semibold text-stone-900 dark:text-stone-50">{org.name}</p>
              <p className="text-[10px] text-stone-400">Strategic plan · {org.planPeriod}</p>
            </div>
          </div>

          <button
            onClick={() => setPaletteOpen(true)}
            className="ml-auto hidden h-9 w-64 items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 text-left text-xs text-stone-400 transition-colors hover:border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:hover:border-stone-600 sm:flex"
          >
            <IconSearch size={14} />
            <span className="flex-1">Search…</span>
            <Kbd>⌘K</Kbd>
          </button>

          <div className="ml-auto flex items-center gap-1 sm:ml-0">
            <Tooltip label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
              <button
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <IconSun size={17} /> : <IconMoon size={17} />}
              </button>
            </Tooltip>
            <div onClick={() => { setNotifOpen((o) => !o); setUserMenuOpen(false); }}>
              <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>
            <div ref={userMenuRef} className="relative ml-1">
              <button
                onClick={() => { setUserMenuOpen((o) => !o); setNotifOpen(false); }}
                className="flex items-center gap-2 rounded-lg p-1 pr-1.5 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <Avatar name={currentUser.name} color={currentUser.color} size="sm" />
                <span className="hidden text-left leading-tight xl:block">
                  <span className="block text-xs font-semibold text-stone-800 dark:text-stone-100">{currentUser.name}</span>
                  <span className="block text-[10px] text-stone-400">{currentUser.title}</span>
                </span>
                <IconChevronDown size={13} className="hidden text-stone-400 xl:block" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-1.5 w-60 animate-scale-in overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-xl shadow-stone-900/5 dark:border-stone-700 dark:bg-stone-800">
                  <div className="border-b border-stone-100 px-4 py-3 dark:border-stone-700">
                    <p className="text-[13px] font-semibold text-stone-900 dark:text-stone-50">{currentUser.name}</p>
                    <p className="text-[11px] text-stone-400">{currentUser.email}</p>
                    <Badge tone="emerald" className="mt-1.5">{currentUser.role}</Badge>
                  </div>
                  <button
                    onClick={() => { setUserMenuOpen(false); location.href = "/settings"; }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-medium text-stone-700 hover:bg-stone-50 dark:text-stone-200 dark:hover:bg-stone-700/50"
                  >
                    <IconSettings size={15} className="text-stone-400" /> Workspace settings
                  </button>
                  <button
                    onClick={() => { setUserMenuOpen(false); location.href = "/advisor"; }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-medium text-stone-700 hover:bg-stone-50 dark:text-stone-200 dark:hover:bg-stone-700/50"
                  >
                    <IconHelp size={15} className="text-stone-400" /> Help & AI assistant
                  </button>
                  <button
                    onClick={() => { setUserMenuOpen(false); location.href = "/settings"; }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-medium text-stone-700 hover:bg-stone-50 dark:text-stone-200 dark:hover:bg-stone-700/50"
                  >
                    <IconBuilding size={15} className="text-stone-400" /> Organization settings
                  </button>
                  <div className="my-1 border-t border-stone-100 dark:border-stone-700" />
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      toast({ title: "Demo mode", description: "Sign-out is disabled in this prototype — there is no auth.", variant: "info" });
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  >
                    <IconLogout size={15} /> Sign out (demo)
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
