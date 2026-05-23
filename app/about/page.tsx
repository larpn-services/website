"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Footer from "@/components/Footer";
import TechStack from "@/components/TechStack";
import WebDevPractice from "@/components/WebDevPractice";
import UiUxPractice from "@/components/UiUxPractice";
import PersonalToolsPractice from "@/components/PersonalToolsPractice";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

type Practice = {
  n: string;
  id: string;
  title: string;
  body: string;
};

const practices: Practice[] = [
  {
    n: "01",
    id: "practice-1",
    title: "Web development",
    body: "Modern, fast, scalable web applications built on the most reliable frameworks available today.",
  },
  {
    n: "02",
    id: "practice-2",
    title: "Software engineering",
    body: "Bespoke systems engineered with rigor — from focused MVPs to enterprise-grade platforms.",
  },
  {
    n: "03",
    id: "practice-3",
    title: "UI / UX design",
    body: "Interfaces that feel inevitable — built fresh, or grafted onto your existing site so it finally feels alive.",
  },
  {
    n: "04",
    id: "practice-4",
    title: "Personal tools",
    body: "AI automations, daily helpers, one-shot utilities. From an email-triage agent to a script that re-organises your files — anything you'd hire a custom dev to build.",
  },
];

// ─── Per-practice animated 3D visuals ───────────────────────────────────────

