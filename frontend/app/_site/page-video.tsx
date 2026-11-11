"use client";

import { useEffect, useState } from "react";
import styles from "./site.module.css";

const PORTRAIT = "(orientation: portrait)";

/**
 * Fixed background video for the inner pages. Landscape screens get `wide`; portrait
 * screens (phones) get `tall` when there is one, otherwise `wide` turned upright.
 * Only the clip in use is downloaded. Reduced-motion visitors get a still frame.
 */
export default function PageVideo({
  wide = "/pages-wide.mp4",
  tall = "/pages-tall.mp4",
}: {
  wide?: string;
  tall?: string | null;
}) {
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

  const src = portrait === null ? null : portrait && tall ? tall : wide;
  const rotate = portrait === true && !tall;

  return (
    <div className={styles.pageVideo} aria-hidden="true">
      {src ? (
        <video
          key={src}
          src={src}
          className={rotate ? styles.pageVideoTurned : undefined}
          muted
          loop
          playsInline
          autoPlay={!still}
          preload="auto"
        />
      ) : null}
    </div>
  );
}
