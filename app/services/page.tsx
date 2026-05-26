"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Footer from "@/components/Footer";
import { categories } from "./categories";

export default function WorkHubPage() {
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

          {/* 4-card directory grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={`/services/${cat.slug}`}
                  className="group relative block aspect-[4/3] sm:aspect-[5/4] rounded-2xl overflow-hidden border border-white/[0.07] hover:border-ember/30 transition-colors"
                >
                  {/* cover image */}
                  <Image
                    src={cat.cover}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover opacity-50 group-hover:opacity-65 group-hover:scale-[1.02] transition-all duration-700"
                  />
                  {/* dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
                  {/* ember edge on hover */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-9">
                    <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-3 font-medium">
                      0{i + 1}
                    </p>
                    <h2 className="text-white text-2xl sm:text-3xl font-light tracking-tight mb-2 leading-tight">
                      {cat.name}
                    </h2>
                    <p className="text-white/50 text-sm font-light max-w-md leading-relaxed">
                      {cat.blurb}
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-white/30 text-[11px] tracking-[0.25em] uppercase font-light">
                        {cat.items.length}{" "}
                        {cat.items.length === 1 ? "item" : "items"}
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
            ))}
          </div>

        </section>
      </main>
      <Footer />
    </>
  );
}
