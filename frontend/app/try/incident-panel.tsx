"use client";

import type { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import styles from "./try.module.css";

type Incident = {
  id: string;
  state: string;
  workflow_name: string | null;
  head_branch: string | null;
  failure_count: number;
  opened_at: string;
  acknowledged_at: string | null;
};

type Event = { occurred_at: string; source: string; kind: string; conclusion: string | null };

const API = process.env.NEXT_PUBLIC_SVAAR_API_URL?.replace(/\/$/, "");
const POLL_MS = 4000;

/**
 * Live view of the signed-in person's latest incident, refreshed every few seconds.
 * In the browser-only demo this is where the owner alert appears (instead of a chat
 * app), with a button to acknowledge it right here. Everything shown comes from the
 * backend's recorded facts; nothing is simulated on the page.
 */
export default function IncidentPanel({ user }: { user: User }) {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [breaking, setBreaking] = useState<"idle" | "starting" | "started">("idle");

  const call = useCallback(
    async (path: string, method = "GET") => {
      const response = await fetch(`${API}/api/v1/try${path}`, {
        method,
        headers: { Authorization: `Bearer ${await user.getIdToken()}` },
      });
      if (!response.ok) throw new Error(String(response.status));
      return response.json();
    },
    [user],
  );

  useEffect(() => {
    if (!API) return;
    let stopped = false;
    const load = async () => {
      try {
        const body = (await call("/incident")) as { incident: Incident | null; events: Event[] };
        if (stopped) return;
        setIncident(body.incident);
        setEvents(body.events);
        if (body.incident?.state === "open") setBreaking("idle");
        setError(null);
      } catch {
        if (!stopped) setError("Can't reach the demo service right now.");
      }
    };
    void load();
    const timer = window.setInterval(load, POLL_MS);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [call]);

  const breakBuild = async () => {
    setBreaking("starting");
    setError(null);
    try {
      const response = await fetch(`${API}/api/v1/try/break`, {
        method: "POST",
        headers: { Authorization: `Bearer ${await user.getIdToken()}` },
      });
      if (response.status === 429) {
        setError("A run was started a moment ago. Give it a couple of minutes.");
        setBreaking("idle");
        return;
      }
      if (!response.ok) throw new Error(String(response.status));
      setBreaking("started");
    } catch {
      setError("Couldn't start the demo run. Please try again.");
      setBreaking("idle");
    }
  };

  const acknowledge = async () => {
    if (!incident) return;
    setBusy(true);
    try {
      setIncident((await call(`/incident/${incident.id}/acknowledge`, "POST")) as Incident);
    } catch {
      setError("Couldn't acknowledge. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!API) return null;

  return (
    <section className={`${styles.panel} ${styles.form}`} aria-live="polite" aria-label="Live incident">
      <h3>Live</h3>
      {!incident || incident.state !== "open" ? (
        <div className={styles.stack}>
          {breaking === "started" ? (
            <p>
              GitHub is running the demo repository&apos;s check now. When it fails, the alert
              appears here (usually within a minute).
            </p>
          ) : (
            <p className={styles.muted}>
              {incident ? "Nothing open right now." : "No incidents on your demo team yet."} Break
              the build to see what Svaar does.
            </p>
          )}
          <div className={styles.row}>
            <button
              type="button"
              className={styles.buttonSolid}
              onClick={breakBuild}
              disabled={breaking !== "idle"}
            >
              {breaking === "starting" ? "Starting…" : breaking === "started" ? "Waiting for GitHub…" : "Break the build"}
            </button>
          </div>
        </div>
      ) : null}
      {incident ? (
        <>
          <p>
            <strong>{incident.state === "open" ? "Alert: " : ""}</strong>
            {incident.workflow_name || "A CI workflow"}
            {incident.head_branch ? ` on ${incident.head_branch}` : ""} failed
            {incident.failure_count > 1 ? ` (${incident.failure_count} times)` : ""}.
          </p>
          <ol className={styles.timeline}>
            <li>
              <span className={styles.muted}>{clock(incident.opened_at)}</span>
              <span>Incident opened and the owner alerted here.</span>
            </li>
            {events.map((event, index) => (
              <li key={`${event.occurred_at}-${index}`}>
                <span className={styles.muted}>{clock(event.occurred_at)}</span>
                <span>
                  {event.source} {event.kind.replaceAll("_", " ")}
                  {event.conclusion ? `: ${event.conclusion}` : ""}
                </span>
              </li>
            ))}
            {incident.acknowledged_at ? (
              <li>
                <span className={styles.muted}>{clock(incident.acknowledged_at)}</span>
                <span>Acknowledged. Escalation stopped.</span>
              </li>
            ) : null}
          </ol>
          {incident.state === "open" ? (
            <div className={styles.row}>
              <button type="button" className={styles.buttonSolid} onClick={acknowledge} disabled={busy}>
                {busy ? "Acknowledging…" : "Acknowledge"}
              </button>
              <button type="button" className={styles.button} disabled title="Needs a verified phone">
                Call me now
              </button>
            </div>
          ) : null}
        </>
      ) : null}
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
}

function clock(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
