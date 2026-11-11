import type { Metadata } from "next";
import ConsoleHead from "../../_site/console-head";
import { claims } from "../../_site/mock";
import Pill from "../../_site/pill";
import styles from "../../_site/site.module.css";

export const metadata: Metadata = { title: "Claims" };

export default function ClaimsPage() {
  return (
    <>
      <ConsoleHead
        title="Claims"
        lede="When someone says it's fixed, Svaar looks for proof. No proof, and it calls them to ask."
      />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Who</th>
              <th>Said</th>
              <th>Svaar looked at</th>
              <th>Found</th>
              <th>Verdict</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={`${claim.who}-${claim.said}`}>
                <td>{claim.who}</td>
                <td>“{claim.said}”</td>
                <td className={styles.muted}>{claim.looked}</td>
                <td>{claim.found}</td>
                <td>
                  <Pill tone={claim.tone}>{claim.verdict}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
