import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

/**
 * Convert a Markdown string into sanitized HTML.
 *
 * Pipeline:
 * - remark-parse:    Markdown text -> mdast (Markdown AST)
 * - remark-gfm:      GitHub Flavored Markdown (tables, strikethrough, task lists)
 * - remark-rehype:   mdast -> hast (HTML AST)
 * - rehype-sanitize: strip unsafe HTML to prevent XSS from post content
 * - rehype-stringify: hast -> HTML string
 *
 * Syntax highlighting, heading anchors, and a table of contents are added in a
 * later step; this base pipeline intentionally stays minimal and safe.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}
