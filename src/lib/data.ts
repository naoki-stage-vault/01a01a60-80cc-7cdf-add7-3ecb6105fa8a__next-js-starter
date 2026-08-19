import type {
  ActivityItem,
  AiMessage,
  AiRec,
  Comment,
  Goal,
  Initiative,
  MeetingNote,
  NotificationItem,
  Org,
  Report,
  Risk,
  StakeholderGroup,
  Survey,
  Swot,
  User,
} from "./types";

/* ------------------------------------------------------------------ */
/* Helpers for relative dates                                         */
/* ------------------------------------------------------------------ */

function hoursAgo(n: number): string {
  return new Date(Date.now() - n * 60 * 60 * 1000).toISOString();
}
function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}
function daysFromNow(n: number): string {
  return new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString();
}

/* ------------------------------------------------------------------ */
/* Organizations & people                                             */
/* ------------------------------------------------------------------ */

export const ORGS: Org[] = [
  {
    id: "org-greenfuture",
    name: "GreenFuture Foundation",
    tagline: "Climate education & environmental stewardship",
    sector: "Environment & Education",
    founded: 2011,
    staff: 48,
    location: "Portland, OR",
    initials: "GF",
    color: "bg-emerald-600",
    planPeriod: "2025 – 2027",
  mission: "To restore healthy ecosystems and create green jobs in underserved urban communities.",
  },
  {
    id: "org-hope",
    name: "Hope for Youth",
    tagline: "Mentorship and pathways for young people",
    sector: "Youth Development",
    founded: 2008,
    staff: 36,
    location: "Denver, CO",
    initials: "HY",
    color: "bg-sky-600",
    planPeriod: "2025 – 2027",
  mission: "To equip every young person with the mentors, skills and opportunities they need to thrive.",
  },
  {
    id: "org-community",
    name: "Community First Alliance",
    tagline: "Building thriving, self-determined neighborhoods",
    sector: "Community Development",
    founded: 2014,
    staff: 29,
    location: "Detroit, MI",
    initials: "CF",
    color: "bg-amber-600",
    planPeriod: "2025 – 2028",
  mission: "To strengthen neighborhoods through resident-led programs, affordable housing and civic participation.",
  },
  {
    id: "org-bright",
    name: "Bright Minds Education",
    tagline: "Equitable access to tutoring and learning tools",
    sector: "Education Access",
    founded: 2010,
    staff: 52,
    location: "Chicago, IL",
    initials: "BM",
    color: "bg-violet-600",
    planPeriod: "2025 – 2026",
    mission: "To make excellent, joyful education accessible to every child regardless of zip code.",
  },
  {
    id: "org-clean",
    name: "Clean Oceans Initiative",
    tagline: "Marine debris prevention and coastal restoration",
    sector: "Marine Conservation",
    founded: 2016,
    staff: 41,
    location: "San Diego, CA",
    initials: "CO",
    color: "bg-cyan-600",
    planPeriod: "2025 – 2030",
    mission: "To protect ocean health and coastal communities through cleanup, policy and education.",
  },
];

export const USERS: User[] = [
  {
    id: "u-sarah",
    name: "Sarah Johnson",
    role: "Administrator",
    title: "Executive Director",
    email: "sarah@greenfuture.org",
    initials: "SJ",
    color: "bg-emerald-600",
  },
  {
    id: "u-michael",
    name: "Michael Chen",
    role: "Editor",
    title: "Strategy Manager",
    email: "michael@greenfuture.org",
    initials: "MC",
    color: "bg-sky-600",
  },
  {
    id: "u-emily",
    name: "Emily Rodriguez",
    role: "Editor",
    title: "Board Chair",
    email: "emily@greenfuture.org",
    initials: "ER",
    color: "bg-violet-600",
  },
  {
    id: "u-david",
    name: "David Wilson",
    role: "Editor",
    title: "Program Director",
    email: "david@greenfuture.org",
    initials: "DW",
    color: "bg-amber-600",
  },
  {
    id: "u-olivia",
    name: "Olivia Brown",
    role: "Editor",
    title: "Risk Manager",
    email: "olivia@greenfuture.org",
    initials: "OB",
    color: "bg-rose-600",
  },
  {
    id: "u-aisha",
    name: "Aisha Patel",
    role: "Editor",
    title: "Development Director",
    email: "aisha@greenfuture.org",
    initials: "AP",
    color: "bg-teal-600",
  },
  {
    id: "u-james",
    name: "James Park",
    role: "Viewer",
    title: "Finance Manager",
    email: "james@greenfuture.org",
    initials: "JP",
    color: "bg-indigo-600",
  },
  {
    id: "u-tom",
    name: "Tom Baker",
    role: "Contributor",
    title: "Volunteer Coordinator",
    email: "tom@greenfuture.org",
    initials: "TB",
    color: "bg-orange-600",
  },
  {
    id: "u-nina",
    name: "Nina Lopez",
    role: "Contributor",
    title: "Communications Lead",
    email: "nina@greenfuture.org",
    initials: "NL",
    color: "bg-fuchsia-600",
  },
];

export const CURRENT_USER_ID = "u-sarah";

export function userById(id: string): User {
  return USERS.find((u) => u.id === id) ?? USERS[0]!;
}

export function orgById(id: string): Org {
  return ORGS.find((o) => o.id === id) ?? ORGS[0]!;
}

/* ------------------------------------------------------------------ */
/* Strategic plan: goals, initiatives, milestones, KPIs               */
/* ------------------------------------------------------------------ */

