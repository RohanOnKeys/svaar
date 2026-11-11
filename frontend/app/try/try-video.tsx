"use client";

import { useEffect, useRef } from "react";
import { playWhenAllowed } from "../autoplay";
import styles from "./try.module.css";

/**
 * The Try page's background video. It is a vertical clip: upright on phones, turned
 * sideways to fill wide screens (see try.module.css). Phones that block autoplay
 * start it on the first tap; reduced-motion visitors keep the still underneath.
 */
export default function TryVideo({ src }: { src: string }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return playWhenAllowed(element);
  }, []);

  return (
    <video ref={video} src={src} className={styles.bgVideo} muted loop playsInline preload="auto" />
  );
}
