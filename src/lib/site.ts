const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Site-wide configuration used for metadata, sitemap, and the RSS feed. */
export const siteConfig = {
  name: "MD-Blog",
  description: "A markdown blog platform built with Next.js.",
  /**
   * Base URL without a trailing slash. Set `NEXT_PUBLIC_SITE_URL` at build
   * time so metadata, sitemap, and RSS emit correct absolute URLs.
   */
  url: rawUrl.replace(/\/+$/, ""),
};

/** Build an absolute URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, `${siteConfig.url}/`).toString();
}