export const GOALS: Goal[] = [
  {
    id: "g1",
    title: "Increase donor retention by 20%",
    pillar: "Sustainable Funding",
    description:
      "Grow annual donor retention from 52% to 75% by deepening relationships, modernizing stewardship, and converting one-time givers into recurring supporters.",
    why:
      "Retaining an existing donor is 5–7× cheaper than acquiring a new one. A 10-point retention lift adds an estimated $410k in predictable annual revenue by 2027 — the single biggest lever for financial resilience.",
    ownerId: "u-sarah",
    progress: 62,
    status: "On track",
    budget: 180000,
    spent: 124500,
    start: "2025-01-01",
    end: "2027-12-31",
    kpis: [
      { id: "k1a", name: "Donor retention rate", current: 62, target: 75, unit: "%", trend: 4, format: "percent" },
      { id: "k1b", name: "Recurring donors", current: 1240, target: 1600, unit: "", trend: 12, format: "number" },
      { id: "k1c", name: "Average gift", current: 118, target: 130, unit: "$", trend: 6, format: "currency" },
    ],
    initiativeIds: ["i1", "i2", "i3"],
  },
  {
    id: "g2",
    title: "Launch three new education programs",
    pillar: "Program Impact",
    description:
      "Design, pilot and scale three new climate-education offerings: a K-8 classroom program, STEM-in-Schools partnerships, and an adult leadership certificate.",
    why:
      "Program demand outpaced capacity 2:1 this year. New offerings extend our reach into underserved districts and open new earned-revenue and grant opportunities.",
    ownerId: "u-david",
    progress: 45,
    status: "On track",
    budget: 420000,
    spent: 156000,
    start: "2025-01-01",
    end: "2027-06-30",
    kpis: [
      { id: "k2a", name: "Programs launched", current: 1, target: 3, unit: "", trend: 1, format: "number" },
      { id: "k2b", name: "Program participants", current: 8400, target: 10000, unit: "", trend: 8, format: "number" },
      { id: "k2c", name: "Program satisfaction", current: 4.3, target: 4.5, unit: "/5", trend: 2, format: "number" },
    ],
    initiativeIds: ["i4", "i5", "i6"],
  },
  {
    id: "g3",
    title: "Expand services into two new regions",
    pillar: "Scale & Reach",
    description:
      "Establish a sustainable operating presence in the Southwest (Phoenix metro) and Southeast (Atlanta metro) with local partners and at least 12 new community partnerships.",
    why:
      "Expansion diversifies our geographic risk, reaches ~1.2M additional students, and positions us for two large multi-state grants currently in the pipeline.",
    ownerId: "u-michael",
    progress: 28,
    status: "At risk",
    budget: 350000,
    spent: 98000,
    start: "2025-03-01",
    end: "2027-03-31",
    kpis: [
      { id: "k3a", name: "Regions active", current: 0, target: 2, unit: "", trend: 0, format: "number" },
      { id: "k3b", name: "New community partners", current: 4, target: 12, unit: "", trend: 4, format: "number" },
      { id: "k3c", name: "Students reached (new regions)", current: 1800, target: 8000, unit: "", trend: 18, format: "number" },
    ],
    initiativeIds: ["i7", "i8"],
  },
  {
    id: "g4",
    title: "Improve volunteer engagement",
    pillar: "Community & People",
    description:
      "Grow annual volunteer hours to 15,000, modernize onboarding, and cut volunteer attrition by building recognition and capacity for 620 active volunteers.",
    why:
      "Volunteers deliver an estimated $310k of in-kind value per year. Better engagement also feeds our donor pipeline — 38% of recurring donors started as volunteers.",
    ownerId: "u-emily",
    progress: 66,
    status: "On track",
    budget: 80000,
    spent: 52200,
    start: "2025-01-01",
    end: "2026-12-31",
    kpis: [
      { id: "k4a", name: "Volunteer hours (annual)", current: 12400, target: 15000, unit: "", trend: 8, format: "number" },
      { id: "k4b", name: "Onboarding completion", current: 61, target: 85, unit: "%", trend: 9, format: "percent" },
      { id: "k4c", name: "Volunteer retention", current: 71, target: 80, unit: "%", trend: 3, format: "percent" },
    ],
    initiativeIds: ["i9", "i10"],
  },
  {
    id: "g5",
    title: "Reduce operational costs by 10%",
    pillar: "Operational Excellence",
    description:
      "Cut cost-per-program-dollar from $0.21 to $0.15 by consolidating tooling, renegotiating vendor contracts, and streamlining back-office processes.",
    why:
      "Every $0.01 of cost removed returns ~$48k to mission work. Efficiency gains also strengthen grant competitiveness — funders score overhead ratios heavily.",
    ownerId: "u-olivia",
    progress: 71,
    status: "On track",
    budget: 65000,
    spent: 48900,
    start: "2025-01-01",
    end: "2026-06-30",
    kpis: [
      { id: "k5a", name: "Cost per program dollar", current: 0.18, target: 0.15, unit: "$", trend: -7, format: "currency" },
      { id: "k5b", name: "Admin hours saved / month", current: 640, target: 1200, unit: "", trend: 22, format: "number" },
      { id: "k5c", name: "Annual tool spend", current: 86000, target: 72000, unit: "$", trend: -6, format: "currency" },
    ],
    initiativeIds: ["i11", "i12"],
  },
];

