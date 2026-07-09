import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">MD-Blog</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          A markdown blog platform built with Next.js.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-zinc-500">No posts yet.</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <article>
                <h2 className="text-xl font-semibold">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="hover:underline"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  <time dateTime={post.date.toISOString()}>
                    {formatDate(post.date)}
                  </time>
                </p>
                {post.description && (
                  <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                    {post.description}
                  </p>
                )}
                {post.tags.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
