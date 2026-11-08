"use client";

import { useEffect } from "react";

/**
 * Uses the gap between the intro text and the first feature heading as the page's
 * single rhythm and applies it between every later section: each feature, the card
 * grid and the closing block (channels plus footer, kept together at the bottom).
 * The large logo screen is left alone.
 * Measured live, so the spacing stays equal at every screen size.
 */
export default function MatchGap() {
  useEffect(() => {
    const top = (element: Element) => element.getBoundingClientRect().top;
    const bottom = (element: Element) => element.getBoundingClientRect().bottom;

    // Give `node` a top margin so the space from `above` to `below` equals `gap`.
    const space = (node: HTMLElement, above: Element, below: Element, gap: number) => {
      const applied = parseFloat(node.style.marginTop || "0") || 0;
      const natural = top(below) - bottom(above) - applied;
      const value = `${Math.max(Math.round(gap - natural), 0)}px`;
      if (node.style.marginTop !== value) node.style.marginTop = value;
    };

    const sync = () => {
      const intro = document.getElementById("intro-text");
      const features = Array.from(document.querySelectorAll<HTMLElement>("#features article"));
      const cards = document.getElementById("safety");
      const firstCard = cards?.querySelector("article");
      const closing = document.getElementById("channels");
      const firstHeading = features[0]?.querySelector("h3");
      if (!intro || !firstHeading || !cards || !firstCard || !closing) return;

      const gap = top(firstHeading) - bottom(intro);

      for (let index = 1; index < features.length; index += 1) {
        const previous = features[index - 1].querySelector("p");
        const heading = features[index].querySelector("h3");
        if (previous && heading) space(features[index], previous, heading, gap);
      }

      const lastText = features[features.length - 1].querySelector("p");
      if (lastText) space(cards, lastText, firstCard, gap);
      // The channels and the footer form one block at the bottom, so only the
      // space above the block follows the rhythm.
      const label = closing.firstElementChild ?? closing;
      space(closing, cards, label, gap);
    };

    sync();
    const resize = new ResizeObserver(sync);
    resize.observe(document.body);
    document.fonts?.ready.then(sync);
    return () => resize.disconnect();
  }, []);

  return null;
}