export const INITIATIVES: Initiative[] = [
  {
    id: "i1",
    title: "Loyalty & recurring giving program",
    goalId: "g1",
    ownerId: "u-sarah",
    budget: 95000,
    spent: 64800,
    deadline: daysFromNow(75),
    start: "2025-02-01",
    priority: "High",
    progress: 68,
    status: "On track",
    description:
      "Launch a tiered recurring giving program with perks, impact reports and a renewal series designed to lift monthly retention above 98%.",
    kpis: [
      { id: "i1k1", name: "Recurring donors", current: 1240, target: 1600, unit: "", trend: 12, format: "number" },
      { id: "i1k2", name: "Monthly churn", current: 2.4, target: 1.8, unit: "%", trend: -0.3, format: "number" },
    ],
    milestones: [
      { id: "i1m1", title: "Recurring giving page launched", due: daysAgo(32), status: "Done" },
      { id: "i1m2", title: "Tier & perks design finalized", due: daysAgo(12), status: "Done" },
      { id: "i1m3", title: "Stewardship email series live", due: daysFromNow(10), status: "Upcoming" },
      { id: "i1m4", title: "Mid-year renewal push", due: daysFromNow(45), status: "Upcoming" },
    ],
  },
  {
    id: "i2",
    title: "Donor appreciation & impact reporting revamp",
    goalId: "g1",
    ownerId: "u-sarah",
    budget: 35000,
    spent: 29400,
    deadline: daysFromNow(20),
    start: "2025-04-01",
    priority: "Medium",
    progress: 80,
    status: "On track",
    description:
      "Rebuild our annual impact report and thank-you journeys so every donor sees the specific outcomes their gift enabled.",
    kpis: [
      { id: "i2k1", name: "Report open rate", current: 54, target: 60, unit: "%", trend: 6, format: "percent" },
    ],
    milestones: [
      { id: "i2m1", title: "Impact report v1 drafted", due: daysAgo(18), status: "Done" },
      { id: "i2m2", title: "Design QA pass", due: daysFromNow(4), status: "In progress" },
      { id: "i2m3", title: "Print + digital distribution", due: daysFromNow(20), status: "Upcoming" },
    ],
  },
  {
    id: "i3",
    title: "Mid-level donor stewardship pilot",
    goalId: "g1",
    ownerId: "u-michael",
    budget: 50000,
    spent: 21000,
    deadline: daysFromNow(50),
    start: "2025-05-01",
    priority: "High",
    progress: 42,
    status: "At risk",
    description:
      "Build a dedicated pipeline for donors giving $1k–$10k/year with personalized outreach, events and a faster upgrade path.",
    kpis: [
      { id: "i3k1", name: "Mid-level donors upgraded", current: 34, target: 60, unit: "", trend: 20, format: "number" },
    ],
    milestones: [
      { id: "i3m1", title: "Segment & pipeline build", due: daysAgo(20), status: "Done" },
      { id: "i3m2", title: "Pilot outreach wave 1", due: daysFromNow(6), status: "In progress" },
      { id: "i3m3", title: "Wave 2 + conversion review", due: daysFromNow(50), status: "Upcoming" },
    ],
  },
  {
    id: "i4",
    title: "Climate Education Program pilot",
    goalId: "g2",
    ownerId: "u-david",
    budget: 140000,
    spent: 77000,
    deadline: daysFromNow(35),
    start: "2025-03-01",
    priority: "High",
    progress: 55,
    status: "On track",
    description:
      "Co-design a K-8 climate curriculum with 4 pilot districts and run a 220-student pilot cohort to validate outcomes before scaling.",
    kpis: [
      { id: "i4k1", name: "Students in pilot", current: 220, target: 300, unit: "", trend: 10, format: "number" },
      { id: "i4k2", name: "Teacher satisfaction", current: 4.4, target: 4.5, unit: "/5", trend: 1, format: "number" },
    ],
    milestones: [
      { id: "i4m1", title: "Curriculum co-design complete", due: daysAgo(25), status: "Done" },
      { id: "i4m2", title: "Pilot cohort 1 enrolled", due: daysFromNow(5), status: "In progress" },
      { id: "i4m3", title: "Pilot evaluation report", due: daysFromNow(35), status: "Upcoming" },
    ],
  },
  {
    id: "i5",
    title: "STEM in Schools program",
    goalId: "g2",
    ownerId: "u-david",
    budget: 160000,
    spent: 35000,
    deadline: daysFromNow(190),
    start: "2025-07-01",
    priority: "Medium",
    progress: 22,
    status: "On track",
    description:
      "Partner with 6 school districts to deliver STEM kits and teacher training, prioritizing Title I schools.",
    kpis: [
      { id: "i5k1", name: "Districts signed", current: 4, target: 6, unit: "", trend: 2, format: "number" },
    ],
    milestones: [
      { id: "i5m1", title: "District MOUs signed", due: daysAgo(10), status: "Done" },
      { id: "i5m2", title: "Teacher training cohort 1", due: daysFromNow(40), status: "Upcoming" },
      { id: "i5m3", title: "Program launch", due: daysFromNow(190), status: "Upcoming" },
    ],
  },
  {
    id: "i6",
    title: "Adult environmental leadership certificate",
    goalId: "g2",
    ownerId: "u-david",
    budget: 120000,
    spent: 12000,
    deadline: daysFromNow(260),
    start: "2025-08-01",
    priority: "Medium",
    progress: 10,
    status: "Planned",
    description:
      "Create a paid 12-week certificate for working professionals, with a scholarship pool funded by corporate partners.",
    kpis: [
      { id: "i6k1", name: "Enrolled (first cohort)", current: 0, target: 40, unit: "", trend: 0, format: "number" },
    ],
    milestones: [
      { id: "i6m1", title: "Syllabus & accreditation review", due: daysFromNow(25), status: "Upcoming" },
      { id: "i6m2", title: "Instructor hiring", due: daysFromNow(90), status: "Upcoming" },
      { id: "i6m3", title: "First cohort launch", due: daysFromNow(260), status: "Upcoming" },
    ],
  },
  {
    id: "i7",
    title: "Regional expansion — Southwest (Phoenix)",
    goalId: "g3",
    ownerId: "u-michael",
    budget: 180000,
    spent: 63000,
    deadline: daysFromNow(150),
    start: "2025-04-01",
    priority: "High",
    progress: 35,
    status: "At risk",
    description:
      "Open a Phoenix operating hub with a regional coordinator, 3 pilot sites and local partner network.",
    kpis: [
      { id: "i7k1", name: "Pilot sites secured", current: 2, target: 3, unit: "", trend: 2, format: "number" },
    ],
    milestones: [
      { id: "i7m1", title: "Market analysis complete", due: daysAgo(40), status: "Done" },
      { id: "i7m2", title: "Hire regional coordinator", due: daysAgo(8), status: "Overdue" },
      { id: "i7m3", title: "Phoenix pilot sites secured", due: daysFromNow(30), status: "Upcoming" },
      { id: "i7m4", title: "Launch day", due: daysFromNow(150), status: "Upcoming" },
    ],
  },
  {
    id: "i8",
    title: "Regional expansion — Southeast (Atlanta)",
    goalId: "g3",
    ownerId: "u-michael",
    budget: 170000,
    spent: 35000,
    deadline: daysFromNow(320),
    start: "2025-06-01",
    priority: "Medium",
    progress: 12,
    status: "Behind",
    description:
      "Second expansion market launching six months after Phoenix, leveraging the first market's playbook and shared infrastructure.",
    kpis: [
      { id: "i8k1", name: "Community partners", current: 2, target: 6, unit: "", trend: 2, format: "number" },
    ],
    milestones: [
      { id: "i8m1", title: "Partner scouting trip", due: daysAgo(15), status: "Done" },
      { id: "i8m2", title: "Community advisory board formed", due: daysFromNow(60), status: "Upcoming" },
      { id: "i8m3", title: "Atlanta launch", due: daysFromNow(320), status: "Upcoming" },
    ],
  },
  {
    id: "i9",
    title: "Volunteer onboarding & training hub",
    goalId: "g4",
    ownerId: "u-emily",
    budget: 60000,
    spent: 44400,
    deadline: daysFromNow(15),
    start: "2025-04-01",
    priority: "High",
    progress: 74,
    status: "On track",
    description:
      "Replace the manual onboarding packet with a self-serve hub: 18 short video modules, role-specific tracks and automated check-ins.",
    kpis: [
      { id: "i9k1", name: "Onboarding completion", current: 61, target: 85, unit: "%", trend: 9, format: "percent" },
    ],
    milestones: [
      { id: "i9m1", title: "Onboarding flow mapped", due: daysAgo(30), status: "Done" },
      { id: "i9m2", title: "Video library production", due: daysFromNow(4), status: "In progress" },
      { id: "i9m3", title: "Hub launch to all volunteers", due: daysFromNow(15), status: "Upcoming" },
    ],
  },
  {
    id: "i10",
    title: "Volunteer recognition program",
    goalId: "g4",
    ownerId: "u-emily",
    budget: 20000,
    spent: 7800,
    deadline: daysFromNow(100),
    start: "2025-05-01",
    priority: "Medium",
    progress: 58,
    status: "On track",
    description:
      "Quarterly spotlights, milestone awards and an annual celebration to recognize 620 active volunteers and lift retention.",
    kpis: [
      { id: "i10k1", name: "Volunteer retention", current: 71, target: 80, unit: "%", trend: 3, format: "percent" },
    ],
    milestones: [
      { id: "i10m1", title: "Recognition criteria approved", due: daysAgo(20), status: "Done" },
      { id: "i10m2", title: "Annual awards event planned", due: daysFromNow(40), status: "Upcoming" },
      { id: "i10m3", title: "Quarterly spotlight rollout", due: daysFromNow(100), status: "Upcoming" },
    ],
  },
  {
    id: "i11",
    title: "Administrative cost review & tool consolidation",
    goalId: "g5",
    ownerId: "u-olivia",
    budget: 25000,
    spent: 20700,
    deadline: daysFromNow(30),
    start: "2025-05-01",
    priority: "High",
    progress: 83,
    status: "On track",
    description:
      "Audit all SaaS and administrative spend, cut from 23 to 14 tools, and renegotiate contracts — target $38k annual savings.",
    kpis: [
      { id: "i11k1", name: "Annual savings realized", current: 26000, target: 38000, unit: "$", trend: 30, format: "currency" },
    ],
    milestones: [
      { id: "i11m1", title: "Tool audit complete (23 → 14)", due: daysAgo(22), status: "Done" },
      { id: "i11m2", title: "Vendor renegotiation closed", due: daysAgo(6), status: "Done" },
      { id: "i11m3", title: "Migration playbook", due: daysFromNow(30), status: "Upcoming" },
    ],
  },
  {
    id: "i12",
    title: "Shared services back-office optimization",
    goalId: "g5",
    ownerId: "u-olivia",
    budget: 40000,
    spent: 28200,
    deadline: daysFromNow(220),
    start: "2025-06-01",
    priority: "Medium",
    progress: 45,
    status: "On track",
    description:
      "Redesign finance, HR and grant-reporting workflows into shared services to eliminate duplication and save 1,200 admin hours/year.",
    kpis: [
      { id: "i12k1", name: "Admin hours saved / month", current: 640, target: 1200, unit: "", trend: 22, format: "number" },
    ],
    milestones: [
      { id: "i12m1", title: "Process inventory done", due: daysAgo(35), status: "Done" },
      { id: "i12m2", title: "Finance + HR workflow redesign", due: daysFromNow(15), status: "In progress" },
      { id: "i12m3", title: "New SOP rollout", due: daysFromNow(220), status: "Upcoming" },
    ],
  },
];

