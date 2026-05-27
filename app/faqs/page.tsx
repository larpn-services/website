"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

// ─── Seeded studio FAQs ────────────────────────────────────────────────────

type SeedFaq = { id: string; question: string; answer: string };

const seededFaqs: SeedFaq[] = [
  {
    id: "free-demo",
    question: "Do you offer a free demo for websites?",
    answer:
      "Yes. For projects that look like a good fit we'll put together a short demo build — a slice of the homepage or a working prototype of a key flow — at no cost. It's how we both decide if there's a fit before any contract.",
  },
  {
    id: "experience",
    question: "How much experience does your team have?",
    answer:
      "Over four years. The team is a mix of AI/ML engineers, software engineers, and web developers — so most projects are handled end-to-end without us subcontracting out the parts that matter.",
  },
  {
    id: "menu",
    question: "What's on your menu?",
    answer:
      "Four lanes: Web development, Software engineering, UI / UX design, and Personal tools. On the work side that translates into client builds, Chrome extensions, standalone applications, and side projects — see the Work page for samples.",
  },
  {
    id: "stack",
    question: "What stack do you build on?",
    answer:
      "Next.js, React, TypeScript, and Tailwind on the front; Node, Python, and Supabase / Postgres on the back. We pick the stack to fit the problem — not the other way around.",
  },
  {
    id: "timeline",
    question: "How long does a typical project take?",
    answer:
      "A polished marketing site: 2–4 weeks. A focused MVP: 4–8 weeks. A larger product build is scoped per project — we always break it into milestones with a working preview at the end of each.",
  },
  {
    id: "pricing",
    question: "How does pricing work?",
    answer:
      "Pick a tier on the contact form — free demo, low budget, solid budget, high budget, or a custom arrangement — and we'll come back with a scoped quote that fits. No hourly billing surprises.",
  },
  {
    id: "nda",
    question: "Can you sign an NDA before we share details?",
    answer:
      "Yes. Send us a one-line note on the Contact page and we'll return a mutual NDA before anything technical is discussed.",
  },
  {
    id: "international",
    question: "Do you work with clients outside your country?",
    answer:
      "Yes — most of our clients are remote. We work async with weekly check-ins and a shared progress channel.",
  },
];

function BlurredStagger({ text }: { text: string }) {
  // Word-level stagger preserves real spaces between words, so the browser
  // can wrap text naturally. Character-level inline-blocks broke word-wrap
  // and made answers look like one long mashed string.
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.025 } },
  };
  const wordVariant = {
    hidden: { opacity: 0, filter: "blur(6px)", y: 4 },
    show: { opacity: 1, filter: "blur(0px)", y: 0 },
  };

  const words = text.split(" ");

  return (
    <motion.p
      variants={container}
      initial="hidden"
      animate="show"
      className="text-white/65 text-sm sm:text-[15px] font-light leading-relaxed"
    >
      {words.map((word, i) => (
        <span key={i}>
          <motion.span
            variants={wordVariant}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.p>
  );
}

function AccordionItem({
  id,
  question,
  answer,
  openId,
  setOpenId,
}: {
  id: string;
  question: string;
  answer: string;
  openId: string | null;
  setOpenId: (id: string | null) => void;
}) {
  const isOpen = openId === id;
  return (
    <div className="border-b border-white/[0.08]">
      <button
        type="button"
        onClick={() => setOpenId(isOpen ? null : id)}
        className={cn(
          "w-full flex items-center justify-between gap-6 py-5 text-left group transition-colors",
          isOpen ? "text-white" : "text-white/85 hover:text-white"
        )}
      >
        <span className="text-base sm:text-[17px] font-light tracking-tight">
          {question}
        </span>
        <span
          className={cn(
            "shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300",
            isOpen
              ? "border-ember text-ember rotate-180"
              : "border-white/15 text-white/40 group-hover:border-ember/50 group-hover:text-ember/80"
          )}
        >
          <ChevronDown size={14} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-10 max-w-2xl">
              <BlurredStagger text={answer} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqsPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      <main className="min-h-dvh bg-ink pt-32 pb-24">
        <section className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="grid gap-12 md:grid-cols-5 md:gap-16">
            <div className="md:col-span-2">
              <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-5 font-medium">
                ▸ Questions
              </p>
              <h1 className="text-white text-4xl sm:text-5xl font-light tracking-tight leading-[1.05]">
                FAQs.
              </h1>
              <p className="text-white/45 text-sm font-light leading-relaxed mt-5 max-w-sm">
                Everything you might want to know about working with LARPN —
                process, pricing, the team, the stack.
              </p>
              <p className="text-white/40 text-sm font-light leading-relaxed mt-5 hidden md:block max-w-sm">
                Still not what you&apos;re looking for? Reach out via{" "}
                <Link
                  href="/contact"
                  className="text-ember hover:underline underline-offset-4 font-normal"
                >
                  the contact page
                </Link>{" "}
                — we answer every message.
              </p>
            </div>

            <div className="md:col-span-3">
              <div>
                {seededFaqs.map((f) => (
                  <AccordionItem
                    key={f.id}
                    id={f.id}
                    question={f.question}
                    answer={f.answer}
                    openId={openId}
                    setOpenId={setOpenId}
                  />
                ))}
              </div>

              {/* Bridge into the community page */}
              <Link
                href="/faqs/community"
                className="group mt-12 flex items-center justify-between w-full p-6 sm:p-8 rounded-2xl border border-white/[0.08] hover:border-ember/40 bg-white/[0.015] hover:bg-white/[0.03] transition-colors text-left"
              >
                <div>
                  <p className="text-ember text-[10px] tracking-[0.3em] uppercase mb-2 font-medium">
                    ▸ Community
                  </p>
                  <p className="text-white text-lg sm:text-xl font-light tracking-tight">
                    Browse and ask community questions
                  </p>
                  <p className="text-white/40 text-sm font-light mt-1.5 max-w-md">
                    See what others are asking, upvote helpful ones, or add your own.
                  </p>
                </div>
                <ArrowUpRight
                  size={20}
                  className="shrink-0 text-white/30 group-hover:text-ember group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
