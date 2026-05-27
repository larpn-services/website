"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { templates, type Template } from "./templates";

export default function TemplatesPage() {
  const [selected, setSelected] = useState<Template | null>(null);

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
                className="group relative rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.025] to-transparent overflow-hidden hover:border-ember/30 transition-colors cursor-pointer"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={tpl.cover}
                    alt={tpl.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
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
    </>
  );
}
