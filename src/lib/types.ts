export type User = {
  id: string;
  name: string;
  role: string;
  title: string;
  email: string;
  initials: string;
  color: string;
};

export type Org = {
  id: string;
  name: string;
  tagline: string;
  sector: string;
  founded: number;
  staff: number;
  location: string;
  initials: string;
  color: string;
  planPeriod: string;
};

export type Status =
  | "On track"
  | "At risk"
  | "Behind"
  | "Completed"
  | "Planned"
  | "Not started";

export type Priority = "High" | "Medium" | "Low";

export type Kpi = {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  trend: number; // % change vs last period
  format: "percent" | "number" | "currency";
};

export type Milestone = {
  id: string;
  title: string;
  due: string; // ISO
  status: "Done" | "In progress" | "Upcoming" | "Overdue";
};

export type Initiative = {
  id: string;
  title: string;
  goalId: string;
  ownerId: string;
  budget: number;
  spent: number;
  deadline: string; // ISO
  start: string; // ISO
  priority: Priority;
  progress: number;
  status: Status;
  description: string;
  kpis: Kpi[];
  milestones: Milestone[];
};

export type Goal = {
  id: string;
  title: string;
  pillar: string;
  description: string;
  why: string;
  ownerId: string;
  progress: number;
  status: Status;
  budget: number;
  spent: number;
  start: string;
  end: string;
  kpis: Kpi[];
  initiativeIds: string[];
};

export type RiskStatus =
  | "Monitoring"
  | "Mitigating"
  | "New"
  | "On track"
  | "Closed";

export type Risk = {
  id: string;
  title: string;
  category: string;
  description: string;
  probability: number; // 1-5
  impact: number; // 1-5
  score: number; // p * i
  ownerId: string;
  status: RiskStatus;
  trend: "increasing" | "stable" | "decreasing";
  goalId?: string;
  mitigation: string[];
  lastReviewed: string;
};

export type SurveyQuestion = {
  id: string;
  text: string;
  avg: number; // avg score (1..max)
  max: number;
};

export type Survey = {
  id: string;
  title: string;
  groupId: string;
  status: "Draft" | "Published" | "Analyzing" | "Completed";
  sent: number;
  responses: number;
  participation: number; // %
  nps?: number;
  satisfaction?: number;
  launched: string;
  closed: string;
  questions: SurveyQuestion[];
  highlights: string[];
};

export type StakeholderGroup = {
  id: string;
  name: string;
  members: number;
  sentiment: number; // 0-100
  trend: number; // pts vs last quarter
  priority: Priority;
  lastTouch: string;
  notes: string;
};

export type SwotQuadrant = "Strengths" | "Weaknesses" | "Opportunities" | "Threats";

export type SwotItem = { id: string; text: string; tag?: string };

export type Swot = Record<SwotQuadrant, SwotItem[]>;

export type Report = {
  id: string;
  title: string;
  type: "Board" | "Executive" | "Quarterly" | "Annual" | "Program" | "Risk";
  period: string;
  status: "Draft" | "Final" | "Published";
  authorId: string;
  date: string;
  pages: number;
  summary: string;
  sections: { heading: string; body: string; bullets?: string[] }[];
};

export type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  time: string; // ISO
  type: "info" | "success" | "warning" | "error";
  read: boolean;
};

export type ActivityItem = {
  id: string;
  actorId: string;
  verb: string;
  target: string;
  time: string; // ISO
  type: "goal" | "initiative" | "risk" | "survey" | "report" | "comment" | "ai";
};

export type AiMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
};

export type Comment = {
  id: string;
  targetId: string;
  authorId: string;
  text: string;
  time: string;
  replies?: { id: string; authorId: string; text: string; time: string }[];
};

export type AiRec = {
  id: string;
  title: string;
  body: string;
  impact: Priority;
  effort: "Low" | "Medium" | "High";
  category: string;
  goalId?: string;
  action: string;
};

export type MeetingNote = {
  id: string;
  title: string;
  date: string;
  participants: string[];
  summary: string;
  decisions: string[];
  actions: { text: string; ownerId: string; due: string }[];
};
