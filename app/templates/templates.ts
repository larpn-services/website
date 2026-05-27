export type Template = {
  slug: string;
  name: string;
  description: string;
  cover: string;
  pics: string[];
  previewUrl: string;
  price: number;
  originalPrice: number;
};

export const templates: Template[] = [
  {
    slug: "landmark",
    name: "Landmark",
    description:
      "Real estate & property listings template with gallery-first design and lead capture.",
    cover: "/t3-pics/main.png",
    pics: ["/t3-pics/1.png", "/t3-pics/2.png", "/t3-pics/3.png", "/t3-pics/4.png"],
    previewUrl: "https://template-3-wheat-omega.vercel.app/",
    price: 119.99,
    originalPrice: 149.99,
  },
  {
    slug: "atelier",
    name: "Atelier",
    description:
      "Finance, consultation & training platform with a structured, trust-building layout.",
    cover: "/t2-pics/main.png",
    pics: ["/t2-pics/1.png", "/t2-pics/2.png", "/t2-pics/3.png", "/t2-pics/4.png"],
    previewUrl: "https://template-2-9d1ow3q3y-omar-hs-projects-cf8ee844.vercel.app/",
    price: 99.99,
    originalPrice: 124.99,
  },
  {
    slug: "luminary",
    name: "Luminary",
    description:
      "Creative studio & personal brand template with bold visuals and portfolio sections.",
    cover: "/t4-pics/main.png",
    pics: ["/t4-pics/1.png", "/t4-pics/2.png", "/t4-pics/3.png", "/t4-pics/4.png"],
    previewUrl: "https://template-4-pink.vercel.app/#/",
    price: 99.99,
    originalPrice: 124.99,
  },
  {
    slug: "civicbase",
    name: "CivicBase",
    description:
      "Built for non-profits and organizations with rich video libraries and content directories.",
    cover: "/t1-pics/main.png",
    pics: ["/t1-pics/1.png", "/t1-pics/2.png", "/t1-pics/3.png", "/t1-pics/4.png"],
    previewUrl: "https://template-1-lime.vercel.app/",
    price: 89.99,
    originalPrice: 112.49,
  },
];
