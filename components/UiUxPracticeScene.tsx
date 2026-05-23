"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

// Three "purpose" sections — each pairs with a scroll position. The backdrop
// (single ember glow + dot field) sits behind everything and quietly drifts
// with the scroll, matching the rest of the site's dark / ember-accent theme.
// Plain HTML + CSS only on purpose — see notes in the PR for the dev-build
// reasoning.
const SECTIONS = [
  {
    eyebrow: "I. Your site is already live",
    title: "Live. Indexed. Working.",
    line: "Just not pulling its weight.",
    body:
      "You don't need a rebuild. You need the layer that makes visitors feel something — without taking your stack offline for a quarter.",
  },
  {
    eyebrow: "II. Templates, grafted on top",
    title: "Pre-built. Tuned to you.",
    line: "Dropped onto your live site.",
    body:
      "Pick from our library of UI/UX templates — motion patterns, depth treatments, micro-interactions — and we edit them onto what's already there. Same routes, same CMS, same backend. We re-skin them in your brand so they don't feel bolted on.",
  },
  {
    eyebrow: "III. Same domain. New gravity.",
    title: "Visitors stay.",
    line: "Pages breathe. Numbers move.",
    body:
      "Time-on-page lengthens, bounce rate drops, the brand starts feeling premium. Same URL — your customers just stop wanting to leave.",
  },
] as const;

export default function UiUxPractice({ onBack }: { onBack: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Scroll progress through the section stack, throttled with rAF.
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const next = total > 0 ? Math.min(1, scrolled / total) : 0;
      setProgress(next);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        compute();
      });
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Reset scroll on mount, trigger entry fade.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    const t = window.setTimeout(() => setMounted(true), 16);
    return () => window.clearTimeout(t);
  }, []);

  const activeSection = Math.min(
    SECTIONS.length - 1,
    Math.round(progress * (SECTIONS.length - 1)),
  );

  const glowTopPct = 18 + progress * 64;
  const glowScale = 1 + progress * 0.35;

  return (
    <div
      className="relative transition-opacity duration-300 ease-out"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      {/* ── Backdrop: dot field + drifting ember glow + dim wash ─────────── */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none bg-ink"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />

        <div
          style={{
            top: `${glowTopPct}%`,
            transform: `translate(-50%, -50%) scale(${glowScale})`,
            transition: "top 200ms linear, transform 300ms linear",
          }}
          className="absolute left-1/2 w-[90vmin] h-[90vmin] rounded-full pointer-events-none"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,107,26,0.16) 0%, rgba(255,107,26,0.05) 35%, transparent 65%)",
              filter: "blur(40px)",
            }}
          />
        </div>

        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Back to the Studio — same affordance as WebDevPractice / PersonalToolsPractice.
          Kept `fixed` because the scroll-stack is taller than one viewport. */}
      <button
        onClick={onBack}
        className="fixed top-24 left-6 sm:left-10 z-40 flex items-center gap-2.5 text-white/30 hover:text-white transition-colors text-[11px] tracking-[0.25em] uppercase group"
      >
        <ArrowLeft
          size={13}
          className="group-hover:-translate-x-1 transition-transform duration-300"
        />
        The Studio
      </button>

      {/* Section-dots rail */}
      <div className="fixed right-6 sm:right-10 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3 bg-black/45 backdrop-blur-md border border-white/10 rounded-full px-2 py-3">
        {SECTIONS.map((_, i) => (
          <span
            key={i}
            className="block w-2 h-2 rounded-full transition-all duration-500"
            style={{
              backgroundColor:
                i === activeSection
                  ? "rgba(255,107,26,1)"
                  : "rgba(255,255,255,0.4)",
              transform: i === activeSection ? "scale(1.4)" : "scale(1)",
              boxShadow:
                i === activeSection
                  ? "0 0 14px rgba(255,107,26,0.7)"
                  : "none",
            }}
            aria-hidden
          />
        ))}
      </div>

      {/* Scroll-progress bar */}
      <div className="fixed bottom-6 left-6 sm:left-10 z-40 flex items-center gap-3 bg-black/55 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5">
        <span className="text-white/85 text-[10px] tracking-[0.3em] uppercase font-medium">
          {String(activeSection + 1).padStart(2, "0")}/
          {String(SECTIONS.length).padStart(2, "0")}
        </span>
        <span className="block w-24 h-px bg-white/25 overflow-hidden">
          <span
            className="block h-full bg-ember origin-left"
            style={{
              transform: `scaleX(${progress})`,
              transition: "transform 120ms linear",
            }}
          />
        </span>
      </div>

      {/* Scroll stack */}
      <div ref={wrapRef} className="relative z-10">
        {SECTIONS.map((s, i) => {
          const isLast = i === SECTIONS.length - 1;
          // Section is "in view" if progress is near its share.
          const share = i / (SECTIONS.length - 1);
          const dist = Math.abs(progress - share);
          const inView = dist < 0.25;
          return (
            <section
              key={s.eyebrow}
              className="relative min-h-screen flex items-center"
            >
              <div
                className={`relative w-full max-w-6xl mx-auto px-6 sm:px-12 ${
                  i % 2 === 0 ? "text-left" : "text-right ml-auto"
                }`}
              >
                <div
                  className={`max-w-2xl transition-all duration-700 ease-out ${
                    i % 2 === 0 ? "" : "ml-auto"
                  }`}
                  style={{
                    opacity: inView ? 1 : 0.25,
                    transform: inView
                      ? "translateY(0) scale(1)"
                      : "translateY(28px) scale(0.94)",
                  }}
                >
                  <p className="text-ember text-[10px] tracking-[0.45em] uppercase mb-7 font-medium">
                    {s.eyebrow}
                  </p>
                  <h2 className="text-white text-5xl sm:text-7xl font-light tracking-tight leading-[0.98] mb-5">
                    {s.title}
                    <br />
                    <span className="text-white/45 italic">{s.line}</span>
                  </h2>
                  <p className="text-white/65 text-base sm:text-lg font-light leading-relaxed max-w-xl">
                    {s.body}
                  </p>

                  {isLast && (
                    <div className="mt-10 flex flex-wrap gap-3 items-center">
                      <Link
                        href="/contact"
                        className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black rounded-full text-sm font-medium hover:bg-ember hover:text-white transition-all"
                      >
                        Graft this onto your site
                        <ArrowUpRight
                          size={15}
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </Link>
                      <button
                        onClick={onBack}
                        className="px-5 py-3.5 text-white/55 hover:text-white text-[11px] tracking-[0.25em] uppercase transition-colors"
                      >
                        ← Back to studio
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Scroll hint on first section only */}
              {i === 0 && (
                <div
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 z-10 transition-opacity duration-500"
                  style={{ opacity: progress < 0.05 ? 1 : 0 }}
                >
                  <span className="text-[10px] tracking-[0.3em] uppercase">
                    Scroll
                  </span>
                  <span
                    aria-hidden
                    className="block h-7 w-px bg-white/55"
                    style={{ animation: "scroll-hint 1.6s ease-in-out infinite" }}
                  />
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
