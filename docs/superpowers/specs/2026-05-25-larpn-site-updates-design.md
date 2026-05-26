# LARPN Site Updates — Design Spec

**Date:** 2026-05-25
**Branch:** main → feature branch
**Author:** LARPN

## Goal

Land a batch of bug fixes, content tweaks, and feature additions to the LARPN
agency site. Twelve distinct changes grouped by area: navigation/state bugs,
content polish, two redesigned sub-pages (PersonalTools, UI/UX→Add-ons), one
new top-level page (Templates), and two new/rewritten legal pages (Privacy,
Terms).

## Constraints

- Next.js App Router with the project's modified version — read
  `node_modules/next/dist/docs/` before reaching for stale Next.js patterns.
- Brand palette: ember (`#FF6B1A`), white, ink dark background. No purple.
- Existing animation conventions: ~180–350ms transitions, `[0.22, 1, 0.36, 1]`
  ease curve, framer-motion.
- No emoji in code. No backwards-compat shims.

---

## 1. PersonalTools back arrow → black screen

**Problem.** Clicking the back arrow inside the PersonalTools sub-page (and
likely WebDev/UiUx too) sometimes leaves the user staring at a dark page until
they refresh. The `AnimatePresence mode="wait"` runs the exit (0.22s fade) before
the grid is mounted. The root cause is that `selected` is local React state — if
anything throws during the transition (e.g. an effect in `UiUxPractice` that
reads `window` during its exit) the state update silently fails.

**Fix.** Move `selected` out of React state and into a URL search param `?p=1..4`
(1-indexed to match the existing deep-link convention already supported in
`app/about/page.tsx`). Benefits:

- `router.push('/about')` from anywhere (back button, Studio nav click) cleanly
  returns to the grid.
- Browser back button works naturally.
- Existing `?p=N` deep-link contract is preserved.
- Removes the React-state-during-animation pitfall.

**Files.** `app/about/page.tsx`.

**Implementation notes.**
- Use `useSearchParams()` + `useRouter()` from `next/navigation`.
- `selected` becomes a derived value from the URL param.
- The four `onBack` handlers call `router.push('/about')`.
- Selecting a card calls `router.push('/about?p=' + (i + 1))`.

---

## 2. Navbar Studio link broken from Studio sub-page

**Problem.** When the user is on `/about?p=4` and clicks "Studio" in the navbar,
nothing happens — `handleNavClick` in `Navbar.tsx` only intervenes when
`pathname.startsWith(href + "/")`. The pathname is exactly `/about`, so the
guard fails and Next.js's `Link` skips re-navigation because the URL "matches."

**Fix.** Inside `handleNavClick`, also detect the case where pathname equals
href but search params are non-empty. In that case, call `router.push(href)` to
clear the params. Naturally pairs with item #1 (URL-param state).

**Files.** `components/Navbar.tsx`.

---

## 3. Contact form send error → switch FormSubmit → Resend

**Problem.** The current form POSTs to `formsubmit.co/ajax/o.18hamdan@outlook.com`.
That endpoint requires a one-time verification click on an email sent to the
target inbox before it forwards submissions. That step was never completed, so
every real submission errors.

**Fix.** Add a server-side `/api/contact` route handler that uses
[Resend](https://resend.com) (free tier: 3K emails/month, no verification
dance). The `ContactForm` component POSTs JSON to `/api/contact` instead of the
external endpoint.

**Why Resend over re-trying FormSubmit:**
- Self-serve API key, no verification email loop.
- Official Next.js docs and SDK.
- Server-side validation gate before sending.
- Removes the `connect-src` whitelist requirement for `formsubmit.co` in
  `next.config.ts`.

**Files.**
- Add `app/api/contact/route.ts` — POST handler, validates inputs, calls Resend.
- Modify `components/ContactForm.tsx` — change endpoint, remove FormSubmit-
  specific fields (`_subject`, `_template`, `_captcha`, `_replyto`).
- Update `next.config.ts` — drop the formsubmit.co `connect-src`.
- Add `RESEND_API_KEY` to `.env.local` (user does this manually).
- Add `resend` to `package.json` dependencies.

**Env contract.** If `RESEND_API_KEY` is missing, the route returns a clear
error rather than 500, and the form surfaces "Email service offline — reach me
directly at o.18hamdan@outlook.com" — matches existing FormSubmit fallback UX.

---

## 4. Contact form close animation feels laggy

**Problem.** Current exit `{ opacity: 0, y: -20 }` with default ease at the
default ~0.3s feels abrupt and snappy. The form-to-sent-card transition
benefits from a softer curve.

