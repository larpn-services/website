# Multi-Area Website Update — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Five independent frontend updates — home CTA text, templates reorder/covers/quality, work page hover-tabs, studio web scraper tool with typewriter, software engineering practice with agent categories.

**Architecture:** All changes are UI-only. No new routes, no API changes. New files: `components/EditTool.tsx`, `components/SoftwareEngineeringPractice.tsx`. Modified files: `components/Hero.tsx`, `app/templates/templates.ts`, `app/templates/page.tsx`, `app/services/page.tsx`, `components/PersonalToolsPractice.tsx`, `app/about/page.tsx`.

**Tech Stack:** Next.js 16 App Router, React 19, Framer Motion, Tailwind CSS v4, next/image, next/link, lucide-react, clsx, tailwind-merge (all already installed).

---

### Task 1: Home page CTA — "Explore templates"

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Edit the secondary CTA link**

In `components/Hero.tsx`, find the `<Link>` with text "Explore prototypes" and change it to:

```tsx
<Link
  href="/templates"
  className="inline-flex items-center min-h-11 px-2 text-white/70 hover:text-white text-sm font-light underline-offset-4 hover:underline transition-colors"
>
  Explore templates
</Link>
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: update hero CTA to 'Explore templates' linking to /templates"
```

---

### Task 2: Templates — reorder, main.png covers, quality fix

**Files:**
- Modify: `app/templates/templates.ts`
- Modify: `app/templates/page.tsx`

- [ ] **Step 1: Rewrite `app/templates/templates.ts` — reorder and update covers**

Replace the `templates` array with the new order and `main.png` covers. Keep all other fields unchanged:

```ts
export type Template = {
  slug: string;
  name: string;
  description: string;
  cover: string;
  pics: string[];
  previewUrl: string;
  price: number;
  originalPrice: number;
};

export const templates: Template[] = [
  {
    slug: "landmark",
    name: "Landmark",
    description:
      "Real estate & property listings template with gallery-first design and lead capture.",
    cover: "/t3-pics/main.png",
    pics: ["/t3-pics/1.png", "/t3-pics/2.png", "/t3-pics/3.png", "/t3-pics/4.png"],
    previewUrl: "https://template-3-wheat-omega.vercel.app/",
    price: 119.99,
    originalPrice: 149.99,
  },
  {
    slug: "atelier",
    name: "Atelier",
    description:
      "Finance, consultation & training platform with a structured, trust-building layout.",
    cover: "/t2-pics/main.png",
    pics: ["/t2-pics/1.png", "/t2-pics/2.png", "/t2-pics/3.png", "/t2-pics/4.png"],
    previewUrl: "https://template-2-9d1ow3q3y-omar-hs-projects-cf8ee844.vercel.app/",
    price: 99.99,
    originalPrice: 124.99,
  },
  {
    slug: "luminary",
    name: "Luminary",
    description:
      "Creative studio & personal brand template with bold visuals and portfolio sections.",
    cover: "/t4-pics/main.png",
    pics: ["/t4-pics/1.png", "/t4-pics/2.png", "/t4-pics/3.png", "/t4-pics/4.png"],
    previewUrl: "https://template-4-pink.vercel.app/#/",
    price: 99.99,
    originalPrice: 124.99,
  },
  {
    slug: "civicbase",
    name: "CivicBase",
    description:
      "Built for non-profits and organizations with rich video libraries and content directories.",
    cover: "/t1-pics/main.png",
    pics: ["/t1-pics/1.png", "/t1-pics/2.png", "/t1-pics/3.png", "/t1-pics/4.png"],
    previewUrl: "https://template-1-lime.vercel.app/",
    price: 89.99,
    originalPrice: 112.49,
  },
];
```

- [ ] **Step 2: Fix modal image quality in `app/templates/page.tsx`**

In the 2×2 modal image grid section, find all four `<Image>` components inside `selected.pics.map(...)` and add `quality={95}` and update `sizes`:

```tsx
<Image
  src={src}
  alt={`${selected.name} screenshot ${idx + 1}`}
  fill
  sizes="(max-width: 640px) 50vw, 600px"
  quality={95}
  className="object-cover"
/>
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/templates/templates.ts app/templates/page.tsx
git commit -m "feat: reorder templates, use main.png covers, fix modal image quality"
```

