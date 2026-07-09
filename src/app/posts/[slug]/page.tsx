import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { markdownToHtml } from "@/lib/markdown";
import { formatDate } from "@/lib/format";

/** Prerender a page for every published post at build time. */
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

/** Only slugs returned by generateStaticParams are valid; others 404. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const html = await markdownToHtml(post.content);

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        &larr; Back to all posts
      </Link>

      <header className="mt-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        <p className="mt-2 text-sm text-zinc-500">
          <time dateTime={post.date.toISOString()}>
            {formatDate(post.date)}
          </time>
        </p>
      </header>

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
