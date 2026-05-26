export type TemplateTheme =
  | "portfolio"
  | "saas"
  | "ecommerce"
  | "editorial";

export type Template = {
  slug: string;
  name: string;
  description: string;
  theme: TemplateTheme;
  cover: string;
  previewUrl?: string;
  price?: number;
  comingSoon?: boolean;
};

export const THEMES: { id: TemplateTheme | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "portfolio", label: "Portfolio / Agency" },
  { id: "saas", label: "SaaS / Dashboard" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "editorial", label: "Blog / Editorial" },
];

// Seed templates — replace covers and previewUrls as real ones land.
export const templates: Template[] = [
  {
    slug: "ember-folio",
    name: "Ember Folio",
    description: "Dark, motion-first portfolio with case-study deep-dives.",
    theme: "portfolio",
    cover:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop",
    price: 79,
    comingSoon: true,
  },
  {
    slug: "studio-mono",
    name: "Studio Mono",
    description:
      "Monospace agency layout — typography-first, no images required.",
    theme: "portfolio",
    cover:
      "https://images.unsplash.com/photo-1561070791-2526d30994b8?q=80&w=1600&auto=format&fit=crop",
    price: 49,
    comingSoon: true,
  },
  {
    slug: "saas-pulse",
    name: "SaaS Pulse",
    description:
      "Conversion-tuned landing with feature grids and pricing tiers.",
    theme: "saas",
    cover:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    price: 99,
    comingSoon: true,
  },
  {
    slug: "dash-control",
    name: "Dash Control",
    description: "Internal-tools dashboard skeleton with sidebar + tables.",
    theme: "saas",
    cover:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    price: 129,
    comingSoon: true,
  },
  {
    slug: "shop-minimal",
    name: "Shop Minimal",
    description:
      "Two-column boutique storefront with focused product cards.",
    theme: "ecommerce",
    cover:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
    price: 119,
    comingSoon: true,
  },
  {
    slug: "shop-bazaar",
    name: "Shop Bazaar",
    description: "High-density grid for catalogs with 50+ SKUs.",
    theme: "ecommerce",
    cover:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1600&auto=format&fit=crop",
    price: 149,
    comingSoon: true,
  },
  {
    slug: "essay-press",
    name: "Essay Press",
    description:
      "Long-form blog template with serif typography and reader mode.",
    theme: "editorial",
    cover:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1600&auto=format&fit=crop",
    price: 39,
    comingSoon: true,
  },
  {
    slug: "magazine-cut",
    name: "Magazine Cut",
    description:
      "Editorial homepage with featured stories, sections, and an archive.",
    theme: "editorial",
    cover:
      "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=1600&auto=format&fit=crop",
    price: 69,
    comingSoon: true,
  },
];

export function themeLabel(t: TemplateTheme): string {
  switch (t) {
    case "portfolio":
      return "Portfolio";
    case "saas":
      return "SaaS";
    case "ecommerce":
      return "E-commerce";
    case "editorial":
      return "Editorial";
  }
}
