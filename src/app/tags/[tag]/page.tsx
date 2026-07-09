import Link from "next/link";
import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { formatDate } from "@/lib/format";

/** Prerender a page for every tag at build time. */
export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.slug }));
}

/** Only known tag slugs are valid; others 404. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const info = getAllTags().find((t) => t.slug === tag);
  const label = info?.tag ?? tag;
  return {
    title: `Posts tagged “${label}”`,
    description: `All posts tagged “${label}”.`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const info = getAllTags().find((t) => t.slug === tag);
  const label = info?.tag ?? tag;
  const posts = getPostsByTag(tag);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/tags" className="text-sm text-blue-600 hover:underline">
        &larr; All tags
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">#{label}</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {posts.length} {posts.length === 1 ? "post" : "posts"}
      </p>

      <ul className="mt-8 space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <h2 className="text-xl font-semibold">
              <Link href={`/posts/${post.slug}`} className="hover:underline">
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
          </li>
        ))}
      </ul>
    </div>
  );
}
