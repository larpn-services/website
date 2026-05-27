"use client";

import { Component, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// ─── Error boundary ────────────────────────────────────────────────────────

interface EBProps {
  children: ReactNode;
  fallback: ReactNode;
}
class SplineErrorBoundary extends Component<EBProps, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// ─── Fallback (matches the orange ember palette) ───────────────────────────

function EmberFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-80 h-80">
        <div
          className="absolute inset-0 rounded-full bg-ember/30 blur-[80px]"
          style={{ animation: "pulse 4s ease-in-out infinite" }}
        />
        <div
          className="absolute inset-12 rounded-full bg-ember/40 blur-[60px]"
          style={{ animation: "pulse 3s ease-in-out infinite" }}
        />
        <div className="absolute inset-24 rounded-full bg-ember-soft blur-[20px] opacity-80" />
      </div>
    </div>
  );
}

// Spline ships ~600 KB of WebGL/runtime code that is purely decorative here.
// Lazy-load it client-side so the LCP text + CTA paint without waiting for it.
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <EmberFallback />,
});

const SCENE_URL =
  "https://prod.spline.design/aA0kuGTPZATnwaaI/scene.splinecode";

// ─── Spline canvas — no parent transforms, stays crisp ─────────────────────

// Aggressively strip Spline's injected watermark from the DOM. The CSS rule
// alone misses it because the runtime mounts the badge with hashed class names
// after onLoad fires.
function nukeWatermarks() {
  if (typeof document === "undefined") return;
  const selectors = [
    'a[href*="spline.design"]',
    'a[href*="spline.app"]',
    'a[href*="splinedesign"]',
    '[class*="watermark" i]',
    '[class*="spline-logo" i]',
    '[id*="spline-watermark" i]',
  ];
  document.querySelectorAll(selectors.join(",")).forEach((el) => el.remove());
}

function SplineCanvas() {
  const [ready, setReady] = useState(false);

  const handleLoad = () => {
    setReady(true);
    // One immediate pass + one delayed catch — CSS rules in globals.css cover
    // anything mounted later. We used to fire five timeouts which was overkill.
    nukeWatermarks();
    setTimeout(nukeWatermarks, 800);
  };

  return (
    <div className="absolute inset-0">
      {!ready && <EmberFallback />}
      <Spline
        scene={SCENE_URL}
        onLoad={handleLoad}
        style={{
          width: "100%",
          height: "100%",
          // canvas is purely decorative — let wheel/touch events scroll the page
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────

// On small viewports we never load Spline at all — the WebGL runtime is
// the single biggest perf cost on iPhone Safari, and the EmberFallback is
// already on-brand. Saves ~600 KB of JS plus continuous GPU work.
function useIsDesktopViewport() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return isDesktop;
}

export default function Hero() {
  const isDesktop = useIsDesktopViewport();

  return (
    <section className="relative w-full h-dvh min-h-[640px] sm:min-h-[760px] overflow-hidden bg-ink">
      {/* Full-bleed Spline scene — desktop only */}
      <div className="absolute inset-0">
        {isDesktop ? (
          <SplineErrorBoundary fallback={<EmberFallback />}>
            <SplineCanvas />
          </SplineErrorBoundary>
        ) : (
          <EmberFallback />
        )}
      </div>

      {/* Vignette + bottom fade for legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 60%, rgba(0,0,0,0.6) 0%, transparent 50%), linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      {/* Overlay copy — bottom-left, minimal, matches reference */}
      <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
        <div className="max-w-7xl w-full mx-auto px-6 sm:px-10 pb-20 sm:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            className="max-w-xl pointer-events-auto"
          >
            <p className="text-ember text-[11px] font-medium tracking-[0.3em] uppercase mb-5">
              LARPN — Est. 2026
            </p>

            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight mb-6">
              Engineering<br />
              the future,<br />
              <span className="italic font-light text-white/70">
                line by line.
              </span>
            </h1>

            <p className="text-white/50 text-sm sm:text-base font-light leading-relaxed max-w-md mb-8">
              We design and build custom software, web apps, and SaaS products
              with the obsession of craftsmen and the precision of engineers.
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-ember hover:text-white transition-all"
              >
                Start a project
                <ArrowUpRight
                  size={15}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center min-h-11 px-2 text-white/70 hover:text-white text-sm font-light underline-offset-4 hover:underline transition-colors"
              >
                Explore templates
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-6 right-6 sm:right-10 text-white/40 text-[10px] tracking-[0.3em] uppercase rotate-90 origin-bottom-right z-10"
      >
        Scroll
      </motion.div>

      {/* Safety mask: covers the bottom-right corner where Spline mounts its
          watermark. Solid at the corner, soft fade outward so it blends with
          the scene's vignette. */}
      <div
        className="absolute bottom-0 right-0 w-[280px] h-20 z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top left, #000 0%, #000 30%, rgba(0,0,0,0.7) 60%, transparent 100%)",
        }}
      />
    </section>
  );
}