function WebDevMotif() {
  // floating browser window with scrolling code lines
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ perspective: 800 }}
    >
      <motion.div
        initial={{ rotateX: 22, rotateY: -14 }}
        animate={{ rotateX: [22, 18, 22], rotateY: [-14, -10, -14] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="absolute right-4 sm:right-6 top-6 w-[58%] aspect-[16/11]"
      >
        <div className="absolute inset-0 rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm overflow-hidden">
          {/* window chrome */}
          <div className="flex items-center gap-1.5 px-2.5 h-5 border-b border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
            <span className="w-1.5 h-1.5 rounded-full bg-ember/40" />
          </div>
          {/* code lines */}
          <div className="p-3 space-y-1.5">
            {[60, 38, 78, 50, 28, 66, 44].map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: [0.25, 0.55, 0.25] }}
                transition={{
                  duration: 3,
                  delay: i * 0.18,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-1 rounded-sm"
                style={{
                  width: `${w}%`,
                  background:
                    i % 3 === 0
                      ? "rgba(255,107,26,0.5)"
                      : "rgba(255,255,255,0.18)",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SoftwareMotif() {
  // stacked floating layers, like an architecture diagram
  const layers = [0, 1, 2, 3];
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ perspective: 900 }}
    >
      <motion.div
        animate={{ rotateX: [28, 24, 28], rotateY: [-12, -16, -12] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="absolute right-6 top-8 w-[55%] aspect-square"
      >
        {layers.map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 3.2 + i * 0.4,
              delay: i * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-x-0 h-7 rounded-md border border-white/10 bg-white/[0.025] backdrop-blur-[1px]"
            style={{
              top: `${i * 22}%`,
              transform: `translateZ(${i * 18}px)`,
              boxShadow:
                i === 1 || i === 2
                  ? "inset 0 0 0 1px rgba(255,107,26,0.12)"
                  : undefined,
            }}
          >
            <div className="flex items-center h-full px-2.5 gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background:
                    i % 2 ? "rgba(255,107,26,0.6)" : "rgba(255,255,255,0.3)",
                }}
              />
              <span
                className="h-1 rounded-sm bg-white/15"
                style={{ width: `${30 + i * 12}%` }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function DesignMotif() {
  // floating geometric shapes with a cursor
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* grid dot field */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
          maskImage:
            "radial-gradient(circle at 75% 35%, black, transparent 70%)",
        }}
      />
      {/* circle */}
      <motion.div
        animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-12 top-10 w-12 h-12 rounded-full border border-ember/40 bg-ember/5"
      />
      {/* square */}
      <motion.div
        animate={{ rotate: [0, 18, 0], y: [0, 6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-28 top-20 w-8 h-8 rounded-md border border-white/20 bg-white/[0.03]"
      />
      {/* triangle */}
      <motion.div
        animate={{ rotate: [0, -22, 0], y: [0, -4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-6 bottom-14"
      >
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: "16px solid rgba(255,255,255,0.18)",
          }}
        />
      </motion.div>
      {/* cursor */}
      <motion.div
        animate={{ x: [0, 18, -8, 12, 0], y: [0, -10, 4, -6, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-20 bottom-20"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 1.5L12 6L7 7L5.5 12L2 1.5Z"
            fill="rgba(255,107,26,0.85)"
            stroke="white"
            strokeOpacity="0.4"
            strokeWidth="0.5"
          />
        </svg>
      </motion.div>
    </div>
  );
}

function ToolsMotif() {
  // CSS keyframes drive the orbits — they don't stutter or stop the way
  // Framer's animate-rotate sometimes does inside parents with mouse-tracked
  // 3D transforms. Each dot's wrapper is sized to the orbit diameter so the
  // dot, offset to the right edge, traces a circle when the wrapper rotates.
  const orbits = [
    { cx: 78, cy: 30, r: 36, d: 6, dur: 6,    dir: "cw",  hue: "ember", delay: 0 },
    { cx: 78, cy: 30, r: 56, d: 5, dur: 9,    dir: "ccw", hue: "white", delay: -1.3 },
    { cx: 78, cy: 30, r: 22, d: 7, dur: 4.5,  dir: "ccw", hue: "ember", delay: -0.6 },
    { cx: 60, cy: 70, r: 30, d: 6, dur: 7,    dir: "cw",  hue: "white", delay: -2.1 },
    { cx: 60, cy: 70, r: 48, d: 5, dur: 11,   dir: "ccw", hue: "ember", delay: -3.5 },
    { cx: 60, cy: 70, r: 18, d: 4, dur: 5,    dir: "cw",  hue: "white", delay: -0.9 },
  ] as const;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* ambient orbit rings — also CSS-driven */}
      <div
        className="absolute right-6 top-4 w-48 h-48 rounded-full border border-white/[0.06]"
        style={{ animation: "tool-orbit-cw 28s linear infinite" }}
      />
      <div
        className="absolute right-12 top-10 w-32 h-32 rounded-full border border-ember/10"
        style={{ animation: "tool-orbit-ccw 36s linear infinite" }}
      />

      {/* orbiting tool dots */}
      {orbits.map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            right: `calc(${o.cx}% - ${o.r}px)`,
            top: `calc(${o.cy}% - ${o.r}px)`,
            width: o.r * 2,
            height: o.r * 2,
            animation: `${
              o.dir === "cw" ? "tool-orbit-cw" : "tool-orbit-ccw"
            } ${o.dur}s linear infinite`,
            animationDelay: `${o.delay}s`,
          }}
        >
          {/* dot sits on the right edge of the wrapper, so wrapper rotation
              makes it orbit at radius o.r */}
          <div
            className="absolute rounded-full"
            style={{
              top: "50%",
              right: 0,
              transform: "translate(50%, -50%)",
              width: o.d,
              height: o.d,
              background:
                o.hue === "ember"
                  ? "rgba(255,107,26,0.95)"
                  : "rgba(255,255,255,0.85)",
              boxShadow:
                o.hue === "ember"
                  ? "0 0 14px rgba(255,107,26,0.8)"
                  : "0 0 10px rgba(255,255,255,0.45)",
            }}
          />
        </div>
      ))}

      {/* caption — pinned top-right of the motif area, above the watermark */}
      <p
        className="absolute top-3 right-4 text-ember/60 text-[10px] tracking-[0.3em] uppercase font-medium z-20"
        style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
      >
        Familiar tools
      </p>
    </div>
  );
}

function PracticeMotif({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <WebDevMotif />;
    case 1:
      return <SoftwareMotif />;
    case 2:
      return <DesignMotif />;
    case 3:
      return <ToolsMotif />;
    default:
      return null;
  }
}

// ─── Card with mouse-tracked 3D tilt ────────────────────────────────────────

function PracticeCard({
  practice,
  index,
  onSelect,
}: {
  practice: Practice;
  index: number;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), {
    stiffness: 150,
    damping: 18,
  });
  const glow = useTransform(
    [mx, my],
    ([x, y]: number[]) => {
      const px = 50 + x * 80;
      const py = 50 + y * 80;
      return `radial-gradient(420px circle at ${px}% ${py}%, rgba(255,107,26,0.10), transparent 60%)`;
    },
  );

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      ref={ref}
      id={practice.id}
      onClick={onSelect}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: index * 0.09,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="group relative text-left w-full rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.03] to-transparent p-8 sm:p-10 overflow-hidden cursor-pointer hover:border-ember/30 transition-colors duration-500 min-h-[340px]"
    >
      {/* mouse-tracked spotlight */}
      <motion.div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: glow }}
      />

      {/* per-practice animated motif */}
      <PracticeMotif index={index} />

      {/* Watermark number */}
      <span
        aria-hidden
        className="absolute -right-2 -top-3 text-[110px] font-bold leading-none select-none pointer-events-none text-white/[0.022] group-hover:text-white/[0.05] transition-colors duration-700"
        style={{ transform: "translateZ(20px)" }}
      >
        {practice.n}
      </span>

      {/* Top edge glow on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div
        className="relative z-10 flex flex-col min-h-[220px]"
        style={{ transform: "translateZ(40px)" }}
      >
        <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-6 font-medium">
          {practice.n}
        </p>
        <h2 className="text-white text-2xl sm:text-3xl font-light tracking-tight mb-4 leading-snug">
          {practice.title}
        </h2>
        <p className="text-white/35 text-sm font-light leading-relaxed flex-1 max-w-[22rem]">
          {practice.body}
        </p>
        <div className="mt-8 flex items-center gap-2 text-white/20 group-hover:text-ember transition-colors duration-300">
          <span className="text-[11px] tracking-[0.25em] uppercase font-light">
            Explore
          </span>
          <ArrowUpRight
            size={13}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
          />
        </div>
      </div>
    </motion.button>
  );
}

function PracticeDetail({
  practice,
  onBack,
}: {
  practice: Practice;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Back button */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.08, duration: 0.4 }}
        className="flex items-center gap-2.5 text-white/30 hover:text-white transition-colors text-[11px] tracking-[0.25em] uppercase mb-14 group"
      >
        <ArrowLeft
          size={13}
          className="group-hover:-translate-x-1 transition-transform duration-300"
        />
        The Studio
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-16"
      >
        <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-5 font-medium">
          {practice.n} — Practice
        </p>
        <h1 className="text-white text-4xl sm:text-6xl font-light tracking-tight mb-6 leading-[1.05]">
          {practice.title}
        </h1>
        <p className="text-white/40 text-base font-light max-w-2xl leading-relaxed">
          {practice.body}
        </p>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="border-t border-white/[0.08] pt-10">
          <p className="text-white/[0.15] text-[11px] tracking-[0.3em] uppercase">
            Case studies coming soon
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function StudioPage() {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    // Deep-link from home blocks: /about?p=1..4 opens that practice directly
    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");
    if (p) {
      const idx = parseInt(p, 10) - 1;
      if (idx >= 0 && idx < practices.length) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time URL → state sync on mount
        setSelected(idx);
        return;
      }
    }
  }, []);

  // Whenever the selected practice changes (open or back), scroll to top so
  // the new view starts at the page header instead of mid-scroll.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selected]);

  return (
    <>
      <main className="bg-ink min-h-screen">
        <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-32 pb-24">
          <AnimatePresence mode="wait">
            {selected === null ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* Page header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-16 sm:mb-20"
                >
                  <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-5 font-medium">
                    ▸ The Studio
                  </p>
                  <h1 className="text-white text-4xl sm:text-6xl font-light tracking-tight leading-[1.08]">
                    Four practices.
                    <br />
                    <span className="text-white/35 italic">One vision.</span>
                  </h1>
                </motion.div>

                {/* 2×2 grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {practices.map((p, i) => (
                    <PracticeCard
                      key={p.id}
                      practice={p}
                      index={i}
                      onSelect={() => setSelected(i)}
                    />
                  ))}
                </div>
              </motion.div>
            ) : selected === 0 ? (
              <WebDevPractice
                key="detail-webdev"
                onBack={() => setSelected(null)}
              />
            ) : selected === 2 ? (
              <UiUxPractice
                key="detail-uiux"
                onBack={() => setSelected(null)}
              />
            ) : selected === 3 ? (
              <PersonalToolsPractice
                key="detail-tools"
                onBack={() => setSelected(null)}
              />
            ) : (
              <PracticeDetail
                key={`detail-${selected}`}
                practice={practices[selected]}
                onBack={() => setSelected(null)}
              />
            )}
          </AnimatePresence>
        </section>

        {selected === null && <TechStack showHeader={false} compact />}
      </main>
      <Footer />
    </>
  );
}
