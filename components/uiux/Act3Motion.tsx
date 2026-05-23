"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";

const STAGES = [
  { label: "Idle" },
  { label: "Hover" },
  { label: "Press" },
  { label: "Sent" },
] as const;

export default function Act3Motion() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Discrete-ish state 0→3 mapped through scroll
  const stateRaw = useTransform(scrollYProgress, [0.15, 0.4, 0.6, 0.82], [0, 1, 2, 3]);

  const scale = useTransform(stateRaw, [0, 1, 2, 3], reduce ? [1, 1, 1, 1] : [1, 1.04, 0.97, 1]);
  const bg = useTransform(stateRaw, [0, 1, 2, 3], ["#ffffff", "#ff6b1a", "#ff8a3d", "#ff6b1a"]);
  const fg = useTransform(stateRaw, [0, 1, 2, 3], ["#000000", "#ffffff", "#ffffff", "#ffffff"]);

  const ringOpacity = useTransform(stateRaw, [1.4, 1.8, 2.2, 2.7], [0, 0.5, 0.5, 0]);
  const ringScale = useTransform(stateRaw, [1.5, 2, 2.8], reduce ? [1.18, 1.18, 1.18] : [1.05, 1.18, 1.4]);

  const glowOpacity = useTransform(stateRaw, [0.5, 1, 2.6, 3], [0, 0.55, 0.55, 0.35]);
  const glowScale = useTransform(stateRaw, [0, 3], reduce ? [1, 1] : [0.9, 1.3]);

  const idleOp = useTransform(stateRaw, [0, 0.7, 1], [1, 1, 0]);
  const hoverOp = useTransform(stateRaw, [0.7, 1, 1.7, 2], [0, 1, 1, 0]);
  const pressOp = useTransform(stateRaw, [1.7, 2, 2.55, 2.8], [0, 1, 1, 0]);
  const successOp = useTransform(stateRaw, [2.55, 2.85, 3], [0, 1, 1]);

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.06, 0.94, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative h-[220vh] bg-ink">
      <motion.div
        style={{ opacity: sectionOpacity }}
        className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="text-center mb-16 px-6">
          <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-3 font-medium">
            ▸ Motion
          </p>
          <h2 className="text-white text-3xl sm:text-5xl font-light tracking-tight">
            Feedback, not decoration.
          </h2>
          <p className="text-white/35 text-sm font-light max-w-md mx-auto mt-5 leading-relaxed">
            Scroll scrubs the button through its states.
            Every transition is rendered, not faked.
          </p>
        </div>

        <div className="relative">
          {/* ambient glow */}
          <motion.div
            aria-hidden
            style={{ opacity: glowOpacity, scale: glowScale }}
            className="absolute -inset-12 rounded-full pointer-events-none"
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(255,107,26,0.45) 0%, transparent 65%)",
                filter: "blur(30px)",
              }}
            />
          </motion.div>

          {/* focus ring */}
          <motion.div
            aria-hidden
            style={{ opacity: ringOpacity, scale: ringScale }}
            className="absolute inset-0 rounded-full border-2 border-ember pointer-events-none"
          />

          {/* the button itself */}
          <motion.div
            style={{ scale, backgroundColor: bg, color: fg }}
            className="relative px-10 py-4 rounded-full text-sm font-medium tracking-tight min-w-[220px] text-center select-none"
          >
            {/* sizing ghost so the button never reflows */}
            <span className="opacity-0 inline-flex items-center gap-2" aria-hidden>
              <Check size={14} strokeWidth={3} />
              Submitting…
            </span>

            <motion.span style={{ opacity: idleOp }} className="absolute inset-0 flex items-center justify-center">
              Submit
            </motion.span>
            <motion.span style={{ opacity: hoverOp }} className="absolute inset-0 flex items-center justify-center gap-1">
              Submit <span aria-hidden>→</span>
            </motion.span>
            <motion.span style={{ opacity: pressOp }} className="absolute inset-0 flex items-center justify-center">
              Submitting…
            </motion.span>
            <motion.span style={{ opacity: successOp }} className="absolute inset-0 flex items-center justify-center gap-2">
              <Check size={14} strokeWidth={3} />
              Sent
            </motion.span>
          </motion.div>
        </div>

        {/* progress chips */}
        <div className="mt-16 flex items-center gap-6">
          {STAGES.map((s, i) => (
            <StageChip key={s.label} index={i} state={stateRaw} label={s.label} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function StageChip({
  index,
  state,
  label,
}: {
  index: number;
  state: MotionValue<number>;
  label: string;
}) {
  const op = useTransform(state, [index - 0.55, index, index + 0.55], [0.25, 1, 0.25]);
  const dotScale = useTransform(state, [index - 0.55, index, index + 0.55], [1, 1.5, 1]);
  return (
    <motion.div style={{ opacity: op }} className="flex items-center gap-2">
      <motion.span
        style={{ scale: dotScale }}
        className="block w-1.5 h-1.5 rounded-full bg-ember"
      />
      <span className="text-white/55 text-[10px] tracking-[0.3em] uppercase tabular-nums">
        {label}
      </span>
    </motion.div>
  );
}
