"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Footer from "@/components/Footer";
import { categories } from "./categories";

export default function WorkHubPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mousePosition]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setIsVisible(false);
  };

  return (
    <>
      <main className="bg-ink min-h-screen">
        <section className="max-w-5xl mx-auto px-6 sm:px-10 pt-32 pb-24">
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

          {/* Showcase list with cursor-following preview */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative"
          >
            {/* Floating preview — desktop only (hover requires a cursor) */}
            <div
              className="pointer-events-none fixed z-40 hidden md:block overflow-hidden rounded-xl shadow-2xl"
              style={{
                left: containerRef.current?.getBoundingClientRect().left ?? 0,
                top: containerRef.current?.getBoundingClientRect().top ?? 0,
                transform: `translate3d(${smoothPosition.x + 24}px, ${smoothPosition.y - 110}px, 0)`,
                opacity: isVisible ? 1 : 0,
                transition:
                  "opacity 280ms cubic-bezier(0.4, 0, 0.2, 1)",
                willChange: "transform, opacity",
              }}
            >
              <div className="relative w-[320px] h-[200px] bg-ink-soft rounded-xl overflow-hidden border border-white/10">
                {categories.map((cat, index) => (
                  <Image
                    key={cat.slug}
                    src={cat.cover}
                    alt={cat.name}
                    fill
                    sizes="320px"
                    priority={index < 2}
                    className="object-cover transition-all duration-500 ease-out"
                    style={{
                      opacity: hoveredIndex === index ? 1 : 0,
                      transform: `scale(${hoveredIndex === index ? 1 : 1.08})`,
                      filter: hoveredIndex === index ? "none" : "blur(10px)",
                    }}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* List */}
            <div>
              {categories.map((cat, index) => {
                const active = hoveredIndex === index;
                return (
                  <Link
                    key={cat.slug}
                    href={`/services/${cat.slug}`}
                    className="group block"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="relative py-7 sm:py-9 border-t border-white/10 transition-colors duration-300">
                      {/* Background highlight on hover */}
                      <div
                        className={
                          "absolute inset-0 -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-xl bg-white/[0.025] transition-opacity duration-300 " +
                          (active ? "opacity-100" : "opacity-0")
                        }
                      />

                      <div className="relative flex items-start justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          {/* index + title */}
                          <div className="inline-flex items-center gap-3">
                            <span className="text-ember text-[10px] tracking-[0.35em] uppercase font-medium tabular-nums">
                              0{index + 1}
                            </span>
                            <h3 className="text-white text-2xl sm:text-3xl font-light tracking-tight">
                              <span className="relative">
                                {cat.name}
                                <span
                                  className={
                                    "absolute left-0 -bottom-0.5 h-px bg-ember transition-all duration-300 ease-out " +
                                    (active ? "w-full" : "w-0")
                                  }
                                />
                              </span>
                            </h3>
                            <ArrowUpRight
                              className={
                                "w-4 h-4 text-white/40 transition-all duration-300 ease-out " +
                                (active
                                  ? "opacity-100 translate-x-0 translate-y-0 text-ember"
                                  : "opacity-0 -translate-x-2 translate-y-2")
                              }
                            />
                          </div>

                          <p
                            className={
                              "text-sm sm:text-base font-light mt-3 leading-relaxed max-w-xl transition-colors duration-300 " +
                              (active ? "text-white/70" : "text-white/40")
                            }
                          >
                            {cat.blurb}
                          </p>
                        </div>

                        {/* item count, like the year badge */}
                        <span
                          className={
                            "shrink-0 text-[11px] font-mono tracking-wider tabular-nums transition-colors duration-300 " +
                            (active ? "text-white/60" : "text-white/30")
                          }
                        >
                          {cat.items.length.toString().padStart(2, "0")}{" "}
                          {cat.items.length === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              <div className="border-t border-white/10" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
