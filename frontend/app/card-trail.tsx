"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type Point = [number, number];

const GAP = 14; // Space left between the line and a card.
const TITLE = 13; // Height of a card's title line, where the line leaves a card.
const RADIUS = 14; // Corner rounding, in pixels.
const STEP_OUT = 44; // How far the line steps away from a card before turning.
const OVERSHOOT = 72; // How far it runs past the next card before doubling back.

/** Straight runs joined by softly rounded corners. */
function rounded(points: Point[]) {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const inLength = Math.hypot(cx - px, cy - py) || 1;
    const outLength = Math.hypot(nx - cx, ny - cy) || 1;
    const r = Math.min(RADIUS, inLength / 2, outLength / 2);
    const ax = cx - ((cx - px) / inLength) * r;
    const ay = cy - ((cy - py) / inLength) * r;
    const bx = cx + ((nx - cx) / outLength) * r;
    const by = cy + ((ny - cy) / outLength) * r;
    d += ` L${ax},${ay} Q${cx},${cy} ${bx},${by}`;
  }
  const [lx, ly] = points[points.length - 1];
  return `${d} L${lx},${ly}`;
}

/**
 * Dashed line that winds through the card trail on wide screens like a path through
 * a maze: only straight runs and right-angle turns with rounded corners. Each stretch
 * steps out of a card, drops, runs past the next card, drops again, doubles back and
 * enters it from above. Measured from the cards' real positions, so it stays
 * attached at every width.
 */
export default function CardTrail() {
  const svg = useRef<SVGSVGElement>(null);
  const [shape, setShape] = useState<{ w: number; h: number; d: string; dots: Point[] } | null>(
    null,
  );

  useEffect(() => {
    const element = svg.current;
    const container = element?.parentElement;
    if (!element || !container) return;

    const draw = () => {
      if (getComputedStyle(element).display === "none") return;
      const origin = container.getBoundingClientRect();
      const boxes = Array.from(container.querySelectorAll("article")).map((card) => {
        const box = card.getBoundingClientRect();
        return {
          left: box.left - origin.left,
          right: box.right - origin.left,
          top: box.top - origin.top,
          bottom: box.bottom - origin.top,
          cx: box.left - origin.left + box.width / 2,
        };
      });

      const paths: string[] = [];
      const dots: Point[] = [];
      for (let index = 0; index < boxes.length - 1; index += 1) {
        const a = boxes[index];
        const b = boxes[index + 1];
        const way = b.cx > a.cx ? 1 : -1;
        const start: Point = [way > 0 ? a.right + GAP : a.left - GAP, a.top + TITLE];
        const end: Point = [b.cx, b.top - GAP];
        const room = Math.max(end[1] - a.bottom, 40);
        const firstDrop = a.bottom + room * 0.35;
        const secondDrop = a.bottom + room * 0.7;
        const out = start[0] + way * STEP_OUT;
        const past = b.cx + way * OVERSHOOT;
        const points: Point[] = [
          start,
          [out, start[1]],
          [out, firstDrop],
          [past, firstDrop],
          [past, secondDrop],
          [b.cx, secondDrop],
          end,
        ];
        paths.push(rounded(points));
        dots.push(start, end);
      }

      setShape({ w: origin.width, h: origin.height, d: paths.join(" "), dots });
    };

    draw();
    const resize = new ResizeObserver(draw);
    resize.observe(container);
    document.fonts?.ready.then(draw);
    return () => resize.disconnect();
  }, []);

  return (
    <svg
      ref={svg}
      className={styles.trailLine}
      width={shape?.w ?? 0}
      height={shape?.h ?? 0}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="card-trail" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={shape?.h ?? 1}>
          <stop offset="0" stopColor="#332C2C" />
          <stop offset="0.4" stopColor="#572332" />
          <stop offset="0.72" stopColor="#722F40" />
          <stop offset="1" stopColor="#2A9D8F" />
        </linearGradient>
        {/* Neon glow to match the diagrams: a tight and a wide blur under the line. */}
        <filter
          id="card-trail-glow"
          filterUnits="userSpaceOnUse"
          x="-40"
          y="-40"
          width={(shape?.w ?? 0) + 80}
          height={(shape?.h ?? 0) + 80}
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="tight" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="wide" />
          <feMerge>
            <feMergeNode in="wide" />
            <feMergeNode in="tight" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {shape ? (
        <g filter="url(#card-trail-glow)">
          <path
            d={shape.d}
            fill="none"
            stroke="url(#card-trail)"
            strokeWidth="3"
            strokeDasharray="10 9"
            strokeLinecap="round"
          />
          {shape.dots.map(([x, y], index) => (
            <circle key={index} cx={x} cy={y} r="5" fill="url(#card-trail)" />
          ))}
        </g>
      ) : null}
    </svg>
  );
}
