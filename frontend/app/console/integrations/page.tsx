import type { Metadata } from "next";
import type { IconType } from "react-icons";
import { FaDiscord, FaEnvelope, FaGithub, FaPhoneAlt, FaSlack, FaTelegramPlane } from "react-icons/fa";
import ConsoleHead from "../../_site/console-head";
import ImageSlot from "../../_site/image-slot";
import type { Tone } from "../../_site/mock";
import Pill from "../../_site/pill";
import styles from "../../_site/site.module.css";

export const metadata: Metadata = { title: "Integrations" };

const integrations: { name: string; icon: IconType; use: string; status: string; tone: Tone }[] = [
  { name: "GitHub", icon: FaGithub, use: "CI runs and merges, the evidence behind every claim.", status: "Connected", tone: "ok" },
  { name: "Phone", icon: FaPhoneAlt, use: "Calls to owners, acknowledgements and phone verification.", status: "Connected", tone: "ok" },
  { name: "Slack", icon: FaSlack, use: "Alerts and questions in team chat.", status: "Connected", tone: "ok" },
  { name: "Discord", icon: FaDiscord, use: "The same agent and rules, in Discord.", status: "Not set up", tone: "muted" },
  { name: "Telegram", icon: FaTelegramPlane, use: "Alerts and one-time codes on a second channel.", status: "Not set up", tone: "muted" },
  { name: "Email", icon: FaEnvelope, use: "Invites, summaries and one-time codes.", status: "Connected", tone: "ok" },
];

export default function IntegrationsPage() {
  return (
    <>
      <ConsoleHead
        title="Integrations"
        lede="One agent, the same tools and the same rules, wherever your team already talks."
      />

      <div className={styles.stack}>
        <ImageSlot name="integrationsHero" />
        <div className={styles.grid}>
          {integrations.map(({ name, icon: Icon, use, status, tone }) => (
            <article key={name} className={styles.panel}>
              <p className={styles.row} style={{ justifyContent: "space-between", marginBottom: 12 }}>
                <Icon className={styles.channelIcon} aria-hidden="true" />
                <Pill tone={tone}>{status}</Pill>
              </p>
              <h3>{name}</h3>
              <p>{use}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
