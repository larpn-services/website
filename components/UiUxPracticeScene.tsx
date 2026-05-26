"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Box,
  Globe,
  Image as ImageIcon,
  MessageSquare,
  PenTool,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

type Addon = {
  icon: LucideIcon;
  name: string;
  price: string;
  period: string;
  tagline: string;
};

const ADDONS: Addon[] = [
  {
    icon: Box,
    name: "3D Components",
    price: "$29.99",
    period: "each",
    tagline: "Three.js scenes, models, interactive 3D for your site",
  },
  {
    icon: ShieldCheck,
    name: "Maintenance Plan",
    price: "$49.99",
    period: "/month",
    tagline: "Updates, security patches, backups, on-call fixes",
  },
  {
    icon: Globe,
    name: "Domain & DNS Setup",
    price: "$9.99",
    period: "one-time",
    tagline: "Buy, point, configure, SSL — fully done for you",
  },
  {
    icon: PenTool,
    name: "Logo Creation",
    price: "$29.99",
    period: "one-time",
    tagline: "Custom mark + wordmark, source files included",
  },
  {
    icon: ImageIcon,
    name: "Thumbnails & Banners",
    price: "$9.99",
    period: "each",
    tagline: "Social posts, YouTube thumbs, ad creatives",
  },
  {
    icon: MessageSquare,
    name: "Live Chat Widget",
    price: "$19.99",
    period: "/month",
    tagline: "AI- or human-routed chat installed on your site",
  },
  {
    icon: Sparkles,
    name: "AI Assistant Setup",
    price: "$79.99",
    period: "one-time",
    tagline: "Custom GPT trained on your business + docs",
  },
  {
    icon: TrendingUp,
    name: "SEO Boost Package",
    price: "$39.99",
    period: "one-time",
    tagline: "On-page audit, keywords, schema, indexing fixes",
  },
];

function AddonCard({ addon, index }: { addon: Addon; index: number }) {
  const Icon = addon.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: 0.25 + index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.025] to-transparent p-6 sm:p-7 overflow-hidden hover:border-ember/30 transition-colors duration-300"
    >
      {/* Top edge glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 group-hover:text-ember group-hover:border-ember/40 transition-colors">
            <Icon className="h-5 w-5" />
          </span>
          <span className="flex items-baseline gap-1">
            <span className="text-ember text-2xl font-light tracking-tight">
              {addon.price}
            </span>
            <span className="text-white/40 text-xs font-light">
              {addon.period}
            </span>
          </span>
        </div>
        <h3 className="text-white text-lg font-normal tracking-tight mb-2">
          {addon.name}
        </h3>
        <p className="text-white/50 text-sm font-light leading-relaxed">
          {addon.tagline}
        </p>
      </div>
    </motion.div>
  );
}

export default function UiUxPractice({ onBack }: { onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Back button */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
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
        transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14"
      >
        <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-5 font-medium">
          03 — Practice
        </p>
        <h1 className="text-white text-4xl sm:text-6xl font-light tracking-tight mb-6 leading-[1.05]">
          Add-ons.
          <br />
          <span className="text-white/35 italic">
            Upgrades for sites already alive.
          </span>
        </h1>
        <p className="text-white/45 text-base font-light max-w-2xl leading-relaxed">
          Have a site you like? I&apos;ll make it sharper, faster, and
          better-looking — without rebuilding the whole thing. Pick what you
          want, when you want.
        </p>
      </motion.div>

      {/* Add-on grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
        {ADDONS.map((a, i) => (
          <AddonCard key={a.name} addon={a} index={i} />
        ))}
      </div>

      {/* Bundle banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl border border-ember/30 bg-gradient-to-br from-ember/[0.08] via-ember/[0.02] to-transparent p-8 sm:p-10 overflow-hidden mb-14"
      >
        <div
          className="absolute -top-20 -right-16 w-56 h-56 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,26,0.18), transparent 70%)",
          }}
        />
        <div className="relative">
          <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-4 font-medium">
            Bundle
          </p>
          <h2 className="text-white text-3xl sm:text-4xl font-light tracking-tight mb-4 leading-tight">
            Pair 3 — <span className="text-ember italic">save 20%.</span>
          </h2>
          <p className="text-white/55 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
            Add any three of the above to a project and the bundle discount
            lands automatically. Ask about quarterly retainers for ongoing
            teams.
          </p>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5 }}
        className="flex flex-wrap gap-3 items-center"
      >
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black rounded-full text-sm font-medium hover:bg-ember hover:text-white transition-all"
        >
          Graft this onto your site
          <ArrowUpRight
            size={15}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>
        <button
          onClick={onBack}
          className="px-5 py-3.5 text-white/55 hover:text-white text-[11px] tracking-[0.25em] uppercase transition-colors"
        >
          ← Back to studio
        </button>
      </motion.div>
    </motion.div>
  );
}
