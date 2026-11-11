import type { Metadata } from "next";
import ConsoleHead from "../../_site/console-head";
import { calls } from "../../_site/mock";
import Pill from "../../_site/pill";
import styles from "../../_site/site.module.css";

export const metadata: Metadata = { title: "Calls" };

export default function CallsPage() {
  return (
    <>
      <ConsoleHead
        title="Calls"
        lede="Every phone call Svaar placed, why it called, and how it ended. A missed call never counts against anyone."
      />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>When</th>
              <th>Who</th>
              <th>Why</th>
              <th>Length</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => (
              <tr key={`${call.time}-${call.person}`}>
                <td className={styles.muted}>{call.time}</td>
                <td>{call.person}</td>
                <td>{call.reason}</td>
                <td className={styles.mono}>{call.length}</td>
                <td>
                  <Pill tone={call.tone}>{call.outcome}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
