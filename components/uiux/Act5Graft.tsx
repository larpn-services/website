"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Act5Graft() {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    setPos(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  }, []);

  return (
    <section className="relative py-32 px-6 bg-ink">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-5 font-medium">
            ▸ Graft
          </p>
          <h2 className="text-white text-4xl sm:text-6xl font-light tracking-tight leading-[1.05] mb-6">
            Already have a site?
          </h2>
          <p className="text-white/45 text-base font-light max-w-xl mx-auto leading-relaxed">
            We do full builds — and we polish too. Existing layouts get the same depth,
            motion, and detail.{" "}
            <span className="text-white/80">This entire scroll could live on yours.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            ref={containerRef}
            onMouseDown={(e) => {
              setDragging(true);
              updateFromClientX(e.clientX);
            }}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onMouseMove={(e) => {
              if (dragging) updateFromClientX(e.clientX);
            }}
            onTouchStart={(e) => {
              setDragging(true);
              updateFromClientX(e.touches[0].clientX);
            }}
            onTouchEnd={() => setDragging(false)}
            onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
            className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 cursor-ew-resize select-none bg-ink-elev"
          >
            {/* "After" full bleed */}
            <PolishedMockup />

            {/* "Before" clipped */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <DrabMockup />
            </div>

            {/* divider line */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none"
              style={{ left: `calc(${pos}% - 0.5px)`, width: 1, background: "#ff6b1a" }}
            />

            {/* pulsing halo behind handle */}
            <motion.div
              aria-hidden
              animate={reduce ? undefined : { scale: [1, 1.3, 1], opacity: [0.45, 0.15, 0.45] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/40 pointer-events-none"
              style={{ left: `${pos}%` }}
            />

            {/* drag handle */}
            <div
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-ember flex items-center justify-center pointer-events-none"
              style={{
                left: `${pos}%`,
                boxShadow:
                  "0 8px 24px rgba(255,107,26,0.45), 0 0 0 4px rgba(255,107,26,0.15)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3L2 7L5 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 3L12 7L9 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* labels */}
            <span className="absolute top-4 left-4 text-white/40 text-[10px] tracking-[0.3em] uppercase">
              Before
            </span>
            <span className="absolute top-4 right-4 text-ember text-[10px] tracking-[0.3em] uppercase">
              After
            </span>

            {/* drag hint */}
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/35 text-[10px] tracking-[0.3em] uppercase pointer-events-none">
              ◂ Drag ▸
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-14 flex flex-col items-center gap-5"
        >
          <p className="text-white/40 text-sm font-light text-center max-w-md leading-relaxed">
            Most retrofits ship in two to three weeks.
            We start with an audit, then graft.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black rounded-full text-sm font-medium hover:bg-ember hover:text-white transition-all"
          >
            Talk about a retrofit
            <ArrowUpRight
              size={15}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function DrabMockup() {
  return (
    <div className="absolute inset-0 bg-[#1a1a1a] p-7 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-[#888] text-lg font-bold tracking-tight">
          Acme Dashboard
        </span>
        <button className="bg-[#444] text-white px-4 py-2 text-sm">
          Sign in
        </button>
      </div>
      <div className="bg-[#262626] p-5">
        <p className="text-[#999] text-xs mb-1.5">Welcome back</p>
        <p className="text-white text-xl font-bold mb-2">
          Your monthly snapshot
        </p>
        <p className="text-[#888] text-sm">
          28 active projects across 4 teams
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Metric 1", v: 42 },
          { label: "Metric 2", v: 1280 },
          { label: "Metric 3", v: 96 },
        ].map((s, i) => (
          <div key={i} className="bg-[#262626] p-3.5">
            <p className="text-[#888] text-xs mb-1">{s.label}</p>
            <p className="text-white text-lg font-bold">{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PolishedMockup() {
  return (
    <div
      className="absolute inset-0 p-7 flex flex-col gap-5"
      style={{
        background:
          "radial-gradient(circle at 82% -10%, rgba(255,107,26,0.14), transparent 50%), #0a0a0a",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="block w-2 h-2 rounded-full bg-ember" />
          <span className="text-white text-base font-medium tracking-tight">
            Acme
          </span>
          <span className="text-white/30 text-[10px] tracking-[0.25em] uppercase ml-2">
            Dashboard
          </span>
        </div>
        <button className="border border-white/15 hover:border-ember/40 text-white/85 px-4 py-2 rounded-full text-xs tracking-tight transition-colors">
          Sign in →
        </button>
      </div>
      <div className="relative rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 backdrop-blur-sm overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-ember/15 blur-3xl pointer-events-none" />
        <p className="text-ember text-[10px] tracking-[0.3em] uppercase mb-2 font-medium">
          Welcome back
        </p>
        <p className="text-white text-xl font-light tracking-tight mb-2 leading-tight">
          Your monthly snapshot
        </p>
        <p className="text-white/40 text-sm font-light">
          28 active projects across 4 teams
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active", v: "42" },
          { label: "Sessions", v: "1,280" },
          { label: "NPS", v: "96" },
        ].map((s, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/[0.06] bg-white/[0.018] p-3.5"
          >
            <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-1.5">
              {s.label}
            </p>
            <p className="text-white text-xl font-light tabular-nums tracking-tight">
              {s.v}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
