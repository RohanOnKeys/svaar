import type { Metadata } from "next";
import ProfileButton from "../../_site/profile-button";
import SiteHeader from "../../_site/site-header";
import styles from "../try.module.css";
import LiveTrail from "./live-trail";

export const metadata: Metadata = { title: "Live · Try Svaar" };

/**
 * The live trail for a demo run, on its own page. The Try page's buttons bring
 * visitors here; `?started=1` means a run was just started, so the page says it is
 * waiting for GitHub straight away.
 */
export default async function LivePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const started = (await searchParams).started === "1";
  return (
    <div className={styles.page}>
      {/* The same burgundy filter over the shared background video as the Try page. */}
      <div className={styles.background} aria-hidden="true" />
      <SiteHeader mark="ivory" />
      <ProfileButton />
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Live</h1>
          <p className={styles.lede}>
            Everything Svaar does with your demo run shows up here as it happens.
          </p>
        </section>
        <div className={styles.liveTrail}>
          <LiveTrail started={started} />
        </div>
      </main>
    </div>
  );
}
