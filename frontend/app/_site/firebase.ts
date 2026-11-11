"use client";

import { getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithRedirect } from "firebase/auth";

/**
 * Firebase, used only for "Continue with Google" on /try. The config values are
 * public by design; they come from NEXT_PUBLIC_FIREBASE_* in .env.local (and Vercel).
 * Whoever receives the resulting sign-in token must still verify it server-side.
 */
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(config.apiKey && config.authDomain && config.projectId);

export function firebaseAuth() {
  const app = getApps()[0] ?? initializeApp(config);
  return getAuth(app);
}

export function googleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

/**
 * Sign in with Google in a popup, falling back to a full-page redirect where popups
 * are blocked (common on phones). Returns an error message, or null on success or
 * when the person simply closed the popup.
 */
export async function signInWithGoogle(): Promise<string | null> {
  try {
    await signInWithPopup(firebaseAuth(), googleProvider());
    return null;
  } catch (problem) {
    const code = (problem as { code?: string }).code ?? "";
    if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
      await signInWithRedirect(firebaseAuth(), googleProvider());
      return null;
    }
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return null;
    return "Google sign-in didn't complete. Please try again.";
  }
}
