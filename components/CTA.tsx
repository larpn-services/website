import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative bg-ink py-32 sm:py-44 border-t border-white/5 overflow-hidden">
      {/* sunset radial — echoes the Spline ember palette */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[900px] h-[500px] bg-ember/8 rounded-full blur-[180px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 sm:px-10 text-center">
        <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-8 font-medium">
          ▸ 03 — Build with us
        </p>

        <h2 className="text-white text-4xl sm:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight mb-10">
          Have an idea worth
          <br />
          <span className="italic text-white/60">
            building&nbsp;properly?
          </span>
        </h2>

        <p className="text-white/50 text-sm sm:text-base font-light max-w-md mx-auto leading-relaxed mb-12">
          A 30-minute call to walk through your project. No pitch decks. No
          jargon. Just an honest read on what it would take.
        </p>

        <Link
          href="/contact"
          className="group inline-flex items-center gap-3 px-7 py-4 bg-white text-black rounded-full text-sm font-medium hover:bg-ember hover:text-white transition-all"
        >
          Book a conversation
          <ArrowUpRight
            size={16}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>

        <p className="mt-10 text-white/30 text-xs font-light tracking-widest uppercase">
          or write —{" "}
          <a
            href="mailto:o.18hamdan@outlook.com"
            className="hover:text-ember transition-colors normal-case tracking-normal"
          >
            o.18hamdan@outlook.com
          </a>
        </p>
      </div>
    </section>
  );
}
