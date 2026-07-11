import { unified } from "unified";
import remarkParse from "remark-parse";
import { toString } from "mdast-util-to-string";
import type { Root } from "mdast";

/**
 * Convert Markdown to plain text for search indexing.
 *
 * Strips all Markdown syntax (headings, code fences, links, etc.) and returns
 * the concatenated text content, so searches match on prose rather than markup.
 */
export function markdownToPlainText(markdown: string): string {
  const tree = unified().use(remarkParse).parse(markdown) as Root;
  return toString(tree);
}
