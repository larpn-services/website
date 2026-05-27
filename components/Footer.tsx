import Link from "next/link";
import SocialsStrip from "./Socials";

const cols = [
  {
    label: "Studio",
    items: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Templates", href: "/templates" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  {
    label: "Connect",
    items: [
      { label: "Contact", href: "/contact" },
      { label: "Email", href: "mailto:o.18hamdan@outlook.com" },
    ],
  },
];

export default function Footer({
  showWordmark = false,
}: {
  /** Render the oversized LARPN watermark below the footer. Used only on home. */
  showWordmark?: boolean;
} = {}) {
  return (
    <footer className="relative bg-ink border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* top row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* wordmark + tagline + socials */}
          <div className="sm:col-span-6">
            <Link href="/" className="inline-block mb-6">
              <span className="text-white font-medium text-sm tracking-[0.35em]">
                LARPN
              </span>
              <span className="ml-1 text-ember">.</span>
            </Link>
            <p className="text-white/40 text-sm font-light leading-relaxed max-w-sm mb-7">
              Engineering the future, line by line. Custom software, web apps,
              and refined interfaces for ambitious teams.
            </p>

            <SocialsStrip />
          </div>

          {/* link columns */}
          {cols.map((col) => (
            <div key={col.label} className="sm:col-span-3">
              <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-5 font-medium">
                {col.label}
              </p>
              <ul className="flex flex-col gap-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-white/70 hover:text-ember text-sm font-light transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10">
          <div className="flex items-center gap-5 flex-wrap">
            <p className="text-white/30 text-xs font-light tracking-wider">
              © 2026 LARPN — All rights reserved.
            </p>
            <span className="hidden sm:inline text-white/15">·</span>
            <Link
              href="/privacy"
              className="text-white/40 hover:text-ember text-xs font-light tracking-wider transition-colors"
            >
              Privacy
            </Link>
            <span className="hidden sm:inline text-white/15">·</span>
            <Link
              href="/terms"
              className="text-white/40 hover:text-ember text-xs font-light tracking-wider transition-colors"
            >
              Terms
            </Link>
          </div>
          <p className="text-white/30 text-xs font-light tracking-[0.25em] uppercase">
            Engineered in the dark.
          </p>
        </div>
      </div>

      {/* oversized wordmark — home page only */}
      {showWordmark && (
        <div className="overflow-hidden mt-12 pointer-events-none select-none">
          <p
            className="text-[24vw] leading-[0.85] text-center"
            style={{
              fontFamily: "var(--font-italianno)",
              fontWeight: 400,
            }}
          >
            <span className="text-ember">L</span>
            <span className="text-white/[0.07]">arp</span>
            <span className="text-ember">N</span>
          </p>
        </div>
      )}
    </footer>
  );
}
