"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.css";

/**
 * Full-screen background video that plays while the element with the given ID is
 * on screen and pauses, keeping its current frame, the moment it has scrolled away.
 * Scrolling back to it resumes playback. Reduced-motion visitors see the first frame.
 */
export default function BackgroundVideo({ watch }: { watch: string }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    const target = document.getElementById(watch);
    if (!element || !target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.play().catch(() => {});
      } else {
        element.pause();
      }
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [watch]);

  return (
    <div className={styles.background} aria-hidden="true">
      <video ref={video} src="/background.mp4" muted loop playsInline preload="auto" />
    </div>
  );
}
