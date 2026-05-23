"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Act1Hero from "./uiux/Act1Hero";
import Act2Parallax from "./uiux/Act2Parallax";
import Act2Depth from "./uiux/Act2Depth";
import Act3Motion from "./uiux/Act3Motion";
import Act4Detail from "./uiux/Act4Detail";
import Act5Graft from "./uiux/Act5Graft";

// Detail "scroll experience" for the UI / UX Design practice card.
// Six scroll-pinned acts (Hero → Parallax retrofit → Depth → Motion → Detail
// → Graft) that each argue a different UI/UX craft principle and end with
// the retrofit CTA.

export default function UiUxPractice({ onBack }: { onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Back button — pinned over the hero, above the navbar's glass band */}
      <div className="absolute top-24 left-6 sm:left-10 z-30">
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="flex items-center gap-2.5 text-white/45 hover:text-white transition-colors text-[11px] tracking-[0.25em] uppercase group"
        >
          <ArrowLeft
            size={13}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          The Studio
        </motion.button>
      </div>

      <Act1Hero />
      <Act2Parallax />
      <Act2Depth />
      <Act3Motion />
      <Act4Detail />
      <Act5Graft />
    </motion.div>
  );
}
