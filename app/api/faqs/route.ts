import { NextResponse } from "next/server";
import { getSupabaseServer, type FaqQuestion } from "@/lib/supabase.server";
import { sanitizeUserText } from "@/lib/sanitize";
import type { PublicFaq } from "@/lib/faqs";

// Route Handler runs on the server. The browser never talks to Supabase
// directly — it only sees this endpoint.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toPublic(row: FaqQuestion): PublicFaq {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    like_count: row.like_count,
    submitted_by: row.submitted_by,
    created_at: row.created_at,
  };
}

export async function GET() {
  const sb = getSupabaseServer();
  if (!sb) {
    return NextResponse.json(
      { error: "Supabase not configured." },
      { status: 503 },
    );
  }
  const { data, error } = await sb
    .from("faq_questions")
    .select("*")
    .eq("status", "approved")
    .order("like_count", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const items = (data ?? []).map((r) => toPublic(r as FaqQuestion));
  return NextResponse.json({ items });
}

type SubmitBody = {
  question?: unknown;
  submitted_by?: unknown;
  honeypot?: unknown;
};

export async function POST(req: Request) {
  let body: SubmitBody;
  try {
    body = (await req.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Honeypot — bots fill any field they see. Return success without writing
  // so they don't learn the field is a tripwire.
  if (typeof body.honeypot === "string" && body.honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const rawQuestion = typeof body.question === "string" ? body.question : "";
  const rawName = typeof body.submitted_by === "string" ? body.submitted_by : "";
  const cleanQuestion = sanitizeUserText(rawQuestion, 400);
  const cleanName = sanitizeUserText(rawName, 60);
  if (cleanQuestion.length < 8) {
    return NextResponse.json(
      { error: "Question must be at least 8 characters." },
      { status: 400 },
    );
  }

  const sb = getSupabaseServer();
  if (!sb) {
    return NextResponse.json(
      { error: "Submissions are temporarily offline." },
      { status: 503 },
    );
  }

  const { error } = await sb.from("faq_questions").insert({
    question: cleanQuestion,
    submitted_by: cleanName || null,
    status: "pending",
    category: "user-submitted",
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
