"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { firebaseAuth, firebaseConfigured } from "../../_site/firebase";
import IncidentPanel from "../incident-panel";
import styles from "../try.module.css";

/**
 * The live incident trail for the signed-in visitor. Signed-out visitors (or a site
 * without sign-in configured) are sent back to the Try page to set up first.
 */
export default function LiveTrail({ started }: { started: boolean }) {
  const [user, setUser] = useState<User | null | undefined>(firebaseConfigured ? undefined : null);

  useEffect(() => {
    if (!firebaseConfigured) return;
    return onAuthStateChanged(firebaseAuth(), setUser);
  }, []);

  if (user === undefined) return <div className={styles.panel} aria-busy="true" />;

  if (!user) {
    return (
      <div className={`${styles.panel} ${styles.form}`}>
        <p>Sign in and set up your demo team first.</p>
        <div className={styles.row}>
          <Link href="/try" className={styles.buttonSolid}>
            Back to Try
          </Link>
        </div>
      </div>
    );
  }

  return <IncidentPanel user={user} started={started} />;
}
