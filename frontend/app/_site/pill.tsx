import type { Tone } from "./mock";
import styles from "./site.module.css";

const toneClass: Record<Tone, string> = {
  ok: styles.ok,
  warn: styles.warn,
  bad: styles.bad,
  muted: styles.mutedPill,
};

export default function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <span className={`${styles.pill} ${toneClass[tone]}`}>{children}</span>;
}
