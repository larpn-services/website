# LARPN Site Updates — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 12 site updates: state/nav bug fixes, content polish, PersonalTools single-tool redesign, UI/UX → Add-ons rebrand, new `/templates` route, Resend-backed contact form, and rewritten Privacy + Terms legal pages with VCDPA/GDPR/CCPA/COPPA coverage.

**Architecture:** Next.js 16 App Router client components with framer-motion. Site is fully static apart from `/api/faqs` (Supabase) and the new `/api/contact` (Resend). State migrations move React useState to URL search params for shareability + back-button correctness.

**Tech Stack:** Next.js 16.2.6, React 19, TypeScript, Tailwind CSS v4, framer-motion 12, lucide-react, Supabase (FAQs only), Resend (new — contact form).

**Verification approach:** No existing test framework. Each task includes a manual-verification step using `npm run dev` (port 3000) + `npm run lint` and `npx tsc --noEmit` for type/lint gates. Commit after each task.

---

## File Structure

**New files:**
- `app/api/contact/route.ts` — Resend-backed contact endpoint
- `app/templates/page.tsx` — templates browser page
- `app/templates/templates.ts` — static template catalog data
- `app/terms/page.tsx` — Terms of Service legal page
- `lib/resend.ts` — small helper to lazily build a Resend client

**Modified files:**
- `app/about/page.tsx` — URL-param state, practice copy update
- `app/privacy/page.tsx` — full rewrite (VCDPA / GDPR / CCPA / COPPA)
- `app/services/page.tsx` — remove "more case studies" line
- `components/Navbar.tsx` — add Templates link, fix Studio click from sub-page
- `components/Footer.tsx` — add Templates + Terms links
- `components/ContactForm.tsx` — point at `/api/contact`, smoother exit
- `components/PersonalToolsPractice.tsx` — single-tool redesign (remove Python preset)
- `components/UiUxPracticeScene.tsx` — full rewrite (Add-ons page)
- `components/WebDevPractice.tsx` — per-tag hover colors
- `next.config.ts` — remove formsubmit.co from connect-src (if present)
- `package.json` — add `resend` dependency

---

## Task Order Rationale

Foundation first (URL-param state) unlocks the Navbar fix. Quick wins (copy/CSS) next to ship low-risk velocity. Sub-page redesigns mid-plan (PersonalTools → Add-ons → Templates). Then contact-form backend. Legal last so it can reflect any URL/route changes the rest introduces.

---

## Task 1: Move Studio sub-page state into URL search params

**Files:**
- Modify: `app/about/page.tsx`

**Why:** Currently the `selected` index is React `useState`. Hitting the back arrow inside PersonalTools sometimes leaves the user on a dark screen until refresh, and clicking "Studio" in the navbar from a sub-page does nothing. Moving state to URL search params (`?p=1..4`) fixes both: every "back" is just `router.push('/about')`, and the Navbar can clear params with the same call. Also keeps the existing deep-link feature.

- [ ] **Step 1: Read the Next.js navigation docs**

Run: `cat node_modules/next/dist/docs/01-app/05-api-reference/04-functions/use-search-params.mdx 2>&1 | head -80`

This confirms the API surface for `useSearchParams` in Next.js 16.

- [ ] **Step 2: Refactor `app/about/page.tsx` to derive `selected` from search params**

Replace the existing `StudioPage` function. The full new component:

```tsx
export default function StudioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pRaw = searchParams.get("p");
  const pIdx = pRaw ? parseInt(pRaw, 10) - 1 : -1;
  const selected =
    pIdx >= 0 && pIdx < practices.length ? pIdx : null;

  const openPractice = (i: number) => {
    router.push(`/about?p=${i + 1}`, { scroll: false });
  };
  const closePractice = () => {
    router.push(`/about`, { scroll: false });
  };

  // Scroll to top whenever the selected sub-page changes.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selected]);

  return (
    <>
      <main className="bg-ink min-h-screen">
        <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-32 pb-24">
          <AnimatePresence mode="wait">
            {selected === null ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* Page header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-16 sm:mb-20"
                >
                  <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-5 font-medium">
                    ▸ The Studio
                  </p>
                  <h1 className="text-white text-4xl sm:text-6xl font-light tracking-tight leading-[1.08]">
                    Four practices.
                    <br />
                    <span className="text-white/35 italic">One vision.</span>
                  </h1>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {practices.map((p, i) => (
                    <PracticeCard
                      key={p.id}
                      practice={p}
                      index={i}
                      onSelect={() => openPractice(i)}
                    />
                  ))}
                </div>
              </motion.div>
            ) : selected === 0 ? (
              <WebDevPractice key="detail-webdev" onBack={closePractice} />
            ) : selected === 2 ? (
              <UiUxPractice key="detail-uiux" onBack={closePractice} />
            ) : selected === 3 ? (
              <PersonalToolsPractice
                key="detail-tools"
                onBack={closePractice}
              />
            ) : (
              <PracticeDetail
                key={`detail-${selected}`}
                practice={practices[selected]}
                onBack={closePractice}
              />
            )}
          </AnimatePresence>
        </section>

        {selected === null && <TechStack showHeader={false} compact />}
      </main>
      <Footer />
    </>
  );
}
```

Also remove the now-unused first effect (the one parsing `?p=` on mount); it's superseded by the derived value above.

Imports at top of file must include:
```tsx
import { useRouter, useSearchParams } from "next/navigation";
```

The `useState` import is no longer needed in this file — drop it if nothing else uses it.

- [ ] **Step 3: Wrap export in Suspense (Next.js 16 requirement)**

`useSearchParams()` requires a Suspense boundary in Next.js 16+. Add at the bottom of `app/about/page.tsx`:

```tsx
import { Suspense } from "react";

function StudioPageInner() {
  // ... the function previously called StudioPage
}

export default function StudioPage() {
  return (
    <Suspense fallback={<main className="bg-ink min-h-screen" />}>
      <StudioPageInner />
    </Suspense>
  );
}
```

Rename the original component to `StudioPageInner`. The default export becomes the wrapper.

- [ ] **Step 4: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint -- --max-warnings 0`
Expected: no errors.

- [ ] **Step 5: Browser verification**

Run: `npm run dev` in one terminal.

Open `http://localhost:3000/about`. Verify:
1. Clicking a practice card pushes `?p=N` to the URL.
2. Browser back button returns to the grid.
3. In-page back arrow returns to the grid.
4. Loading `/about?p=4` directly opens PersonalTools.
5. Refreshing on a sub-page stays on that sub-page.

- [ ] **Step 6: Commit**

```bash
git add app/about/page.tsx
git commit -m "Move studio sub-page state into URL search params"
```

---

## Task 2: Fix Navbar "Studio" link from a Studio sub-page

