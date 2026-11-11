// Scenario cards for the Try page.

export const scenarios = [
  {
    image: "scenarioCi" as const,
    title: "Threat Weightage and Response",
    body: "Fail a run. Svaar alerts the owner in chat, waits, then calls and lets them acknowledge on the call.",
  },
  {
    image: "scenarioClaim" as const,
    title: "Zero Trust Matrix",
    body: "Tell Svaar the fix is merged. It looks for the merge, and if it isn't there, it calls and asks.",
  },
  {
    image: "scenarioFeedback" as const,
    title: "Context Aware Feedback",
    body: "Send a loose, informal request. Svaar works out the task, pulls in past context and routes it to the right person.",
  },
];