---

### Task 3: Work page — horizontal tabs with hover preview

**Files:**
- Modify: `app/services/page.tsx`

- [ ] **Step 1: Replace the entire file contents**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Footer from "@/components/Footer";
import { categories } from "./categories";

export default function WorkHubPage() {
  const [hovered, setHovered] = useState(categories[0].slug);
  const active = categories.find((c) => c.slug === hovered) ?? categories[0];

  return (
    <>
      <main className="bg-ink min-h-screen">
        <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-32 pb-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 sm:mb-20"
          >
            <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-5 font-medium">
              ▸ Selected Work
            </p>
            <h1 className="text-white text-4xl sm:text-6xl font-light tracking-tight leading-[1.08]">
              Things we&apos;ve built.
              <br />
              <span className="text-white/35 italic">By category.</span>
            </h1>
            <p className="text-white/40 text-sm font-light leading-relaxed mt-6 max-w-md">
              Each directory holds a gallery of work in that lane — open one to scroll through.
            </p>
          </motion.div>

          {/* Tab pills */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {categories.map((cat, i) => {
              const active = hovered === cat.slug;
              return (
                <Link
                  key={cat.slug}
                  href={`/services/${cat.slug}`}
                  onMouseEnter={() => setHovered(cat.slug)}
                  className={
                    "px-5 py-2.5 rounded-full text-[11px] tracking-[0.2em] uppercase font-medium border transition-colors duration-200 " +
                    (active
                      ? "bg-ember/15 border-ember/45 text-ember"
                      : "bg-white/[0.02] border-white/[0.08] text-white/55 hover:text-white hover:border-white/20")
                  }
                >
                  <span className="text-current/40 mr-2">0{i + 1}</span>
                  {cat.name}
                </Link>
              );
            })}
          </motion.div>

          {/* Preview image */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={hovered}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/services/${active.slug}`}
                  className="group relative block aspect-[4/3] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-white/[0.07] hover:border-ember/30 transition-colors"
                >
                  <Image
                    src={active.cover}
                    alt={active.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 90vw"
                    className="object-cover opacity-50 group-hover:opacity-65 group-hover:scale-[1.02] transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
                    <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-3 font-medium">
                      0{categories.findIndex((c) => c.slug === active.slug) + 1}
                    </p>
                    <h2 className="text-white text-3xl sm:text-5xl font-light tracking-tight mb-3 leading-tight">
                      {active.name}
                    </h2>
                    <p className="text-white/50 text-sm font-light max-w-lg leading-relaxed mb-6">
                      {active.blurb}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/30 text-[11px] tracking-[0.25em] uppercase font-light">
                        {active.items.length}{" "}
                        {active.items.length === 1 ? "item" : "items"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-white/40 group-hover:text-ember text-[11px] tracking-[0.25em] uppercase font-light transition-colors">
                        Browse
                        <ArrowUpRight
                          size={13}
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/services/page.tsx
git commit -m "feat: replace work page image grid with hover-tab preview layout"
```

---

### Task 4: Create EditTool component

**Files:**
- Create: `components/EditTool.tsx`

- [ ] **Step 1: Create the file with the provided code**

```tsx
"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SHIMMER_STYLE_ID = "an-edit-tool-shimmer-styles";
const SHIMMER_STYLES = `
@keyframes an-edit-shimmer {
  from { background-position: 100% center; }
  to { background-position: 0% center; }
}
.an-edit-shimmer {
  display: inline-flex;
  align-items: center;
  height: 1rem;
  background-size: 250% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(90deg, #a3a3a3 0%, #a3a3a3 40%, #525252 50%, #a3a3a3 60%, #a3a3a3 100%);
  background-repeat: no-repeat;
  animation: an-edit-shimmer 1.2s linear infinite;
}
@keyframes an-edit-dot {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}
.an-edit-dot { animation: an-edit-dot 1.4s ease-in-out infinite; }
.an-edit-dot:nth-child(2) { animation-delay: 0.2s; }
.an-edit-dot:nth-child(3) { animation-delay: 0.4s; }
`;

let shimmerStylesInjected = false;
function ensureShimmerStyles() {
  if (typeof document === "undefined") return;
  if (shimmerStylesInjected) return;
  if (document.getElementById(SHIMMER_STYLE_ID)) {
    shimmerStylesInjected = true;
    return;
  }
  const el = document.createElement("style");
  el.id = SHIMMER_STYLE_ID;
  el.textContent = SHIMMER_STYLES;
  document.head.appendChild(el);
  shimmerStylesInjected = true;
}

type DiffOp = { type: "context" | "remove" | "add"; text: string };

function lineDiff(oldText: string, newText: string): DiffOp[] {
  const a = oldText.split("\n");
  const b = newText.split("\n");
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0),
  );
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (a[i] === b[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      ops.push({ type: "context", text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "remove", text: a[i] });
      i++;
    } else {
      ops.push({ type: "add", text: b[j] });
      j++;
    }
  }
  while (i < m) {
    ops.push({ type: "remove", text: a[i] });
    i++;
  }
  while (j < n) {
    ops.push({ type: "add", text: b[j] });
    j++;
  }
  return ops;
}

function countDiffStats(ops: DiffOp[]): { added: number; removed: number } {
  let added = 0;
  let removed = 0;
  for (const op of ops) {
    if (op.type === "add") added++;
    else if (op.type === "remove") removed++;
  }
  return { added, removed };
}

type ApprovalDecision = "approved" | "rejected" | null;

function ApprovalFooter({
  isPending,
  approveLabel = "Approve",
  rejectLabel = "Reject",
  onApprove,
  onReject,
}: {
  isPending: boolean;
  approveLabel?: string;
  rejectLabel?: string;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const [decision, setDecision] = React.useState<ApprovalDecision>(null);
  const handleApprove = () => {
    setDecision("approved");
    onApprove?.();
  };
  const handleReject = () => {
    setDecision("rejected");
    onReject?.();
  };

  let status: string | null = null;
  if (decision === "approved") status = isPending ? "Starting" : "Approved";
  else if (decision === "rejected") status = "Canceled";
  else if (isPending) status = "Waiting";

  return (
    <div className="flex items-center justify-between gap-2 px-2.5 py-2 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/40">
      {status && decision !== null ? (
        <span className="text-xs text-neutral-500 dark:text-neutral-400 inline-flex items-center gap-1.5">
          {status}
          {decision === "approved" && isPending && (
            <span className="inline-flex gap-0.5">
              <span className="an-edit-dot">.</span>
              <span className="an-edit-dot">.</span>
              <span className="an-edit-dot">.</span>
            </span>
          )}
        </span>
      ) : (
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {status ?? ""}
        </span>
      )}
      {decision === null && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleReject}
            className="px-2 h-7 rounded-[6px] text-xs font-medium border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
          >
            {rejectLabel}
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="px-2 h-7 rounded-[6px] text-xs font-medium bg-blue-500 dark:bg-blue-400 text-white dark:text-neutral-950 hover:bg-blue-600 dark:hover:bg-blue-300"
          >
            {approveLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export type EditToolApproval = {
  approveLabel?: string;
  rejectLabel?: string;
  onApprove?: () => void;
  onReject?: () => void;
};

export type EditToolProps = {
  state?: "completed" | "pending" | "waiting";
  variant?: "edit" | "write";
  filePath?: string;
  oldContent?: string;
  newContent?: string;
  approval?: EditToolApproval;
  className?: string;
};

export const EditTool = React.memo(function EditTool({
  state = "completed",
  variant = "edit",
  filePath,
  oldContent,
  newContent,
  approval,
  className,
}: EditToolProps) {
  React.useEffect(() => {
    ensureShimmerStyles();
  }, []);

  const isPending = state === "pending";
  const isWaiting = state === "waiting";
  const isWrite = variant === "write";
  const fileName = filePath?.split("/").pop() ?? undefined;

  const diffOps = React.useMemo<DiffOp[] | null>(() => {
    if (isWaiting) return null;
    if (isWrite && newContent) {
      return newContent.split("\n").map((text) => ({ type: "add", text }));
    }
    if (oldContent !== undefined && newContent !== undefined) {
      return lineDiff(oldContent, newContent);
    }
    return null;
  }, [isWaiting, isWrite, oldContent, newContent]);

  const stats = React.useMemo(
    () => (diffOps ? countDiffStats(diffOps) : null),
    [diffOps],
  );

  const headerLabel = isWaiting
    ? "Generating..."
    : isPending
      ? `${isWrite ? "Creating" : "Editing"}${fileName ? ` ${fileName}` : ""}`
      : `${isWrite ? "Created" : "Edited"}${fileName ? ` ${fileName}` : ""}`;

  return (
    <div
      className={cn(
        "rounded-[10px] border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black overflow-hidden w-full",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-2.5 h-7 bg-neutral-100 dark:bg-neutral-900",
          (diffOps && diffOps.length > 0) || approval
            ? "border-b border-neutral-200 dark:border-neutral-800"
            : "",
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {isPending || isWaiting ? (
            <span className="an-edit-shimmer text-xs">{headerLabel}</span>
          ) : (
            <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {headerLabel}
            </span>
          )}
        </div>
        {stats && !isPending && !isWaiting && (stats.added > 0 || stats.removed > 0) && (
          <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 inline-flex gap-2 shrink-0">
            {stats.added > 0 && (
              <span className="text-green-600 dark:text-green-400">
                +{stats.added}
              </span>
            )}
            {stats.removed > 0 && (
              <span className="text-red-600 dark:text-red-400">
                -{stats.removed}
              </span>
            )}
          </span>
        )}
      </div>
      {diffOps && diffOps.length > 0 && (
        <div className="text-[12px] font-mono leading-[1.5] bg-white dark:bg-black overflow-x-auto">
          {diffOps.map((op, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start min-w-0",
                op.type === "add" &&
                  "bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-200",
                op.type === "remove" &&
                  "bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200",
                op.type === "context" &&
                  "text-neutral-700 dark:text-neutral-300",
              )}
            >
              <span
                className={cn(
                  "select-none w-4 text-center shrink-0",
                  op.type === "add" && "text-green-600 dark:text-green-400",
                  op.type === "remove" && "text-red-600 dark:text-red-400",
                  op.type === "context" && "text-neutral-400 dark:text-neutral-600",
                )}
              >
                {op.type === "add" ? "+" : op.type === "remove" ? "-" : " "}
              </span>
              <span className="whitespace-pre pr-2 flex-1 min-w-0">
                {op.text || " "}
              </span>
            </div>
          ))}
        </div>
      )}
      {approval && (
        <ApprovalFooter
          isPending={isPending}
          approveLabel={approval.approveLabel}
          rejectLabel={approval.rejectLabel}
          onApprove={approval.onApprove}
          onReject={approval.onReject}
        />
      )}
    </div>
  );
});
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/EditTool.tsx
git commit -m "feat: add EditTool component for code-diff display"
```

---

### Task 5: Personal tools — web scraper section with typewriter

**Files:**
- Modify: `components/PersonalToolsPractice.tsx`

- [ ] **Step 1: Read the current file first, then apply these changes**

Add the following imports at the top of the file (after existing imports):

```tsx
import { EditTool } from "./EditTool";
```

- [ ] **Step 2: Add the scraper code constant and typewriter state**

Add this constant ABOVE the `PersonalToolsPractice` component (after the `SOCIAL_PRESET` definition):

```tsx
const SCRAPER_CODE = `// scraper/social-media.ts
import puppeteer from "puppeteer";

export async function scrapePosts(
  platform: string,
  username: string,
) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(\`https://\${platform}.com/\${username}\`);
  await page.waitForSelector("[data-post]");

  const posts = await page.evaluate(() =>
    [...document.querySelectorAll("[data-post]")].map((el) => ({
      content: el.querySelector(".caption")?.textContent ?? "",
      likes: parseInt(
        el.querySelector(".likes")?.textContent ?? "0",
      ),
      timestamp: el.querySelector("time")?.dateTime ?? "",
    })),
  );

  await browser.close();
  return posts;
}`;
```

- [ ] **Step 3: Add typewriter state inside the component**

Inside `PersonalToolsPractice`, add these state variables and effect (place after the `const preset = SOCIAL_PRESET;` line):

```tsx
const [typed, setTyped] = React.useState("");
const [toolState, setToolState] = React.useState<
  "waiting" | "pending" | "completed"
>("waiting");

React.useEffect(() => {
  let interval: ReturnType<typeof setInterval> | null = null;
  const startDelay = setTimeout(() => {
    setToolState("pending");
    let i = 0;
    interval = setInterval(() => {
      i++;
      setTyped(SCRAPER_CODE.slice(0, i));
      if (i >= SCRAPER_CODE.length) {
        clearInterval(interval!);
        setToolState("completed");
      }
    }, 18);
  }, 600);
  return () => {
    clearTimeout(startDelay);
    if (interval) clearInterval(interval);
  };
}, []);
```

Note: you also need to add `React` to the import — change the top import from:
```tsx
import Link from "next/link";
import { motion, type PanInfo } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
```
to:
```tsx
import * as React from "react";
import Link from "next/link";
import { motion, type PanInfo } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
```

- [ ] **Step 4: Add the web scraper section after the CTA block**

In the JSX of `PersonalToolsPractice`, add this section AFTER the closing `</motion.div>` of the CTA block (the one with "Pitch me your tool"):

```tsx
{/* ── Web Scraper Tool ─────────────────────────────────── */}
<motion.div
  initial={{ opacity: 0, y: 28 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
  className="mt-24"
>
  {/* Section header */}
  <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-5 font-medium">
    02 — Tool
  </p>
  <h2 className="text-white text-4xl sm:text-5xl font-light tracking-tight mb-4 leading-[1.05]">
    Scrape any feed.
    <br />
    <span className="text-white/35 italic">Any platform, any data.</span>
  </h2>
  <p className="text-white/45 text-base font-light max-w-2xl leading-relaxed mb-10">
    Point it at an Instagram profile, TikTok page, or Twitter feed — it returns
    a clean structured dataset ready to pipe into a dashboard, spreadsheet, or
    downstream automation.
  </p>

  {/* EditTool */}
  <EditTool
    state={toolState}
    variant="write"
    filePath="scraper/social-media.ts"
    newContent={typed}
  />
</motion.div>
```

- [ ] **Step 5: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/PersonalToolsPractice.tsx
git commit -m "feat: add web scraper tool with typewriter animation to Personal Tools practice"
```

---

### Task 6: Software Engineering practice component

**Files:**
- Create: `components/SoftwareEngineeringPractice.tsx`
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Create `components/SoftwareEngineeringPractice.tsx`**

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

type Agent = {
  name: string;
  description: string;
  tags: string[];
};

type AgentCategory = {
  label: string;
  agents: Agent[];
};

const AGENT_CATEGORIES: AgentCategory[] = [
  {
    label: "Workflow",
    agents: [
      {
        name: "Lead-to-Deal Pipeline",
        description:
          "Searches Apollo for ICP-matched leads, deduplicates against HubSpot, creates CRM objects, notifies via Slack, and sends a Calendly booking link.",
        tags: ["Apollo", "HubSpot", "Slack", "Calendly"],
      },
      {
        name: "Proposal Builder",
        description:
          "Auto-fills client proposals from HubSpot/Notion templates, pulls portfolio items, saves drafts to Google Drive, and tracks which templates convert best.",
        tags: ["HubSpot", "Notion", "Google Drive"],
      },
      {
        name: "Form Autocomplete",
        description:
          "AI-powered form filling with tabbed UI and a chat interface — submit accurate forms in seconds.",
        tags: ["Automation", "Forms"],
      },
    ],
  },
  {
    label: "Customer Support",
    agents: [
      {
        name: "WhatsApp Business Responder",
        description:
          "Matches inbound messages against your knowledge base, replies accurately, and escalates what it can't handle — with full conversation logging.",
        tags: ["WhatsApp", "Automation"],
      },
      {
        name: "Refund & Cancellation Agent",
        description:
          "Verifies the customer in Stripe, explains your refund policy, processes approved refunds or cancellations, and logs the outcome in Intercom.",
        tags: ["Stripe", "Intercom"],
      },
    ],
  },
  {
    label: "DevOps",
    agents: [
      {
        name: "Security Auditor",
        description:
          "Comprehensive security audits and compliance assessments against SOC 2, ISO 27001, HIPAA, PCI DSS, GDPR, and NIST — with prioritised findings and remediation roadmaps.",
        tags: ["Security", "Compliance"],
      },
      {
        name: "PR Reviewer",
        description:
          "Structured code review on every pull request — correctness, security, and convention issues posted as inline comments automatically.",
        tags: ["GitHub", "DevOps"],
      },
    ],
  },
];

function AgentCard({ agent, delay }: { agent: Agent; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-white/[0.07] bg-gradient-to-b from-white/[0.025] to-transparent p-5 sm:p-6 hover:border-ember/25 transition-colors group"
    >
      <h4 className="text-white text-base font-normal tracking-tight mb-2 group-hover:text-ember/90 transition-colors">
        {agent.name}
      </h4>
      <p className="text-white/45 text-sm font-light leading-relaxed mb-4">
        {agent.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {agent.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/40 text-[10px] tracking-[0.15em] uppercase font-light"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function SoftwareEngineeringPractice({
  onBack,
}: {
  onBack: () => void;
}) {
  let cardDelay = 0.3;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
        className="mb-16"
      >
        <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-5 font-medium">
          02 — Practice
        </p>
        <h1 className="text-white text-4xl sm:text-6xl font-light tracking-tight mb-6 leading-[1.05]">
          Software engineering.
          <br />
          <span className="text-white/35 italic">Agents that work for you.</span>
        </h1>
        <p className="text-white/40 text-base font-light max-w-2xl leading-relaxed">
          Bespoke AI agents engineered with rigor — from focused workflow automation
          to enterprise-grade autonomous systems that handle real business processes.
        </p>
      </motion.div>

      {/* Agent categories */}
      <div className="space-y-16">
        {AGENT_CATEGORIES.map((cat, catIdx) => {
          const sectionDelay = cardDelay;
          return (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2 + catIdx * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-ember text-[10px] tracking-[0.35em] uppercase font-medium">
                  {cat.label}
                </span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.agents.map((agent, agentIdx) => {
                  const d = sectionDelay + agentIdx * 0.06;
                  cardDelay = d + 0.06;
                  return (
                    <AgentCard key={agent.name} agent={agent} delay={d} />
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* More agents note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="mt-12 text-white/25 text-sm font-light italic"
      >
        …and many more agents available on request.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="mt-10 flex items-center"
      >
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black rounded-full text-sm font-medium hover:bg-ember hover:text-white transition-all"
        >
          Commission an agent
          <ArrowUpRight
            size={15}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Wire up in `app/about/page.tsx`**

Add the import at the top of `app/about/page.tsx` (with the other component imports):

```tsx
import SoftwareEngineeringPractice from "@/components/SoftwareEngineeringPractice";
```

Then in `StudioPageInner`, find this block:

```tsx
} : selected === 2 ? (
  <UiUxPractice key="detail-uiux" onBack={closePractice} />
```

And add the new case for `selected === 1` BEFORE it (currently `selected === 1` falls through to the generic `PracticeDetail`):

```tsx
} : selected === 1 ? (
  <SoftwareEngineeringPractice key="detail-software" onBack={closePractice} />
) : selected === 2 ? (
  <UiUxPractice key="detail-uiux" onBack={closePractice} />
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/SoftwareEngineeringPractice.tsx app/about/page.tsx
git commit -m "feat: add Software Engineering practice with agent category cards"
```

---

### Final verification

- [ ] **Run dev server and spot-check all 5 areas**

```bash
npm run dev
```

Check:
1. `/` — Hero secondary CTA reads "Explore templates" and links to `/templates`
2. `/templates` — Cards order: Landmark, Atelier, Luminary, CivicBase. Each shows `main.png` thumbnail. Clicking a card opens modal with better quality images.
3. `/services` — Horizontal tab pills. Hovering each tab updates the preview image with a fade. Clicking navigates to the category.
4. `/about?p=4` — Personal Tools: social hygiene graph at top, then web scraper section below with EditTool typing out the code on load.
5. `/about?p=2` — Software Engineering: three category sections (Workflow, Customer Support, DevOps) with agent cards and tags.

- [ ] **Final TypeScript check**

```bash
npx tsc --noEmit
```

Expected: clean.
