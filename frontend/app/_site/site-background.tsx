"use client";

import { usePathname } from "next/navigation";
import PageVideo from "./page-video";

// The one background clip for the inner pages (Try, Console, Team).
const CLIP = "/team/14683997_3840_2160_30fps.mp4";
// How far the clip is scaled up from its centre so the wave fills the screen.
const ZOOM = 1.5;

/**
 * The inner pages' shared background. It is mounted once in the root layout, so it
 * keeps playing, uninterrupted, while visitors move between those pages. The landing
 * page has its own video, so nothing is drawn there.
 */
export default function SiteBackground() {
  if (usePathname() === "/") return null;
  // A wide clip: as-is on desktop, turned upright on phones.
  return <PageVideo wide={CLIP} zoom={ZOOM} />;
}
