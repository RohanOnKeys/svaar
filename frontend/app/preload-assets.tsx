"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PAGES = ["/", "/try", "/console", "/team"];

/**
 * Warms the browser cache once per visit so moving between pages loads nothing new.
 * After the current page has finished loading, it prefetches every page's code and
 * fetches every image. Videos are fetched too, except on data-saver or slow mobile
 * connections, where pulling tens of megabytes unasked would cost the visitor.
 */
export default function PreloadAssets({ images, videos }: { images: string[]; videos: string[] }) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const warm = () => {
      if (cancelled) return;
      PAGES.forEach((page) => router.prefetch(page));
      images.forEach((src) => {
        const image = new window.Image();
        image.decoding = "async";
        image.src = src;
      });
      const connection = (navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }).connection;
      const slow = connection?.saveData || /(^|-)2g|3g/.test(connection?.effectiveType ?? "");
      if (slow) return;
      // One video at a time, so they don't compete with each other.
      const pending = videos.filter((src) => !document.querySelector(`video[src="${src}"]`));
      void (async () => {
        for (const src of pending) {
          if (cancelled) return;
          try {
            await (await fetch(src)).blob();
          } catch {
            // A failed warm-up just means that video loads normally later.
          }
        }
      })();
    };

    const start = () => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number })
        .requestIdleCallback;
      if (idle) idle(warm);
      else window.setTimeout(warm, 300);
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
    };
  }, [router, images, videos]);

  return null;
}
