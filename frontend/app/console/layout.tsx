import type { Metadata } from "next";
import ConsoleNav from "../_site/console-nav";
import PageVideo from "../_site/page-video";
import ProfileButton from "../_site/profile-button";
import SiteHeader from "../_site/site-header";
import styles from "../_site/site.module.css";

export const metadata: Metadata = { title: { template: "%s · Svaar Console", default: "Svaar Console" } };

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      {/* A vertical clip: upright on phones, turned sideways on wide screens. */}
      <PageVideo wide={null} tall="/console-bg-v1.mp4" />
      <SiteHeader />
      <ProfileButton />
      <div className={styles.console}>
        <ConsoleNav />
        <main className={styles.consoleMain}>{children}</main>
      </div>
    </div>
  );
}
