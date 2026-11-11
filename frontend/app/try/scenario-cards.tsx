"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebaseAuth, firebaseConfigured, signInWithGoogle } from "../_site/firebase";
import styles from "./try.module.css";

const API = process.env.NEXT_PUBLIC_SVAAR_API_URL?.replace(/\/$/, "");

type Scenario = {
  title: string;
  body: string;
  /** Backend route that starts it; scenarios without one are not built yet. */
  run?: string;
  image: React.ReactNode;
};

type RunState = "idle" | "starting" | "started";

/**
 * The scenario cards, each with one button that runs it. Only scenarios with a
 * working backend trigger are enabled; the rest say so plainly.
 */
export default function ScenarioCards({ scenarios }: { scenarios: Scenario[] }) {
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<Record<string, RunState>>({});
  const [message, setMessage] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!firebaseConfigured) return;
    return onAuthStateChanged(firebaseAuth(), setUser);
  }, []);

  const run = async (scenario: Scenario) => {
    const key = scenario.title;
    const say = (text: string) => setMessage((all) => ({ ...all, [key]: text }));
    if (!scenario.run) return;
    if (!user) {
      const problem = await signInWithGoogle();
      if (problem) say(problem);
      return;
    }
    if (!API) {
      say("The demo service isn't connected on this site yet.");
      return;
    }
    setState((all) => ({ ...all, [key]: "starting" }));
    say("");
    try {
      const response = await fetch(`${API}/api/v1/try${scenario.run}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${await user.getIdToken()}` },
      });
      if (response.status === 404) {
        say("Create your demo team above first.");
      } else if (response.status === 429) {
        say("This was started a moment ago. Give it a couple of minutes.");
      } else if (!response.ok) {
        say("Couldn't start it. Please try again.");
      } else {
        setState((all) => ({ ...all, [key]: "started" }));
        say("Started. Watch the Live section above; the alert appears there.");
        return;
      }
    } catch {
      say("Couldn't reach the demo service. Please try again.");
    }
    setState((all) => ({ ...all, [key]: "idle" }));
  };

  return (
    <ol className={styles.scenarios}>
      {scenarios.map((scenario) => {
        const current = state[scenario.title] ?? "idle";
        return (
          <li key={scenario.title} className={styles.card}>
            {scenario.image}
            <h3>{scenario.title}</h3>
            <p>{scenario.body}</p>
            <div className={styles.cardAction}>
              {scenario.run ? (
                <button
                  type="button"
                  className={styles.buttonSolid}
                  onClick={() => run(scenario)}
                  disabled={current !== "idle"}
                >
                  {current === "starting"
                    ? "Starting…"
                    : current === "started"
                      ? "Running…"
                      : user
                        ? "Run it"
                        : "Sign in to run"}
                </button>
              ) : (
                <button type="button" className={styles.button} disabled>
                  Coming soon
                </button>
              )}
              {message[scenario.title] ? (
                <p className={styles.cardNote} role="status">
                  {message[scenario.title]}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
