import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/format";

/** A short list of other posts related to the current one by shared tags. */
export function RelatedPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-posts-heading" className="mt-12">
      <h2 id="related-posts-heading" className="text-lg font-semibold">
        Related posts
      </h2>
      <ul className="mt-4 space-y-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${post.slug}`}
              className="font-medium hover:underline"
            >
              {post.title}
            </Link>
            <p className="text-sm text-zinc-500">
              <time dateTime={post.date.toISOString()}>
                {formatDate(post.date)}
              </time>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
