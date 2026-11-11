import type { Metadata } from "next";
import Image from "next/image";
import { LinkedInIcon, MailIcon } from "./icons";
import PageVideo from "../_site/page-video";
import SiteHeader from "../_site/site-header";
import styles from "../_site/site.module.css";

export const metadata: Metadata = { title: "Team · Svaar" };

const team = [
  {
    name: "Rohan Pattanayak",
    photo: "/team/rohan.jpg",
    email: "rohanpxquantum@gmail.com",
    linkedin: "https://www.linkedin.com/in/rohan-a142a1284/",
  },
  {
    name: "Soumya Ranjan Panda",
    photo: "/team/soumya.jpg",
    email: "pandaranjan314@gmail.com",
    linkedin: "https://www.linkedin.com/in/soumya-ranjan-panda-802b1a331/",
  },
  {
    name: "Suneeti Aryaa",
    photo: "/team/suneeti.jpg",
    email: "suneetiaryaa@gmail.com",
    linkedin: "https://www.linkedin.com/in/suneeti-aryaa-02a3351ba/",
  },
  {
    name: "Shreya Mishra",
    photo: "/team/shreya.jpg",
    email: "shreyamishra2k05@gmail.com",
    linkedin: "https://www.linkedin.com/in/shreya-mishra-developer/",
  },
];

export default function TeamPage() {
  return (
    <div className={styles.shell}>
      {/* Same video as the landing page, turned upright on phones. */}
      <PageVideo wide="/background.mp4" tall={null} />
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
                sizes="(max-width: 760px) 50vw, 260px"
                className={styles.memberPhoto}
              />
              {/* Mail on the left, LinkedIn on the right, right under the photo. */}
              <div className={styles.memberLinks}>
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
