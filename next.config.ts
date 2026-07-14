import type { NextConfig } from "next";

// Set to "/MD-Blog" when building for the GitHub Pages project site (done in
// CI). Empty locally and on root hosts (Vercel/Netlify) so URLs stay at root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Emit a fully static site to `out/` so it can be hosted on any static host
  // (Vercel, Netlify, GitHub Pages, S3, Nginx, ...).
  output: "export",
  // Emit directory-style routes (`/posts/x/index.html`) so hosts without
  // rewrite rules (e.g. GitHub Pages) serve clean URLs correctly.
  trailingSlash: true,
  // Serve under a subpath for GitHub Pages project sites; assets inherit it.
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
