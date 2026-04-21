import { splitLocalized } from "./i18n";

const WORDS_PER_MIN = 220;

function stripMarkdown(s: string): string {
  return s
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(s: string): number {
  const cleaned = stripMarkdown(s);
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).length;
}

/**
 * Estimates reading time in minutes for bilingual or plain content fields.
 * Uses the max of the RU and EN word counts so the estimate doesn't shrink
 * when the user switches languages.
 */
export function estimateReadingMinutes(...fields: string[]): number {
  let maxWords = 0;
  for (const field of fields) {
    if (!field) continue;
    const { ru, en } = splitLocalized(field);
    const ruWords = countWords(ru);
    const enWords = countWords(en);
    maxWords += Math.max(ruWords, enWords);
  }
  if (maxWords === 0) return 0;
  return Math.max(1, Math.round(maxWords / WORDS_PER_MIN));
}