export const PILLARS = [
  "Sustainable Funding",
  "Program Impact",
  "Scale & Reach",
  "Community & People",
  "Operational Excellence",
] as const;

export function goalById(id: string): Goal {
  return GOALS.find((g) => g.id === id) ?? GOALS[0]!;
}

export function initiativesByGoal(goalId: string): Initiative[] {
  return INITIATIVES.filter((i) => i.goalId === goalId);
}

export function initiativeById(id: string): Initiative | undefined {
  return INITIATIVES.find((i) => i.id === id);
}

export function groupById(id: string): StakeholderGroup {
  return STAKEHOLDER_GROUPS.find((g) => g.id === id) ?? STAKEHOLDER_GROUPS[0]!;
}

/* ------------------------------------------------------------------ */
/* Risks                                                              */
/* ------------------------------------------------------------------ */

export const RISKS: Risk[] = [
  {
    id: "r1",
    title: "Revenue concentration in top-3 donors",
    category: "Funding",
    description:
      "34% of annual revenue comes from three donors. Loss of any one would force program cuts within two quarters.",
    probability: 4,
    impact: 5,
    score: 20,
    ownerId: "u-sarah",
    status: "Monitoring",
    trend: "stable",
    goalId: "g1",
    mitigation: [
      "Grow mid-level donor pipeline to 60 upgraded donors by Q1 2026",
      "Add two new institutional funders per quarter",
      "Establish a 6-month operating reserve policy",
    ],
    lastReviewed: daysAgo(9),
  },
  {
    id: "r2",
    title: "Regional expansion hiring delays",
    category: "Operations",
    description:
      "Regional coordinator role has been open 8 weeks; Phoenix launch timeline depends on a Q4 hire.",
    probability: 4,
    impact: 3,
    score: 12,
    ownerId: "u-michael",
    status: "Mitigating",
    trend: "increasing",
    goalId: "g3",
    mitigation: [
      "Engaged two nonprofit recruiting partners",
      "Overlapping onboarding with Portland program staff",
      "Interim coordinator coverage from partner org",
    ],
    lastReviewed: daysAgo(3),
  },
  {
    id: "r3",
    title: "Grant funding volatility",
    category: "Funding",
    description:
      "Two multi-year grants end in 2026; renewal decisions land after budget season, creating a $240k planning gap.",
    probability: 3,
    impact: 4,
    score: 12,
    ownerId: "u-olivia",
    status: "Monitoring",
    trend: "stable",
    mitigation: [
      "Grant pipeline target: 4:1 coverage of expiring funds",
      "Multi-year asks with two foundations in negotiation",
      "Scenario budgets at 80% / 100% / 120% funding",
    ],
    lastReviewed: daysAgo(14),
  },
  {
    id: "r4",
    title: "Pilot program under-enrollment",
    category: "Program",
    description:
      "Climate Education pilot is at 220 of 300 target students; under-enrollment would weaken the scale-up case to funders.",
    probability: 3,
    impact: 3,
    score: 9,
    ownerId: "u-david",
    status: "Mitigating",
    trend: "decreasing",
    goalId: "g2",
    mitigation: [
      "Added two after-school partner sites",
      "Parent ambassador recruitment in 4 districts",
      "Extended enrollment window by 3 weeks",
    ],
    lastReviewed: daysAgo(6),
  },
  {
    id: "r5",
    title: "Volunteer burnout & attrition",
    category: "People",
    description:
      "Volunteer hours are up 22% YoY but sentiment dipped 5 points; attrition risk is highest among site leads.",
    probability: 4,
    impact: 2,
    score: 8,
    ownerId: "u-emily",
    status: "Mitigating",
    trend: "decreasing",
    goalId: "g4",
    mitigation: [
      "Capacity caps per program site",
      "Recognition program launched (Q4)",
      "Quarterly lead check-ins",
    ],
    lastReviewed: daysAgo(5),
  },
  {
    id: "r6",
    title: "Donor data security incident",
    category: "Compliance",
    description:
      "Donor database holds 42k records; no formal incident response run in the last 24 months and MFA rollout is 60% complete.",
    probability: 2,
    impact: 5,
    score: 10,
    ownerId: "u-olivia",
    status: "Monitoring",
    trend: "stable",
    mitigation: [
      "Complete MFA rollout by December",
      "Run tabletop incident response exercise",
      "Annual third-party vendor security review",
    ],
    lastReviewed: daysAgo(18),
  },
  {
    id: "r7",
    title: "New state fundraising regulations",
    category: "Compliance",
    description:
      "Three states introduced charitable solicitation registration changes effective 2026 that may raise compliance load.",
    probability: 3,
    impact: 2,
    score: 6,
    ownerId: "u-olivia",
    status: "On track",
    trend: "stable",
    mitigation: [
      "Legal review engaged for all three states",
      "Registration calendar automated in CRM",
    ],
    lastReviewed: daysAgo(11),
  },
  {
    id: "r8",
    title: "Key-person dependency",
    category: "People",
    description:
      "Two grant-funded programs are single-staffed; unplanned departure would stall delivery 4–6 months.",
    probability: 3,
    impact: 3,
    score: 9,
    ownerId: "u-sarah",
    status: "New",
    trend: "increasing",
    goalId: "g2",
    mitigation: [
      "Cross-train one backup per critical role",
      "Document program runbooks by Q1 2026",
      "Succession review at next board meeting",
    ],
    lastReviewed: daysAgo(2),
  },
  {
    id: "r9",
    title: "Inflation on program delivery costs",
    category: "Financial",
    description:
      "Supply and venue costs rose ~9% this year; budget buffers are being consumed faster than planned.",
    probability: 4,
    impact: 3,
    score: 12,
    ownerId: "u-olivia",
    status: "Monitoring",
    trend: "increasing",
    mitigation: [
      "Multi-year contracts for top 5 vendors",
      "5% contingency held at pillar level",
      "Quarterly cost index review",
    ],
    lastReviewed: daysAgo(7),
  },
  {
    id: "r10",
    title: "Board engagement decline",
    category: "Governance",
    description:
      "Committee attendance slipped to 78%; two committees are one member short of their charter minimum.",
    probability: 2,
    impact: 2,
    score: 4,
    ownerId: "u-emily",
    status: "On track",
    trend: "decreasing",
    mitigation: [
      "Board retreat scheduled for October",
      "Recruit two new board members (finance, legal)",
    ],
    lastReviewed: daysAgo(12),
  },
];

export const RISK_CATEGORIES = [
  "Funding",
  "Operations",
  "Program",
  "People",
  "Compliance",
  "Financial",
  "Governance",
];

/* ------------------------------------------------------------------ */
/* Stakeholder engagement                                             */
/* ------------------------------------------------------------------ */

