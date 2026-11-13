import Image from "next/image";
import Link from "next/link";
import { channels } from "./_site/channels";
import styles from "./page.module.css";
import BackgroundVideo from "./background-video";
import CardTrail from "./card-trail";
import MatchGap from "./match-gap";

const PREVIEW_MAILTO = "mailto:robinxander23@gmail.com?subject=Svaar%20preview";

type Feature = {
  title: string;
  body?: string;
  diagram?: { src: string; width: number; height: number; alt: string };
};

const features: Feature[] = [
  {
    title: "Ask What Happened. Every Claim, Checked.",
    // Shown as a diagram; the sentence stays as the image's description.
    diagram: {
      src: "/features/pipeline.png",
      width: 1774,
      height: 440,
      alt: "A pipeline fails at one step. Svaar rebuilds what happened, checks the claimed fix against evidence, and calls the person to ask when the evidence is missing, before the pipeline goes green.",
    },
  },
  {
    title: "Understands What You Actually Mean.",
    diagram: {
      src: "/features/routing.png",
      width: 1293,
      height: 620,
      alt: "Requests from several people flow into Svaar, which works out the intended task from past conversations and routes it onward to a ticket, an email or a phone call.",
    },
  },
  {
    title: "Dials, Then Fixes.",
    diagram: {
      src: "/features/fallback.png",
      width: 1760,
      height: 521,
      alt: "CI fails and Svaar alerts the owner in chat. When nobody acknowledges in time, it calls them, explains what broke, and lets them acknowledge on the call or in chat.",
    },
  },
];

// The six capability cards. Titles only for now; a line under each can be added
// with a `body`.
const cards: { title: string; body?: string }[] = [
  { title: "Completely Automating AI Loop Engineering" },
  { title: "Auto-Intelligence Layer Model Switching" },
  { title: "Smart Context Compiler" },
  { title: "Smart Instruction Decomposition" },
  { title: "Intelligent Ticket Assignment" },
  { title: "Multi-Channel Client-Team Coordination Engine" },
];

function Channels() {
  return (
    <div className={styles.channels}>
      <p className={styles.channelsLabel}>Available on</p>
      <ul className={styles.contacts} aria-label="Supported channels">
        {channels.map(({ label, icon: Icon }) => (
          <li key={label} className={styles.contact} title={label}>
            <Icon aria-hidden="true" />
            <span className={styles.visuallyHidden}>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  return (
    <main className={styles.page}>
      {/* The video plays while the large header is on screen and pauses as it leaves. */}
      <BackgroundVideo watch="splash" />

      <section id="splash" className={styles.splash}>
        <nav className={styles.topNav} aria-label="Site">
          <Link href="/try">Try</Link>
          <Link href="/console">Console</Link>
          <Link href="/team">Team</Link>
        </nav>
        <h1 className={styles.splashBrand}>
          <Image
            src="/swan.png"
            alt=""
            width={894}
            height={868}
            preload
            className={styles.splashSwan}
          />
          <span className={styles.splashWordmark}>vaar</span>
          <span className={styles.visuallyHidden}>Svaar</span>
        </h1>
        <span className={styles.scrollHint} aria-hidden="true" />
      </section>

      <section className={styles.hero}>
        <div className={styles.intro}>
          <p id="intro-text" className={styles.tagline}>More than a Pager</p>
        </div>
      </section>

      <section id="features" className={styles.features} aria-label="What Svaar does">
        {features.map((feature) => (
          <article key={feature.title} className={styles.feature}>
            <h3>{feature.title}</h3>
            {feature.diagram ? (
              <Image
                src={feature.diagram.src}
                alt={feature.diagram.alt}
                width={feature.diagram.width}
                height={feature.diagram.height}
                sizes="(max-width: 960px) 100vw, 900px"
                loading="eager"
                className={styles.featureDiagram}
              />
            ) : (
              <p>{feature.body}</p>
            )}
          </article>
        ))}
      </section>

      {/* In the ending, only the channel icons are white. */}
      <div className={styles.finale}>
        <section id="safety" className={styles.cardsSection} aria-label="How Svaar keeps you safe">
          {/* Six cards on larger screens; phones skip the cards entirely. */}
          {/* Wide screens: a winding trail of six cards joined by a dashed line. */}
          <div className={`${styles.cards} ${styles.cardsFull} ${styles.trail}`}>
            {cards.map((card, index) => (
              <article key={card.title} className={`${styles.card} ${styles[`step${index + 1}`]}`}>
                <h4>{card.title}</h4>
                {card.body ? <p>{card.body}</p> : null}
              </article>
            ))}
            <CardTrail />
          </div>
        </section>

        <section id="channels" className={styles.closing}>
          <Channels />
        </section>

        <footer className={styles.footer}>
          <a href={PREVIEW_MAILTO} className={styles.bookPreview}>
            Book a preview
          </a>
        </footer>
      </div>

      <MatchGap />
    </main>
  );
}
