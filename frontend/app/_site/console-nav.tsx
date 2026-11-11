"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./site.module.css";

const sections = [
  { href: "/console", label: "Live" },
  { href: "/console/incidents", label: "Incidents" },
  { href: "/console/calls", label: "Calls" },
  { href: "/console/claims", label: "Claims" },
  { href: "/console/approvals", label: "Approvals" },
  { href: "/console/plans", label: "Plans" },
  { href: "/console/rules", label: "Rules" },
  { href: "/console/people", label: "People" },
  { href: "/console/ledger", label: "Ledger" },
  { href: "/console/integrations", label: "Integrations" },
];

export default function ConsoleNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar} aria-label="Console">
      <p className={styles.sideLabel}>Console</p>
      {sections.map((section) => {
        const active = pathname === section.href;
        return (
          <Link
            key={section.href}
            href={section.href}
            className={active ? `${styles.sideLink} ${styles.sideActive}` : styles.sideLink}
            aria-current={active ? "page" : undefined}
          >
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
}
