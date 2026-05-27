"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Footer from "@/components/Footer";
import { categories } from "./categories";

export default function WorkHubPage() {
  const [hovered, setHovered] = useState(categories[0].slug);
  const active = categories.find((c) => c.slug === hovered) ?? categories[0];

  return (
    <>
      <main className="bg-ink min-h-screen">
        <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-32 pb-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 sm:mb-20"
          >
            <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-5 font-medium">
              ▸ Selected Work
            </p>
            <h1 className="text-white text-4xl sm:text-6xl font-light tracking-tight leading-[1.08]">
              Things we&apos;ve built.
              <br />
              <span className="text-white/35 italic">By category.</span>
            </h1>
            <p className="text-white/40 text-sm font-light leading-relaxed mt-6 max-w-md">
              Each directory holds a gallery of work in that lane — open one to scroll through.
            </p>
          </motion.div>

          {/* Tab pills */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {categories.map((cat, i) => {
              const active = hovered === cat.slug;
              return (
                <Link
                  key={cat.slug}
                  href={`/services/${cat.slug}`}
                  onMouseEnter={() => setHovered(cat.slug)}
                  className={
                    "px-5 py-2.5 rounded-full text-[11px] tracking-[0.2em] uppercase font-medium border transition-colors duration-200 " +
                    (active
                      ? "bg-ember/15 border-ember/45 text-ember"
                      : "bg-white/[0.02] border-white/[0.08] text-white/55 hover:text-white hover:border-white/20")
                  }
                >
                  <span className="text-current/40 mr-2">0{i + 1}</span>
                  {cat.name}
                </Link>
              );
            })}
          </motion.div>

          {/* Preview image */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={hovered}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/services/${active.slug}`}
                  className="group relative block aspect-[4/3] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-white/[0.07] hover:border-ember/30 transition-colors"
                >
                  <Image
                    src={active.cover}
                    alt={active.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 90vw"
                    className="object-cover opacity-50 group-hover:opacity-65 group-hover:scale-[1.02] transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
                    <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-3 font-medium">
                      0{categories.findIndex((c) => c.slug === active.slug) + 1}
                    </p>
                    <h2 className="text-white text-3xl sm:text-5xl font-light tracking-tight mb-3 leading-tight">
                      {active.name}
                    </h2>
                    <p className="text-white/50 text-sm font-light max-w-lg leading-relaxed mb-6">
                      {active.blurb}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/30 text-[11px] tracking-[0.25em] uppercase font-light">
                        {active.items.length}{" "}
                        {active.items.length === 1 ? "item" : "items"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-white/40 group-hover:text-ember text-[11px] tracking-[0.25em] uppercase font-light transition-colors">
                        Browse
                        <ArrowUpRight
                          size={13}
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
