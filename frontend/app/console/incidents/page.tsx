import type { Metadata } from "next";
import ConsoleHead from "../../_site/console-head";
import { incidents } from "../../_site/mock";
import Pill from "../../_site/pill";
import styles from "../../_site/site.module.css";

export const metadata: Metadata = { title: "Incidents" };

export default function IncidentsPage() {
  return (
    <>
      <ConsoleHead
        title="Incidents"
        lede="Every failure Svaar has picked up, rebuilt from recorded events, with the step that broke."
      >
        <button type="button" className={styles.button}>
          Replay an incident
        </button>
      </ConsoleHead>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>What broke</th>
              <th>Failed step</th>
              <th>Owner</th>
              <th>Opened</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.id}>
                <td className={styles.mono}>{incident.id}</td>
                <td>{incident.title}</td>
                <td className={styles.mono}>{incident.step}</td>
                <td>{incident.owner}</td>
                <td className={styles.muted}>{incident.opened}</td>
                <td>
                  <Pill tone={incident.tone}>{incident.status}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