**Fix.** Change exit on the form motion to `{ opacity: 0, scale: 0.97, y: -8 }`
with `transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}`. Matches the
existing entry transition curve so the open and close feel reciprocal.

**Files.** `components/ContactForm.tsx`.

---

## 5. Work page — remove "More case studies on the way."

**Files.** `app/services/page.tsx` — delete the trailing `<p>` (lines 95–97).

---

## 6. PersonalTools description copy update

**Files.** `app/about/page.tsx`.

**Change.**
```ts
// before
body: "AI automations, daily helpers, one-shot utilities. From an email-triage agent to a script that re-organises your files — anything you'd hire a custom dev to build.",

// after
body: "Ad blockers, bots, scrapers, social automations, one-shot utilities. If you'd pay someone to build it once, I'll build it — and make it run itself.",
```

---

## 7. WebDev tech tags — hover colors

**Problem.** The five tags in `WebDevPractice.tsx` (`Three.js`, `Spline`,
`GLSL Shaders`, `WebGL`, `React Three Fiber`) are static `text-white/55` with
no per-tag affordance. Make them feel alive.

**Fix.** Build a `{ label, hoverClass, borderClass }` lookup and apply it.

| Tag | Hover text | Hover border | Hover bg |
|---|---|---|---|
| Three.js | `#FF6B1A` (ember) | ember/40 | ember/[0.05] |
| Spline | `#a78bfa` (violet) | violet/40 | violet/[0.06] |
| GLSL Shaders | `#4ade80` (emerald) | emerald/40 | emerald/[0.06] |
| WebGL | `#38bdf8` (sky) | sky/40 | sky/[0.06] |
| React Three Fiber | `#2dd4bf` (teal) | teal/40 | teal/[0.06] |

Use arbitrary Tailwind values so we don't expand the palette. Transitions:
180ms colors (matches site convention).

**Files.** `components/WebDevPractice.tsx`.

---

## 8. PersonalTools — single social automation tool

**Problem.** Currently two presets (`social-automation` and `python-scraper`)
plus a chip switcher. User wants just one: social media account-hygiene tool
spanning Discord/Instagram/TikTok.

**Fix.** Strip out:
- `PYTHON_PRESET`, `PythonTypewriter`, `PYTHON_SOURCE`, `highlightPython`,
  `PY_KEYWORDS`.
- The `PRESETS` array, `presetIdx` state, and the preset chip selector UI.
- The conditional `isGraph ? <GraphCanvas /> : <PythonTypewriter />`.

Keep:
- `SOCIAL_PRESET` (renamed to a const, no longer wrapped in an array).
- `GraphCanvas` and `ConnectionPath`.
- The header layout, status bar, and CTA.

Refine the copy:
- Header h1: `Tools that do` / *`exactly that one thing.`* (unchanged)
- Intro p: "One button across Instagram, Discord, and TikTok. Wipe every DM,
  un-like a year of videos, un-repost reels you regret, and see exactly who
  stopped following back — without scrolling for hours."
- Tagline below header: the current `SOCIAL_PRESET.tagline` works.
- Footer stat: keep `Multi-account · IG · Discord · TikTok`.

Refine node subtitles for clarity:
- `sa-discord` subtitle: "Servers + DMs" → "Wipes any DM or server"
- `sa-tiktok` subtitle: "Posts + likes + reposts" → "Likes, reposts, follows"
- `sa-ghosts` title: "Non-followers-back" → "Ghost tracker"

**"Add a block" feature.** The current component has no UI for adding new
blocks — nodes are positional but read-only. The user's request to "remove the
feature to add a block" is already satisfied. No code change required, but
note in the implementation that we double-check no editor UI is bolted on
elsewhere.

**Files.** `components/PersonalToolsPractice.tsx`.

---

## 9. UI/UX page → Add-ons service page

**Problem.** `UiUxPracticeScene` is currently a 3-section scroll-stack narrative
about grafting templates onto live sites. User wants a service page listing
specific add-on offerings with prices and a bundle discount.

**Fix.** Full replacement of the component body. Reuse: ember backdrop glow
(scaled-down version), back button affordance, ember/dot aesthetic, the
"Graft this onto your site" CTA pattern.

**Page structure.**

1. **Back button** — `← The Studio` (same affordance as siblings).
2. **Header**
   - eyebrow: `03 — Practice`
   - h1: `Add-ons.` / *`Upgrades for sites already alive.`*
   - sub: "Have a site you like? I'll make it sharper, faster, better-looking
     — without rebuilding the whole thing."
3. **Add-on grid** — 2 columns on desktop, 1 on mobile. Each card:
   - Lucide icon (top-left)
   - service name (h3)
   - price (large, ember accent)
   - period suffix (`each` / `/month` / `one-time`)
   - one-line tagline
   - on hover: ember border + subtle scale + glow