**Files:**
- Modify: `components/Navbar.tsx`

**Why:** Clicking "Studio" while on `/about?p=4` does nothing because `pathname === '/about'` already; `Link` skips re-navigation. Detect non-empty search params on same-pathname clicks and force a `router.push(href)` to clear them.

- [ ] **Step 1: Update `handleNavClick` in `components/Navbar.tsx`**

Replace the existing `handleNavClick` body:

```tsx
const handleNavClick =
  (href: string) =>
  (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Sub-route case: pathname is /something/sub but we want to go to /something.
    if (pathname !== href && pathname.startsWith(href + "/")) {
      e.preventDefault();
      router.push(href);
    }
    // Same-pathname-with-search-params case: e.g. /about?p=4 → /about.
    // Without intervening, Next.js's Link sees a "matching" URL and does nothing.
    else if (pathname === href && typeof window !== "undefined" &&
             window.location.search.length > 0) {
      e.preventDefault();
      router.push(href);
    }
    setOpen(false);
  };
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Browser verification**

With `npm run dev` running:
1. Go to `/about?p=4` directly.
2. Click "Studio" in the desktop nav. Verify it returns to the Studio grid.
3. Same flow on mobile menu.

- [ ] **Step 4: Commit**

```bash
git add components/Navbar.tsx
git commit -m "Clear search params when re-clicking a nav item on its own page"
```

---

## Task 3: Remove "More case studies on the way." from Work page

**Files:**
- Modify: `app/services/page.tsx`

- [ ] **Step 1: Delete the trailing paragraph**

Open `app/services/page.tsx` and delete lines 95–97:

```tsx
<p className="text-white/25 text-xs font-light tracking-[0.2em] uppercase mt-14">
  More case studies on the way.
</p>
```

- [ ] **Step 2: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint -- --max-warnings 0`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add app/services/page.tsx
git commit -m "Drop 'more case studies on the way' line from Work page"
```

---

## Task 4: Update PersonalTools practice card copy

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Replace the body field for the `personal tools` practice**

In the `practices` array, locate the entry with `n: "04"` / `id: "practice-4"` and change `body` to:

```ts
body: "Ad blockers, bots, scrapers, social automations, one-shot utilities. If you'd pay someone to build it once, I'll build it — and make it run itself.",
```

- [ ] **Step 2: Browser verification**

Reload `/about`. The fourth card's body matches the new copy.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "Rewrite PersonalTools card copy"
```

---

## Task 5: WebDev tech-tag hover colors

**Files:**
- Modify: `components/WebDevPractice.tsx`

- [ ] **Step 1: Replace the tag list rendering**

In `components/WebDevPractice.tsx`, replace the inline `["Three.js", ...]` map with a typed list and per-tag classes. Above the JSX, add:

```tsx
const TECH_TAGS: { label: string; classes: string }[] = [
  {
    label: "Three.js",
    classes:
      "hover:text-ember hover:border-ember/40 hover:bg-ember/[0.06]",
  },
  {
    label: "Spline",
    classes:
      "hover:text-[#a78bfa] hover:border-[#a78bfa]/40 hover:bg-[#a78bfa]/[0.06]",
  },
  {
    label: "GLSL Shaders",
    classes:
      "hover:text-[#4ade80] hover:border-[#4ade80]/40 hover:bg-[#4ade80]/[0.06]",
  },
  {
    label: "WebGL",
    classes:
      "hover:text-[#38bdf8] hover:border-[#38bdf8]/40 hover:bg-[#38bdf8]/[0.06]",
  },
  {
    label: "React Three Fiber",
    classes:
      "hover:text-[#2dd4bf] hover:border-[#2dd4bf]/40 hover:bg-[#2dd4bf]/[0.06]",
  },
];
```

Replace the `motion.ul` block (`["Three.js", ...].map(...)`) with:

```tsx
<motion.ul
  initial="hidden"
  animate="show"
  variants={{
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.7 } },
  }}
  className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12"
>
  {TECH_TAGS.map((t) => (
    <motion.li
      key={t.label}
      variants={{
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={
        "inline-flex items-center px-3 py-1.5 rounded-full border " +
        "border-white/[0.08] bg-white/[0.02] text-white/55 text-[11px] " +
        "tracking-[0.2em] uppercase font-light transition-colors " +
        "duration-[180ms] " + t.classes
      }
    >
      {t.label}
    </motion.li>
  ))}
</motion.ul>
```

