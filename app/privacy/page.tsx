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
                We collect only what&apos;s needed to talk to you.
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
                  <strong className="text-white/80">Resend</strong> —
                  outbound email delivery used to forward contact-form
                  submissions to our inbox.{" "}
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
                in Virginia under VCDPA). We do not knowingly collect
                personal data from minors. If a parent or guardian believes a
                minor has submitted information through the contact form or
                FAQ feature, please email us at{" "}
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
                We do not track users across websites or services, so there
                is no behavioral profile to disable. As a result, we honor
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
                  Contact-form messages are kept while the related project
                  is active, then deleted on request or within 12 months of
                  last contact, whichever comes first.
                </li>
                <li>
                  Approved FAQ submissions remain visible indefinitely as
                  part of the public knowledge base. Unapproved submissions
                  are deleted within 90 days.
                </li>
                <li>
                  Server logs are rotated and discarded within 30 days
                  unless retained for an active security investigation.
                </li>
              </ul>
            </section>

            <section id="security">
              <h2 className="text-white text-xl font-normal mb-3">
                8. Security
              </h2>
              <p>
                All submissions are encrypted in transit using TLS. Stored
                data lives in Supabase&apos;s managed Postgres, encrypted
                at rest. No system is bulletproof — please don&apos;t send
                anything sensitive (financial, medical, government IDs)
                through the forms on this site.
              </p>
            </section>

            <section id="changes">
              <h2 className="text-white text-xl font-normal mb-3">
                9. Changes
              </h2>
              <p>
                If this policy changes materially, we update the
                &ldquo;Last updated&rdquo; date at the top of the page and
                post the new version here. Continued use of the site after
                a change indicates acceptance of the updated policy.
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
