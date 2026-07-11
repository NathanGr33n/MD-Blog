import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a fully static site to `out/` so it can be hosted on any static host
  // (Vercel, Netlify, GitHub Pages, S3, Nginx, ...).
  output: "export",
  // Emit directory-style routes (`/posts/x/index.html`) so hosts without
  // rewrite rules (e.g. GitHub Pages) serve clean URLs correctly.
  trailingSlash: true,
};

export default nextConfig;