- [ ] **Step 2: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint -- --max-warnings 0`
Expected: clean.

- [ ] **Step 3: Browser verification**

Go to `/about?p=1`. Hover each tag. Each tag's text, border, and background tint should shift to its assigned color smoothly.

- [ ] **Step 4: Commit**

```bash
git add components/WebDevPractice.tsx
git commit -m "Add per-tag hover colors to WebDev tech list"
```

---

## Task 6: PersonalTools — single social automation tool

**Files:**
- Modify: `components/PersonalToolsPractice.tsx`

**Why:** Spec item 8. Remove the Python scraper preset, the preset chip switcher, and the typewriter component. The social automation graph stays as the sole content.

- [ ] **Step 1: Strip the Python preset and typewriter**

In `components/PersonalToolsPractice.tsx`:
- Delete the `CodePreset`, `Preset`, `PYTHON_PRESET`, `PYTHON_SOURCE`, `PY_KEYWORDS`, `highlightPython`, and `PythonTypewriter` definitions.
- Delete the `PRESETS` array (the single preset is referenced directly).
- Replace `type GraphPreset` to be a plain type (remove the union with `CodePreset`).
- Remove the `Code2` icon import from `lucide-react` (no longer used).

- [ ] **Step 2: Refactor the main component to render the social preset directly**

Replace the `PersonalToolsPractice` function body. The new component:

```tsx
export default function PersonalToolsPractice({
  onBack,
}: {
  onBack: () => void;
}) {
  const preset = SOCIAL_PRESET;

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
        className="mb-10"
      >
        <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-5 font-medium">
          04 — Practice
        </p>
        <h1 className="text-white text-4xl sm:text-6xl font-light tracking-tight mb-6 leading-[1.05]">
          One button.
          <br />
          <span className="text-white/35 italic">Clean account.</span>
        </h1>
        <p className="text-white/45 text-base font-light max-w-2xl leading-relaxed">
          Across Instagram, Discord, and TikTok — wipe every DM, un-like a
          year of videos, un-repost reels you regret, and see exactly who
          stopped following back. Without scrolling for hours.
        </p>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="text-white/45 text-sm font-light mb-4 max-w-2xl leading-relaxed"
      >
        {preset.tagline}
      </motion.p>

      {/* Canvas */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.018] to-transparent backdrop-blur-sm overflow-hidden"
      >
        {/* Status header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-ember/80" />
              <motion.span
                aria-hidden
                animate={{
                  scale: [1, 2.4, 2.4],
                  opacity: [0.6, 0, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full bg-ember"
              />
            </span>
            <span className="text-ember text-[10px] tracking-[0.3em] uppercase">
              Live
            </span>
          </div>
          <p className="text-white/30 text-[10px] tracking-[0.25em] uppercase">
            Drag to rearrange
          </p>
        </div>

        <GraphCanvas preset={preset} />

        {/* Footer status */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-white/[0.06]">
          <p className="text-white/40 text-[11px] font-light">
            <span className="text-ember mr-1">▸</span>
            {preset.stat}
          </p>
          <p className="text-white/25 text-[10px] tracking-[0.25em] uppercase">
            Custom built · Ships in days
          </p>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-12 flex flex-col items-center gap-5"
      >
        <p className="text-white/40 text-sm font-light text-center max-w-md leading-relaxed">
          Whatever &quot;just one button&quot; thing you&apos;ve wanted —
          tell me. I build the rest.
        </p>
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black rounded-full text-sm font-medium hover:bg-ember hover:text-white transition-all"
        >
          Pitch me your tool
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

- [ ] **Step 3: Refine node subtitles**

In `SOCIAL_PRESET.nodes`, update three entries (full lines shown — preserve the surrounding ones):

```ts
{
  id: "sa-discord",
  kind: "ai",
  title: "Discord",
  subtitle: "Wipes any DM or server",
  icon: MessageCircle,
  position: { x: 240, y: 128 },
},
```

```ts
{
  id: "sa-tiktok",
  kind: "ai",
  title: "TikTok",
  subtitle: "Likes, reposts, follows",
  icon: Music2,
  position: { x: 240, y: 240 },
},
```

```ts
{
  id: "sa-ghosts",
  kind: "output",
  title: "Ghost tracker",
  subtitle: "One button, full list",
  icon: UserMinus,
  position: { x: 700, y: 384 },
},
```

- [ ] **Step 4: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint -- --max-warnings 0`
Expected: clean. Watch for unused-import warnings from `Code2` removal.

- [ ] **Step 5: Browser verification**

Go to `/about?p=4`. Verify:
1. No preset chips visible.
2. Headline reads "One button. Clean account."
3. The graph renders with the renamed Discord/TikTok/Ghost nodes.
4. Nodes are draggable.
5. Back arrow returns to the Studio grid.

- [ ] **Step 6: Commit**

```bash
git add components/PersonalToolsPractice.tsx
git commit -m "Strip Python preset; PersonalTools shows the social tool only"
```

---

## Task 7: UI/UX → Add-ons page (full rewrite of UiUxPracticeScene)

**Files:**
- Modify: `components/UiUxPracticeScene.tsx`
- Modify: `app/about/page.tsx` (UI/UX practice card copy)

- [ ] **Step 1: Update the UI/UX practice card body copy**

In `app/about/page.tsx`, change the practice with `id: "practice-3"` body to:

```ts
body: "Add-ons grafted onto your live site — 3D scenes, maintenance, SEO, logo work. No rebuild, no downtime.",
```

- [ ] **Step 2: Replace `components/UiUxPracticeScene.tsx` entirely**

Full new file content:

```tsx
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
        <div className="absolute -top-20 -right-16 w-56 h-56 rounded-full pointer-events-none"
             style={{ background: "radial-gradient(circle, rgba(255,107,26,0.18), transparent 70%)" }} />
        <div className="relative">
          <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-4 font-medium">
            Bundle
          </p>
          <h2 className="text-white text-3xl sm:text-4xl font-light tracking-tight mb-4 leading-tight">
            Pair 3 —{" "}
            <span className="text-ember italic">save 20%.</span>
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
```

- [ ] **Step 3: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint -- --max-warnings 0`
Expected: clean. The `Image` import is aliased to `ImageIcon` to avoid clash with `next/image` if that's ever added.

- [ ] **Step 4: Browser verification**

Go to `/about?p=3`. Verify:
1. Header reads "Add-ons." / "Upgrades for sites already alive."
2. Eight cards render with correct prices, periods, taglines, icons.
3. Hover state: ember border + top edge glow + icon color shift.
4. Bundle banner near the bottom with ember accent.
5. Back arrow returns to grid.

- [ ] **Step 5: Commit**

```bash
git add components/UiUxPracticeScene.tsx app/about/page.tsx
git commit -m "Rebrand UI/UX page as Add-ons service grid"
```

---

## Task 8: Templates page — catalog data + route

**Files:**
- Create: `app/templates/templates.ts`
- Create: `app/templates/page.tsx`

- [ ] **Step 1: Create the catalog data file**

Create `app/templates/templates.ts`:

```ts
export type TemplateTheme =
  | "portfolio"
  | "saas"
  | "ecommerce"
  | "editorial";

export type Template = {
  slug: string;
  name: string;
  description: string;
  theme: TemplateTheme;
  cover: string;
  previewUrl?: string;
  price?: number;
  comingSoon?: boolean;
};

export const THEMES: { id: TemplateTheme | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "portfolio", label: "Portfolio / Agency" },
  { id: "saas", label: "SaaS / Dashboard" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "editorial", label: "Blog / Editorial" },
];

// Seed templates — replace covers and previewUrls as real ones land.
export const templates: Template[] = [
  {
    slug: "ember-folio",
    name: "Ember Folio",
    description: "Dark, motion-first portfolio with case-study deep-dives.",
    theme: "portfolio",
    cover:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop",
    price: 79,
    comingSoon: true,
  },
  {
    slug: "studio-mono",
    name: "Studio Mono",
    description: "Monospace agency layout — typography-first, no images required.",
    theme: "portfolio",
    cover:
      "https://images.unsplash.com/photo-1561070791-2526d30994b8?q=80&w=1600&auto=format&fit=crop",
    price: 49,
    comingSoon: true,
  },
  {
    slug: "saas-pulse",
    name: "SaaS Pulse",
    description: "Conversion-tuned landing with feature grids and pricing tiers.",
    theme: "saas",
    cover:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    price: 99,
    comingSoon: true,
  },
  {
    slug: "dash-control",
    name: "Dash Control",
    description: "Internal-tools dashboard skeleton with sidebar + tables.",
    theme: "saas",
    cover:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    price: 129,
    comingSoon: true,
  },
  {
    slug: "shop-minimal",
    name: "Shop Minimal",
    description: "Two-column boutique storefront with focused product cards.",
    theme: "ecommerce",
    cover:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
    price: 119,
    comingSoon: true,
  },
  {
    slug: "shop-bazaar",
    name: "Shop Bazaar",
    description: "High-density grid for catalogs with 50+ SKUs.",
    theme: "ecommerce",
    cover:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1600&auto=format&fit=crop",
    price: 149,
    comingSoon: true,
  },
  {
    slug: "essay-press",
    name: "Essay Press",
    description: "Long-form blog template with serif typography and reader mode.",
    theme: "editorial",
    cover:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1600&auto=format&fit=crop",
    price: 39,
    comingSoon: true,
  },
  {
    slug: "magazine-cut",
    name: "Magazine Cut",
    description: "Editorial homepage with featured stories, sections, and an archive.",
    theme: "editorial",
    cover:
      "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=1600&auto=format&fit=crop",
    price: 69,
    comingSoon: true,
  },
];

export function themeLabel(t: TemplateTheme): string {
  switch (t) {
    case "portfolio":
      return "Portfolio";
    case "saas":
      return "SaaS";
    case "ecommerce":
      return "E-commerce";
    case "editorial":
      return "Editorial";
  }
}
```

- [ ] **Step 2: Create the templates page**

Create `app/templates/page.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import Footer from "@/components/Footer";
import {
  THEMES,
  templates,
  themeLabel,
  type TemplateTheme,
} from "./templates";

export default function TemplatesPage() {
  const [query, setQuery] = useState("");
  const [activeTheme, setActiveTheme] = useState<TemplateTheme | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => {
      if (activeTheme !== "all" && t.theme !== activeTheme) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    });
  }, [query, activeTheme]);

  return (
    <>
      <main className="bg-ink min-h-screen">
        <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-32 pb-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
          >
            <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-5 font-medium">
              ▸ Templates
            </p>
            <h1 className="text-white text-4xl sm:text-6xl font-light tracking-tight leading-[1.08]">
              Templates.
              <br />
              <span className="text-white/35 italic">
                Ready to ship. Tuned to you.
              </span>
            </h1>
            <p className="text-white/40 text-sm font-light leading-relaxed mt-6 max-w-xl">
              Built once, sharpened endlessly. Drop one onto your domain and
              I&apos;ll re-skin it in your brand — usually within a week.
            </p>
          </motion.div>

          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-10 flex flex-col gap-4"
          >
            <div className="relative">
              <Search
                aria-hidden
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates…"
                aria-label="Search templates"
                className="w-full bg-white/[0.025] border border-white/[0.08] rounded-full pl-11 pr-4 py-3 text-white text-sm font-light placeholder:text-white/30 focus:border-ember focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => {
                const active = activeTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTheme(t.id)}
                    className={
                      "px-4 py-2 rounded-full text-[11px] tracking-[0.2em] uppercase font-medium border transition-colors duration-200 " +
                      (active
                        ? "bg-ember/15 border-ember/45 text-ember"
                        : "bg-white/[0.02] border-white/[0.08] text-white/55 hover:text-white hover:border-white/20")
                    }
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((tpl, i) => (
                <motion.div
                  key={tpl.slug}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.08 * (i % 6),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.025] to-transparent overflow-hidden hover:border-ember/30 transition-colors"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={tpl.cover}
                      alt={tpl.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-[1.02] transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full bg-ember/15 border border-ember/30 text-ember text-[9px] tracking-[0.25em] uppercase font-medium">
                      {themeLabel(tpl.theme)}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-white text-lg font-normal tracking-tight">
                        {tpl.name}
                      </h3>
                      {tpl.price !== undefined && (
                        <span className="shrink-0 text-ember text-sm font-light">
                          ${tpl.price}
                        </span>
                      )}
                    </div>
                    <p className="text-white/45 text-sm font-light leading-relaxed mb-4">
                      {tpl.description}
                    </p>
                    {tpl.previewUrl ? (
                      <a
                        href={tpl.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-white/40 group-hover:text-ember text-[11px] tracking-[0.25em] uppercase font-light transition-colors"
                      >
                        Preview
                        <ArrowUpRight
                          size={13}
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </a>
                    ) : (
                      <span className="inline-flex items-center text-white/30 text-[11px] tracking-[0.25em] uppercase font-light">
                        {tpl.comingSoon ? "Coming soon" : "Available"}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-white text-2xl font-light tracking-tight mb-2">
                Nothing here.
              </p>
              <p className="text-white/40 text-sm font-light italic">
                Try a different theme.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Add Unsplash to `next.config.ts` `images.remotePatterns`**

Check `next.config.ts`:

Run: `cat next.config.ts`

If `images.unsplash.com` isn't already whitelisted (the Work page already uses it, so it likely is — verify), no change needed. If absent, add it under `images.remotePatterns`. Skip step if already present.

- [ ] **Step 4: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint -- --max-warnings 0`
Expected: clean.

- [ ] **Step 5: Browser verification**

Open `/templates`. Verify:
1. Eight template cards render in a 3-column grid (desktop).
2. Search filters live as you type.
3. Theme chips filter correctly; "All" resets.
4. Combination of search + theme works (e.g. "shop" + "E-commerce").
5. Empty state shows "Nothing here." with no matches (try "zzz").

- [ ] **Step 6: Commit**

```bash
git add app/templates/page.tsx app/templates/templates.ts
git commit -m "Add /templates browser with search + theme filter"
```

---

## Task 9: Wire Templates into Navbar and Footer

**Files:**
- Modify: `components/Navbar.tsx`
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Add Templates link to the Navbar**

In `components/Navbar.tsx`, update `navLinks`:

```tsx
const navLinks = [
  { label: "Work", href: "/services" },
  { label: "Templates", href: "/templates" },
  { label: "Studio", href: "/about" },
  { label: "Contact", href: "/contact" },
];
```

- [ ] **Step 2: Add Templates link to the Footer Studio column**

In `components/Footer.tsx`, update the Studio column entry:

```tsx
{
  label: "Studio",
  items: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Templates", href: "/templates" },
    { label: "FAQs", href: "/faqs" },
  ],
},
```

- [ ] **Step 3: Browser verification**

Verify "Templates" appears between Work and Studio in the desktop nav, mobile menu, and footer.

- [ ] **Step 4: Commit**

```bash
git add components/Navbar.tsx components/Footer.tsx
git commit -m "Link /templates from navbar and footer"
```

---

## Task 10: Contact form — switch backend to Resend

**Files:**
- Create: `lib/resend.ts`
- Create: `app/api/contact/route.ts`
- Modify: `components/ContactForm.tsx`
- Modify: `package.json` (via npm install)
- Modify: `next.config.ts` (if formsubmit.co is in `connect-src`)

- [ ] **Step 1: Install Resend**

Run: `npm install resend`
Expected: package added to dependencies. No vulnerabilities reported.

- [ ] **Step 2: Create the Resend helper**

Create `lib/resend.ts`:

```ts
import { Resend } from "resend";

let cached: Resend | null = null;

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

export const CONTACT_DESTINATION = "o.18hamdan@outlook.com";
// Resend's sandbox-friendly default sender. Swap to a verified domain
// once one is set up.
export const CONTACT_FROM = "LARPN Contact <onboarding@resend.dev>";
```

- [ ] **Step 3: Create the API route**

Create `app/api/contact/route.ts`:

```ts
import { NextResponse } from "next/server";
import { sanitizeUserText } from "@/lib/sanitize";
import {
  CONTACT_DESTINATION,
  CONTACT_FROM,
  getResend,
} from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  budget?: unknown;
  note?: unknown;
  honeypot?: unknown;
};

function isValidEmail(value: string): boolean {
  // Pragmatic check — Resend will reject anything truly malformed.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  let body: ContactBody;
  try {
    body = (await req.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (typeof body.honeypot === "string" && body.honeypot.length > 0) {
    // Silent accept so bots stop retrying.
    return NextResponse.json({ ok: true });
  }

  const rawName = typeof body.name === "string" ? body.name : "";
  const rawEmail = typeof body.email === "string" ? body.email : "";
  const rawBudget = typeof body.budget === "string" ? body.budget : "";
  const rawNote = typeof body.note === "string" ? body.note : "";

  const name = sanitizeUserText(rawName, 120);
  const email = sanitizeUserText(rawEmail, 120);
  const budget = sanitizeUserText(rawBudget, 120);
  const note = sanitizeUserText(rawNote, 2000);

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 },
    );
  }
  if (!budget) {
    return NextResponse.json(
      { error: "Budget tier is required." },
      { status: 400 },
    );
  }

  const resend = getResend();
  if (!resend) {
    return NextResponse.json(
      {
        error:
          "Email service is offline — please reach me directly at " +
          CONTACT_DESTINATION + ".",
      },
      { status: 503 },
    );
  }

  const escape = (v: string) =>
    v.replace(/[&<>]/g, (c) =>
      c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;",
    );

  try {
    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_DESTINATION,
      replyTo: email,
      subject: `LARPN inquiry from ${name}`,
      html:
        `<h2>New LARPN inquiry</h2>` +
        `<p><strong>Name:</strong> ${escape(name)}</p>` +
        `<p><strong>Email:</strong> ${escape(email)}</p>` +
        `<p><strong>Budget:</strong> ${escape(budget)}</p>` +
        `<p><strong>Notes:</strong></p>` +
        `<pre style="white-space:pre-wrap;font-family:inherit">${escape(
          note || "(none)",
        )}</pre>`,
    });
    if (error) {
      return NextResponse.json(
        { error: error.message || "Send failed." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected send error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 4: Repoint `ContactForm` at the new endpoint**

In `components/ContactForm.tsx`:

Replace the two top-level constants:

```tsx
const CONTACT_ENDPOINT = "/api/contact";
const FALLBACK_MAILTO = "o.18hamdan@outlook.com";
```

Replace the body of `handleSubmit`'s `fetch` body (drop FormSubmit-specific fields). The new try block:

```tsx
try {
  const res = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: cleanName,
      email: cleanEmail,
      budget,
      note: cleanNote,
      honeypot: honeypotRef.current?.value ?? "",
    }),
  });
  const data: { ok?: boolean; error?: string } = await res
    .json()
    .catch(() => ({}));
  if (!res.ok || data.ok !== true) {
    throw new Error(data.error || `Send failed (${res.status})`);
  }
  setSent(true);
} catch (err) {
  setError(
    err instanceof Error && err.message
      ? `${err.message} Email ${FALLBACK_MAILTO} directly while we look at this.`
      : `Couldn't send — try emailing ${FALLBACK_MAILTO} directly.`,
  );
} finally {
  setSubmitting(false);
}
```

Also remove the early-return honeypot branch (the server handles it now). The block:

```tsx
if (honeypotRef.current?.value) {
  setSent(true);
  return;
}
```

…is deleted. (The honeypot value is passed to the server in the body instead.)

- [ ] **Step 5: Drop formsubmit.co from `next.config.ts` (if present)**

Run: `cat next.config.ts`

If you see `formsubmit.co` in any `connect-src` or CSP-related entry, delete that line. If it's not there, skip.

- [ ] **Step 6: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint -- --max-warnings 0`
Expected: clean.

