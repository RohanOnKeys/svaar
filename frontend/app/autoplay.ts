/**
 * Helpers that make muted background videos start reliably on phones.
 *
 * Phones only autoplay a video that is muted and inline, and some block even that
 * (iPhone Low Power Mode, Android data saver). These helpers mark the video muted in
 * every way browsers check, try to play it, and if playback is refused, try again on
 * the visitor's first tap, touch, scroll or key press.
 */

const GESTURES = ["pointerdown", "touchend", "click", "keydown", "scroll"] as const;

/** Mark a video muted and inline as both a property and an attribute. */
export function prepareInline(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
}

/**
 * Play the video; if the browser refuses, retry once on the first user gesture.
 * Returns a function that removes any pending retry.
 */
export function playWhenAllowed(video: HTMLVideoElement) {
  prepareInline(video);
  let waiting = false;

  const retry = () => {
    stop();
    video.play().catch(() => {});
  };

  const stop = () => {
    if (!waiting) return;
    waiting = false;
    GESTURES.forEach((name) => window.removeEventListener(name, retry));
  };

  video.play().catch(() => {
    if (waiting) return;
    waiting = true;
    GESTURES.forEach((name) => window.addEventListener(name, retry, { passive: true }));
  });

  return stop;
}
