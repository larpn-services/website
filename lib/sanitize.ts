// Strip Unicode controls that let attackers spoof what a moderator sees:
//   U+202A..U+202E  bidi overrides (LRE/RLE/PDF/LRO/RLO)
//   U+2066..U+2069  bidi isolates (LRI/RLI/FSI/PDI)
//   U+200B..U+200D  zero-width space, ZWNJ, ZWJ
//   U+FEFF          ZWNBSP / BOM
//   U+00AD          soft hyphen
// Normalize to NFKC so visually-identical-but-different codepoints collapse
// before they reach the moderator queue or the inbox.
const UNSAFE_INVISIBLE = new RegExp(
  "[" +
    "\\u00AD" +
    "\\u200B-\\u200D" +
    "\\u202A-\\u202E" +
    "\\u2066-\\u2069" +
    "\\uFEFF" +
    "]",
  "g",
);

export function sanitizeUserText(input: string, maxLen: number): string {
  return input
    .normalize("NFKC")
    .replace(UNSAFE_INVISIBLE, "")
    .trim()
    .slice(0, maxLen);
}