- [ ] **Step 7: Verify behavior (with and without RESEND_API_KEY)**

Without the key (default state for now):
1. `npm run dev`
2. Submit the form. Expect a friendly error: "Email service is offline — please reach me directly at o.18hamdan@outlook.com."

With the key:
1. Add `RESEND_API_KEY=<your key>` to `.env.local`.
2. Restart `npm run dev`.
3. Submit the form. Expect success + email in inbox within ~30s.

(The user is responsible for setting `RESEND_API_KEY`. Document this in the commit and any deploy notes.)

- [ ] **Step 8: Commit**

```bash
git add lib/resend.ts app/api/contact/route.ts components/ContactForm.tsx package.json package-lock.json
git commit -m "Replace FormSubmit with Resend-backed /api/contact"
```

If `next.config.ts` was edited, add it to the same commit.

---

## Task 11: Contact form — smoother close animation

**Files:**
- Modify: `components/ContactForm.tsx`

- [ ] **Step 1: Update the form's `motion.form` exit prop**

Find the inner `motion.form` (the form, not the outer `motion.div`). Replace its `exit` prop:

```tsx
<motion.form
  key="form"
  onSubmit={handleSubmit}
  initial={{ opacity: 1 }}
  exit={{ opacity: 0, scale: 0.97, y: -8 }}
  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
  className="relative"
>
```

