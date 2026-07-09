import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { slugifyTag } from "./tags";

/** Absolute path to the directory that holds Markdown post files. */
const POSTS_DIRECTORY = path.join(process.cwd(), "content", "posts");
const POST_EXTENSION = ".md";

/** Schema for a post's YAML frontmatter. Invalid frontmatter fails the build. */
const FrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export type PostMeta = z.infer<typeof FrontmatterSchema> & { slug: string };
export type Post = PostMeta & { content: string };

function getPostFilePath(slug: string): string {
  return path.join(POSTS_DIRECTORY, `${slug}${POST_EXTENSION}`);
}

/** Return every post slug (file name without the `.md` extension). */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    return [];
  }
  return fs
    .readdirSync(POSTS_DIRECTORY)
    .filter((file) => file.endsWith(POST_EXTENSION))
    .map((file) => file.slice(0, -POST_EXTENSION.length));
}

/**
 * Read and parse a single post by slug.
 * Throws if the file is missing or the frontmatter is invalid.
 */
export function getPostBySlug(slug: string): Post {
  const raw = fs.readFileSync(getPostFilePath(slug), "utf8");
  const { data, content } = matter(raw);

  const parsed = FrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in "${slug}${POST_EXTENSION}": ${parsed.error.message}`,
    );
  }

  return { slug, content, ...parsed.data };
}

/**
 * Return metadata for all published posts, sorted newest first.
 * Draft posts (`draft: true`) are excluded.
 */
export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((post) => !post.draft)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      tags: post.tags,
      draft: post.draft,
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export type TagSummary = { tag: string; slug: string; count: number };

/**
 * Aggregate tags across all published posts.
 * Returns each tag's display name, URL slug, and post count, sorted by count
 * (descending) then name.
 */
export function getAllTags(): TagSummary[] {
  const bySlug = new Map<string, { tag: string; count: number }>();

  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      const slug = slugifyTag(tag);
      const existing = bySlug.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        bySlug.set(slug, { tag, count: 1 });
      }
    }
  }

  return [...bySlug.entries()]
    .map(([slug, { tag, count }]) => ({ tag, slug, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Return published posts that have the given tag slug, newest first. */
export function getPostsByTag(tagSlug: string): PostMeta[] {
  return getAllPosts().filter((post) =>
    post.tags.some((tag) => slugifyTag(tag) === tagSlug),
  );
}
