"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type Point = [number, number];

// How each card connects to the next, following the hand-drawn layout:
// "hv" leaves from the side and drops into the next card's top,
// "h" runs side to side, "vh" drops from the bottom and turns into the side.
const ROUTES = ["hv", "hv", "hv", "h", "vh"] as const;

const RADIUS = 14; // Corner rounding, in pixels.
const GAP = 12; // Space left between the line and a card.
const TITLE = 13; // Height of a card's title line, where side connections attach.

/** Path through the points with softly rounded corners. */
function rounded(points: Point[]) {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const inLength = Math.hypot(cx - px, cy - py);
    const outLength = Math.hypot(nx - cx, ny - cy);
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
 * Dashed line that winds through the card trail on wide screens. It is measured
 * from the cards' real positions, so it stays attached at every width.
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
      ROUTES.forEach((route, index) => {
        const a = boxes[index];
        const b = boxes[index + 1];
        if (!a || !b) return;
        const toRight = b.cx > a.cx;
        let points: Point[];
        if (route === "hv") {
          const start: Point = [toRight ? a.right + GAP : a.left - GAP, a.top + TITLE];
          points = [start, [b.cx, start[1]], [b.cx, b.top - GAP]];
        } else if (route === "h") {
          const startY = a.top + TITLE;
          const endY = b.top + TITLE;
          const start: Point = [toRight ? a.right + GAP : a.left - GAP, startY];
          const end: Point = [toRight ? b.left - GAP : b.right + GAP, endY];
          const mid = (start[0] + end[0]) / 2;
          points = startY === endY ? [start, end] : [start, [mid, startY], [mid, endY], end];
        } else {
          const end: Point = [toRight ? b.left - GAP : b.right + GAP, b.top + TITLE];
          points = [[a.cx, a.bottom + GAP], [a.cx, end[1]], end];
        }
        paths.push(rounded(points));
        dots.push(points[0], points[points.length - 1]);
      });

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
      </defs>
      {shape ? (
        <>
          <path
            d={shape.d}
            fill="none"
            stroke="url(#card-trail)"
            strokeWidth="1.6"
            strokeDasharray="7 7"
            strokeLinecap="round"
          />
          {shape.dots.map(([x, y], index) => (
            <circle key={index} cx={x} cy={y} r="3.5" fill="url(#card-trail)" />
          ))}
        </>
      ) : null}
    </svg>
  );
}