- [ ] **Step 2: Browser verification**

Fill out the form (or just submit with the dev key set), confirm the form fades + scales + lifts smoothly into the "Sent" card.

- [ ] **Step 3: Commit**

```bash
git add components/ContactForm.tsx
git commit -m "Soften contact form exit animation"
```

---

## Task 12: Privacy Policy — full rewrite

**Files:**
- Modify: `app/privacy/page.tsx`

- [ ] **Step 1: Replace `app/privacy/page.tsx` entirely**

Full new file:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy — LARPN",
  description:
    "LARPN's privacy policy — what we collect, how it's used, and your rights under VCDPA, GDPR, CCPA/CPRA, and COPPA.",
};

const SECTIONS = [
  { id: "info-collected", label: "Information we collect" },
  { id: "info-use", label: "How we use information" },
  { id: "third-parties", label: "Third-party providers" },
  { id: "children", label: "Children's privacy" },
  { id: "rights", label: "Your rights" },
  { id: "dnt", label: "Do Not Track" },
  { id: "retention", label: "Data retention" },
  { id: "security", label: "Security" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen bg-ink pt-32 pb-24">
        <section className="max-w-3xl mx-auto px-6 sm:px-10">
          <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-5 font-medium">
            ▸ Legal
          </p>
          <h1 className="text-white text-4xl sm:text-5xl font-light tracking-tight leading-[1.05] mb-4">
            Privacy.
          </h1>
          <p className="text-white/40 text-sm font-light mb-10">
            Effective: 2026-05-25 · Last updated: 2026-05-25
          </p>

          <p className="text-white/55 text-[15px] font-light leading-relaxed mb-12">
            LARPN is a small studio. We collect as little as we can get away
            with, we never sell or trade what you share, and we follow VCDPA
            (Virginia), GDPR (EEA/UK), CCPA/CPRA (California), COPPA, and
            CalOPPA. The rest of this page is the formal version.
          </p>

          {/* TOC */}
          <nav
            aria-label="On this page"
            className="mb-14 border border-white/10 rounded-2xl p-5 bg-white/[0.015]"
          >
            <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-3 font-medium">
              On this page
            </p>
            <ol className="flex flex-col gap-1.5 text-sm font-light">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-white/65 hover:text-ember transition-colors"
                  >
                    {String(i + 1).padStart(2, "0")} — {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-12 text-white/55 text-[15px] font-light leading-relaxed">
            <section id="info-collected">
              <h2 className="text-white text-xl font-normal mb-3">
                1. Information we collect
              </h2>
              <p className="mb-3">
                We collect only what's needed to talk to you.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong className="text-white/80">Contact form:</strong>{" "}
                  your name, email address, budget tier, and any optional
                  message text you choose to send.
                </li>
                <li>
                  <strong className="text-white/80">FAQ submissions:</strong>{" "}
                  the question text you submit, and an optional name if you
                  provide one. Submissions are stored in our database and
                  reviewed before publication.
                </li>
                <li>
                  <strong className="text-white/80">Operational data:</strong>{" "}
                  standard server logs (request IP, user-agent, timestamp)
                  retained briefly for security and abuse prevention.
                </li>
                <li>
                  <strong className="text-white/80">Cookies:</strong> no
                  advertising or cross-site tracking cookies. Supabase may set
                  short-lived functional cookies to keep submission sessions
                  secure. They expire when the browser tab closes.
                </li>
              </ul>
            </section>

            <section id="info-use">
              <h2 className="text-white text-xl font-normal mb-3">
                2. How we use information
              </h2>
              <p>
                Contact-form data is used solely to reply to your inquiry.
                FAQ submissions are reviewed and, if approved, published
                publicly along with our answer. We do not use any of this
                data for marketing, profiling, or any purpose unrelated to
                the original submission.
              </p>
            </section>

            <section id="third-parties">
              <h2 className="text-white text-xl font-normal mb-3">
                3. Third-party service providers
              </h2>
              <p className="mb-3">
                Your data passes through and is stored by two providers, each
                with their own published privacy practices:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong className="text-white/80">Supabase</strong> —
                  hosted Postgres database used to store FAQ submissions and
                  approved answers.{" "}
                  <a
                    href="https://supabase.com/privacy"
                    target="_blank"
                    rel="noreferrer"
                    className="text-ember hover:underline underline-offset-4"
                  >
                    Supabase privacy policy
                  </a>
                  .
                </li>
                <li>
                  <strong className="text-white/80">Resend</strong> — outbound
                  email delivery used to forward contact-form submissions to
                  our inbox.{" "}
                  <a
                    href="https://resend.com/legal/privacy-policy"
                    target="_blank"
                    rel="noreferrer"
                    className="text-ember hover:underline underline-offset-4"
                  >
                    Resend privacy policy
                  </a>
                  .
                </li>
              </ul>
              <p className="mt-3">
                We do not sell, rent, or share your personal data with
                third-party advertisers, brokers, or data resellers.
              </p>
            </section>

            <section id="children">
              <h2 className="text-white text-xl font-normal mb-3">
                4. Children&apos;s privacy
              </h2>
              <p>
                This site is not directed to children under 13 (or under 16
                in Virginia under VCDPA). We do not knowingly collect personal
                data from minors. If a parent or guardian believes a minor
                has submitted information through the contact form or FAQ
                feature, please email us at{" "}
                <a
                  href="mailto:o.18hamdan@outlook.com"
                  className="text-ember hover:underline underline-offset-4"
                >
                  o.18hamdan@outlook.com
                </a>{" "}
                and we will permanently delete it from our database.
              </p>
            </section>

            <section id="rights">
              <h2 className="text-white text-xl font-normal mb-3">
                5. Your rights (GDPR / VCDPA / CCPA)
              </h2>
              <p className="mb-3">
                Depending on where you live, you may have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Access the personal data we hold about you.</li>
                <li>Correct inaccurate or incomplete data.</li>
                <li>Request deletion of your data from our database.</li>
                <li>Receive a copy of your data in a portable format.</li>
                <li>
                  Opt out of any sale of personal data. (We do not currently
                  sell any data; this right is preserved by default.)
                </li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, email{" "}
                <a
                  href="mailto:o.18hamdan@outlook.com"
                  className="text-ember hover:underline underline-offset-4"
                >
                  o.18hamdan@outlook.com
                </a>{" "}
                from the email address you used at submission. We verify the
                request by reply and act within 30 days (45 days for VCDPA
                requests if extended notice is given).
              </p>
            </section>

            <section id="dnt">
              <h2 className="text-white text-xl font-normal mb-3">
                6. Do Not Track (CalOPPA)
              </h2>
              <p>
                We do not track users across websites or services, so there is
                no behavioral profile to disable. As a result, we honor
                browser &ldquo;Do Not Track&rdquo; signals by default — the
                experience does not differ whether the signal is present or
                not.
              </p>
            </section>

            <section id="retention">
              <h2 className="text-white text-xl font-normal mb-3">
                7. Data retention
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Contact-form messages are kept while the related project is
                  active, then deleted on request or within 12 months of last
                  contact, whichever comes first.
                </li>
                <li>
                  Approved FAQ submissions remain visible indefinitely as
                  part of the public knowledge base. Unapproved submissions
                  are deleted within 90 days.
                </li>
                <li>
                  Server logs are rotated and discarded within 30 days unless
                  retained for an active security investigation.
                </li>
              </ul>
            </section>

            <section id="security">
              <h2 className="text-white text-xl font-normal mb-3">
                8. Security
              </h2>
              <p>
                All submissions are encrypted in transit using TLS. Stored
                data lives in Supabase&apos;s managed Postgres, encrypted at
                rest. No system is bulletproof — please don&apos;t send
                anything sensitive (financial, medical, government IDs)
                through the forms on this site.
              </p>
            </section>

            <section id="changes">
              <h2 className="text-white text-xl font-normal mb-3">
                9. Changes
              </h2>
              <p>
                If this policy changes materially, we update the &ldquo;Last
                updated&rdquo; date at the top of the page and post the new
                version here. Continued use of the site after a change
                indicates acceptance of the updated policy.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-white text-xl font-normal mb-3">
                10. Contact
              </h2>
              <p className="mb-3">
                Privacy questions, data requests, or anything else legal:
              </p>
              <ul className="list-none space-y-1 pl-0">
                <li>
                  <strong className="text-white/80">Company:</strong>{" "}
                  <span className="text-white/45">
                    [Official Company Name]
                  </span>
                </li>
                <li>
                  <strong className="text-white/80">Mailing address:</strong>{" "}
                  <span className="text-white/45">[Mailing Address]</span>
                </li>
                <li>
                  <strong className="text-white/80">Email:</strong>{" "}
                  <a
                    href="mailto:o.18hamdan@outlook.com"
                    className="text-ember hover:underline underline-offset-4"
                  >
                    o.18hamdan@outlook.com
                  </a>
                </li>
              </ul>
            </section>

            <p className="text-white/35 text-sm pt-8 border-t border-white/[0.08]">
              See also:{" "}
              <Link
                href="/terms"
                className="text-ember hover:underline underline-offset-4"
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint -- --max-warnings 0`
Expected: clean.

- [ ] **Step 3: Browser verification**

Open `/privacy`. Verify:
1. Header reads "Privacy." with effective + last updated dates.
2. TOC with 10 anchor links.
3. All ten sections render. Anchor jumps work.
4. External links to Supabase / Resend privacy policies open in new tabs.

- [ ] **Step 4: Commit**

```bash
git add app/privacy/page.tsx
git commit -m "Expand privacy policy for VCDPA, GDPR, CCPA, COPPA, CalOPPA"
```

---

## Task 13: Terms of Service — new page

**Files:**
- Create: `app/terms/page.tsx`

- [ ] **Step 1: Create `app/terms/page.tsx`**

Full content:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms — LARPN",
  description:
    "Terms of service for LARPN — the agreement between the studio and visitors who submit FAQs or use the contact form.",
};

const SECTIONS = [
  { id: "acceptance", label: "Acceptance of terms" },
  { id: "ugc", label: "User-generated content" },
  { id: "prohibited", label: "Prohibited conduct" },
  { id: "liability", label: "Limitation of liability" },
  { id: "ip", label: "Intellectual property" },
  { id: "indemnify", label: "Indemnification" },
  { id: "modifications", label: "Modifications" },
  { id: "law", label: "Governing law" },
  { id: "severability", label: "Severability" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <>
      <main className="min-h-screen bg-ink pt-32 pb-24">
        <section className="max-w-3xl mx-auto px-6 sm:px-10">
          <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-5 font-medium">
            ▸ Legal
          </p>
          <h1 className="text-white text-4xl sm:text-5xl font-light tracking-tight leading-[1.05] mb-4">
            Terms.
          </h1>
          <p className="text-white/40 text-sm font-light mb-10">
            Effective: 2026-05-25 · Last updated: 2026-05-25
          </p>

          <p className="text-white/55 text-[15px] font-light leading-relaxed mb-12">
            This is the agreement between you and LARPN (&ldquo;we,&rdquo;
            &ldquo;us&rdquo;) when you use this site. By submitting the
            contact form or an FAQ, you agree to everything below. If you
            don&apos;t, please don&apos;t submit anything.
          </p>

          <nav
            aria-label="On this page"
            className="mb-14 border border-white/10 rounded-2xl p-5 bg-white/[0.015]"
          >
            <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-3 font-medium">
              On this page
            </p>
            <ol className="flex flex-col gap-1.5 text-sm font-light">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-white/65 hover:text-ember transition-colors"
                  >
                    {String(i + 1).padStart(2, "0")} — {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-12 text-white/55 text-[15px] font-light leading-relaxed">
            <section id="acceptance">
              <h2 className="text-white text-xl font-normal mb-3">
                1. Acceptance of terms
              </h2>
              <p>
                By submitting the contact form or an FAQ on this site, you
                acknowledge that you have read, understood, and agree to be
                bound by these Terms of Service. If you do not agree, do not
                use those features.
              </p>
            </section>

            <section id="ugc">
              <h2 className="text-white text-xl font-normal mb-3">
                2. User-generated content (FAQ submissions)
              </h2>
              <p>
                By submitting a question to the FAQ feature, you grant LARPN
                a perpetual, irrevocable, worldwide, royalty-free,
                non-exclusive license to publish, edit, paraphrase, translate,
                respond to, and display that question publicly on the
                website. You retain ownership of the original wording; LARPN
                owns any answers, edits, and editorial framing we create
                around it. Do not submit content you don&apos;t have the
                right to share.
              </p>
            </section>

            <section id="prohibited">
              <h2 className="text-white text-xl font-normal mb-3">
                3. Prohibited conduct
              </h2>
              <p className="mb-3">You agree not to submit:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Malicious code, exploits, scripts, or anything intended to
                  disrupt the site or its visitors.
                </li>
                <li>
                  Spam, repetitive submissions, or content posted in
                  bad faith.
                </li>
                <li>
                  Offensive, harassing, defamatory, threatening, or unlawful
                  content.
                </li>
                <li>
                  Sensitive personal data (Social Security numbers, financial
                  account details, medical records, credentials, government
                  IDs).
                </li>
                <li>
                  Content that infringes a third party&apos;s intellectual
                  property, privacy, or other rights.
                </li>
              </ul>
              <p className="mt-3">
                We may remove any submission for any reason and restrict
                access to anyone who violates these terms.
              </p>
            </section>

            <section id="liability">
              <h2 className="text-white text-xl font-normal mb-3">
                4. Limitation of liability
              </h2>
              <p className="mb-3">
                The site, its content, and any answered FAQ entries are
                provided &ldquo;as is&rdquo; without warranty of any kind.
                LARPN is not liable for:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Site downtime, server errors, lost submissions, or interrupted
                  service.
                </li>
                <li>
                  Reliance on information published in the FAQ section — those
                  answers are informational, not professional, legal, medical,
                  or financial advice.
                </li>
                <li>
                  Indirect, incidental, consequential, or punitive damages
                  arising from use of the site.
                </li>
              </ul>
              <p className="mt-3">
                To the maximum extent permitted by law, LARPN&apos;s total
                aggregate liability for any claim related to this site is
                capped at the lesser of (a) $100, or (b) any fees you paid us
                in the twelve months preceding the claim.
              </p>
            </section>

            <section id="ip">
              <h2 className="text-white text-xl font-normal mb-3">
                5. Intellectual property
              </h2>
              <p>
                All website design, code, written copy, visual assets, logos,
                and answered FAQ content are the exclusive property of LARPN
                (or its licensors). Use, copying, modification, or
                redistribution of any of this material without prior written
                permission is prohibited.
              </p>
            </section>

            <section id="indemnify">
              <h2 className="text-white text-xl font-normal mb-3">
                6. Indemnification
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless LARPN and
                its operators from any claim, loss, or expense (including
                reasonable attorneys&apos; fees) arising from your
                submissions, your violation of these terms, or your
                violation of any law or third-party right.
              </p>
            </section>

            <section id="modifications">
              <h2 className="text-white text-xl font-normal mb-3">
                7. Modifications
              </h2>
              <p>
                We may update these terms at any time. Material changes will
                be reflected in the &ldquo;Last updated&rdquo; date at the
                top of this page. Continued use of the site after an update
                constitutes acceptance of the revised terms.
              </p>
            </section>

            <section id="law">
              <h2 className="text-white text-xl font-normal mb-3">
                8. Governing law
              </h2>
              <p>
                These terms are governed by the laws of the Commonwealth of
                Virginia, without regard to conflict-of-laws principles. Any
                legal action or proceeding arising under these terms shall
                be filed exclusively in the state or federal courts located
                in Virginia, and you consent to the personal jurisdiction
                of those courts.
              </p>
            </section>

            <section id="severability">
              <h2 className="text-white text-xl font-normal mb-3">
                9. Severability
              </h2>
              <p>
                If any provision of these terms is held invalid or
                unenforceable, the remaining provisions remain in full
                effect, and the invalid provision will be replaced with one
                that most closely matches its original intent.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-white text-xl font-normal mb-3">
                10. Contact
              </h2>
              <ul className="list-none space-y-1 pl-0">
                <li>
                  <strong className="text-white/80">Company:</strong>{" "}
                  <span className="text-white/45">
                    [Official Company Name]
                  </span>
                </li>
                <li>
                  <strong className="text-white/80">Mailing address:</strong>{" "}
                  <span className="text-white/45">[Mailing Address]</span>
                </li>
                <li>
                  <strong className="text-white/80">Email:</strong>{" "}
                  <a
                    href="mailto:o.18hamdan@outlook.com"
                    className="text-ember hover:underline underline-offset-4"
                  >
                    o.18hamdan@outlook.com
                  </a>
                </li>
              </ul>
            </section>

            <p className="text-white/35 text-sm pt-8 border-t border-white/[0.08]">
              See also:{" "}
              <Link
                href="/privacy"
                className="text-ember hover:underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint -- --max-warnings 0`
Expected: clean.

- [ ] **Step 3: Browser verification**

Open `/terms`. Verify:
1. Header reads "Terms." with effective + last updated dates.
2. TOC with 10 anchors.
3. All ten sections render.
4. Cross-link to `/privacy` at the bottom works.

- [ ] **Step 4: Commit**

```bash
git add app/terms/page.tsx
git commit -m "Add Terms of Service page (VA governing law)"
```

---

## Task 14: Footer — link to Terms

**Files:**
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Add the Terms link beside Privacy**

In `components/Footer.tsx`, find the bottom row containing the Privacy link. Update the surrounding block:

```tsx
<div className="flex items-center gap-5 flex-wrap">
  <p className="text-white/30 text-xs font-light tracking-wider">
    © 2026 LARPN — All rights reserved.
  </p>
  <span className="hidden sm:inline text-white/15">·</span>
  <Link
    href="/privacy"
    className="text-white/40 hover:text-ember text-xs font-light tracking-wider transition-colors"
  >
    Privacy
  </Link>
  <span className="hidden sm:inline text-white/15">·</span>
  <Link
    href="/terms"
    className="text-white/40 hover:text-ember text-xs font-light tracking-wider transition-colors"
  >
    Terms
  </Link>
</div>
```

- [ ] **Step 2: Browser verification**

Scroll to the footer on any page. "Privacy" and "Terms" both appear, both link to the right places.

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "Link Terms of Service from footer"
```

---

## Task 15: Final cross-cutting verification

**Why:** With everything landed, do one full pass to catch interactions across changes (e.g. Templates page interacting with the new Resend env, the URL-param routing playing nice with the new Add-ons sub-page, etc.).

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: build completes without errors. Note any new warnings.

- [ ] **Step 2: Walk the site**

`npm run start` (or keep `npm run dev`), then visit each route manually:
- `/` — home loads
- `/services` — Work hub renders, no "more case studies" line
- `/templates` — search + theme filter work
- `/about` — Studio grid; click each of 4 practices; back arrow on each; refresh on a sub-page; Studio nav from sub-page; deep-link `?p=4`
- `/contact` — submit form; smooth close into Sent card; error message format on failure
- `/privacy` — TOC links jump correctly
- `/terms` — TOC links jump correctly
- Footer Privacy/Terms links present on every page

- [ ] **Step 3: Commit any pending lint/build fixes**

If anything turned up: fix, then commit with the message describing the fix.

- [ ] **Step 4: Final commit (if anything changed)**

If no changes, skip. Otherwise:

```bash
git add -A
git commit -m "Polish from final cross-cutting verification pass"
```

---

## Self-Review Notes

**Spec coverage check:**
- Item 1 (back-arrow black screen) → Task 1.
- Item 2 (Navbar Studio click bug) → Task 2.
- Item 3 (contact form send error) → Task 10.
- Item 4 (contact form animation lag) → Task 11.
- Item 5 (remove "more case studies") → Task 3.
- Item 6 (PersonalTools description) → Task 4.
- Item 7 (WebDev tag hover colors) → Task 5.
- Item 8 (PersonalTools single tool) → Task 6.
- Item 9 (UI/UX → Add-ons) → Task 7.
- Item 10 (Templates page) → Tasks 8 + 9.
- Item 11 (Privacy rewrite) → Task 12.
- Item 12 (Terms new page + footer) → Tasks 13 + 14.

All twelve spec items covered. Final verification pass in Task 15.

**Sequencing notes:**
- Task 1 must come before Task 2 (Navbar fix relies on URL-param behavior to work cleanly).
- Tasks 4 and 7 both touch `app/about/page.tsx` but in different fields — apply Task 4 first.
- Task 8 (`/templates`) must come before Task 9 (Navbar/Footer link to it), otherwise the link would 404 mid-commit.
- Task 12 + Task 13 are independent; Task 14 (footer Terms link) must come after Task 13.

**Placeholder scan:** Brand placeholders (`[Official Company Name]`, `[Mailing Address]`) are intentional inline values in Tasks 12 and 13 — flagged in the spec under "Open decisions for user." No code TBDs.

**Type consistency:** `TemplateTheme` defined in Task 8 (`app/templates/templates.ts`) is the only type used across tasks. `Addon`, `Practice`, and others are file-local. All consistent.
