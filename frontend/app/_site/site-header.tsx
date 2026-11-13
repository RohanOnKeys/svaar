"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./site.module.css";

const links = [
  { href: "/try", label: "Try" },
  { href: "/console", label: "Console" },
  { href: "/team", label: "Team" },
];

// The swan in the header: the dark one by default, an ivory one for dark backgrounds.
const MARKS = {
  dark: { src: "/swan.png", width: 894, height: 868 },
  ivory: { src: "/swan-ivory.png", width: 1080, height: 1049 },
};

export default function SiteHeader({ mark = "dark" }: { mark?: keyof typeof MARKS }) {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <Image
          {...MARKS[mark]}
          alt=""
          className={styles.brandMark}
          loading="eager"
        />
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
