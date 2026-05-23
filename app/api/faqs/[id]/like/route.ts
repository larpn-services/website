import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }
  const sb = getSupabaseServer();
  if (!sb) {
    return NextResponse.json(
      { error: "Supabase not configured." },
      { status: 503 },
    );
  }

  // SECURITY DEFINER RPC defined in supabase/schema.sql — only mutates
  // already-approved rows, so it can't be used to bump pending ones live.
  const { data, error } = await sb.rpc("increment_faq_like", { qid: id });
  if (error || typeof data !== "number" || data < 0) {
    return NextResponse.json(
      { error: error?.message ?? "Like failed." },
      { status: 500 },
    );
  }
  return NextResponse.json({ like_count: data });
}
