import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser-safe Supabase client. The anon key is publishable (it relies on RLS
// policies enforced in the database). Setup steps:
//   1. Create a Supabase project at https://supabase.com
//   2. Run supabase/schema.sql in the SQL editor
//   3. Copy your project URL + anon key into .env.local

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !anon) return null;
  if (!cached) cached = createClient(url, anon);
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
