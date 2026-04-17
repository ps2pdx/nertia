export const BANNED_PHRASES = [
  "the real power",
  "unlock the",
  "in today's fast-paced world",
  "truly make a difference",
  "game-changing",
  "at the end of the day",
  "cutting-edge",
  "take your business to the next level",
  "revolutionize",
  "leverage",
  "seamlessly integrate",
  "empower",
  "robust solution",
  "innovative solution",
  "unparalleled",
  "elevate your",
  "it's not just X, it's Y",
];

const SMART_QUOTES: Record<string, string> = {
  "\u201c": '"',
  "\u201d": '"',
  "\u2018": "'",
  "\u2019": "'",
};

export function containsBannedPhrase(text: string): boolean {
  const lower = text.toLowerCase();
  return BANNED_PHRASES.some((p) => lower.includes(p.toLowerCase()));
}

function stripBannedPhrases(text: string): string {
  let out = text;
  for (const phrase of BANNED_PHRASES) {
    const re = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out = out.replace(re, "");
  }
  return out.replace(/\s{2,}/g, " ").replace(/\s+([,.!?])/g, "$1").trim();
}

function normalizeDashes(text: string): string {
  return text
    .replace(/\s*[\u2014]\s*/g, ". ")
    .replace(/[\u2013]/g, "-");
}

function normalizeQuotes(text: string): string {
  return text.replace(/[\u201c\u201d\u2018\u2019]/g, (ch) => SMART_QUOTES[ch] ?? ch);
}

export function humanize(text: string): string {
  let out = text;
  out = normalizeQuotes(out);
  out = normalizeDashes(out);
  out = stripBannedPhrases(out);
  return out;
}