export const STAKEHOLDER_GROUPS: StakeholderGroup[] = [
  {
    id: "sg-donors",
    name: "Donors",
    members: 2400,
    sentiment: 72,
    trend: 4,
    priority: "High",
    lastTouch: daysAgo(2),
    notes: "Highest-value group; satisfaction driven by impact reporting quality.",
  },
  {
    id: "sg-volunteers",
    name: "Volunteers",
    members: 620,
    sentiment: 68,
    trend: -2,
    priority: "High",
    lastTouch: daysAgo(5),
    notes: "Hours up 22% YoY but burnout signals in site leads.",
  },
  {
    id: "sg-staff",
    name: "Staff",
    members: 48,
    sentiment: 74,
    trend: 6,
    priority: "High",
    lastTouch: daysAgo(1),
    notes: "Strong strategy alignment; workload concerns during expansion.",
  },
  {
    id: "sg-board",
    name: "Board",
    members: 12,
    sentiment: 81,
    trend: 3,
    priority: "Medium",
    lastTouch: daysAgo(6),
    notes: "Full meeting attendance; committee capacity is the constraint.",
  },
  {
    id: "sg-partners",
    name: "Community Partners",
    members: 85,
    sentiment: 63,
    trend: -5,
    priority: "Medium",
    lastTouch: daysAgo(9),
    notes: "Value curriculum co-design; want faster grant reporting.",
  },
  {
    id: "sg-participants",
    name: "Program Participants",
    members: 8400,
    sentiment: 78,
    trend: 8,
    priority: "Medium",
    lastTouch: daysAgo(3),
    notes: "Students and families rate programs 4.3/5 on average.",
  },
];

export const SURVEYS: Survey[] = [
  {
    id: "s1",
    title: "Donor Satisfaction Survey 2025",
    groupId: "sg-donors",
    status: "Analyzing",
    sent: 2400,
    responses: 968,
    participation: 40,
    nps: 54,
    satisfaction: 4.2,
    launched: "2025-07-01",
    closed: "2025-08-15",
    questions: [
      { id: "s1q1", text: "How satisfied are you with our impact updates?", avg: 4.2, max: 5 },
      { id: "s1q2", text: "How likely are you to renew your gift this year?", avg: 4.1, max: 5 },
      { id: "s1q3", text: "How clear is our communication about where money goes?", avg: 3.8, max: 5 },
      { id: "s1q4", text: "How connected do you feel to our mission?", avg: 4.4, max: 5 },
    ],
    highlights: [
      "“The impact report is the best I've seen from any nonprofit I support.”",
      "“I'd love quarterly updates instead of annual — I want to see progress as it happens.”",
      "“Recurring giving page took three tries to work on mobile.”",
    ],
  },
  {
    id: "s2",
    title: "Volunteer Engagement Pulse",
    groupId: "sg-volunteers",
    status: "Published",
    sent: 620,
    responses: 421,
    participation: 68,
    nps: 61,
    satisfaction: 4.4,
    launched: "2025-08-01",
    closed: "2025-08-20",
    questions: [
      { id: "s2q1", text: "How meaningful do you find your volunteer role?", avg: 4.5, max: 5 },
      { id: "s2q2", text: "Do you feel recognized for your contribution?", avg: 3.6, max: 5 },
      { id: "s2q3", text: "How easy was onboarding?", avg: 3.2, max: 5 },
      { id: "s2q4", text: "How likely are you to recommend volunteering here?", avg: 4.3, max: 5 },
    ],
    highlights: [
      "“Onboarding took two weeks of emails — the hub can't come soon enough.”",
      "“Site leads burn out because there's no relief coverage.”",
    ],
  },
  {
    id: "s3",
    title: "Board Effectiveness Review",
    groupId: "sg-board",
    status: "Completed",
    sent: 12,
    responses: 12,
    participation: 100,
    satisfaction: 4.6,
    launched: "2025-06-10",
    closed: "2025-06-24",
    questions: [
      { id: "s3q1", text: "How clear is the board's role in strategy?", avg: 4.7, max: 5 },
      { id: "s3q2", text: "How effective are committee meetings?", avg: 4.2, max: 5 },
      { id: "s3q3", text: "How well does the board use dashboards?", avg: 4.1, max: 5 },
    ],
    highlights: [
      "“Strategy dashboards transformed how we spend board time.”",
      "“Finance committee needs a second treasurer track member.”",
    ],
  },
  {
    id: "s4",
    title: "Community Partner Feedback",
    groupId: "sg-partners",
    status: "Analyzing",
    sent: 85,
    responses: 51,
    participation: 60,
    nps: 47,
    launched: "2025-08-10",
    closed: "2025-09-01",
    questions: [
      { id: "s4q1", text: "How valuable is our co-design process?", avg: 4.0, max: 5 },
      { id: "s4q2", text: "How responsive are we to partner needs?", avg: 3.7, max: 5 },
      { id: "s4q3", text: "How useful is our shared reporting?", avg: 3.1, max: 5 },
    ],
    highlights: [
      "“Grant reporting formats differ from our funders — extra work on our side.”",
    ],
  },
  {
    id: "s5",
    title: "Staff Culture & Strategy Alignment",
    groupId: "sg-staff",
    status: "Draft",
    sent: 48,
    responses: 0,
    participation: 0,
    launched: "2025-09-20",
    closed: "2025-10-03",
    questions: [
      { id: "s5q1", text: "I understand how my work connects to the strategic plan.", avg: 0, max: 5 },
      { id: "s5q2", text: "I have the tools and time to do my best work.", avg: 0, max: 5 },
    ],
    highlights: [],
  },
];

export const SWOT: Swot = {
  Strengths: [
    { id: "sw1", text: "Strong donor loyalty — 62% retention vs. 52% two years ago", tag: "Funding" },
    { id: "sw2", text: "Award-winning climate curriculum with 4.3/5 participant satisfaction", tag: "Program" },
    { id: "sw3", text: "100% board meeting attendance and engaged committees", tag: "Governance" },
    { id: "sw4", text: "Experienced leadership team with 10+ years average tenure", tag: "People" },
  ],
  Weaknesses: [
    { id: "sw5", text: "34% of revenue from top-3 donors — fragile concentration", tag: "Funding" },
    { id: "sw6", text: "Thin middle management; key-person dependencies in 2 programs", tag: "People" },
    { id: "sw7", text: "Manual volunteer onboarding — 61% completion, slow time-to-first-shift", tag: "Operations" },
    { id: "sw8", text: "Digital fundraising capacity limited to one staff member", tag: "Funding" },
  ],
  Opportunities: [
    { id: "sw9", text: "Corporate ESG partnership demand up 35% in our sector", tag: "Funding" },
    { id: "sw10", text: "Two underserved regions (Phoenix, Atlanta) with growing climate education demand", tag: "Scale" },
    { id: "sw11", text: "$4.2M state climate-literacy funding pool opening 2026", tag: "Funding" },
    { id: "sw12", text: "AI tools can cut admin reporting time by an estimated 30%", tag: "Operations" },
  ],
  Threats: [
    { id: "sw13", text: "Economic downturn risk reducing individual giving 8–12%", tag: "Funding" },
    { id: "sw14", text: "New charitable solicitation regulations in three states", tag: "Compliance" },
    { id: "sw15", text: "Competing nonprofits entering Phoenix and Atlanta markets", tag: "Scale" },
    { id: "sw16", text: "Staff burnout after record program year (volunteer sentiment -5 pts)", tag: "People" },
  ],
};

/* ------------------------------------------------------------------ */
/* Reports & meeting notes                                            */
/* ------------------------------------------------------------------ */

