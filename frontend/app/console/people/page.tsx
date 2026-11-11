import type { Metadata } from "next";
import ConsoleHead from "../../_site/console-head";
import { people } from "../../_site/mock";
import Pill from "../../_site/pill";
import styles from "../../_site/site.module.css";

export const metadata: Metadata = { title: "People" };

export default function PeoplePage() {
  return (
    <>
      <ConsoleHead
        title="People"
        lede="People join with single-use invites, and phones are verified by a code read aloud on a call. Nobody gets in by claiming to be someone."
      >
        <button type="button" className={styles.button}>
          Send an invite
        </button>
      </ConsoleHead>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Team</th>
              <th>Role</th>
              <th>Invite</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.name}>
                <td>{person.name}</td>
                <td>{person.team}</td>
                <td>{person.role}</td>
                <td className={styles.muted}>{person.invite}</td>
                <td>
                  <Pill tone={person.tone}>{person.phone}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
