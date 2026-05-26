"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import Footer from "@/components/Footer";
import {
  THEMES,
  templates,
  themeLabel,
  type TemplateTheme,
} from "./templates";

export default function TemplatesPage() {
  const [query, setQuery] = useState("");
  const [activeTheme, setActiveTheme] = useState<TemplateTheme | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => {
      if (activeTheme !== "all" && t.theme !== activeTheme) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    });
  }, [query, activeTheme]);

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

          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-10 flex flex-col gap-4"
          >
            <div className="relative">
              <Search
                aria-hidden
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates…"
                aria-label="Search templates"
                className="w-full bg-white/[0.025] border border-white/[0.08] rounded-full pl-11 pr-4 py-3 text-white text-sm font-light placeholder:text-white/30 focus:border-ember focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => {
                const active = activeTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTheme(t.id)}
                    className={
                      "px-4 py-2 rounded-full text-[11px] tracking-[0.2em] uppercase font-medium border transition-colors duration-200 " +
                      (active
                        ? "bg-ember/15 border-ember/45 text-ember"
                        : "bg-white/[0.02] border-white/[0.08] text-white/55 hover:text-white hover:border-white/20")
                    }
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((tpl, i) => (
                <motion.div
                  key={tpl.slug}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.08 * (i % 6),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.025] to-transparent overflow-hidden hover:border-ember/30 transition-colors"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={tpl.cover}
                      alt={tpl.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-[1.02] transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full bg-ember/15 border border-ember/30 text-ember text-[9px] tracking-[0.25em] uppercase font-medium">
                      {themeLabel(tpl.theme)}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-white text-lg font-normal tracking-tight">
                        {tpl.name}
                      </h3>
                      {tpl.price !== undefined && (
                        <span className="shrink-0 text-ember text-sm font-light">
                          ${tpl.price}
                        </span>
                      )}
                    </div>
                    <p className="text-white/45 text-sm font-light leading-relaxed mb-4">
                      {tpl.description}
                    </p>
                    {tpl.previewUrl ? (
                      <a
                        href={tpl.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-white/40 group-hover:text-ember text-[11px] tracking-[0.25em] uppercase font-light transition-colors"
                      >
                        Preview
                        <ArrowUpRight
                          size={13}
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </a>
                    ) : (
                      <span className="inline-flex items-center text-white/30 text-[11px] tracking-[0.25em] uppercase font-light">
                        {tpl.comingSoon ? "Coming soon" : "Available"}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-white text-2xl font-light tracking-tight mb-2">
                Nothing here.
              </p>
              <p className="text-white/40 text-sm font-light italic">
                Try a different theme.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