export const REPORTS: Report[] = [
  {
    id: "rep1",
    title: "Board Summary — Q3 2025",
    type: "Board",
    period: "Q3 2025",
    status: "Final",
    authorId: "u-sarah",
    date: "2025-09-25",
    pages: 12,
    summary:
      "Quarterly board snapshot: 4 of 5 strategic goals on track, donor retention up 4 pts, and one risk elevated to the board's attention (regional hiring).",
    sections: [
      {
        heading: "Executive summary",
        body:
          "The organization enters Q4 with strong momentum. Strategy health improved to 78 (from 74 in Q2), driven by donor retention gains and the completion of the tool consolidation audit. One item requires board attention: the Phoenix regional coordinator hire is eight weeks behind schedule and now threatens the Q1 2026 launch window.",
      },
      {
        heading: "Goals at a glance",
        bullets: [
          "Increase donor retention by 20% — On track (62% vs. 60% last quarter)",
          "Launch three new education programs — On track (pilot at 220 students)",
          "Expand services into two new regions — At risk (hiring delay)",
          "Improve volunteer engagement — On track (onboarding hub launching Sep)",
          "Reduce operational costs by 10% — On track ($26k of $38k savings realized)",
        ],
      },
      {
        heading: "Financial health",
        body:
          "Budget utilization stands at 68% with three quarters elapsed — slightly ahead of plan. Program pillar is at 82% utilization and will need a reforecast in Q4. Operating reserve remains above policy floor at 4.2 months.",
      },
      {
        heading: "Decisions requested",
        bullets: [
          "Approve emergency hiring package for Phoenix regional coordinator",
          "Ratify the new donor data incident-response plan",
        ],
      },
    ],
  },
  {
    id: "rep2",
    title: "Executive Quarterly Report — Q3 2025",
    type: "Executive",
    period: "Q3 2025",
    status: "Final",
    authorId: "u-michael",
    date: "2025-09-28",
    pages: 8,
    summary:
      "Deep-dive operational review for leadership: initiative-level progress, budget variances, risk movement, and the AI-assisted recommendations adopted this quarter.",
    sections: [
      {
        heading: "Quarter in review",
        body:
          "Twelve initiatives are active across five pillars. Six are on track, three at risk or behind, and three planned launches remain on schedule. The volunteer onboarding hub reached 74% completion and is set to launch September 30.",
      },
      {
        heading: "What changed this quarter",
        bullets: [
          "Recurring giving page relaunched — conversion up 18%",
          "Tool audit complete: 23 tools reduced to 14, $26k savings realized",
          "Two new district MOUs signed for STEM in Schools",
          "Risk register: 1 new risk added (key-person dependency)",
        ],
      },
    ],
  },
  {
    id: "rep3",
    title: "Donor Impact Report 2025",
    type: "Annual",
    period: "FY 2025",
    status: "Draft",
    authorId: "u-nina",
    date: "2025-10-15",
    pages: 16,
    summary:
      "Donor-facing narrative report connecting gifts to outcomes, with stories from the Climate Education pilot and the volunteer community.",
    sections: [
      {
        heading: "A year of roots",
        body:
          "Every gift this year planted something: a classroom garden, a teacher trained, a river mile cleaned. This report follows the impact of your support from our Portland headquarters to 8,400 program participants across the region.",
      },
      {
        heading: "Where the money goes",
        bullets: [
          "82% direct program services",
          "11% fundraising",
          "7% administration",
        ],
      },
    ],
  },
  {
    id: "rep4",
    title: "Q2 2025 Quarterly Report",
    type: "Quarterly",
    period: "Q2 2025",
    status: "Final",
    authorId: "u-michael",
    date: "2025-06-30",
    pages: 10,
    summary:
      "Q2 report: strategy health 74, three initiatives launched, donor retention 60%, and first regional market analysis completed.",
    sections: [
      {
        heading: "Q2 highlights",
        bullets: [
          "Curriculum co-design with 4 pilot districts completed",
          "Mid-level donor pipeline built — 34 upgrades to date",
          "Phoenix market analysis delivered",
        ],
      },
    ],
  },
  {
    id: "rep5",
    title: "Annual Report 2024",
    type: "Annual",
    period: "FY 2024",
    status: "Published",
    authorId: "u-sarah",
    date: "2025-02-10",
    pages: 24,
    summary:
      "Published FY2024 annual report covering programs, finances, and the strategic plan for 2025–2027.",
    sections: [
      {
        heading: "FY 2024 by the numbers",
        bullets: [
          "7,200 program participants",
          "10,100 volunteer hours",
          "54% donor retention (baseline year)",
          "$2.4M total revenue",
        ],
      },
    ],
  },
  {
    id: "rep6",
    title: "Risk & Compliance Report — Q3 2025",
    type: "Risk",
    period: "Q3 2025",
    status: "Final",
    authorId: "u-olivia",
    date: "2025-09-22",
    pages: 6,
    summary:
      "Risk register movement, mitigation progress, and compliance calendar status for the quarter.",
    sections: [
      {
        heading: "Risk posture",
        body:
          "Average risk score is unchanged at 10.2. One risk moved up (regional hiring), one was added (key-person dependency), and one closed. Mitigation progress: 11 of 26 actions complete, 9 in progress.",
      },
      {
        heading: "Compliance calendar",
        bullets: [
          "Fundraising registrations renewed in 9 states",
          "Three new state regulations tracked for 2026",
          "MFA rollout 60% complete — target December",
        ],
      },
    ],
  },
  {
    id: "rep7",
    title: "Program Outcomes Report — H1 2025",
    type: "Program",
    period: "H1 2025",
    status: "Final",
    authorId: "u-david",
    date: "2025-07-15",
    pages: 9,
    summary:
      "First-half program outcomes: 4,100 participants served, satisfaction 4.3, and early signals from the Climate Education pilot.",
    sections: [
      {
        heading: "Outcomes",
        bullets: [
          "4,100 participants across 62 schools",
          "92% of teachers report students more engaged with climate topics",
          "Pilot enrollment at 220 of 300 target",
        ],
      },
    ],
  },
];

