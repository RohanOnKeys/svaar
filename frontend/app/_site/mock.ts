// Sample data for the demo pages. Names and numbers are made up; nothing is live.

export type Tone = "ok" | "warn" | "bad" | "muted";

export const incidents = [
  {
    id: "INC-1042",
    title: "deploy-api: integration tests failing on main",
    owner: "Asha Rao",
    status: "Calling owner",
    tone: "bad" as Tone,
    opened: "02:14",
    step: "test:integration",
  },
  {
    id: "INC-1041",
    title: "web: build cache miss doubles CI time",
    owner: "Karan Mehta",
    status: "Acknowledged",
    tone: "warn" as Tone,
    opened: "Yesterday 18:40",
    step: "build:web",
  },
  {
    id: "INC-1039",
    title: "worker: migration 0026 timed out in staging",
    owner: "Meera Iyer",
    status: "Resolved, verified",
    tone: "ok" as Tone,
    opened: "Yesterday 11:05",
    step: "migrate:staging",
  },
  {
    id: "INC-1036",
    title: "payments: flaky webhook test",
    owner: "Dev Sharma",
    status: "Claim unverified",
    tone: "warn" as Tone,
    opened: "Mon 16:22",
    step: "test:webhooks",
  },
];

export const calls = [
  { time: "02:24", person: "Asha Rao", reason: "Unacknowledged CI failure", length: "0:58", outcome: "Acknowledged", tone: "ok" as Tone },
  { time: "Yesterday 19:02", person: "Dev Sharma", reason: "Check claim: webhook fix merged", length: "1:34", outcome: "Evidence missing", tone: "warn" as Tone },
  { time: "Yesterday 12:10", person: "Meera Iyer", reason: "Phone verification", length: "0:41", outcome: "Verified", tone: "ok" as Tone },
  { time: "Mon 21:47", person: "Karan Mehta", reason: "Unacknowledged CI failure", length: "—", outcome: "Missed, no penalty", tone: "muted" as Tone },
];

export const claims = [
  { who: "Asha Rao", said: "The fix is merged.", looked: "Merges to main after 02:14", found: "Merge #2291", tone: "ok" as Tone, verdict: "Verified" },
  { who: "Dev Sharma", said: "Webhook test is fixed.", looked: "Merges and green runs since Mon", found: "Nothing yet", tone: "warn" as Tone, verdict: "Asked on a call" },
  { who: "Meera Iyer", said: "Staging migration passed.", looked: "Run log for migrate:staging", found: "Run 8790, passed", tone: "ok" as Tone, verdict: "Verified" },
  { who: "Karan Mehta", said: "Cache issue is resolved.", looked: "Build times, last 5 runs", found: "Still 2× slower", tone: "bad" as Tone, verdict: "Not supported" },
];

export const approvals = [
  { action: "Rerun deploy-api pipeline on main", by: "Asha Rao", owner: "Asha Rao", channel: "Code sent by SMS", status: "Waiting for code", tone: "warn" as Tone },
  { action: "Rerun migrate:staging", by: "Meera Iyer", owner: "Meera Iyer", channel: "Code read on a call", status: "Ran once", tone: "ok" as Tone },
  { action: "Rerun web build with cache cleared", by: "Karan Mehta", owner: "Asha Rao", channel: "Code sent by email", status: "Expired", tone: "muted" as Tone },
];

export const constraints = [
  { kind: "Freeze", text: "No production deploys Friday 18:00 to Monday 09:00." },
  { kind: "On-call", text: "Someone from payments on call at all times." },
  { kind: "Deploy slot", text: "deploy-api needs a 30-minute slot before the release." },
  { kind: "Leave", text: "Meera is away Thursday." },
];

export const planSlots = [
  { day: "Thu", oncall: "Dev Sharma", deploy: "—", note: "Meera away" },
  { day: "Fri", oncall: "Asha Rao", deploy: "deploy-api 10:00–10:30", note: "Before the freeze" },
  { day: "Sat", oncall: "Karan Mehta", deploy: "Frozen", note: "" },
  { day: "Sun", oncall: "Dev Sharma", deploy: "Frozen", note: "" },
];

export const rules = [
  { name: "Freeze windows are absolute", detail: "No plan may place a production deploy inside a freeze.", kind: "Hard" },
  { name: "Payments always covered", detail: "Every hour has at least one payments engineer on call.", kind: "Hard" },
  { name: "Nobody on call while on leave", detail: "Leave always wins over the rota.", kind: "Hard" },
  { name: "Risky actions need the owner", detail: "Reruns need a one-time code from the owner, on a second channel.", kind: "Hard" },
  { name: "Missed calls never count against anyone", detail: "A missed call is logged, never scored.", kind: "Hard" },
  { name: "Spread night shifts", detail: "Prefer plans that give no one two nights in a row.", kind: "Soft" },
];

export const people = [
  { name: "Asha Rao", team: "Platform", role: "Owner", phone: "Verified", invite: "Joined", tone: "ok" as Tone },
  { name: "Dev Sharma", team: "Payments", role: "Engineer", phone: "Verified", invite: "Joined", tone: "ok" as Tone },
  { name: "Meera Iyer", team: "Data", role: "Engineer", phone: "Verified", invite: "Joined", tone: "ok" as Tone },
  { name: "Karan Mehta", team: "Web", role: "Engineer", phone: "Not verified", invite: "Joined", tone: "warn" as Tone },
  { name: "Neel Kapoor", team: "Web", role: "Engineer", phone: "—", invite: "Invite sent", tone: "muted" as Tone },
];

export const ledger = [
  { time: "02:41:19", decision: "Marked INC-1042 claim as verified", reason: "Merge #2291 landed on main after the failure." },
  { time: "02:25:02", decision: "Assigned INC-1042 to Asha Rao", reason: "Acknowledged on the call." },
  { time: "02:24:05", decision: "Called Asha Rao", reason: "No acknowledgement within 10 minutes." },
  { time: "02:14:05", decision: "Alerted Asha Rao in #deploys", reason: "Owner of deploy-api per the service map." },
  { time: "Yesterday 19:03", decision: "Left INC-1036 open", reason: "Dev's claim had no merge or green run behind it." },
  { time: "Yesterday 12:11", decision: "Verified Meera Iyer's phone", reason: "Code read aloud on the call matched." },
];

export const scenarios = [
  {
    image: "scenarioCi" as const,
    title: "A build breaks and nobody answers",
    body: "Fail a run. Svaar alerts the owner in chat, waits, then calls and lets them acknowledge on the call.",
  },
  {
    image: "scenarioClaim" as const,
    title: "Someone says it's fixed",
    body: "Tell Svaar the fix is merged. It looks for the merge, and if it isn't there, it calls and asks.",
  },
  {
    image: "scenarioFeedback" as const,
    title: "Vague feedback comes in",
    body: "Send a loose, informal request. Svaar works out the task, pulls in past context and routes it to the right person.",
  },
];
