import { ImageResponse } from "next/og";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export const alt = "Post cover image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Prerender an Open Graph image for every published post at build time.
 * Required for static export: this file is a specialized Route Handler and
 * does not inherit `generateStaticParams` from the sibling `page.tsx`.
 */
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

/** Only slugs returned by generateStaticParams are valid; others 404. */
export const dynamicParams = false;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#09090b",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, color: "#a1a1aa" }}>
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {post.title}
        </div>
        {post.description ? (
          <div style={{ display: "flex", fontSize: 28, color: "#d4d4d8" }}>
            {post.description}
          </div>
        ) : (
          <div />
        )}
      </div>
    ),
    { ...size },
  );
}
