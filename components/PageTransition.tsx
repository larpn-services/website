"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

// Global crossfade between routes. Opacity-only and short — the previous
// version added a y-translate + 400ms each direction, which read as a
// "page freeze" during navigation. Navbar lives in the root layout now,
// so it's outside this AnimatePresence and never re-mounts on nav.
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
