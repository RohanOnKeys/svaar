import type { Metadata } from "next";
import PageVideo from "../_site/page-video";
import ProfileButton from "../_site/profile-button";
import SiteHeader from "../_site/site-header";
import styles from "./console.module.css";

export const metadata: Metadata = { title: "Svaar Console" };

const DEMO_MAILTO = "mailto:robinxander23@gmail.com?subject=Svaar%20demo";

export default function ConsolePage() {
  return (
    <div className={styles.page}>
      {/* A wide clip at quarter speed, its end faded into its start: as-is on desktop,
          turned upright on phones. */}
      <PageVideo wide="/creame_waves.mp4" tall={null} speed={0.25} blend={2} />
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
