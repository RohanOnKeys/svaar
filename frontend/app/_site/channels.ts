import type { IconType } from "react-icons";
import { FaDiscord, FaEnvelope, FaPhoneAlt, FaSlack, FaTelegramPlane } from "react-icons/fa";

/** Channels Svaar is available in; shown as information, not links. */
export const channels: { label: string; icon: IconType }[] = [
  { label: "Email", icon: FaEnvelope },
  { label: "Phone", icon: FaPhoneAlt },
  { label: "Discord", icon: FaDiscord },
  { label: "Slack", icon: FaSlack },
  { label: "Telegram", icon: FaTelegramPlane },
];
