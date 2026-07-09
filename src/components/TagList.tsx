import Link from "next/link";
import { slugifyTag } from "@/lib/tags";

/** Render post tags as links to their tag pages. */
export function TagList({
  tags,
  className,
}: {
  tags: string[];
  className?: string;
}) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ul className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/tags/${slugifyTag(tag)}`}
            className="inline-block rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
