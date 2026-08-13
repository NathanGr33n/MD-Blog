import Link from "next/link";
import type { Metadata } from "next";
import {
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/posts";
import { markdownToHtml } from "@/lib/markdown";
import { extractToc } from "@/lib/toc";
import { formatDate } from "@/lib/format";
import { TableOfContents } from "@/components/TableOfContents";
import { TagList } from "@/components/TagList";
import { RelatedPosts } from "@/components/RelatedPosts";
import { PostNav } from "@/components/PostNav";

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
  const url = `/posts/${slug}/`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date.toISOString(),
      tags: post.tags,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
    },
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
  const toc = extractToc(post.content);
  const { previous, next } = getAdjacentPosts(slug);
  const related = getRelatedPosts(slug);

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
          <span aria-hidden="true"> · </span>
          <span>{post.readingMinutes} min read</span>
        </p>
        <TagList tags={post.tags} className="mt-3" />
      </header>

      <TableOfContents items={toc} />

      <div
        className="prose max-w-none prose-zinc dark:prose-invert post-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <RelatedPosts posts={related} />
      <PostNav previous={previous} next={next} />
    </article>
  );
}
