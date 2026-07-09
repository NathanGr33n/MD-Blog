import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

/** Shiki-based syntax highlighting for fenced code blocks. */
const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-dark",
  keepBackground: true,
};

/**
 * Convert a Markdown string into sanitized, syntax-highlighted HTML.
 *
 * Pipeline:
 * - remark-parse:             Markdown text -> mdast (Markdown AST)
 * - remark-gfm:               GitHub Flavored Markdown (tables, strikethrough, tasks)
 * - remark-rehype:            mdast -> hast (HTML AST)
 * - rehype-sanitize:          strip unsafe author HTML first (XSS protection)
 * - rehype-slug:              add stable `id`s to headings (github-slugger)
 * - rehype-autolink-headings: turn each heading into a self-link
 * - rehype-pretty-code:       Shiki syntax highlighting for code blocks
 * - rehype-stringify:         hast -> HTML string
 *
 * Sanitization runs before the slug/anchor/highlight transforms so the trusted
 * markup they add (ids, anchors, Shiki spans) is preserved in the output.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}
