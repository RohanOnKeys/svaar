/**
 * Every image the site still needs. Each page shows a labelled placeholder until a
 * file with the listed name is dropped into `public/images/`; then the real image
 * is shown instead, with no code change.
 */
export type ImageSpec = {
  id: string;
  file: string;
  width: number;
  height: number;
  page: string;
  alt: string;
  brief: string;
};

export const images = {
  og: {
    id: "IMG-01",
    file: "og-card.png",
    width: 1200,
    height: 630,
    page: "Link preview (all pages)",
    alt: "Svaar. Not a pager.",
    brief:
      "Peach background, the swan mark and the words 'Not a pager.'. Calm, lots of empty space.",
  },
  tryHero: {
    id: "IMG-02",
    file: "try-hero.png",
    width: 1600,
    height: 900,
    page: "/try",
    alt: "A phone lighting up on a desk beside a laptop showing a failed build.",
    brief:
      "Night desk scene: a phone lights up with an incoming call while a laptop shows a red CI run. Warm peach and ink tones, soft grain, no readable brand names.",
  },
  scenarioCi: {
    id: "IMG-03",
    file: "scenario-ci.png",
    width: 800,
    height: 600,
    page: "/try",
    alt: "A failed pipeline step highlighted in red.",
    brief: "Abstract pipeline of five steps, the fourth one broken. Flat, ink lines on peach.",
  },
  scenarioClaim: {
    id: "IMG-04",
    file: "scenario-claim.png",
    width: 800,
    height: 600,
    page: "/try",
    alt: "A chat message saying the fix is merged, next to an empty merge list.",
    brief:
      "A chat bubble saying 'fix is merged' beside a magnifying glass over an empty list. Same flat style.",
  },
  scenarioFeedback: {
    id: "IMG-05",
    file: "scenario-feedback.png",
    width: 800,
    height: 600,
    page: "/try",
    alt: "A loose client message turning into a neat task card with an owner.",
    brief:
      "A messy, informal chat bubble on the left becoming a tidy task card with a small person avatar on the right. Same flat style.",
  },
  integrationsHero: {
    id: "IMG-09",
    file: "integrations-hero.png",
    width: 1600,
    height: 600,
    page: "/console/integrations",
    alt: "The swan mark at the centre of a ring of channel symbols.",
    brief:
      "The swan in the middle, with simple generic symbols for mail, phone, chat and code around it, joined by thin lines. No third-party logos.",
  },
} satisfies Record<string, ImageSpec>;

export type ImageKey = keyof typeof images;
