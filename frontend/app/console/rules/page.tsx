import type { Metadata } from "next";
import ConsoleHead from "../../_site/console-head";
import { rules } from "../../_site/mock";
import Pill from "../../_site/pill";
import styles from "../../_site/site.module.css";

export const metadata: Metadata = { title: "Rules" };

export default function RulesPage() {
  return (
    <>
      <ConsoleHead
        title="Rules"
        lede="Models propose; code decides. Hard rules are checked by deterministic code and can never be traded away."
      >
        <button type="button" className={styles.button}>
          Add a rule
        </button>
      </ConsoleHead>

      <div className={styles.grid}>
        {rules.map((rule) => (
          <article key={rule.name} className={styles.panel}>
            <p className={styles.row} style={{ marginBottom: 10 }}>
              <Pill tone={rule.kind === "Hard" ? "bad" : "muted"}>{rule.kind}</Pill>
            </p>
            <h3>{rule.name}</h3>
            <p>{rule.detail}</p>
          </article>
        ))}
      </div>
    </>
  );
}
