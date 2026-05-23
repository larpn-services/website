"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Scroll-driven parallax act adapted from the Osmo "Parallax" pattern,
// rebuilt in framer-motion (no GSAP/Lenis) to stay consistent with the rest
// of the project. Four layers slide at different rates as the section
// passes under the viewport — back moves furthest, foreground barely moves.

export default function Act2Parallax() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // y rates mirror the Osmo demo (back layer travels furthest down)
  const layer1Y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["0%", "70%"],
  );
  const layer2Y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["0%", "55%"],
  );
  const layer3Y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["0%", "38%"],
  );
  const layer4Y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["0%", "10%"],
  );

  // Title settles in subtle scale shift, no opacity dance so it stays
  // readable through the whole act.
  const titleScale = useTransform(scrollYProgress, [0.05, 0.6], [1.06, 1]);

  return (
    <section ref={ref} className="relative h-[220vh] bg-ink">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Eyebrow caption pinned near the top */}
        <div className="absolute top-[12vh] left-1/2 -translate-x-1/2 text-center px-6 pointer-events-none z-20">
          <p className="text-ember text-[10px] tracking-[0.35em] uppercase font-medium mb-3">
            ▸ Retrofit
          </p>
          <p className="text-white/45 text-sm font-light max-w-md mx-auto leading-relaxed">
            Build new — or take what&apos;s already live and graft new craft on top.
          </p>
        </div>

        {/* Layer 1 — ember nebula (back) */}
        <motion.div
          aria-hidden
          style={{ y: layer1Y }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className="w-[140vmin] h-[140vmin] rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,107,26,0.32) 0%, rgba(255,107,26,0.08) 30%, transparent 62%)",
              filter: "blur(60px)",
            }}
          />
        </motion.div>

        {/* Layer 2 — ghost wireframe of "an existing site" */}
        <motion.div
          aria-hidden
          style={{ y: layer2Y }}
          className="absolute inset-0 flex items-end justify-center pb-[6vh] pointer-events-none"
        >
          <div
            className="w-[78vmin] h-[52vmin] rounded-2xl border border-white/[0.06] bg-white/[0.014] p-6 flex flex-col gap-4 opacity-55"
            style={{ maxWidth: 520 }}
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded-full bg-white/[0.07]" />
              <div className="flex items-center gap-2">
                <div className="h-3 w-12 rounded-full bg-white/[0.06]" />
                <div className="h-3 w-12 rounded-full bg-white/[0.06]" />
              </div>
            </div>
            <div className="h-3 w-2/3 rounded-full bg-white/[0.05]" />
            <div className="grid grid-cols-3 gap-3 mt-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-white/[0.04] bg-white/[0.02] h-16"
                />
              ))}
            </div>
            <div className="mt-auto flex items-center justify-between">
              <div className="h-3 w-28 rounded-full bg-white/[0.05]" />
              <div className="h-3 w-16 rounded-full bg-white/[0.05]" />
            </div>
          </div>
        </motion.div>

        {/* Layer 3 — big headline */}
        <motion.div
          style={{ y: layer3Y, scale: titleScale }}
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none z-10"
        >
          <h2 className="text-white text-7xl sm:text-9xl font-light tracking-tighter text-center leading-[0.9]">
            We
            <span className="text-ember italic"> retrofit.</span>
          </h2>
        </motion.div>

        {/* Layer 4 — polished UI snippet floating in front */}
        <motion.div
          style={{ y: layer4Y }}
          className="absolute inset-x-0 bottom-[8vh] flex items-center justify-center pointer-events-none z-10"
        >
          <div
            className="rounded-2xl border border-ember/30 bg-ink-elev/85 backdrop-blur-md p-4 sm:p-5 w-[78vmin] max-w-[440px]"
            style={{
              boxShadow: "0 20px 60px -20px rgba(255,107,26,0.4)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-2 h-2 rounded-full bg-ember" />
              <span className="text-white text-sm font-medium tracking-tight">
                Your site, after.
              </span>
              <span className="text-white/30 text-[10px] tracking-[0.25em] uppercase ml-auto">
                Retrofit
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { l: "Bounce", v: "−38%" },
                { l: "Time", v: "+2.4×" },
                { l: "NPS", v: "+24" },
              ].map((m) => (
                <div
                  key={m.l}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5"
                >
                  <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase mb-1">
                    {m.l}
                  </p>
                  <p className="text-white text-base font-light tabular-nums">
                    {m.v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
