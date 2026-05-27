"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Heart, Plus, Search, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicFaq } from "@/lib/faqs";

const LIKED_KEY = "larpn_liked_faq_ids";
const COOLDOWN_KEY = "larpn_faq_last_submit_ms";
const COOLDOWN_MS = 60_000;

function readLikedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(LIKED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}
function writeLikedIds(set: Set<string>) {
  try {
    localStorage.setItem(LIKED_KEY, JSON.stringify(Array.from(set)));
  } catch {
    /* ignore quota errors */
  }
}

export default function CommunityFaqsPage() {
  const [items, setItems] = useState<PublicFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const [query, setQuery] = useState("");
  const [askOpen, setAskOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Hidden field that real users never fill but bots auto-populate.
  // A non-empty value is treated as a silent spam signal.
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage sync on mount
    setLiked(readLikedIds());
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/faqs", { cache: "no-store" });
        const payload = (await res.json()) as
          | { items: PublicFaq[] }
          | { error: string };
        if (cancelled) return;
        if (!res.ok || "error" in payload) {
          setError("error" in payload ? payload.error : "Failed to load.");
        } else {
          setItems(payload.items);
        }
      } catch {
        if (!cancelled) setError("Network error.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.question.toLowerCase().includes(q) ||
        (it.answer ?? "").toLowerCase().includes(q) ||
        (it.submitted_by ?? "").toLowerCase().includes(q)
    );
  }, [items, query]);

  async function like(id: string) {
    if (liked.has(id)) return;

    setItems((prev) =>
      prev.map((q) => (q.id === id ? { ...q, like_count: q.like_count + 1 } : q))
    );
    const next = new Set(liked);
    next.add(id);
    setLiked(next);
    writeLikedIds(next);

    let ok = false;
    try {
      const res = await fetch(`/api/faqs/${id}/like`, { method: "POST" });
      ok = res.ok;
    } catch {
      ok = false;
    }
    if (!ok) {
      setItems((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, like_count: Math.max(0, q.like_count - 1) } : q
        )
      );
      const rb = new Set(next);
      rb.delete(id);
      setLiked(rb);
      writeLikedIds(rb);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    // Honeypot — bots fill any field they see; silently swallow as success
    // so they don't learn to retry.
    if (honeypotRef.current?.value) {
      setDone(true);
      setQuestion("");
      setName("");
      return;
    }

    // Per-browser cooldown so a flood from one tab is throttled even before
    // hitting the DB length checks.
    try {
      const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
      const wait = COOLDOWN_MS - (Date.now() - last);
      if (last > 0 && wait > 0) {
        setSubmitError(
          `One submission per minute, please. Try again in ${Math.ceil(wait / 1000)}s.`,
        );
        return;
      }
    } catch {
      /* localStorage unavailable — fall through */
    }

    if (question.trim().length < 8) {
      setSubmitError("Please write a few more words.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    let errorMsg: string | null = null;
    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          submitted_by: name,
          honeypot: honeypotRef.current?.value ?? "",
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) errorMsg = payload.error ?? "Submission failed.";
    } catch {
      errorMsg = "Network error.";
    }
    setSubmitting(false);
    if (errorMsg) {
      setSubmitError(errorMsg);
      return;
    }
    try {
      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setDone(true);
    setQuestion("");
    setName("");
  }

  return (
    <>
      <main className="min-h-dvh bg-ink pt-28 pb-32">
        <section className="max-w-3xl mx-auto px-6 sm:px-10">
          {/* Back link */}
          <Link
            href="/faqs"
            className="group inline-flex items-center gap-2 text-white/35 hover:text-white text-[11px] tracking-[0.25em] uppercase mb-12 transition-colors"
          >
            <ArrowLeft
              size={13}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to FAQs
          </Link>

          {/* Header */}
          <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-5 font-medium">
            ▸ Community
          </p>
          <h1 className="text-white text-4xl sm:text-5xl font-light tracking-tight leading-[1.05] mb-4">
            Asked by the community.
          </h1>
          <p className="text-white/40 text-sm font-light leading-relaxed max-w-lg">
            Real questions from real visitors. Helpful ones float to the top —
            tap the heart to vote.
          </p>

          {/* Search */}
          <div className="mt-12 relative">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions…"
              className="w-full bg-white/[0.025] border border-white/10 rounded-full pl-11 pr-5 py-3 text-white text-sm font-light placeholder:text-white/30 focus:border-ember focus:outline-none transition-colors"
            />
          </div>

          {/* List */}
          <div className="mt-10">
            {loading ? (
              <p className="text-white/25 text-xs tracking-[0.25em] uppercase">
                Loading…
              </p>
            ) : error ? (
              <p className="text-white/30 text-sm font-light">
                Community questions unavailable — {error}
              </p>
            ) : filtered.length === 0 ? (
              <p className="text-white/30 text-sm font-light">
                {query
                  ? "No questions match that search."
                  : "No community questions yet. Be the first to ask one below."}
              </p>
            ) : (
              <ul className="flex flex-col gap-0">
                {filtered.map((q) => {
                  const isLiked = liked.has(q.id);
                  return (
                    <li
                      key={q.id}
                      className="flex items-start gap-4 py-5 border-b border-white/[0.06]"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-[15px] font-light leading-snug">
                          {q.question}
                        </p>
                        {q.answer && (
                          <p className="mt-2 text-white/45 text-sm font-light leading-relaxed">
                            {q.answer}
                          </p>
                        )}
                        {q.submitted_by && (
                          <p className="mt-2 text-white/25 text-[11px] tracking-[0.2em] uppercase">
                            asked by {q.submitted_by}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => like(q.id)}
                        disabled={isLiked}
                        aria-label={isLiked ? "Already liked" : "Like this question"}
                        className={cn(
                          "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-light transition-colors",
                          isLiked
                            ? "border-ember/50 text-ember bg-ember/10 cursor-default"
                            : "border-white/15 text-white/60 hover:border-ember hover:text-ember"
                        )}
                      >
                        <Heart
                          size={12}
                          className={isLiked ? "fill-current" : ""}
                          strokeWidth={2}
                        />
                        <span className="tabular-nums">{q.like_count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Ask */}
          <div className="mt-14">
            <button
              type="button"
              onClick={() => {
                setAskOpen((o) => !o);
                setDone(false);
                setSubmitError(null);
              }}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-light transition-colors",
                askOpen
                  ? "bg-white/5 border border-white/15 text-white/70"
                  : "bg-white text-black hover:bg-ember hover:text-white"
              )}
            >
              {askOpen ? "Close" : "Ask a new question"}
              <Plus
                size={13}
                className={cn("transition-transform", askOpen && "rotate-45")}
              />
            </button>

            <AnimatePresence>
              {askOpen && (
                <motion.form
                  onSubmit={onSubmit}
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-7">
                    {done ? (
                      <div className="py-6 text-center">
                        <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-ember/10 border border-ember/30 mb-4">
                          <Check size={18} className="text-ember" strokeWidth={2} />
                        </div>
                        <p className="text-white text-base font-light">
                          Thanks — your question is in the moderation queue.
                        </p>
                        <p className="text-white/40 text-xs font-light mt-2">
                          Approved questions appear in the list above.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Honeypot — visually hidden, kept out of tab order
                            and read-out by screen readers via aria-hidden. */}
                        <div
                          aria-hidden
                          style={{
                            position: "absolute",
                            left: "-9999px",
                            top: "auto",
                            width: 1,
                            height: 1,
                            overflow: "hidden",
                          }}
                        >
                          <label>
                            Leave this field blank
                            <input
                              ref={honeypotRef}
                              type="text"
                              name="website"
                              tabIndex={-1}
                              autoComplete="off"
                            />
                          </label>
                        </div>

                        <label className="block text-white/40 text-[10px] tracking-[0.3em] uppercase mb-2">
                          Your question
                        </label>
                        <textarea
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          rows={3}
                          maxLength={400}
                          placeholder="e.g. Do you build mobile apps too?"
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm font-light leading-relaxed placeholder:text-white/25 focus:border-ember focus:outline-none transition-colors resize-none"
                        />

                        <label className="block text-white/40 text-[10px] tracking-[0.3em] uppercase mt-5 mb-2">
                          Name (optional)
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          maxLength={60}
                          placeholder="how should we credit you?"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-light placeholder:text-white/25 focus:border-ember focus:outline-none transition-colors"
                        />

                        {submitError && (
                          <p className="text-ember text-xs font-light mt-3">
                            {submitError}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.08]">
                          <p className="text-white/30 text-[11px] font-light tracking-wide">
                            Moderated · won&apos;t appear until approved
                          </p>
                          <button
                            type="submit"
                            disabled={submitting || question.trim().length < 8}
                            className={cn(
                              "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-colors",
                              submitting || question.trim().length < 8
                                ? "bg-white/10 text-white/30 cursor-not-allowed"
                                : "bg-white text-black hover:bg-ember hover:text-white"
                            )}
                          >
                            {submitting ? "Sending…" : "Submit"}
                            <Send size={12} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </>
  );
}
