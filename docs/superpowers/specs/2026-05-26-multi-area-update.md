# Multi-Area Website Update — Design Spec

## Overview

Five independent UI updates across the LARPN website, all frontend-only, no new routes or API changes.

---

## Area 1: Home Page — "Explore Templates" CTA

**File:** `components/Hero.tsx`

Change the secondary hero CTA:
- Text: "Explore prototypes" → "Explore templates"
- `href="/about"` → `href="/templates"`

One-line edit, no other changes.

---

## Area 2: Templates Page — Reorder, New Covers, Quality Fix

**Files:** `app/templates/templates.ts`, `app/templates/page.tsx`

### Reorder (new array order)
1. Landmark (was 3rd) — images in `/t3-pics/`
2. Atelier (was 2nd) — images in `/t2-pics/`
3. Luminary (was 4th) — images in `/t4-pics/`
4. CivicBase (was 1st) — images in `/t1-pics/`

### Cover images
Each template's `cover` field changes from `1.png` to `main.png` in the same folder:
- Landmark: `/t3-pics/main.png`
- Atelier: `/t2-pics/main.png`
- Luminary: `/t4-pics/main.png`
- CivicBase: `/t1-pics/main.png`

The `pics` arrays remain unchanged (still reference `1.png`–`4.png` from each template's folder).

### Image quality fix in modal
The 2×2 modal grid renders at `sizes="(max-width: 640px) 50vw, 384px"`, which is too small — Next.js serves a downsampled variant. Fix: change to `sizes="(max-width: 640px) 50vw, 600px"` and add `quality={95}` to all four modal `Image` components.

---

## Area 3: Work Page — Hover-Tab Layout

**File:** `app/services/page.tsx`

Replace the 2×2 image card grid with:

### Tab pills row
- Horizontal `flex flex-wrap gap-2` row of 4 pill buttons (one per category)
- Default hover state: first category
- On `onMouseEnter`: set `hovered` state to that category's slug
- On `onClick`: navigate to `/services/[slug]` via `next/link`
- Active tab styles: `bg-ember/15 border-ember/45 text-ember`
- Inactive tab styles: `bg-white/[0.02] border-white/[0.08] text-white/55`

### Preview image area
- Sits below the tabs, `aspect-[21/9]` on desktop, `aspect-[4/3]` on mobile
- Uses `AnimatePresence` with `key={hovered}` so the image fades out/in on tab change
- Each frame: `motion.div` with `initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}` at 0.3s
- Inside: `Image fill object-cover opacity-60` with gradient overlay
- Overlay content (bottom-left): category number, name, blurb, item count + Browse arrow
- Entire preview is wrapped in `<Link href={/services/${hovered}}>` so clicking navigates

---

## Area 4: Studio Personal Tools — Web Scraper Tool

**Files:** `components/EditTool.tsx` (new), `components/PersonalToolsPractice.tsx`

### EditTool component
Save the provided `EditTool` component code as `components/EditTool.tsx` exactly as provided. Dependencies (`clsx`, `tailwind-merge`) are already installed.

### Web scraper section in PersonalToolsPractice
Add a second tool section below the existing social hygiene graph. The section uses `EditTool` in write mode with a typewriter animation.

**Typewriter logic (on page mount):**
- 600ms initial delay, then starts building `newContent` string character by character at 18ms/char
- `toolState` transitions: `"waiting"` → `"pending"` (when typing starts) → `"completed"` (when full)
- Code typed out:

```ts
// scraper/social-media.ts
import puppeteer from "puppeteer";

export async function scrapePosts(
  platform: string,
  username: string,
) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`https://${platform}.com/${username}`);
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
}
```

**Section layout:**
- Section label: "02 — Tool" (ember, uppercase)
- Heading: "Scrape any feed." + italic "Any platform, any data."
- Subtitle: short description of the scraper
- EditTool rendered with `filePath="scraper/social-media.ts"`, `variant="write"`, `state={toolState}`, `newContent={typed}`

---

## Area 5: Software Engineering Practice

**Files:** `components/SoftwareEngineeringPractice.tsx` (new), `app/about/page.tsx`

### New component
Replaces the generic `PracticeDetail` for practice index 1 (software engineering).

**Structure:**
- Back button → "The Studio"
- Header: "02 — Practice" + h1 "Software engineering." + italic subhead + description
- Three category sections (Workflow, Customer Support, DevOps), each with:
  - Category label in ember uppercase
  - Agent cards in a `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`

**Agent data:**

Workflow:
1. **Lead-to-Deal Pipeline** — "Searches Apollo for ICP-matched leads, deduplicates against HubSpot, creates CRM objects, notifies via Slack, and sends a Calendly booking link." Tags: Apollo, HubSpot, Slack, Calendly
2. **Proposal Builder** — "Auto-fills client proposals from HubSpot/Notion templates, pulls portfolio items, saves drafts to Drive, and tracks which templates convert best." Tags: HubSpot, Notion, Google Drive
3. **Form Autocomplete** — "AI-powered form filling with tabbed UI and chat interface." Tags: Automation, Forms

Customer Support:
1. **WhatsApp Business Responder** — "Matches inbound messages against your knowledge base, replies accurately, and escalates what it can't handle — with full conversation logging." Tags: WhatsApp, Automation
2. **Refund & Cancellation Agent** — "Verifies the customer in Stripe, explains your policy, processes approved refunds or cancellations, and logs the outcome in Intercom." Tags: Stripe, Intercom

DevOps:
1. **Security Auditor** — "Comprehensive security audits and compliance assessments against SOC 2, ISO 27001, HIPAA, PCI DSS, GDPR, and NIST — with prioritised findings and remediation roadmaps." Tags: Security, Compliance
2. **PR Reviewer** — "Structured code review on every pull request — correctness, security, and convention issues posted as inline comments." Tags: GitHub, DevOps

**Footer note:** "…and many more agents available on request."

### Wire-up in about/page.tsx
Import `SoftwareEngineeringPractice` and render it for `selected === 1` (replacing the generic `PracticeDetail` case for that index).

---

## What does NOT change

- Navbar, Footer
- All other pages and routes
- `categories.ts` data (work page reuses existing cover URLs)
- Templates `pics` arrays (still 1.png–4.png)
- Any authentication, API, or data-fetching logic
