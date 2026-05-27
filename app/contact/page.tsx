"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ArrowUpRight, MapPin, Plus, HelpCircle } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import SocialsStrip from "@/components/Socials";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <main className="min-h-dvh bg-ink pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          {/* header */}
          <div className="text-center">
            <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-5 font-medium">
              ▸ Get in touch
            </p>
            <h1 className="text-white text-5xl sm:text-6xl font-light tracking-tight mb-5">
              Let&apos;s talk.
            </h1>
            <p className="text-white/50 text-sm font-light max-w-md mx-auto leading-relaxed mb-10">
              Tell us about your project. We&apos;ll get back within 24 hours
              with an honest read on what it would take.
            </p>

            {/* Two CTAs: direct email + open form */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <a
                href="mailto:o.18hamdan@outlook.com"
                className="group inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-white rounded-full text-sm font-light hover:border-ember hover:text-ember transition-colors"
              >
                o.18hamdan@outlook.com
                <ArrowUpRight
                  size={14}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </a>
              <button
                onClick={() => setShowForm((s) => !s)}
                className={cn(
                  "group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all",
                  showForm
                    ? "bg-white/5 border border-white/15 text-white/70 hover:text-white"
                    : "bg-white text-black hover:bg-ember hover:text-white"
                )}
              >
                {showForm ? "Close form" : "Send a message"}
                <Plus
                  size={14}
                  className={cn(
                    "transition-transform duration-300",
                    showForm ? "rotate-45" : "rotate-0"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Form floats in / out */}
          <AnimatePresence>{showForm && <ContactForm />}</AnimatePresence>

          {/* Mini section — socials, location, FAQ. Replaces the footer on this page. */}
          <div className="mt-24 pt-12 border-t border-white/[0.08]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 items-start">
              {/* socials */}
              <div>
                <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-4 font-medium">
                  Socials
                </p>
                <SocialsStrip />
              </div>

              {/* location */}
              <div>
                <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-4 font-medium">
                  Based in
                </p>
                <p className="inline-flex items-center gap-2 text-white/80 text-sm font-light">
                  <MapPin size={14} className="text-ember" />
                  Leesburg, Virginia
                </p>
              </div>

              {/* FAQ */}
              <div className="sm:text-right">
                <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-4 font-medium">
                  Before you write
                </p>
                <Link
                  href="/faqs"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 border border-white/15 rounded-full text-white text-sm font-light hover:border-ember hover:text-ember transition-colors"
                >
                  <HelpCircle size={14} />
                  Read the FAQs
                  <ArrowUpRight
                    size={13}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
