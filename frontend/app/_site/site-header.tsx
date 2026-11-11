"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./site.module.css";

const links = [
  { href: "/team", label: "Team" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <Image src="/swan.png" alt="" width={894} height={868} className={styles.brandMark} />
        <span>Svaar</span>
      </Link>
      <nav className={styles.nav} aria-label="Site">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={active ? `${styles.navLink} ${styles.navActive}` : styles.navLink}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
