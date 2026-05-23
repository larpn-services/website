import Link from "next/link";

const services = [
  {
    n: "01",
    title: "Web samples",
    body: "Sample sites and web app demos — the kinds of interfaces, layouts, and stacks we can ship for you.",
    href: "/about?p=1",
  },
  {
    n: "02",
    title: "Software prototypes",
    body: "Working prototypes of bespoke systems — focused MVPs through to enterprise-grade builds we can take further.",
    href: "/about?p=2",
  },
  {
    n: "03",
    title: "Design samples",
    body: "UI / UX that feels inevitable — built fresh, or grafted onto an existing site so it finally feels alive.",
    href: "/about?p=3",
  },
  {
    n: "04",
    title: "Tool prototypes",
    body: "AI automations, daily helpers, one-shot utilities — anything you'd hire a custom dev to build, sampled here ready to ship.",
    href: "/about?p=4",
  },
];

export default function Services() {
  return (
    <section
      id="work"
      className="relative bg-ink py-32 sm:py-40 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section label */}
        <div className="flex items-start justify-between mb-20 sm:mb-28">
          <div>
            <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-5 font-medium">
              ▸ 01 — Samples &amp; Prototypes
            </p>
            <h2 className="text-white text-3xl sm:text-5xl font-light leading-[1.1] tracking-tight max-w-xl">
              Samples of what we can
              <br />
              <span className="italic text-white/60">design and build</span> for you.
            </h2>
          </div>
          <p className="hidden sm:block text-white/40 text-xs font-light max-w-[200px] text-right leading-relaxed">
            Four sample lanes.
            <br />
            One obsession with the&nbsp;craft.
          </p>
        </div>

        {/* Service list */}
        <div className="border-t border-white/10">
          {services.map((s) => (
            <Link
              key={s.n}
              href={s.href}
              className="group grid grid-cols-12 gap-6 py-8 sm:py-10 border-b border-white/10 hover:bg-white/[0.015] transition-colors px-2 -mx-2"
            >
              <div className="col-span-2 sm:col-span-1 text-ember text-xs sm:text-sm font-light tracking-wider pt-1">
                {s.n}
              </div>
              <div className="col-span-10 sm:col-span-4 text-white text-xl sm:text-2xl font-light tracking-tight group-hover:translate-x-1 transition-transform">
                {s.title}
              </div>
              <div className="col-start-3 sm:col-start-auto col-span-10 sm:col-span-6 text-white/50 text-sm font-light leading-relaxed">
                {s.body}
              </div>
              <div className="hidden sm:flex col-span-1 items-center justify-end text-white/30 group-hover:text-ember transition-colors">
                <span className="text-lg">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
