import type { Metadata } from "next";
import Image from "next/image";
import { LinkedInIcon, MailIcon } from "./icons";
import SiteHeader from "../_site/site-header";
import styles from "../_site/site.module.css";

export const metadata: Metadata = { title: "Team · Svaar" };

// `color` matches each sticker's outline; a white outline uses the hair instead, so the
// icons show on the light background.
const team: {
  name: string;
  photo: string;
  email: string;
  linkedin: string;
  color: string;
  mirrored?: boolean;
}[] = [
  {
    name: "Rohan Pattanayak",
    photo: "/team/rohan-v2.png",
    color: "#4a3226",
    email: "rohanpxquantum@gmail.com",
    linkedin: "https://www.linkedin.com/in/rohan-a142a1284/",
  },
  {
    name: "Soumya Ranjan Panda",
    photo: "/team/soumya-v2.png",
    color: "#111",
    email: "pandaranjan314@gmail.com",
    linkedin: "https://www.linkedin.com/in/soumya-ranjan-panda-802b1a331/",
  },
  {
    name: "Suneeti Aryaa",
    photo: "/team/suneeti-v3.png",
    color: "#490711",
    email: "suneetiaryaa@gmail.com",
    linkedin: "https://www.linkedin.com/in/suneeti-aryaa-02a3351ba/",
  },
  {
    name: "Shreya Mishra",
    photo: "/team/shreya-v4.png",
    color: "#0c4450",
    email: "shreyamishra2k05@gmail.com",
    linkedin: "https://www.linkedin.com/in/shreya-mishra-developer/",
  },
];

export default function TeamPage() {
  return (
    <div className={styles.shell}>
      <SiteHeader />
      <main className={styles.main}>
        <h1 className={styles.visuallyHidden}>Team</h1>

        <ul className={styles.team}>
          {team.map((member) => (
            <li key={member.email} className={styles.member}>
              <Image
                src={member.photo}
                alt={member.name}
                width={600}
                height={600}
                sizes="(max-width: 760px) 170px, 300px"
                // Load straight away (not when scrolled to), so phones don't wait.
                loading="eager"
                className={
                  member.mirrored
                    ? `${styles.memberPhoto} ${styles.memberPhotoMirrored}`
                    : styles.memberPhoto
                }
              />
              {/* Mail and LinkedIn, side by side and centred under the sticker. */}
              <div
                className={styles.memberLinks}
                style={
                  {
                    "--icon-fill": member.color,
                  } as React.CSSProperties
                }
              >
                  <a
                    href={`mailto:${member.email}`}
                    className={styles.memberIcon}
                    aria-label={`Email ${member.name}`}
                    title={member.email}
                  >
                    <MailIcon />
                  </a>
                  <a
                    href={member.linkedin}
                    className={styles.memberIcon}
                    aria-label={`${member.name} on LinkedIn`}
                    title="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedInIcon />
                  </a>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
