"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const TITLE = "Feels inevitable.";

export default function Act1Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Nebula drifts down + scales up; content rises out as you scroll past.
  const nebulaY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 120]);
  const nebulaScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.35]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-ink"
    >
      {/* ember nebula */}
      <motion.div
        aria-hidden
        style={{ y: nebulaY, scale: nebulaScale }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <div
          className="w-[110vmin] h-[110vmin] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,107,26,0.28) 0%, rgba(255,107,26,0.07) 28%, transparent 58%)",
            filter: "blur(38px)",
          }}
        />
      </motion.div>

      {/* dot field */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse at center, black 28%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 28%, transparent 72%)",
        }}
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="text-ember text-[10px] tracking-[0.4em] uppercase font-medium mb-6"
        >
          03 — UI / UX Design
        </motion.p>

        <h1 className="text-white text-6xl sm:text-8xl font-light tracking-tight leading-[0.95] mb-8">
          {TITLE.split("").map((c, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 64 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15 + i * 0.028,
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              {c === " " ? " " : c}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6 }}
          className="text-white/45 text-base sm:text-lg font-light max-w-md mx-auto leading-relaxed"
        >
          Built from scratch — or grafted onto what&apos;s already live.
        </motion.p>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 z-10"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.span
          aria-hidden
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="block h-6 w-px bg-white/30"
        />
      </motion.div>
    </section>
  );
}
