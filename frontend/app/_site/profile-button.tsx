"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { firebaseAuth, firebaseConfigured, signInWithGoogle } from "./firebase";
import styles from "./site.module.css";

/**
 * Round profile button fixed in the bottom-right corner. Signed out, it signs in with
 * Google. Signed in, it shows the person's Google profile photo and opens a small card
 * with their name, email and "Log out".
 */
export default function ProfileButton() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!firebaseConfigured) return;
    return onAuthStateChanged(firebaseAuth(), (current) => {
      setUser(current);
      setPhotoFailed(false);
      setReady(true);
      if (!current) setOpen(false);
    });
  }, []);

  // Close the card on an outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (box.current && !box.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!firebaseConfigured || !ready) return null;

  const name = user?.displayName || user?.email || "";
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  if (!user) {
    return (
      <div className={styles.profile}>
        {error ? (
          <p className={styles.profileCard} role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="button"
          className={styles.profileButton}
          aria-label="Log in with Google"
          title="Log in with Google"
          onClick={async () => setError(await signInWithGoogle())}
        >
          <FaUserCircle aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className={styles.profile} ref={box}>
      {open ? (
        <div className={styles.profileCard} role="dialog" aria-label="Your account">
          <strong>{user.displayName || "Signed in"}</strong>
          <span className={styles.muted}>{user.email}</span>
          <button
            type="button"
            className={styles.button}
            onClick={async () => {
              await signOut(firebaseAuth());
              setOpen(false);
            }}
          >
            Log out
          </button>
        </div>
      ) : null}
      <button
        type="button"
        className={styles.profileButton}
        aria-label={`Account: ${name}`}
        aria-expanded={open}
        title={name}
        onClick={() => setOpen((value) => !value)}
      >
        {user.photoURL && !photoFailed ? (
          // Google profile photos are served from googleusercontent.com; no-referrer
          // avoids the 403 they return to some referrers.
          <img
            src={user.photoURL}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setPhotoFailed(true)}
          />
        ) : (
          <span aria-hidden="true">{initial}</span>
        )}
      </button>
    </div>
  );
}
