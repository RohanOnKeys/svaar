import type { NextConfig } from "next";

// Versioned files (name ends in -v<number>, or lives in /team or /images where every
// replacement gets a new name) never change, so browsers and phones may keep them
// for a year without asking again.
const FOREVER = "public, max-age=31536000, immutable";
// Unversioned files: reuse for a day, then refresh quietly in the background.
const DAILY = "public, max-age=86400, stale-while-revalidate=604800";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // One stable file per image (no per-size variants), so each is fetched once,
    // preloaded on the first visit, and reused on every page from the cache.
    unoptimized: true,
  },
  async headers() {
    const cache = (value: string) => [{ key: "Cache-Control", value }];
    return [
      { source: "/team/:file*", headers: cache(FOREVER) },
      { source: "/images/:file*", headers: cache(FOREVER) },
      { source: "/:file([a-z0-9-]+-v[0-9]+\\.[a-z0-9]+)", headers: cache(FOREVER) },
      { source: "/features/:file*", headers: cache(DAILY) },
      { source: "/background.mp4", headers: cache(DAILY) },
      { source: "/swan.png", headers: cache(DAILY) },
    ];
  },
};

export default nextConfig;
