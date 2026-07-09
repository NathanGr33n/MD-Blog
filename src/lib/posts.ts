import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

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
