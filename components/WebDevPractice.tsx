"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import PyramidAnimation from "./PyramidAnimation";

// Detail "scene" for the Web Development practice card. Replaces the
// generic PracticeDetail for that one practice — pyramid + tagline + CTA.

export default function WebDevPractice({ onBack }: { onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Back button — same affordance as PracticeDetail */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        className="flex items-center gap-2.5 text-white/30 hover:text-white transition-colors text-[11px] tracking-[0.25em] uppercase mb-14 group"
      >
        <ArrowLeft
          size={13}
          className="group-hover:-translate-x-1 transition-transform duration-300"
        />
        The Studio
      </motion.button>

      {/* Practice tag */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="text-ember text-[10px] tracking-[0.35em] uppercase font-medium text-center"
      >
        01 — Practice
      </motion.p>

      {/* Pyramid stage */}
      <div className="relative mt-6">
        {/* ember halo behind the pyramid */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto h-[420px] w-[420px] sm:h-[520px] sm:w-[520px] rounded-full bg-ember/[0.08] blur-[80px] pointer-events-none"
          style={{ left: "50%", marginLeft: "-260px" }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center py-8 sm:py-12"
        >
          <PyramidAnimation />
        </motion.div>
      </div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-white text-4xl sm:text-6xl font-light tracking-tight leading-[1.05] text-center mb-6"
      >
        Set up 3D
        <br />
        <span className="text-white/35 italic">on your site today.</span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="text-white/50 text-base font-light leading-relaxed text-center max-w-xl mx-auto mb-10"
      >
        Spline scenes, Three.js worlds, WebGL shaders, and live ASCII
        renderers — when depth matters, we build it into the page itself,
        not bolted on.
      </motion.p>

      {/* Spec strip — three small tags below the subtext to add texture */}
      <motion.ul
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.7 } },
        }}
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12"
      >
        {["Three.js", "Spline", "GLSL Shaders", "WebGL", "React Three Fiber"].map(
          (label) => (
            <motion.li
              key={label}
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-white/55 text-[11px] tracking-[0.2em] uppercase font-light"
            >
              {label}
            </motion.li>
          )
        )}
      </motion.ul>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.5 }}
        className="flex items-center justify-center"
      >
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black rounded-full text-sm font-medium hover:bg-ember hover:text-white transition-all"
        >
          Start your project
          <ArrowUpRight
            size={15}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>
      </motion.div>
    </motion.div>
  );
}
