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
      <main className="min-h-dvh bg-ink pt-32 pb-24">
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
                bound by these Terms of Service. If you do not agree, do
                not use those features.
              </p>
            </section>

            <section id="ugc">
              <h2 className="text-white text-xl font-normal mb-3">
                2. User-generated content (FAQ submissions)
              </h2>
              <p>
                By submitting a question to the FAQ feature, you grant LARPN
                a perpetual, irrevocable, worldwide, royalty-free,
                non-exclusive license to publish, edit, paraphrase,
                translate, respond to, and display that question publicly
                on the website. You retain ownership of the original
                wording; LARPN owns any answers, edits, and editorial
                framing we create around it. Do not submit content you
                don&apos;t have the right to share.
              </p>
            </section>

            <section id="prohibited">
              <h2 className="text-white text-xl font-normal mb-3">
                3. Prohibited conduct
              </h2>
              <p className="mb-3">You agree not to submit:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Malicious code, exploits, scripts, or anything intended
                  to disrupt the site or its visitors.
                </li>
                <li>
                  Spam, repetitive submissions, or content posted in bad
                  faith.
                </li>
                <li>
                  Offensive, harassing, defamatory, threatening, or
                  unlawful content.
                </li>
                <li>
                  Sensitive personal data (Social Security numbers,
                  financial account details, medical records, credentials,
                  government IDs).
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
                  Site downtime, server errors, lost submissions, or
                  interrupted service.
                </li>
                <li>
                  Reliance on information published in the FAQ section —
                  those answers are informational, not professional, legal,
                  medical, or financial advice.
                </li>
                <li>
                  Indirect, incidental, consequential, or punitive damages
                  arising from use of the site.
                </li>
              </ul>
              <p className="mt-3">
                To the maximum extent permitted by law, LARPN&apos;s total
                aggregate liability for any claim related to this site is
                capped at the lesser of (a) $100, or (b) any fees you paid
                us in the twelve months preceding the claim.
              </p>
            </section>

            <section id="ip">
              <h2 className="text-white text-xl font-normal mb-3">
                5. Intellectual property
              </h2>
              <p>
                All website design, code, written copy, visual assets,
                logos, and answered FAQ content are the exclusive property
                of LARPN (or its licensors). Use, copying, modification, or
                redistribution of any of this material without prior
                written permission is prohibited.
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
                We may update these terms at any time. Material changes
                will be reflected in the &ldquo;Last updated&rdquo; date at
                the top of this page. Continued use of the site after an
                update constitutes acceptance of the revised terms.
              </p>
            </section>

            <section id="law">
              <h2 className="text-white text-xl font-normal mb-3">
                8. Governing law
              </h2>
              <p>
                These terms are governed by the laws of the Commonwealth
                of Virginia, without regard to conflict-of-laws principles.
                Any legal action or proceeding arising under these terms
                shall be filed exclusively in the state or federal courts
                located in Virginia, and you consent to the personal
                jurisdiction of those courts.
              </p>
            </section>

            <section id="severability">
              <h2 className="text-white text-xl font-normal mb-3">
                9. Severability
              </h2>
              <p>
                If any provision of these terms is held invalid or
                unenforceable, the remaining provisions remain in full
                effect, and the invalid provision will be replaced with
                one that most closely matches its original intent.
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
