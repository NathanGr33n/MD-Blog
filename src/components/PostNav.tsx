import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

/** Chronological previous/next navigation shown at the end of a post. */
export function PostNav({
  previous,
  next,
}: {
  previous: PostMeta | null;
  next: PostMeta | null;
}) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label="Post navigation"
      className="mt-12 grid grid-cols-1 gap-6 border-t border-zinc-200 pt-6 sm:grid-cols-2 dark:border-zinc-800"
    >
      <div>
        {previous && (
          <Link
            href={`/posts/${previous.slug}`}
            className="group block text-sm text-zinc-500 dark:text-zinc-400"
          >
            <span aria-hidden="true">&larr; </span>
            <span>Previous</span>
            <span className="mt-1 block font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
              {previous.title}
            </span>
          </Link>
        )}
      </div>
      <div className="sm:text-right">
        {next && (
          <Link
            href={`/posts/${next.slug}`}
            className="group block text-sm text-zinc-500 dark:text-zinc-400"
          >
            <span>Next</span>
            <span aria-hidden="true"> &rarr;</span>
            <span className="mt-1 block font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
