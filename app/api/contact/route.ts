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
          CONTACT_DESTINATION +
          ".",
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
