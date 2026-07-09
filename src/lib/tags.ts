/**
 * Convert a tag's display name into a URL-safe slug.
 * Lowercased, with runs of non-alphanumeric characters collapsed to a hyphen.
 */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
