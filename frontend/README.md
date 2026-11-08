# Svaar web

Next.js client site for Svaar. Independent of the Python service.

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
```

- Font: Gotu, loaded with `next/font/google`.
- Assets in `public/`: `background.mp4` (background video) and `swan.png` (logo with a
  transparent background).
- The video plays while the large header is on screen and pauses the moment it scrolls
  away (`app/background-video.tsx`); reduced-motion visitors see its first frame.
- The channel icons are informational, not links.
