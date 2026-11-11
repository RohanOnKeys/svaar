import type { Metadata } from "next";
import ConsoleHead from "../../_site/console-head";
import { approvals } from "../../_site/mock";
import Pill from "../../_site/pill";
import styles from "../../_site/site.module.css";

export const metadata: Metadata = { title: "Approvals" };

export default function ApprovalsPage() {
  return (
    <>
      <ConsoleHead
        title="Approvals"
        lede="Risky actions wait for a one-time code from the owner, sent on a second channel. Each one runs once, and only once."
      />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Action</th>
              <th>Asked by</th>
              <th>Owner</th>
              <th>Code</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((approval) => (
              <tr key={approval.action}>
                <td>{approval.action}</td>
                <td>{approval.by}</td>
                <td>{approval.owner}</td>
                <td className={styles.muted}>{approval.channel}</td>
                <td>
                  <Pill tone={approval.tone}>{approval.status}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
