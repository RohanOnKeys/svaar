"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.css";

// Strongest blur at the bottom of the page, in pixels; kept gentle on purpose.
const MAX_BLUR = 10;
// Share of the remaining distance covered each frame; lower is smoother.
const EASING = 0.08;

/**
 * Full-screen background video that plays while the element with the given ID is
 * on screen and pauses, keeping its current frame, the moment it has scrolled away.
 * Scrolling back to it resumes playback. Reduced-motion visitors see the first frame.
 *
 * The background also blurs gradually with scroll depth. The blur eases toward its
 * target every animation frame, so it changes continuously instead of in steps.
 */
export default function BackgroundVideo({ watch }: { watch: string }) {
  const wrapper = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const layer = wrapper.current;
    if (!layer) return;

    let current = 0;
    let frame = 0;

    const targetBlur = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
      // Smoothstep: starts softly, builds through the middle, settles at the end.
      return MAX_BLUR * progress * progress * (3 - 2 * progress);
    };

    const step = () => {
      const goal = targetBlur();
      current += (goal - current) * EASING;
      if (Math.abs(goal - current) < 0.01) current = goal;
      layer.style.filter = current > 0.01 ? `blur(${current.toFixed(3)}px)` : "none";
      frame = current === goal ? 0 : requestAnimationFrame(step);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={wrapper} className={styles.background} aria-hidden="true">
      <video ref={video} src="/background.mp4" muted loop playsInline preload="auto" />
    </div>
  );
}
