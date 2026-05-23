"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// LARPN-themed BrandList — vertical list of brand entries with hover color
// inversion (ink → white) and an arrow that shifts northeast on hover.
// Modeled on the Framer BrandList primitive, themed to match the studio.

export type BrandStatus = "private" | "in-progress" | "active";

export type BrandEntry = {
  title: string;
  subtitle?: string;
  href?: string;
  comingSoon?: boolean;
  date?: string;
  status?: BrandStatus;
};

const STATUS_META: Record<
  BrandStatus,
  { label: string; pill: string }
> = {
  // Each pill keeps its hue on both the default dark row AND the inverted
  // (white background) hover state, so we hardcode bg/border/text instead
  // of relying on `currentColor`.
  private: {
    label: "Private",
    pill:
      "border-red-500/50 bg-red-500/15 text-red-400",
  },
  "in-progress": {
    label: "In progress",
    pill:
      "border-ember/50 bg-ember/15 text-ember",
  },
  active: {
    label: "Active",
    pill:
      "border-emerald-500/50 bg-emerald-500/15 text-emerald-400",
  },
};

export default function BrandList({ entries }: { entries: BrandEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-white/30 text-sm font-light border-t border-white/[0.08] pt-10">
        Nothing here yet — check back soon.
      </p>
    );
  }

  return (
    <ul className="rounded-2xl overflow-hidden border border-white/[0.08]">
      {entries.map((entry, i) => (
        <BrandRow key={`${entry.title}-${i}`} entry={entry} index={i} />
      ))}
    </ul>
  );
}

function StatusPill({ status }: { status: BrandStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] tracking-[0.2em] uppercase font-medium border",
        meta.pill
      )}
    >
      {meta.label}
    </span>
  );
}

function BrandRow({ entry, index }: { entry: BrandEntry; index: number }) {
  const isInteractive = !!entry.href && !entry.comingSoon;
  const content = (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <p className="text-current text-lg sm:text-xl font-light tracking-tight transition-colors">
            {entry.title}
          </p>
          {entry.status && <StatusPill status={entry.status} />}
          {entry.comingSoon && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] tracking-[0.2em] uppercase border border-current/40">
              Coming soon
            </span>
          )}
        </div>
        {entry.subtitle && (
          <p className="text-current/55 group-hover/row:text-current/70 text-[13px] font-light mt-1 tracking-wide transition-colors">
            {entry.subtitle}
          </p>
        )}
      </div>
      <div className="shrink-0 flex items-center gap-4">
        {entry.date && (
          <span className="hidden sm:inline text-current/45 group-hover/row:text-current/65 text-[11px] tracking-[0.2em] uppercase font-light tabular-nums transition-colors">
            {entry.date}
          </span>
        )}
        <span
          aria-hidden
          className={cn(
            "text-2xl leading-none font-light translate-y-0 transition-transform duration-300 ease-out motion-reduce:transition-none",
            isInteractive &&
              "group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5"
          )}
        >
          ↗
        </span>
      </div>
    </>
  );

  const rowClasses = cn(
    "group/row flex items-center justify-between gap-6 px-5 sm:px-7 py-5 sm:py-6 transition-colors duration-200 ease-out motion-reduce:transition-none",
    // border between rows, no border on last row (handled by overflow-hidden wrapper)
    index !== 0 && "border-t border-white/[0.08]",
    isInteractive
      ? "text-white/90 hover:bg-white hover:text-black cursor-pointer"
      : "text-white/40 cursor-default"
  );

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: 0.05 + index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {isInteractive ? (
        <a
          href={entry.href}
          target="_blank"
          rel="noopener noreferrer"
          className={rowClasses}
        >
          {content}
        </a>
      ) : (
        <div className={rowClasses}>
          {/* Show date inline on mobile when the row isn't an <a> wrapping it */}
          {content}
        </div>
      )}
    </motion.li>
  );
}
