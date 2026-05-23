"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface LogoItem {
  /** The label text displayed next to the icon */
  label: string;
  /** The icon node (any React element — usually a small SVG/badge) */
  icon: React.ReactNode;
  /** Animation delay in seconds (negative values give a staggered start) */
  animationDelay: number;
  /** Animation duration in seconds */
  animationDuration: number;
  /** The row number where this logo should appear (1-based) */
  row: number;
}

export interface LogoTimelineProps {
  items: LogoItem[];
  title?: string;
  height?: string;
  className?: string;
  iconSize?: number;
  showRowSeparator?: boolean;
  animateOnHover?: boolean;
}

export function LogoTimeline({
  items,
  title,
  height = "h-[400px] sm:h-[800px]",
  className,
  showRowSeparator = true,
  animateOnHover = false,
}: LogoTimelineProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Group items by row
  const rowsMap = new Map<number, LogoItem[]>();
  items.forEach((item) => {
    if (!rowsMap.has(item.row)) rowsMap.set(item.row, []);
    rowsMap.get(item.row)?.push(item);
  });

  const rows = Array.from(rowsMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([, rowItems]) => rowItems);

  const animationPlayState = animateOnHover
    ? isHovered
      ? "running"
      : "paused"
    : "running";

  return (
    <section className={cn("w-full", height, className)}>
      <motion.div
        aria-hidden="true"
        className="bg-background relative h-full w-full overflow-hidden py-24 ring-inset sm:py-32"
        onMouseEnter={() => animateOnHover && setIsHovered(true)}
        onMouseLeave={() => animateOnHover && setIsHovered(false)}
      >
        {title && (
          <div className="absolute top-1/2 left-1/2 mx-auto w-full max-w-[90%] -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="relative z-10">
              <p className="text-foreground/10 mx-auto mt-2 max-w-3xl text-4xl font-semibold tracking-tight text-pretty sm:text-5xl md:text-6xl">
                {title}
              </p>
            </div>
          </div>
        )}

        <div
          className="@container absolute inset-0 grid"
          style={{ gridTemplateRows: `repeat(${rows.length}, 1fr)` }}
        >
          {rows.map((rowItems, index) => (
            <div className="group relative flex items-center" key={index}>
              {/* dashed row line */}
              <div className="from-foreground/15 absolute inset-x-0 top-1/2 h-0.5 bg-linear-to-r from-[2px] to-[2px] bg-size-[12px_100%]" />
              {showRowSeparator && (
                <div className="from-foreground/5 absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-[2px] to-[2px] bg-size-[12px_100%] group-last:hidden" />
              )}

              {rowItems.map((logo) => (
                <div
                  key={`${logo.row}-${logo.label}`}
                  className={cn(
                    "absolute top-1/2 flex -translate-y-1/2 items-center gap-2 px-3 py-1.5 whitespace-nowrap",
                    // dark-themed pill: subtle gradient, hairline ring, soft glow
                    "rounded-full bg-gradient-to-b from-white/[0.06] to-white/[0.02] ring-1 ring-inset ring-white/10 backdrop-blur-sm",
                    "shadow-[0_0_20px_rgba(255,107,26,0.06)]",
                    // horizontal scroll animation — `repeat-[infinite]` isn't
                    // a real Tailwind utility, so the iteration-count never
                    // shipped and items ran exactly one lap before freezing
                    // (the latest-starting items stopped first). Use the
                    // explicit arbitrary property instead.
                    "[animation-iteration-count:infinite] [--move-x-from:-100%] [--move-x-to:calc(100%+100cqw)] [animation-name:move-x] [animation-timing-function:linear]"
                  )}
                  style={{
                    animationDelay: `${logo.animationDelay}s`,
                    animationDuration: `${logo.animationDuration}s`,
                    animationPlayState,
                  }}
                >
                  {logo.icon}
                  <span className="text-white text-sm/6 font-medium tracking-tight">
                    {logo.label}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* edge fades — items scroll cleanly off-screen */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />
      </motion.div>
    </section>
  );
}