export const MEETING_NOTES: MeetingNote[] = [
  {
    id: "mn1",
    title: "Board Meeting — August 2025",
    date: daysAgo(12),
    participants: ["Sarah Johnson", "Emily Rodriguez", "Board (12 members)"],
    summary:
      "Reviewed Q3 dashboard, approved the 2026 budget framework, and discussed Phoenix expansion hiring risk.",
    decisions: [
      "Approved budget framework at 4.2-month reserve floor",
      "Formed ad-hoc committee to recruit two new board members",
    ],
    actions: [
      { text: "Deliver hiring package proposal for Phoenix coordinator", ownerId: "u-michael", due: daysFromNow(7) },
      { text: "Draft board recruitment profile", ownerId: "u-emily", due: daysFromNow(21) },
    ],
  },
  {
    id: "mn2",
    title: "Strategy Workshop — June 2025",
    date: daysAgo(70),
    participants: ["Sarah Johnson", "Michael Chen", "David Wilson", "Emily Rodriguez", "Olivia Brown"],
    summary:
      "Mid-plan check-in: revalidated five goals, moved volunteer engagement to 'On track', and scoped the AI-assist pilot for reporting.",
    decisions: [
      "Keep all five strategic goals with adjusted KPIs",
      "Pilot AI drafting for quarterly reports starting Q3",
    ],
    actions: [
      { text: "Update KPI baselines in system", ownerId: "u-michael", due: daysAgo(60) },
    ],
  },
  {
    id: "mn3",
    title: "Risk Committee — July 2025",
    date: daysAgo(40),
    participants: ["Olivia Brown", "Sarah Johnson", "James Park"],
    summary:
      "Reviewed top-5 risks, closed the 'grant report delays' risk, and added the key-person dependency risk.",
    decisions: [
      "Raised incident-response exercise to Q4 priority",
      "Approved 5% pillar-level budget contingency",
    ],
    actions: [
      { text: "Schedule tabletop incident exercise", ownerId: "u-olivia", due: daysFromNow(30) },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Notifications & activity feed                                      */
/* ------------------------------------------------------------------ */

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    title: "Risk alert: regional hiring delay",
    description: "Phoenix coordinator role is 8 weeks open — launch window at risk.",
    time: hoursAgo(2),
    type: "warning",
    read: false,
  },
  {
    id: "n2",
    title: "Milestone approaching",
    description: "“Stewardship email series live” is due in 10 days (Goal 1).",
    time: hoursAgo(5),
    type: "info",
    read: false,
  },
  {
    id: "n3",
    title: "Michael Chen updated an initiative",
    description: "“Regional expansion — Southwest (Phoenix)” progress 30% → 35%.",
    time: hoursAgo(26),
    type: "info",
    read: false,
  },
  {
    id: "n4",
    title: "Board meeting notes ready",
    description: "August board summary is available for review.",
    time: daysAgo(2),
    type: "info",
    read: true,
  },
  {
    id: "n5",
    title: "Survey milestone",
    description: "Donor Satisfaction Survey crossed 40% participation.",
    time: daysAgo(3),
    type: "success",
    read: true,
  },
  {
    id: "n6",
    title: "Budget warning",
    description: "Program Impact pillar at 82% utilization — reforecast recommended.",
    time: daysAgo(4),
    type: "warning",
    read: true,
  },
  {
    id: "n7",
    title: "Assigned to you",
    description: "Sarah Johnson assigned “Mid-level donor stewardship pilot” to Michael Chen.",
    time: daysAgo(5),
    type: "info",
    read: true,
  },
];

export const ACTIVITY: ActivityItem[] = [
  { id: "a1", actorId: "u-sarah", verb: "updated", target: "the initiative “Loyalty & recurring giving program”", time: hoursAgo(2), type: "initiative" },
  { id: "a2", actorId: "u-olivia", verb: "reviewed", target: "risk “Revenue concentration in top-3 donors”", time: hoursAgo(4), type: "risk" },
  { id: "a3", actorId: "u-michael", verb: "commented on", target: "Goal “Expand services into two new regions”", time: hoursAgo(7), type: "comment" },
  { id: "a4", actorId: "u-david", verb: "marked milestone complete", target: "“Pilot cohort 1 enrolled” (Climate Education)", time: hoursAgo(9), type: "initiative" },
  { id: "a5", actorId: "u-nina", verb: "drafted", target: "report “Donor Impact Report 2025”", time: hoursAgo(22), type: "report" },
  { id: "a6", actorId: "u-emily", verb: "published", target: "survey “Volunteer Engagement Pulse” results", time: daysAgo(1), type: "survey" },
  { id: "a7", actorId: "u-michael", verb: "updated", target: "the initiative “Regional expansion — Southwest (Phoenix)”", time: daysAgo(1), type: "initiative" },
  { id: "a8", actorId: "u-sarah", verb: "shared", target: "AI recommendation “Diversify funding sources”", time: daysAgo(2), type: "ai" },
  { id: "a9", actorId: "u-olivia", verb: "closed", target: "risk “Grant report delays”", time: daysAgo(2), type: "risk" },
  { id: "a10", actorId: "u-david", verb: "added", target: "KPI “Students in pilot” to Climate Education", time: daysAgo(3), type: "goal" },
  { id: "a11", actorId: "u-sarah", verb: "finalized", target: "report “Board Summary — Q3 2025”", time: daysAgo(4), type: "report" },
  { id: "a12", actorId: "u-james", verb: "uploaded", target: "Q3 budget reforecast workbook", time: daysAgo(5), type: "report" },
];

/* ------------------------------------------------------------------ */
/* Comments                                                           */
/* ------------------------------------------------------------------ */

export const COMMENTS: Comment[] = [
  {
    id: "c1",
    targetId: "g3",
    authorId: "u-michael",
    text: "The Phoenix hire is the critical path. I've shortlisted 3 candidates and we'll extend an offer this week — but I want to flag that the interim plan (partner coverage) is our fallback if the top candidate declines.",
    time: hoursAgo(7),
    replies: [
      {
        id: "c1r1",
        authorId: "u-sarah",
        text: "Thanks Michael. Let's set a decision deadline of Friday and involve the hiring committee in the final round so we can move fast.",
        time: hoursAgo(5),
      },
    ],
  },
  {
    id: "c2",
    targetId: "g3",
    authorId: "u-olivia",
    text: "Updating risk r2 to 'Mitigating' with the recruiter engagement. Impact stays at 3 — hiring delay alone doesn't blow the budget, but combined with inflation (r9) I'd watch the Phoenix hub costs.",
    time: hoursAgo(4),
  },
  {
    id: "c3",
    targetId: "i3",
    authorId: "u-aisha",
    text: "Wave 1 outreach is going out Thursday. Response rate from the pilot segment is tracking 9% vs. 5% baseline — promising. I'll post conversion numbers after the 2-week mark.",
    time: hoursAgo(12),
  },
  {
    id: "c4",
    targetId: "g1",
    authorId: "u-sarah",
    text: "Donor retention hit 62% this month — 4 points ahead of our internal plan. The stewardship series is clearly working; let's double down on the mid-year renewal push.",
    time: daysAgo(1),
  },
];

/* ------------------------------------------------------------------ */
/* AI advisor                                                         */
/* ------------------------------------------------------------------ */

export const AI_RECS: AiRec[] = [
  {
    id: "ar1",
    title: "Reprioritize Phoenix hiring to protect the launch window",
    body:
      "Goal “Expand into two new regions” is at risk because the regional coordinator role has been open 8 weeks. Historical hiring data across similar nonprofits suggests the window closes at 12 weeks. Shortlist 3 candidates now and pre-approve an offer band so you can move in 48 hours.",
    impact: "High",
    effort: "Low",
    category: "Scale & Reach",
    goalId: "g3",
    action: "View goal",
  },
  {
    id: "ar2",
    title: "Diversify revenue to reduce top-3 donor concentration",
    body:
      "34% of revenue comes from three donors. At current growth rates, the mid-level pipeline will cover only ~8% of that exposure by Q2 2026. Recommend prioritizing two new institutional asks this quarter and converting the pilot to a permanent program.",
    impact: "High",
    effort: "Medium",
    category: "Sustainable Funding",
    goalId: "g1",
    action: "View risk",
  },
  {
    id: "ar3",
    title: "Volunteer onboarding hub: fix the mobile flow before launch",
    body:
      "Pulse survey shows onboarding ease at 3.2/5 — the weakest score in the survey. The hub is 74% complete and launching in 15 days; QA has flagged the mobile enrollment flow. A two-day fix avoids a poor first impression for 60% of volunteers who onboard on phones.",
    impact: "Medium",
    effort: "Low",
    category: "Community & People",
    goalId: "g4",
    action: "View initiative",
  },
  {
    id: "ar4",
    title: "Program pillar is at 82% budget utilization — reforecast in Q4",
    body:
      "The Program Impact pillar has spent 82% of its budget with a quarter remaining. Enrollment is ahead of plan, so this is a growth signal, but a formal reforecast now prevents a Q4 scramble and strengthens the ask for unrestricted funds.",
    impact: "Medium",
    effort: "Medium",
    category: "Operational Excellence",
    goalId: "g5",
    action: "Open report",
  },
  {
    id: "ar5",
    title: "Add a follow-up survey trigger for partner reporting",
    body:
      "Partner sentiment dropped 5 points, driven largely by reporting friction (“formats differ from our funders”). A one-click shared-report export could recover ~2 points of sentiment and reduce partner staff time by an estimated 30 hours/quarter.",
    impact: "Medium",
    effort: "High",
    category: "Stakeholders",
    action: "View survey",
  },
  {
    id: "ar6",
    title: "Board dashboard: surface key-person risk at next meeting",
    body:
      "Two grant-funded programs are single-staffed. Board visibility of this risk supports the succession-plan action item and pre-empts a surprise at renewal season. Suggested agenda slot: 10 minutes in the strategy review.",
    impact: "Low",
    effort: "Low",
    category: "Governance",
    action: "Open meeting notes",
  },
];

export const AI_STARTER_MESSAGES = [
  "How is my strategy health doing this quarter?",
  "What should I do about donor concentration?",
  "Summarize the Phoenix expansion risk",
  "Draft a board update on volunteer engagement",
  "What are the top 3 risks I should watch?",
  "How are we tracking against the 2025–2027 plan?",
];

export function getAIReply(text: string): string {
  const t = text.toLowerCase();
  if (/(retention|donor|fund|recurring|give)/.test(t)) {
    return (
      "Here's what I see on donor retention:\n\n• Retention is 62%, up 4 points this quarter and 10 points vs. two years ago. You're on pace to hit 75% by the end of 2027.\n• The stewardship email series and the recurring giving relaunch are the two highest-leverage levers — conversion on the new giving page is up 18%.\n• Watch item: monthly churn is 2.4%, just above the 1.8% target. The mid-year renewal push (due in 45 days) is the moment to close that gap.\n\nI'd recommend approving the renewal-push creative early so Aisha has a full test window before the mailing."
    );
  }
  if (/(risk|risks|phoenix|hire|expand|region)/.test(t)) {
    return (
      "On risk:\n\n• The Phoenix hiring delay (r2) is your live issue: the coordinator role has been open 8 weeks, and the launch window typically closes at 12. Score is 12 (Likely × Major).\n• The mitigation — two recruiting partners plus interim coverage — is underway, and I'd add a 48-hour offer-band pre-approval to your decision log.\n• Donor concentration (r9 → r1 in impact) remains the biggest exposure at 20/25, but it's stable and fully mitigated on paper.\n\nOverall exposure is moderate. Two of ten risks are trending up (hiring, inflation) — both are manageable with the actions already logged."
    );
  }
  if (/(volunteer|onboard|recruit|people)/.test(t)) {
    return (
      "Volunteer engagement snapshot:\n\n• Hours are up 22% YoY (12,400 annualized vs. 10,100 last year) but sentiment dipped 5 points, mostly from site-lead burnout and clunky onboarding (3.2/5).\n• The onboarding hub is 74% complete and launches in 15 days — that directly addresses the top complaint.\n• One QA item to fix before launch: the mobile enrollment flow. Roughly 60% of volunteers onboard on phones.\n\nIf the hub ships on time and the recognition program lands in Q4, I'd expect retention to tick from 71% toward the 80% target by mid-2026."
    );
  }
  if (/(budget|cost|spend|money|finance)/.test(t)) {
    return (
      "Financial posture:\n\n• Budget utilization is 68% with three quarters elapsed — slightly ahead of plan.\n• Program Impact pillar is at 82% utilization; enrollment is ahead of plan, so it's a growth signal, but a formal Q4 reforecast is wise.\n• Cost per program dollar is $0.18, down from $0.21 — you've realized $26k of the $38k tool-consolidation savings target.\n\nNet: healthy, with one reforecast action recommended before year-end."
    );
  }
  if (/(board|report|summary|govern)/.test(t)) {
    return (
      "Here's a board-ready summary:\n\n• 4 of 5 strategic goals are on track; “Expand into two new regions” is at risk solely due to the Phoenix hire.\n• Strategy health improved to 78 (from 74 in Q2).\n• One decision request to surface: approving the emergency hiring package for the regional coordinator.\n• Reserve is healthy at 4.2 months — above the 3-month policy floor.\n\nThe full Q3 Board Summary is already in Reports and marked Final, so you can share it as-is or trim to the one-pager."
    );
  }
  if (/(survey|stakeholder|partner|sentiment)/.test(t)) {
    return (
      "Stakeholder pulse:\n\n• Donors: NPS 54, satisfaction 4.2/5 — strongest in two years. The main theme in comments is wanting quarterly impact updates.\n• Volunteers: satisfaction 4.4/5, but onboarding ease at 3.2/5 is the drag — the hub launch addresses this.\n• Partners: sentiment down 5 points, driven by reporting friction. A shared-report export would recover ~2 points.\n• Board: 100% participation, 4.6/5 — committees want more dashboard time.\n\nI'd publish the Donor Satisfaction analysis this week while the data is fresh."
    );
  }
  if (/(goal|objective|plan|strategy|health)/.test(t)) {
    return (
      "Strategy health is 78 this quarter — up 4 points from Q2:\n\n• On track: Donor retention (+4 pts), New education programs (pilot at 220 students), Volunteer engagement (hub launching), Cost reduction (71%).\n• At risk: Regional expansion (28%) — single point of failure is the Phoenix coordinator hire.\n\nRecommended focus for the next two weeks: close the Phoenix offer, ship the onboarding hub, and approve the renewal-push creative. That sequencing protects your two biggest 2026 milestones."
    );
  }
  return (
    "I've looked across your strategic plan, risk register, surveys and reports. The strongest signal right now: strategy health is 78/100 and improving, but the Phoenix hiring delay is the single point of failure for the 2026 expansion milestone.\n\nI'd suggest three actions this week:\n1. Pre-approve an offer band for the regional coordinator (48-hour close).\n2. Ship the volunteer onboarding hub with the mobile-flow fix.\n3. Approve the mid-year renewal push creative.\n\nHappy to go deeper on any of these — ask me about a specific goal, risk, or report."
  );
}

/* ------------------------------------------------------------------ */
/* Monthly trends for charts                                          */
/* ------------------------------------------------------------------ */

export const MONTHS = [
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
];

export const TRENDS = {
  retention: [52, 53, 53, 54, 55, 56, 56, 58, 59, 60, 61, 62],
  volunteers: [9.2, 8.4, 7.6, 8.1, 9.3, 10.2, 10.8, 11.4, 11.2, 11.9, 12.1, 12.4],
  participants: [6.4, 6.6, 6.9, 7.1, 7.2, 7.5, 7.8, 7.9, 8.1, 8.2, 8.3, 8.4],
  costPerDollar: [0.21, 0.21, 0.2, 0.2, 0.19, 0.19, 0.19, 0.18, 0.18, 0.18, 0.18, 0.18],
  sentiment: [61, 62, 63, 63, 64, 66, 67, 68, 69, 68, 69, 70],
};

export const AI_CHAT_SEED: AiMessage[] = [
  {
    id: "ai0",
    role: "assistant",
    text:
      "Hi Sarah — I'm your strategy advisor. I've been reading across your plan, risk register, surveys and reports. Right now the highest-leverage item is the Phoenix coordinator hire: it's the single point of failure for the 2026 expansion milestone. Ask me anything about your goals, risks, or stakeholders.",
    time: hoursAgo(1),
  },
];
