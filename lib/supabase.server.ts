import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client. Imported by Route Handlers under app/api/*.
// The `server-only` import makes Webpack/Turbopack throw at build time if
// anything in the client bundle ever pulls this in by accident.
//
// Env vars (non-NEXT_PUBLIC so they never reach the browser):
//   SUPABASE_URL              — project URL
//   SUPABASE_ANON_KEY         — publishable anon key (RLS still applies)
// Setup: copy values from Supabase project settings into .env.local, and
// add them to Vercel project settings for production.

const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;

let cached: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient | null {
  if (!url || !anon) return null;
  if (!cached) {
    cached = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

export type FaqQuestion = {
  id: string;
  question: string;
  answer: string | null;
  category: string;
  status: "pending" | "approved" | "rejected" | "removed";
  like_count: number;
  submitted_by: string | null;
  created_at: string;
};
