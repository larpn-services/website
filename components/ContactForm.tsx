"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, ChevronDown, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const BUDGETS = [
  "a free demo",
  "a low budget build",
  "a solid budget build",
  "a high budget build",
  "a custom arrangement",
];

// ─── Inline underline input that grows with content ────────────────────────

function InlineInput({
  value,
  onChange,
  placeholder,
  type = "text",
  required = true,
  maxLength = 120,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  /** Defensive cap so the field can't be inflated into a UI-freezing string. */
  maxLength?: number;
}) {
  const displayLen = Math.max(value.length, placeholder.length);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      style={{ width: `${displayLen + 1.5}ch` }}
      className="bg-transparent border-b border-white/25 hover:border-white/50 focus:border-ember outline-none text-white font-normal px-1 pb-0.5 placeholder:text-white/30 transition-colors"
    />
  );
}

// ─── Inline dropdown for budget ────────────────────────────────────────────

function BudgetSelect({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-1.5 bg-transparent border-b border-white/25 hover:border-white/50 outline-none px-1 pb-0.5 transition-colors",
          value ? "text-white" : "text-white/30",
          open && "border-ember"
        )}
      >
        {value || "pick a tier"}
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform",
            open && "rotate-180 text-ember"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 min-w-[200px] bg-black border border-white/15 rounded-lg overflow-hidden z-30 shadow-2xl shadow-black/80"
          >
            {BUDGETS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => {
                  onChange(b);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between w-full text-left px-4 py-2.5 text-sm font-light hover:bg-white/[0.04] hover:text-ember transition-colors",
                  value === b ? "text-ember" : "text-white/80"
                )}
              >
                {b}
                {value === b && <Check size={14} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

// ─── Main form ─────────────────────────────────────────────────────────────

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState<string | null>(null);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const ready = name.trim() && email.trim() && budget;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ready) return;
    // In a real build this would POST somewhere. For now just acknowledge.
    setSent(true);
  }

  return (
    <motion.div
      // floating entry — slide up, fade, gentle scale
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.98 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl mx-auto mt-10"
    >
      <div className="relative bg-ink-soft/80 backdrop-blur-sm border border-white/10 rounded-3xl p-8 sm:p-14 overflow-hidden">
        {/* soft ember accent in the corner of the card */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,107,26,0.08), transparent 70%)" }}
        />

        <AnimatePresence mode="wait">
          {sent ? (
            <SentCard key="sent" name={name} />
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative"
            >
              <p className="text-ember text-[11px] tracking-[0.3em] uppercase font-medium mb-10">
                ▸ A short message
              </p>

              <div className="text-white text-lg sm:text-2xl font-light leading-[2.2] tracking-tight">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                >
                  Hi LARPN, I&apos;m{" "}
                  <InlineInput
                    value={name}
                    onChange={setName}
                    placeholder="your name"
                  />{" "}
                  and you can reach me at{" "}
                  <InlineInput
                    value={email}
                    onChange={setEmail}
                    placeholder="your@email.com"
                    type="email"
                  />
                  .
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="inline-block mt-2"
                >
                  I&apos;m looking for{" "}
                  <BudgetSelect value={budget} onChange={setBudget} />.
                </motion.span>
              </div>

              {/* Optional notes — only revealed on request */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mt-12"
              >
                <button
                  type="button"
                  onClick={() => setShowNote((s) => !s)}
                  className="inline-flex items-center gap-2 text-white/50 hover:text-ember text-sm font-light transition-colors group"
                >
                  <span className="w-5 h-5 rounded-full border border-white/20 group-hover:border-ember flex items-center justify-center transition-colors">
                    {showNote ? (
                      <Minus size={11} strokeWidth={2.5} />
                    ) : (
                      <Plus size={11} strokeWidth={2.5} />
                    )}
                  </span>
                  {showNote ? "nevermind, hide notes" : "want to share more?"}
                </button>

                <AnimatePresence>
                  {showNote && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={4}
                        // Defensive client-side cap — once this form actually
                        // submits anywhere, the receiving endpoint should
                        // re-validate, but capping here stops UI freezes from
                        // pasted multi-MB payloads.
                        maxLength={2000}
                        placeholder="Tell us about your project, timeline, what success looks like — anything we should know."
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm font-light leading-relaxed placeholder:text-white/30 focus:border-ember focus:outline-none transition-colors resize-none"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit row */}
              <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-white/30 text-xs font-light tracking-wide">
                  Response within 24 hours · no auto-replies
                </p>
                <button
                  type="submit"
                  disabled={!ready}
                  className={cn(
                    "group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-all",
                    ready
                      ? "bg-white text-black hover:bg-ember hover:text-white"
                      : "bg-white/10 text-white/30 cursor-not-allowed"
                  )}
                >
                  Send
                  <ArrowUpRight
                    size={15}
                    className={cn(
                      "transition-transform",
                      ready &&
                        "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    )}
                  />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Sent confirmation ─────────────────────────────────────────────────────

function SentCard({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center py-10"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ember/10 border border-ember/30 mb-6">
        <Check size={22} className="text-ember" strokeWidth={2} />
      </div>
      <p className="text-ember text-[11px] tracking-[0.3em] uppercase font-medium mb-3">
        ▸ Message sent
      </p>
      <h3 className="text-white text-3xl font-light tracking-tight mb-3">
        Thanks{name ? `, ${name.split(" ")[0]}` : ""}.
      </h3>
      <p className="text-white/50 text-sm font-light max-w-sm mx-auto leading-relaxed">
        We&apos;ve got your message. Expect to hear from us within 24 hours — no
        templates, just a real reply.
      </p>
    </motion.div>
  );
}
