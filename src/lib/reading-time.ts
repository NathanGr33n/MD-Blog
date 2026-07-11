import { markdownToPlainText } from "./plaintext";

const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time in whole minutes (minimum 1) for a Markdown string,
 * based on plain-text word count at ~200 words per minute.
 */
export function readingTime(markdown: string): number {
  const words = markdownToPlainText(markdown)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return Math.max(1, Math.round(words.length / WORDS_PER_MINUTE));
}
