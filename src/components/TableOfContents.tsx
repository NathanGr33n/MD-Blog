import type { TocItem } from "@/lib/toc";

/**
 * Render a table of contents as in-page anchor links.
 * Hidden when there are fewer than two headings.
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length < 2) {
    return null;
  }

  return (
    <nav
      aria-label="Table of contents"
      className="mb-10 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <p className="mb-2 font-semibold text-zinc-700 dark:text-zinc-200">
        On this page
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className={item.depth === 3 ? "pl-4" : undefined}>
            <a
              href={`#${item.id}`}
              className="text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
