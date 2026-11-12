import type { Metadata } from "next";
import ProfileButton from "../_site/profile-button";
import SiteHeader from "../_site/site-header";
import styles from "./console.module.css";

export const metadata: Metadata = { title: "Svaar Console" };

const DEMO_MAILTO = "mailto:robinxander23@gmail.com?subject=Svaar%20demo";

export default function ConsolePage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <ProfileButton />
      <main className={styles.main}>
        <h1 className={styles.title}>Request for access</h1>
        <a href={DEMO_MAILTO} className={styles.button}>
          Book a demo
        </a>
      </main>
    </div>
  );
}
