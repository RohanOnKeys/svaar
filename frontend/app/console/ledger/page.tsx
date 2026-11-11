import type { Metadata } from "next";
import ConsoleHead from "../../_site/console-head";
import { ledger } from "../../_site/mock";
import styles from "../../_site/site.module.css";

export const metadata: Metadata = { title: "Ledger" };

export default function LedgerPage() {
  return (
    <>
      <ConsoleHead
        title="Ledger"
        lede="Each decision and each action, written down with its reason, so you can always see what Svaar did and why."
      >
        <button type="button" className={styles.button}>
          Export
        </button>
      </ConsoleHead>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>When</th>
              <th>Decision</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((entry) => (
              <tr key={entry.time}>
                <td className={`${styles.mono} ${styles.muted}`}>{entry.time}</td>
                <td>{entry.decision}</td>
                <td className={styles.muted}>{entry.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
