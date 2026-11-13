"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { firebaseAuth, firebaseConfigured, signInWithGoogle } from "../_site/firebase";
import styles from "./try.module.css";

type Stage = "loading" | "signed-out" | "details" | "saving" | "ready";

type Member = {
  org_id: string;
  display_name: string;
  phone_verified: boolean;
  created: boolean;
};

const API = process.env.NEXT_PUBLIC_SVAAR_API_URL?.replace(/\/$/, "");

/**
 * Demo sign-up: "Continue with Google", then a short step for name and phone.
 * Google confirms the email; the backend checks Google's token itself and creates
 * (or returns) this person's demo team. The phone is verified later by Svaar,
 * with a code read aloud on a call.
 */
export default function SignUp() {
  const [stage, setStage] = useState<Stage>(firebaseConfigured ? "loading" : "signed-out");
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    if (!firebaseConfigured) return;
    return onAuthStateChanged(firebaseAuth(), (current) => {
      setUser(current);
      if (current) {
        setName((value) => value || current.displayName || "");
        setStage((value) => (value === "ready" ? value : "details"));
      } else {
        setStage("signed-out");
      }
    });
  }, []);

  const signIn = async () => {
    setError(null);
    setError(await signInWithGoogle());
  };

  const createTeam = async () => {
    if (!user) return;
    setError(null);
    if (!API) {
      setError("The demo service isn't connected on this site yet.");
      return;
    }
    setStage("saving");
    try {
      const response = await fetch(`${API}/api/v1/try/session`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ display_name: name.trim() }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setMember((await response.json()) as Member);
      setStage("ready");
    } catch {
      setError("Couldn't reach the demo service. Please try again in a moment.");
      setStage("details");
    }
  };

  const leave = async () => {
    await signOut(firebaseAuth());
    setPhone("");
    setName("");
  };

  const phoneValid = /^\+[1-9]\d{7,14}$/.test(phone.replace(/[\s-]/g, ""));

  if (!firebaseConfigured) {
    return (
      <div className={`${styles.panel} ${styles.form}`}>
        <p className={styles.muted}>Google sign-in isn&apos;t configured on this deployment yet.</p>
      </div>
    );
  }

  if (stage === "loading") {
    return <div className={`${styles.panel} ${styles.form}`} aria-busy="true" />;
  }

  if (stage === "signed-out" || !user) {
    return (
      <div className={`${styles.panel} ${styles.form}`}>
        <button
          type="button"
          className={styles.googleButton}
          onClick={signIn}
          aria-label="Continue with Google"
          title="Continue with Google"
        >
          <FaGoogle aria-hidden="true" />
        </button>
        <p className={styles.muted}>Google confirms your email. Nothing is posted anywhere.</p>
        {error ? <p role="alert">{error}</p> : null}
      </div>
    );
  }

  if (stage === "ready") {
    return (
      <div className={`${styles.panel} ${styles.form}`}>
        <p>
          {member?.created ? "Your demo team is ready" : "Welcome back"},{" "}
          {(member?.display_name || name).split(" ")[0] || "there"}. Next, Svaar will call{" "}
          <strong>{maskPhone(phone)}</strong> and read you a code to verify the number.
        </p>
        <p className={styles.muted}>Signed in as {user.email}.</p>
        <div className={styles.row}>
          <button type="button" className={styles.button} onClick={() => setStage("details")}>
            Edit details
          </button>
          <button type="button" className={styles.button} onClick={leave}>
            Sign out
          </button>
        </div>
        {/* The live trail has its own page. */}
        <div className={styles.row}>
          <Link href="/try/live" className={styles.buttonSolid}>
            See it live
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      className={`${styles.panel} ${styles.form}`}
      onSubmit={(event) => {
        event.preventDefault();
        if (phoneValid && name.trim()) void createTeam();
      }}
    >
      <p className={styles.row}>
        Signed in as <strong>{user.email}</strong>
        <button type="button" className={styles.linkButton} onClick={leave}>
          Not you?
        </button>
      </p>
      <label className={styles.field}>
        Your name
        <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
      </label>
      <label className={styles.field}>
        Mobile number, with country code
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          type="tel"
          inputMode="tel"
          placeholder="+91 98xxx xxxxx"
          autoComplete="tel"
          required
          aria-invalid={phone !== "" && !phoneValid}
        />
      </label>
      <div className={styles.row}>
        <button
          type="submit"
          className={styles.buttonSolid}
          disabled={!phoneValid || !name.trim() || stage === "saving"}
        >
          {stage === "saving" ? "Creating…" : "Create my demo team"}
        </button>
        <span className={styles.muted}>Svaar will call to verify your number.</span>
      </div>
      {error ? <p role="alert">{error}</p> : null}
    </form>
  );
}

/** Show only the country code and last two digits. */
function maskPhone(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits.length > 6 ? `${digits.slice(0, 3)} •••• ••${digits.slice(-2)}` : digits;
}
