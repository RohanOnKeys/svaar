import ConsoleHead from "../_site/console-head";
import { incidents, ledger } from "../_site/mock";
import Pill from "../_site/pill";
import styles from "../_site/site.module.css";

const stats = [
  { value: "1", label: "Open incident needing someone" },
  { value: "3", label: "Calls placed today" },
  { value: "2", label: "Claims verified today" },
  { value: "1", label: "Action waiting for a code" },
];

export default function LivePage() {
  return (
    <>
      <ConsoleHead title="Live" lede="What Svaar is doing right now, and what is waiting on a person.">
        <span className={styles.live}>Demo data</span>
      </ConsoleHead>

      <div className={styles.stack}>
        <div className={styles.grid}>
          {stats.map((stat) => (
            <div key={stat.label} className={`${styles.panel} ${styles.stat}`}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.split}>
          <div className={styles.panel}>
            <h2 className={styles.sectionTitle}>Open now</h2>
            <ol className={styles.timeline}>
              {incidents
                .filter((incident) => incident.tone !== "ok")
                .map((incident) => (
                  <li key={incident.id}>
                    <span className={`${styles.mono} ${styles.muted}`}>{incident.id}</span>
                    <span>
                      {incident.title} <Pill tone={incident.tone}>{incident.status}</Pill>
                    </span>
                  </li>
                ))}
            </ol>
          </div>
          <div className={styles.panel}>
            <h2 className={styles.sectionTitle}>Latest decisions</h2>
            <ol className={styles.timeline}>
              {ledger.slice(0, 4).map((entry) => (
                <li key={entry.time}>
                  <span className={`${styles.mono} ${styles.muted}`}>{entry.time}</span>
                  <span>{entry.decision}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
