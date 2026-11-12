import type { Metadata } from "next";
import ImageSlot from "../_site/image-slot";
import { scenarios } from "../_site/mock";
import ProfileButton from "../_site/profile-button";
import SiteHeader from "../_site/site-header";
import ScenarioCards from "./scenario-cards";
import SignUp from "./sign-up";
import styles from "./try.module.css";

export const metadata: Metadata = { title: "Try Svaar" };

const steps = [
  "Continue with Google, then add your name and mobile number.",
  "Svaar calls and reads you a code. Say it back to verify your phone.",
  "You get your own demo team and a pipeline you are allowed to break.",
  "Break the build and watch Svaar handle it, live, right here.",
];

export default function TryPage() {
  return (
    <div className={styles.page}>
      {/* A burgundy tint over the shared background video, so the text stays readable. */}
      <div className={styles.background} aria-hidden="true" />
      <SiteHeader />
      <ProfileButton />
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>More than a Pager</h1>
          <p className={styles.lede}>
            Svaar reads the failure, tells you what broke, checks what people claim, and only rings
            your phone when it has to. Set up a demo team, break a build, and let it call you.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Set up a demo team</h2>
          <div className={styles.split}>
            <SignUp />
            <ol className={`${styles.timeline} ${styles.steps}`} aria-label="What happens next">
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Scenarios to try</h2>
          <ScenarioCards
            scenarios={scenarios.map((scenario, index) => ({
              title: scenario.title,
              body: scenario.body,
              // Only "A build breaks" has a live trigger so far.
              run: index === 0 ? "/break" : undefined,
              // The first card keeps its image placeholder; the others say TBA.
              image: (
                <ImageSlot
                  name={scenario.image}
                  className={styles.cardImage}
                  label={index === 0 ? undefined : "TBA"}
                />
              ),
            }))}
          />
        </section>
      </main>
    </div>
  );
}
