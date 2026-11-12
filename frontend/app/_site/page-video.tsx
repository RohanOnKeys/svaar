"use client";

import { useEffect, useRef, useState } from "react";
import { playWhenAllowed, prepareInline } from "../autoplay";
import styles from "./site.module.css";

const PORTRAIT = "(orientation: portrait)";

/**
 * Loop a clip whose last frame doesn't match its first. `blend` seconds (clip time)
 * before the end, the other copy starts from the beginning and fades over it. `top`
 * is stacked above `bottom`, so only its opacity changes. Returns a cleanup.
 */
function blendLoop(bottom: HTMLVideoElement, top: HTMLVideoElement, blend: number, speed: number) {
  const fade = (blend / speed) * 1000;
  prepareInline(top);
  top.style.transition = `opacity ${fade}ms linear`;
  let active = bottom;
  let fading = false;
  let timer = 0;

  const swap = () => {
    if (fading) return;
    fading = true;
    const previous = active;
    const next = previous === bottom ? top : bottom;
    next.currentTime = 0;
    next.play().then(
      () => {
        top.style.opacity = next === top ? "1" : "0";
        timer = window.setTimeout(() => {
          previous.pause();
          previous.currentTime = 0;
          active = next;
          fading = false;
        }, fade);
      },
      () => {
        // The browser refused the second copy; restart this one instead (a plain cut).
        previous.currentTime = 0;
        previous.play().catch(() => {});
        fading = false;
      },
    );
  };

  const check = (event: Event) => {
    const clip = event.currentTarget as HTMLVideoElement;
    if (clip !== active || !Number.isFinite(clip.duration)) return;
    if (event.type === "ended" || clip.currentTime >= clip.duration - blend) swap();
  };

  for (const clip of [bottom, top]) {
    clip.addEventListener("timeupdate", check);
    clip.addEventListener("ended", check);
  }
  return () => {
    window.clearTimeout(timer);
    for (const clip of [bottom, top]) {
      clip.removeEventListener("timeupdate", check);
      clip.removeEventListener("ended", check);
    }
    top.pause();
    top.style.transition = "";
    top.style.opacity = "";
  };
}

/**
 * Fixed background video for the inner pages. Landscape screens get `wide`; portrait
 * screens (phones) get `tall`. With only one of the two, that clip is turned 90° on
 * the other kind of screen, so it always fills it.
 * Only the clip in use is downloaded. Playback is started from code so phones that
 * block autoplay still start it on the first tap. Reduced-motion visitors get a
 * still frame. `speed` sets the playback rate (1 is normal; below 1 is slower).
 * `blend` (seconds of clip) fades the end into the start for a seamless loop; 0 is a
 * plain loop. `zoom` scales the clip up from the centre (1 is plain cover), to crop
 * its edges away.
 */
export default function PageVideo({
  wide = null,
  tall = null,
  speed = 1,
  blend = 0,
  zoom = 1,
}: {
  wide?: string | null;
  tall?: string | null;
  speed?: number;
  blend?: number;
  zoom?: number;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const overlay = useRef<HTMLVideoElement>(null);
  const [portrait, setPortrait] = useState<boolean | null>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(PORTRAIT);
    const pick = () => setPortrait(query.matches);
    pick();
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    query.addEventListener("change", pick);
    return () => query.removeEventListener("change", pick);
  }, []);

  const src = portrait === null ? null : portrait ? (tall ?? wide) : (wide ?? tall);
  const rotate = portrait === null ? false : portrait ? !tall : !wide;

  useEffect(() => {
    const element = video.current;
    if (!element || still) return;
    const top = overlay.current;
    // Both rates, so the speed survives a reload of the clip.
    for (const clip of top ? [element, top] : [element]) {
      clip.defaultPlaybackRate = speed;
      clip.playbackRate = speed;
    }
    const stop = playWhenAllowed(element);
    if (!top) return stop;
    const unblend = blendLoop(element, top, blend, speed);
    return () => {
      stop();
      unblend();
    };
  }, [src, still, speed, blend]);

  const turned = rotate ? styles.pageVideoTurned : "";
  return (
    <div
      className={styles.pageVideo}
      style={{ "--zoom": zoom } as React.CSSProperties}
      aria-hidden="true"
    >
      {src ? (
        <video
          ref={video}
          key={src}
          src={src}
          className={turned || undefined}
          muted
          loop={!blend}
          playsInline
          preload="auto"
        />
      ) : null}
      {src && blend ? (
        <video
          ref={overlay}
          key={`${src}-blend`}
          src={src}
          className={`${styles.pageVideoBlend} ${turned}`.trim()}
          muted
          playsInline
          preload="auto"
        />
      ) : null}
    </div>
  );
}