4. **Bundle banner** — full-width card with:
   - eyebrow: `Bundle`
   - h2: `Pair 3 — save 20%`
   - sub: "Add any three of the above to a project and the bundle discount lands
     automatically. Ask about quarterly retainers for ongoing teams."

5. **CTA** — existing "Graft this onto your site" / "Back to studio" buttons.

**Add-on data (with icons from `lucide-react`).**

| Icon | Name | Price | Period | Tagline |
|---|---|---|---|---|
| `Box` | 3D Components | $29.99 | each | Three.js scenes, models, interactive 3D for your site |
| `ShieldCheck` | Maintenance Plan | $49.99 | /month | Updates, security patches, backups, on-call fixes |
| `Globe` | Domain & DNS Setup | $9.99 | one-time | Buy, point, configure, SSL — fully done for you |
| `PenTool` | Logo Creation | $29.99 | one-time | Custom mark + wordmark, source files included |
| `Image` | Thumbnails & Banners | $9.99 | each | Social posts, YouTube thumbs, ad creatives |
| `MessageSquare` | Live Chat Widget | $19.99 | /month | AI- or human-routed chat installed on your site |
| `Sparkles` | AI Assistant Setup | $79.99 | one-time | Custom GPT trained on your business + docs |
| `TrendingUp` | SEO Boost Package | $39.99 | one-time | On-page audit, keywords, schema, indexing fixes |

**Files.**
- Rewrite `components/UiUxPracticeScene.tsx`.
- Update the practice card body in `app/about/page.tsx` for index 2 (UI/UX)
  to reflect the new positioning: "Add-ons grafted onto your live site — 3D
  scenes, maintenance, SEO, logo work. No rebuild."

---

## 10. Templates page — `/templates`

**Problem.** User has ready-made site templates they want to sell/showcase.
Needs a clean page with search and theme-based sort.

**Fix.** New top-level route with a static template catalog.

**Routing.**
- `app/templates/page.tsx` — client component, search + filter UI.
- `app/templates/templates.ts` — exports the static `templates` array and
  `themes` enum/array. Mirrors the pattern of `app/services/categories.ts`.

**Page structure.**

1. **Header**
   - eyebrow: `▸ Templates`
   - h1: `Templates.` / *`Ready to ship. Tuned to you.`*
   - sub: "Built once, sharpened endlessly. Drop one onto your domain and we
     re-skin it in your brand — usually within a week."

2. **Toolbar** — sticky-ish row containing:
   - Search input (live filter on `name` + `description`)
   - Theme chip filter: `All` · `Portfolio / Agency` · `SaaS / Dashboard` ·
     `E-commerce` · `Blog / Editorial`

3. **Card grid** — 3-col desktop, 2-col tablet, 1-col mobile. Each card:
   - Cover thumbnail (next/image, 16:10)
   - theme badge (ember small chip)
   - template name (h3)
   - short description (one line)
   - Preview link (arrow) — opens external demo URL if present
   - Price (ember, small) if priced; "Free" otherwise

4. **Empty state** — when no results match the search/theme combo:
   - centered: "Nothing here." / *"Try a different theme."*

