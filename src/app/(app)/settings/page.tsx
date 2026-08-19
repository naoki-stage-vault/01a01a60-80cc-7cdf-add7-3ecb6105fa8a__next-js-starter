"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { ORGS, USERS, userById } from "@/lib/data";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Field,
  Input,
  PageHeader,
  Select,
  Toggle,
} from "@/components/ui";
import {
  IconBell,
  IconBuilding,
  IconCheck,
  IconMail,
  IconPencil,
  IconShield,
  IconSparkles,
  IconUser,
  IconUsers,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

const SETTING_SECTIONS = [
  { id: "profile", label: "Profile", icon: <IconUser size={16} /> },
  { id: "organization", label: "Organization", icon: <IconBuilding size={16} /> },
  { id: "team", label: "Team & roles", icon: <IconUsers size={16} /> },
  { id: "notifications", label: "Notifications", icon: <IconBell size={16} /> },
  { id: "ai", label: "AI & workspace", icon: <IconSparkles size={16} /> },
] as const;

type SectionId = (typeof SETTING_SECTIONS)[number]["id"];

export default function SettingsPage() {
  const { user, updateProfile, org, updateOrg, notifications, toast } = useApp();
  const [section, setSection] = useState<SectionId>("profile");
  const [profile, setProfile] = useState({ name: user.name, title: user.title, email: user.email, phone: "415-555-0134" });
  const [orgForm, setOrgForm] = useState({ name: org.name, sector: org.sector, mission: org.mission, website: "greenfuture.org", email: "hello@greenfuture.org", phone: "415-555-0100" });

  const saveProfile = () => {
    updateProfile({ name: profile.name, title: profile.title });
    toast({ title: "Profile saved", description: "Your changes are live.", variant: "success" });
  };

  const saveOrg = () => {
    updateOrg({ name: orgForm.name, sector: orgForm.sector, mission: orgForm.mission });
    toast({ title: "Organization updated", description: "Workspace details saved.", variant: "success" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Settings" subtitle="Workspace, team, notifications and AI preferences." />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Section nav */}
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {SETTING_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                section === s.id
                  ? "bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                  : "text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
              )}
            >
              <span className={section === s.id ? "text-emerald-600 dark:text-emerald-400" : "text-stone-400"}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>

        <div className="space-y-4">
          {section === "profile" && (
            <Card>
              <CardHeader title="Profile" subtitle="How you appear across the workspace" />
              <CardBody className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar name={profile.name || user.name} color={user.color} size="lg" />
                  <div>
                    <Button variant="outline" size="sm"><IconPencil size={13} /> Change avatar</Button>
                    <p className="mt-1.5 text-[11px] text-stone-400">Avatars are auto-generated from your name.</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name">
                    <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </Field>
                  <Field label="Job title">
                    <Input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} />
                  </Field>
                  <Field label="Email">
                    <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} type="email" />
                  </Field>
                  <Field label="Phone">
                    <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  </Field>
                </div>
                <div className="flex justify-end border-t border-stone-100 pt-4 dark:border-stone-800">
                  <Button onClick={saveProfile}>Save changes</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {section === "organization" && (
            <Card>
              <CardHeader title="Organization" subtitle="Details shown on reports and the board portal" />
              <CardBody className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-4 dark:bg-stone-800/60">
                  <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white", org.color)}>
                    {org.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">{org.name}</p>
                    <p className="text-xs text-stone-400">{org.sector} · founded {org.founded}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Organization name">
                    <Input value={orgForm.name} onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })} />
                  </Field>
                  <Field label="Sector">
                    <Select value={orgForm.sector} onChange={(e) => setOrgForm({ ...orgForm, sector: e.target.value })}>
                      {["Environment & conservation", "Youth development", "Education", "Community development", "Public health", "Arts & culture"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <Field label="Mission statement">
                  <textarea
                    value={orgForm.mission}
                    onChange={(e) => setOrgForm({ ...orgForm, mission: e.target.value })}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Website">
                    <Input value={orgForm.website} onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })} />
                  </Field>
                  <Field label="Contact email">
                    <Input value={orgForm.email} onChange={(e) => setOrgForm({ ...orgForm, email: e.target.value })} />
                  </Field>
                  <Field label="Phone">
                    <Input value={orgForm.phone} onChange={(e) => setOrgForm({ ...orgForm, phone: e.target.value })} />
                  </Field>
                </div>
                <div className="flex justify-end border-t border-stone-100 pt-4 dark:border-stone-800">
                  <Button onClick={saveOrg}>Save changes</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {section === "team" && <TeamSection />}

          {section === "notifications" && (
            <Card>
              <CardHeader title="Notifications" subtitle="What lands in your inbox and the bell" />
              <CardBody>
                <SettingRow
                  icon={<IconMail size={15} />}
                  title="Weekly strategy digest"
                  desc="Goal progress, risks and milestones every Monday"
                  defaultOn
                />
                <SettingRow
                  icon={<IconBell size={15} />}
                  title="Risk alerts"
                  desc="Immediate notification when a risk score changes"
                  defaultOn
                />
                <SettingRow
                  icon={<IconShield size={15} />}
                  title="Milestone reminders"
                  desc="7 days before a milestone is due"
                  defaultOn
                />
                <SettingRow
                  icon={<IconSparkles size={15} />}
                  title="AI recommendation digest"
                  desc="Weekly summary of new advisor suggestions"
                />
                <SettingRow
                  icon={<IconUsers size={15} />}
                  title="Mentions & comments"
                  desc="When someone mentions you or replies"
                  defaultOn
                />
              </CardBody>
            </Card>
          )}

          {section === "ai" && (
            <Card>
              <CardHeader title="AI & workspace" subtitle="How the advisor behaves in your workspace" />
              <CardBody className="space-y-4">
                <SettingRow
                  icon={<IconSparkles size={15} />}
                  title="Auto-detect survey themes"
                  desc="The advisor analyzes open-ended survey responses"
                  defaultOn
                />
                <SettingRow
                  icon={<IconSparkles size={15} />}
                  title="Auto-summarize meeting notes"
                  desc="Generate decisions and action items after meetings"
                  defaultOn
                />
                <SettingRow
                  icon={<IconSparkles size={15} />}
                  title="Risk exposure nudges"
                  desc="Flag risks whose score rises two periods in a row"
                  defaultOn
                />
                <div className="rounded-xl border border-stone-100 bg-stone-50 p-4 text-xs text-stone-500 dark:border-stone-800 dark:bg-stone-800/60 dark:text-stone-400">
                  <p className="font-semibold text-stone-700 dark:text-stone-200">About this prototype</p>
                  <p className="mt-1 leading-relaxed">
                    All data is local mock data — nothing leaves your browser. In production, the advisor would run on your org's data with explicit consent controls.
                  </p>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  icon,
  title,
  desc,
  defaultOn,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn ?? false);
  return (
    <div className="flex items-center justify-between gap-4 border-b border-stone-100 py-3.5 last:border-0 dark:border-stone-800">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400">
          {icon}
        </span>
        <div>
          <p className="text-[13px] font-medium text-stone-800 dark:text-stone-100">{title}</p>
          <p className="text-xs text-stone-400">{desc}</p>
        </div>
      </div>
      <Toggle on={on} onChange={setOn} />
    </div>
  );
}

function TeamSection() {
  const { toast } = useApp();
  const [members, setMembers] = useState(USERS.map((u) => ({ ...u, inviteAccepted: u.id !== "u-nina", status: "Active" as "Active" | "Inactive" })));

  const updateRole = (id: string, role: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    toast({ title: "Role updated", description: "Permissions saved for this member.", variant: "success" });
  };

  const toggleStatus = (id: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" } : m)));
  };

  return (
    <Card>
      <CardHeader
        title="Team & roles"
        subtitle={`${members.length} members · roles control what each person can see and do`}
        action={
          <Button size="sm" onClick={() => toast({ title: "Invitation sent", description: "A demo invite email was sent (mock).", variant: "success" })}>
            <IconMail size={14} /> Invite member
          </Button>
        }
      />
      <CardBody className="pt-2">
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-stone-100 p-3.5 dark:border-stone-800">
              <Avatar name={m.name} color={m.color} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold text-stone-900 dark:text-stone-50">{m.name}</p>
                  {m.id === "u-sarah" && <Badge tone="emerald">You</Badge>}
                  {!m.inviteAccepted && <Badge tone="amber">Invite pending</Badge>}
                </div>
                <p className="truncate text-[11px] text-stone-400">{m.title} · {m.email}</p>
              </div>
              <Badge tone={m.status === "Active" ? "emerald" : "stone"}>{m.status}</Badge>
              <Select value={m.role} onChange={(e) => updateRole(m.id, e.target.value)} className="h-8 w-40 py-1 text-xs">
                {["Admin", "Manager", "Viewer"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Select>
              <Button variant="outline" size="sm" onClick={() => { toggleStatus(m.id); toast({ title: m.status === "Active" ? "Member deactivated" : "Member activated", description: `${m.name} ${m.status === "Active" ? "can no longer" : "can now"} access the workspace.`, variant: "info" }); }}>
                {m.status === "Active" ? "Deactivate" : "Activate"}
              </Button>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
