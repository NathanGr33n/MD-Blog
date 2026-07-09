import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import type { Root, Heading } from "mdast";

export type TocItem = { depth: number; text: string; id: string };

/**
 * Extract a table of contents from Markdown headings (h2–maxDepth).
 *
 * Slugs are generated with github-slugger — the same algorithm rehype-slug
 * uses — so the anchor links here match the `id`s rendered in the post HTML.
 * Every heading advances the slugger so duplicate-title ids stay in sync.
 */
export function extractToc(markdown: string, maxDepth = 3): TocItem[] {
  const tree = unified().use(remarkParse).parse(markdown) as Root;
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  visit(tree, "heading", (node: Heading) => {
    const text = toString(node);
    const id = slugger.slug(text);
    if (node.depth >= 2 && node.depth <= maxDepth && text.length > 0) {
      items.push({ depth: node.depth, text, id });
    }
  });

  return items;
}
