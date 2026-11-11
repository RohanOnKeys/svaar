"use client";

import { useEffect, useRef, useState } from "react";
import { playWhenAllowed } from "../autoplay";
import styles from "./site.module.css";

const PORTRAIT = "(orientation: portrait)";

/**
 * Fixed background video for the inner pages. Landscape screens get `wide`; portrait
 * screens (phones) get `tall`. With only one of the two, that clip is turned 90° on
 * the other kind of screen, so it always fills it.
 * Only the clip in use is downloaded. Playback is started from code so phones that
 * block autoplay still start it on the first tap. Reduced-motion visitors get a
 * still frame.
 */
export default function PageVideo({
  wide = null,
  tall = null,
}: {
  wide?: string | null;
  tall?: string | null;
}) {
  const video = useRef<HTMLVideoElement>(null);
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
    return playWhenAllowed(element);
  }, [src, still]);

  return (
    <div className={styles.pageVideo} aria-hidden="true">
      {src ? (
        <video
          ref={video}
          key={src}
          src={src}
          className={rotate ? styles.pageVideoTurned : undefined}
          muted
          loop
          playsInline
          preload="auto"
        />
      ) : null}
    </div>
  );
}
