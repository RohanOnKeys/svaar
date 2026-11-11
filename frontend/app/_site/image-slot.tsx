import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { images, type ImageKey } from "./images";
import styles from "./site.module.css";

/**
 * Shows the real image once `public/images/<file>` exists; until then, a labelled
 * placeholder with the image's ID, file name, size and brief.
 */
export default function ImageSlot({
  name,
  className,
  optional = false,
}: {
  name: ImageKey;
  className?: string;
  /** Render nothing (instead of a placeholder box) until the real image exists. */
  optional?: boolean;
}) {
  const spec = images[name];
  const ratio = `${spec.width} / ${spec.height}`;
  const classes = [styles.slot, className].filter(Boolean).join(" ");

  if (existsSync(join(process.cwd(), "public", "images", spec.file))) {
    return (
      <Image
        src={`/images/${spec.file}`}
        alt={spec.alt}
        width={spec.width}
        height={spec.height}
        className={classes}
        style={{ aspectRatio: ratio }}
      />
    );
  }

  if (optional) return null;

  return (
    <figure className={`${classes} ${styles.slotEmpty}`} style={{ aspectRatio: ratio }}>
      <figcaption>
        <strong>
          {spec.id} · {spec.file}
        </strong>
        <span>
          {spec.width} × {spec.height}
        </span>
      </figcaption>
    </figure>
  );
}
