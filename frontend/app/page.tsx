import Image from "next/image";
import type { IconType } from "react-icons";
import { FaDiscord, FaEnvelope, FaPhoneAlt, FaSlack, FaTelegramPlane } from "react-icons/fa";
import styles from "./page.module.css";
import BackgroundVideo from "./background-video";
import MatchGap from "./match-gap";

// Channels Svaar supports; shown as information, not links.
const channels: { label: string; icon: IconType }[] = [
  { label: "Email", icon: FaEnvelope },
  { label: "Phone", icon: FaPhoneAlt },
  { label: "Discord", icon: FaDiscord },
  { label: "Slack", icon: FaSlack },
  { label: "Telegram", icon: FaTelegramPlane },
];

const PREVIEW_MAILTO = "mailto:rohanpxquantum@gmail.com?subject=Svaar%20preview";

const features = [
  {
    title: "Ask What Happened. Every Claim, Checked.",
    body: "When a pipeline breaks, ask Svaar in chat or on a call and hear the incident rebuilt from recorded events, in order, with the step that failed. When someone says the fix is merged, Svaar looks for the merge, and if the evidence is missing it calls that person and asks. A missed call never counts against anyone.",
  },
  {
    title: "Understands What You Actually Mean.",
    body: "Svaar interprets ambiguous, informal client requests and infers the intent behind them. It traces requirements across previous conversations to pin down the exact task, pulls in the relevant context, and routes it to the right person to get it done.",
  },
  {
    title: "It Calls When Nobody Answers.",
    body: "Svaar alerts the owner in team chat the moment CI fails. If nobody acknowledges in time, it phones them, explains what broke in two plain sentences, and lets them acknowledge right there on the call.",
  },
];

const cards = [
  {
    title: "Vague Requests, Clear Tasks.",
    body: "Informal asks become a defined task, with context from past conversations and the right owner attached.",
  },
  {
    title: "One Agent, Chat and Voice.",
    body: "Team chat and phone calls reach the same agent, the same tools and the same rules. Pick up wherever you are.",
  },
  {
    title: "Verified, Every Time.",
    body: "People join with single-use invites, and phones are verified by a code read aloud on a call. Nobody gets in by claiming to be someone.",
  },
  {
    title: "Risky Actions Wait for You.",
    body: "Reruns and other risky actions need a one-time code from the owner on a second channel. They run once, and only once.",
  },
  {
    title: "Validated Plans, Simulated First.",
    body: "Freezes, on-call coverage and deploy slots become a plan that passes every hard rule, then a clearly labelled sandbox run before anything touches production.",
  },
  {
    title: "Every Decision on Record.",
    body: "Each decision and each action is written down with its reason, so you can always see what Svaar did and why.",
  },
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
        <h1 className={styles.splashBrand}>
          <Image
            src="/swan.png"
            alt=""
            width={894}
            height={868}
            priority
            className={styles.splashSwan}
          />
          <span className={styles.splashWordmark}>vaar</span>
          <span className={styles.visuallyHidden}>Svaar</span>
        </h1>
        <span className={styles.scrollHint} aria-hidden="true" />
      </section>

      <section className={styles.hero}>
        <div className={styles.intro}>
          <p id="intro-text">
            Svaar is a voice-enabled agent for engineering incidents. It lives in team chat,
            watches CI, rebuilds what happened from recorded events, checks status claims against
            evidence, calls engineers by phone to verify them, and negotiates conflicting
            constraints into a plan that deterministic code has validated.
          </p>
        </div>
      </section>

      <section id="features" className={styles.features} aria-label="What Svaar does">
        {features.map((feature) => (
          <article key={feature.title} className={styles.feature}>
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </article>
        ))}
      </section>

      {/* In the ending, only the channel icons are white. */}
      <div className={styles.finale}>
        <section id="safety" className={styles.cards} aria-label="How Svaar keeps you safe">
          {cards.map((card) => (
            <article key={card.title} className={styles.card}>
              <h4>{card.title}</h4>
              <p>{card.body}</p>
            </article>
          ))}
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
