# MD-Blog
A fast, statically generated Markdown blog built with Next.js (App Router).
## Features
- Markdown posts with YAML frontmatter (`content/posts/*.md`)
- Syntax highlighting (Shiki), GFM tables, auto heading anchors, and table of contents
- Tagging with per-tag pages
- Client-side search over a build-time index
- Fully static output — deployable to any static host
## Getting started
```bash
npm install
npm run dev      # start the dev server at http://localhost:3000
```
## Writing posts
Add a Markdown file to `content/posts/`. Each file needs frontmatter:
```md
---
title: My Post
description: A short summary.
date: 2025-01-01
tags: [example]
draft: false
---

Post body in Markdown…
```
Posts with `draft: true` are excluded from the build.
## Build
```bash
npm run lint
npm run build    # outputs a static site to ./out
```
## Deployment
`npm run build` produces a static export in `out/` that can be hosted anywhere.
- **Vercel:** import the repo; no configuration required.
- **Netlify:** build command `npm run build`, publish directory `out`.
- **GitHub Pages:** serve the `out/` directory. Project sites (served from `/<repo>/`) also require setting `basePath`/`assetPrefix` in `next.config.ts` and adding a `.nojekyll` file so the `_next/` assets are served.
- **Any static host / CDN (S3, Nginx, ...):** upload the contents of `out/`.
Continuous integration (`.github/workflows/ci.yml`) runs lint and build on every push and pull request to `Master`.
