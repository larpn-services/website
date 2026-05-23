import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy — LARPN",
  description: "LARPN's privacy policy — what we collect, what we don't, and how to reach us.",
};

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen bg-ink pt-32 pb-24">
        <section className="max-w-3xl mx-auto px-6 sm:px-10">
          <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-5 font-medium">
            ▸ Legal
          </p>
          <h1 className="text-white text-4xl sm:text-5xl font-light tracking-tight leading-[1.05] mb-10">
            Privacy.
          </h1>

          <div className="space-y-7 text-white/55 text-[15px] font-light leading-relaxed">
            <p>
              LARPN is a small studio. We collect as little as we can get away
              with, and we never sell or trade anything you give us.
            </p>

            <div>
              <h2 className="text-white text-base font-normal mb-2">
                What we collect
              </h2>
              <p>
                When you submit the contact form we receive your name, email,
                budget tier, and any notes you choose to send. When you submit
                or like a community FAQ we store the question, an optional name
                you provide, and a per-device flag to prevent double-liking.
              </p>
            </div>

            <div>
              <h2 className="text-white text-base font-normal mb-2">
                What we don&apos;t do
              </h2>
              <p>
                No third-party advertising trackers. No selling. No profile
                building beyond what&apos;s necessary to answer your message.
              </p>
            </div>

            <div>
              <h2 className="text-white text-base font-normal mb-2">
                Removing your data
              </h2>
              <p>
                Email{" "}
                <a
                  href="mailto:o.18hamdan@outlook.com"
                  className="text-ember hover:underline underline-offset-4"
                >
                  o.18hamdan@outlook.com
                </a>{" "}
                and we&apos;ll wipe it. Usually same day.
              </p>
            </div>

            <p className="text-white/35 text-sm pt-8 border-t border-white/[0.08]">
              Last updated: 2026-05-22
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
