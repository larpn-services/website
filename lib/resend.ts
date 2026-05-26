import { Resend } from "resend";

let cached: Resend | null = null;

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

export const CONTACT_DESTINATION = "o.18hamdan@outlook.com";
// Resend's sandbox-friendly default sender. Swap to a verified domain
// once one is set up.
export const CONTACT_FROM = "LARPN Contact <onboarding@resend.dev>";
