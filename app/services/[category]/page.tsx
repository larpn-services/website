"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import BrandList, { type BrandEntry } from "@/components/BrandList";
import { getCategory, sortItemsByDateDesc } from "../categories";

export default function CategoryDirectoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = use(params);
  const category = getCategory(slug);

  if (!category) notFound();

  const entries: BrandEntry[] = sortItemsByDateDesc(category.items).map(
    (item) => ({
      title: item.title,
      subtitle: item.subtitle,
      href: item.href,
      comingSoon: item.comingSoon,
      date: item.date,
      status: item.status,
    })
  );

  return (
    <>
      <main className="bg-ink min-h-dvh">
        <section className="max-w-3xl mx-auto px-6 sm:px-10 pt-28 pb-24">
          {/* Back to hub */}
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-white/35 hover:text-white text-[11px] tracking-[0.25em] uppercase mb-14 transition-colors"
          >
            <ArrowLeft
              size={13}
              className="group-hover:-translate-x-1 transition-transform"
            />
            All categories
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
          >
            <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-5 font-medium">
              ▸ Directory
            </p>
            <h1 className="text-white text-4xl sm:text-6xl font-light tracking-tight leading-[1.05] mb-5">
              {category.name}
            </h1>
            <p className="text-white/45 text-base font-light max-w-xl leading-relaxed">
              {category.blurb}
            </p>
            <p className="text-white/25 text-[11px] tracking-[0.25em] uppercase font-light mt-6">
              {category.items.length}{" "}
              {category.items.length === 1 ? "entry" : "entries"}
            </p>
          </motion.div>

          {/* BrandList */}
          <BrandList entries={entries} />
        </section>
      </main>
      <Footer />
    </>
  );
}
