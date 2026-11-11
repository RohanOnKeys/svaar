import { FaLinkedinIn } from "react-icons/fa";
import { PiMailboxFill } from "react-icons/pi";

// Mail and LinkedIn marks for the team cards, drawn in the current text colour.

/** A mailbox, linking to the person's email. */
export function MailIcon() {
  return <PiMailboxFill aria-hidden="true" focusable="false" />;
}

/** Just the "in", no square around it. */
export function LinkedInIcon() {
  return <FaLinkedinIn aria-hidden="true" focusable="false" />;
}
