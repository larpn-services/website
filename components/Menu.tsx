import Image from "next/image";

type Offering = {
  title: string;
  description: string;
  image: string;
};

// Royalty-free Unsplash images — each picked to match the topic.
const offerings: Offering[] = [
  {
    title: "Web Development",
    description: "Modern, fast, scalable sites and web apps.",
    image:
      "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Software Engineering",
    description: "Bespoke systems with rigor — MVPs through platforms.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "UI / UX Design",
    description: "Interfaces that feel inevitable, every pixel earning its place.",
    image:
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Chrome Extensions",
    description: "One-shortcut browser tools that live in your tab bar.",
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Custom Applications",
    description: "Standalone apps — desktop, web, and mobile — for focused use cases.",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Automations & Tools",
    description: "Scripts and utilities that quietly run the boring parts.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop",
  },
];

function Card({ o }: { o: Offering }) {
  return (
    <div className="shrink-0 w-[320px] sm:w-[360px] mr-5 sm:mr-7 rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.015]">
      <div className="relative aspect-[5/4] overflow-hidden">
        <Image
          src={o.image}
          alt={o.title}
          fill
          sizes="360px"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="text-white text-lg font-light tracking-tight">
          {o.title}
        </h3>
        <p className="text-white/45 text-sm font-light mt-1.5 leading-relaxed">
          {o.description}
        </p>
      </div>
    </div>
  );
}

export default function Menu() {
  // Duplicate the list so the marquee can loop seamlessly.
  const track = [...offerings, ...offerings];

  return (
    <section className="relative bg-ink py-32 sm:py-40 border-t border-white/5 overflow-hidden">
      {/* ember horizon line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,107,26,0.4), transparent)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 mb-12 sm:mb-16">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-5 font-medium">
              ▸ 02 — Menu
            </p>
            <h2 className="text-white text-3xl sm:text-5xl font-light leading-[1.1] tracking-tight max-w-xl">
              Services and products
              <br />
              <span className="italic text-white/60">on the menu.</span>
            </h2>
          </div>
          <p className="hidden sm:block text-white/40 text-xs font-light max-w-[200px] text-right leading-relaxed">
            A slow scroll.
            <br />
            Pick what you need.
          </p>
        </div>
      </div>

      {/* Edge fade masks so the marquee bleeds into the page */}
      <div
        className="menu-marquee-wrap relative"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="menu-marquee-track flex w-max">
          {track.map((o, i) => (
            <Card key={`${o.title}-${i}`} o={o} />
          ))}
        </div>
      </div>
    </section>
  );
}
