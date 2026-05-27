import { NextResponse } from "next/server";
import { sanitizeUserText } from "@/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const CONTACT_DESTINATION = "o.18hamdan@outlook.com";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  budget?: unknown;
  note?: unknown;
  honeypot?: unknown;
};

function isValidEmail(value: string): boolean {
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

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
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

  // Web3Forms accepts a flat JSON payload; the keys other than
  // `access_key`, `from_name`, `subject`, `replyto`, `botcheck` show
  // up as labelled fields in the emailed summary.
  const payload = {
    access_key: accessKey,
    from_name: "LARPN Contact",
    subject: `LARPN inquiry from ${name}`,
    replyto: email,
    name,
    email,
    budget,
    notes: note || "(none)",
  };

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data: { success?: boolean; message?: string } = await res
      .json()
      .catch(() => ({}));

    if (!res.ok || data.success !== true) {
      return NextResponse.json(
        { error: data.message || `Send failed (${res.status})` },
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
