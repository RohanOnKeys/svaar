"use client";

import { useEffect, useRef } from "react";
import { playWhenAllowed } from "../autoplay";
import styles from "./try.module.css";

/**
 * The Try page's background video. It is a vertical clip: upright on phones, turned
 * sideways to fill wide screens (see try.module.css). Phones that block autoplay
 * start it on the first tap; reduced-motion visitors keep the still underneath.
 * `speed` sets the playback rate (1 is normal; below 1 is slower).
 */
export default function TryVideo({ src, speed = 1 }: { src: string; speed?: number }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Both rates, so the speed survives a reload of the clip.
    element.defaultPlaybackRate = speed;
    element.playbackRate = speed;
    return playWhenAllowed(element);
  }, [speed]);

  return (
    <video ref={video} src={src} className={styles.bgVideo} muted loop playsInline preload="auto" />
  );
}
