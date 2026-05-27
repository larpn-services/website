"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import Footer from "@/components/Footer";
import { templates, type Template } from "./templates";

export default function TemplatesPage() {
  const [selected, setSelected] = useState<Template | null>(null);

  useEffect(() => {
    if (!selected) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  return (
    <>
      <main className="bg-ink min-h-screen">
        <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-32 pb-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
          >
            <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-5 font-medium">
              ▸ Templates
            </p>
            <h1 className="text-white text-4xl sm:text-6xl font-light tracking-tight leading-[1.08]">
              Templates.
              <br />
              <span className="text-white/35 italic">
                Ready to ship. Tuned to you.
              </span>
            </h1>
            <p className="text-white/40 text-sm font-light leading-relaxed mt-6 max-w-xl">
              Built once, sharpened endlessly. Drop one onto your domain and
              I&apos;ll re-skin it in your brand — usually within a week.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {templates.map((tpl, i) => (
              <motion.div
                key={tpl.slug}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.08 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => setSelected(tpl)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(tpl); } }}
                className="group relative rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.025] to-transparent overflow-hidden hover:border-ember/30 transition-colors cursor-pointer"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={tpl.cover}
                    alt={tpl.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    priority={i < 2}
                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-[1.02] transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-white text-lg font-normal tracking-tight">
                      {tpl.name}
                    </h3>
                    <div className="shrink-0 flex flex-col items-end gap-0.5">
                      <span className="text-white/35 text-xs line-through">
                        ${tpl.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-ember text-sm font-light">
                        ${tpl.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/45 text-sm font-light leading-relaxed">
                    {tpl.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="relative bg-[#0f0f0f] border border-white/[0.08] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                {/* Close */}
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>

                {/* 2×2 image grid */}
                <div className="grid grid-cols-2 gap-1 rounded-t-2xl overflow-hidden">
                  {selected.pics.map((src, idx) => (
                    <div key={idx} className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={src}
                        alt={`${selected.name} screenshot ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 384px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <h2 id="modal-title" className="text-white text-2xl font-normal tracking-tight">
                      {selected.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-white/35 text-sm line-through">
                        ${selected.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-ember text-lg font-light">
                        ${selected.price.toFixed(2)}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-ember/15 border border-ember/30 text-ember text-[10px] tracking-[0.2em] uppercase font-medium">
                        25% OFF
                      </span>
                    </div>
                  </div>

                  <p className="text-white/50 text-sm font-light leading-relaxed mb-8">
                    {selected.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={selected.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/[0.15] text-white/70 hover:text-white hover:border-white/30 text-sm font-light tracking-wide transition-colors"
                    >
                      Preview
                      <ArrowUpRight size={14} />
                    </a>
                    <Link
                      href="/contact"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-ember hover:bg-ember-soft text-white text-sm font-medium tracking-wide transition-colors"
                    >
                      Purchase
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
