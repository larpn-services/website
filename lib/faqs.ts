// Public shape returned by /api/faqs. Safe to import from client components —
// no runtime, just the type. Server-only fields (status, internal flags) are
// stripped before the API returns the rows.

export type PublicFaq = {
  id: string;
  question: string;
  answer: string | null;
  like_count: number;
  submitted_by: string | null;
  created_at: string;
};
