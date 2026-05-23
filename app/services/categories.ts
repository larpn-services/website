export type WorkStatus = "private" | "in-progress" | "active";

export type WorkItem = {
  title: string;
  subtitle?: string;
  href?: string;
  comingSoon?: boolean;
  /** Free-text date string, e.g. "March 2026". Surfaced inline in BrandList. */
  date?: string;
  /** Renders a coloured pill in BrandList — red, ember, or emerald. */
  status?: WorkStatus;
};

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  cover: string;
  items: WorkItem[];
};

export const categories: Category[] = [
  {
    slug: "client-work",
    name: "Client work",
    blurb:
      "Production builds shipped for paying clients — sites, dashboards, internal tools.",
    cover:
      "https://plus.unsplash.com/premium_photo-1723489242223-865b4a8cf7b8?q=80&w=1600&auto=format&fit=crop",
    items: [
      {
        title: "My Natural Me",
        subtitle: "Website",
        href: "https://dementiacaregiversupport.org/",
        date: "March 2026",
      },
      {
        title: "Kaizen PM Consulting",
        subtitle: "Website",
        status: "in-progress",
      },
      {
        title: "Yapn",
        subtitle: "AI voice-agency analytics dashboard",
        date: "August 2025",
        status: "private",
      },
      {
        title: "Tab Saver",
        subtitle: "Website",
        href: "https://chromewebstore.google.com/detail/tab-saver/nonbbacblhbkhblenjgljomlllcppidp",
        date: "January 2026",
      },
    ],
  },
  {
    slug: "chrome-extensions",
    name: "Chrome Extensions",
    blurb:
      "Browser extensions — automations, overlays, and quality-of-life tools that live in your tab bar.",
    cover:
      "https://images.unsplash.com/photo-1530435460869-d13625c69bbf?q=80&w=1600&auto=format&fit=crop",
    items: [
      {
        title: "AdImmunity",
        subtitle: "Ad blocker",
        href: "https://chromewebstore.google.com/detail/ad-immunity-ad-blocker/lnoponmddlnbkgkmpkmdpjgclpinplkk",
        date: "November 2025",
        status: "active",
      },
      {
        title: "Tab Saver",
        subtitle: "Tab session manager",
        href: "https://chromewebstore.google.com/detail/tab-saver/nonbbacblhbkhblenjgljomlllcppidp",
        date: "July 2025",
      },
    ],
  },
  {
    slug: "applications",
    name: "Applications",
    blurb:
      "Standalone apps — desktop, web, and mobile builds for focused use cases.",
    cover:
      "https://i.pinimg.com/1200x/99/ca/5c/99ca5cf82cf12df8801f7b2bef38d325.jpg",
    items: [
      {
        title: "CoverLetter.ai",
        subtitle: "AI-assisted cover letter generator",
        href: "https://cover-letterai.vercel.app/",
        date: "May 2025",
      },
      {
        title: "Algorithm Visualizer",
        subtitle: "Interactive learning platform",
        href: "https://algorithm-visuals.vercel.app/",
        date: "February 2025",
      },
      {
        title: "TimeTravel",
        subtitle: "Social media automation · desktop app",
        comingSoon: true,
      },
    ],
  },
  {
    slug: "projects",
    name: "Projects",
    blurb:
      "Experiments, prototypes, and side builds — the lab notebook of the studio.",
    cover:
      "https://i.pinimg.com/736x/7c/15/39/7c1539cf7ff0207cb49ce0d338de1e5f.jpg",
    items: [
      {
        title: "Flappy Face",
        subtitle: "Game",
        href: "https://omarayman23.github.io/flappyFace/",
        date: "2025",
      },
      {
        title: "Terminal ping-pong",
        subtitle: "Terminal game",
        href: "https://github.com/omarayman23/terminal-pingpong",
        date: "2025",
      },
      {
        title: "Open-source contributions",
        subtitle: "GitHub",
        href: "https://github.com/omarayman23/openSourceContributions",
        date: "2025",
      },
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

// ─── Sorting ───────────────────────────────────────────────────────────────
// Directories render newest → oldest. Items in active/upcoming states without
// an explicit date pin to the top (they represent current work).

const MONTHS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

function sortKey(item: WorkItem): number {
  if (!item.date) {
    // "In progress" or "Coming soon" without a date → treat as current.
    if (item.status === "in-progress" || item.comingSoon) {
      return Number.POSITIVE_INFINITY;
    }
    return Number.NEGATIVE_INFINITY;
  }
  let month = 1;
  let year = 0;
  for (const part of item.date.trim().toLowerCase().split(/\s+/)) {
    if (MONTHS[part]) month = MONTHS[part];
    else if (/^\d{4}$/.test(part)) year = parseInt(part, 10);
  }
  return year * 100 + month;
}

export function sortItemsByDateDesc(items: WorkItem[]): WorkItem[] {
  return [...items].sort((a, b) => sortKey(b) - sortKey(a));
}