**Data model.**

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
```

The initial `templates` array can be seeded with placeholder entries that the
user fills in later. Ship 2–3 in each theme so the filter has something to
demonstrate. Mark placeholders `comingSoon: true`.

**Nav integration.**
- `components/Navbar.tsx` — add `{ label: "Templates", href: "/templates" }`
  to `navLinks` between Work and Studio.
- `components/Footer.tsx` — add `{ label: "Templates", href: "/templates" }`
  to the Studio column.

---

## 11. Privacy Policy rewrite

**Files.** `app/privacy/page.tsx`.

**Coverage.** VCDPA (Virginia), COPPA, CCPA/CPRA (California), GDPR, CalOPPA.

**Sections.**

1. **Effective date** — `2026-05-25` plus `Last updated` line.
2. **Who we are** — brief studio intro, contact details.
3. **Information We Collect**
   - *Contact form*: name, email, budget tier, optional message.
   - *FAQ submissions*: question text, optional name.
   - *Server logs*: standard request data (IP, user-agent) for security and
     abuse prevention. Auto-rotated.
   - *No cookies for tracking*. Functional cookies/tokens may be set by
     Supabase to maintain secure submission sessions; these expire when the
     tab closes.
4. **How We Use Information**
   - Strictly to reply to contact inquiries and publish approved FAQ answers.
   - No marketing, no profile-building, no third-party sharing.
5. **Third-Party Service Providers**
   - Supabase — hosted Postgres + auth tokens for submissions.
   - Resend — outbound email delivery for contact-form replies.
   - Disclosure that data is stored securely with these providers; links to
     their privacy policies.
   - Explicit: we do not sell, rent, or share personal data with advertisers.
6. **Children's Privacy (COPPA + VCDPA)**
   - Site not directed to anyone under 13 (or under 16 in Virginia).
   - We do not knowingly collect data from minors.
   - Parents can email us to remove a child's submission; we will permanently
     delete from Supabase.
7. **Your Rights** (GDPR / VCDPA / CCPA)
   - Right to access, correct, delete, and port your data.
   - Right to opt out of any future sale of data (we currently sell nothing).
   - How to exercise: email the support address with the request; verification
     by replying from the email used at submission.
8. **Do Not Track (CalOPPA)**
   - We do not track users across sites or services. We honor DNT signals by
     default because no cross-site tracking exists.
9. **Data Retention**
   - Contact form messages: kept until the project lifecycle ends, then
     deleted on request or within 12 months of last contact.
   - FAQ submissions: kept indefinitely if approved (public). Unapproved
     submissions deleted within 90 days.
10. **Security**
    - Submissions encrypted in transit (TLS). Stored in Supabase
      (PostgreSQL, encrypted at rest).
11. **Changes** — version history line.
12. **Contact**
    - Placeholders: `[Official Company Name]`, `[Mailing Address]`.
    - Support email: `o.18hamdan@outlook.com`.

**Visual.** Reuse the existing typography pattern from the current privacy
page (ember eyebrow, white h1, white/55 body). Add an in-page table of
contents at the top with anchor links for the 12 sections.

---

## 12. Terms of Service (new page)

**Files.**
- `app/terms/page.tsx` — new route.
- `components/Footer.tsx` — add a Terms link beside Privacy in the bottom
  row.

**Coverage.** Per the Gemini brief:

1. **Acceptance of Terms** — by submitting the contact form or an FAQ, you
   agree to these terms.
2. **User-Generated Content (FAQ Submissions)** — perpetual, royalty-free,
   non-exclusive license to LARPN to publish, edit, paraphrase, and respond
   to submitted questions publicly. User keeps ownership of original wording;
   LARPN owns the answers and any editorial framing.
3. **Prohibited Conduct** — no malicious code, spam, offensive content,
   sensitive personal data (SSN, financial, health), or content infringing
   third-party rights.
4. **Limitation of Liability** — LARPN not liable for downtime, errors, or
   reliance on FAQ information. FAQ answers are informational, not
   professional advice. Maximum aggregate liability capped at the lesser of
   $100 or fees paid in the prior 12 months.
5. **Intellectual Property** — site design, code, logos, copy, and answered
   FAQ content are LARPN's exclusive property. Use, copy, or reproduction
   without written permission is prohibited.
6. **Indemnification** — user agrees to indemnify LARPN from claims arising
   from their submissions.
7. **Modifications** — LARPN may update these terms; continued use after
   posted update is acceptance.
8. **Governing Law** — Commonwealth of Virginia law; venue: state or federal
   courts located in Virginia.
9. **Severability** — invalid clause doesn't void the rest.
10. **Contact** — same support email as privacy policy.

**Visual.** Mirror the Privacy page's structure for consistency: ember eyebrow
`▸ Legal`, white h1 `Terms.`, body white/55, version line at the bottom.

---

## Footer updates (cross-cutting)

`components/Footer.tsx`:
- Add `Templates` link to the Studio column.
- Add `Terms` link to the bottom row beside `Privacy`.

---

## Out of scope

- Cookie consent banner. VCDPA doesn't require one for this site (no
  third-party trackers, no sale of data). Adding one would be cosmetic; not
  doing it now keeps the chrome clean. Easy to add later if compliance posture
  changes.
- Translating the site or supporting locales other than English.
- A search/filter for the FAQs page (separate work).

## Open decisions for user

- **Resend** — user needs a Resend account and an API key. The implementation
  can ship behind a feature flag; if the env var is absent, the form gracefully
  falls back to a `mailto:` button.
- **Privacy / Terms placeholders** — `[Official Company Name]` and
  `[Mailing Address]` left as visible bracketed placeholders. User can edit
  in-line once finalized.
- **Initial template catalog** — implementation ships with placeholder cards
  (2 per theme, marked `comingSoon`). User populates with real assets later.

## Risks

- **Resend env**: a production deploy without `RESEND_API_KEY` will surface a
  fallback message. Acceptable.
- **URL-param state migration** (item #1): any current bookmark to a sub-page
  uses `?p=N`; the existing deep-link feature already supports this so
  bookmarks survive.
- **Footer Studio column**: adding `Templates` may push the column to 4 items
  visually — still fits.
