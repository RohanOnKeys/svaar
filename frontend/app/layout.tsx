import type { Metadata, Viewport } from "next";
import { readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { Gotu } from "next/font/google";
import "./globals.css";
import PreloadAssets from "./preload-assets";

const gotu = Gotu({ weight: "400", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Svaar",
  description:
    "A voice-enabled agent for engineering incidents: it rebuilds what happened, checks claims against evidence and calls engineers to verify them.",
  icons: { icon: "/swan.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/** Every image and video in /public, read once at build time for the preloader. */
function publicAssets() {
  const root = join(process.cwd(), "public");
  const files = readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => "/" + relative(root, join(entry.parentPath, entry.name)).split(sep).join("/"));
  return {
    images: files.filter((file) => /\.(png|jpe?g|webp|avif|svg)$/i.test(file)),
    videos: files.filter((file) => /\.mp4$/i.test(file)),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={gotu.className}>
        {children}
        <PreloadAssets {...publicAssets()} />
      </body>
    </html>
  );
}
