# MD-Blog

A fast, statically generated Markdown blog built with Next.js (App Router).

**Live demo:** https://nathangr33n.github.io/MD-Blog/

## Features

- **Markdown posts** with YAML frontmatter (`content/posts/*.md`), validated at build time with Zod
- **GitHub Flavored Markdown**: syntax highlighting (Shiki), tables, task lists, and strikethrough
- **Automatic heading anchors** and a generated per-post table of contents
- **Tagging** with a tag index and per-tag pages
- **Client-side search** over a build-time index — no server required
- **Reading-time estimates** on posts and listings
- **SEO**: per-page metadata, canonical URLs, Open Graph, and Twitter cards
- **Feeds & discovery**: generated `sitemap.xml`, `robots.txt`, and an RSS feed at `/feed.xml`
- **Dark mode** that follows the system preference
- **Accessible**: skip-to-content link and visible keyboard focus styles
- **Fully static output** — deployable to any static host

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) and [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) and [Tailwind CSS v4](https://tailwindcss.com/)
- [unified](https://unifiedjs.com/) (remark / rehype) Markdown pipeline with [Shiki](https://shiki.style/) highlighting
- [gray-matter](https://github.com/jonschlinkert/gray-matter) for frontmatter and [Zod](https://zod.dev/) for validation

## Getting started

Requires **Node.js 20+**.

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

## Project structure

```
content/posts/       Markdown post sources
src/app/             App Router pages, layout, and sitemap/robots/RSS routes
src/components/      Reusable UI (search, table of contents, tag list)
src/lib/             Content loading, Markdown pipeline, search, site config
.github/workflows/   CI and GitHub Pages deployment
```

## Scripts

- `npm run dev` — start the development server
- `npm run build` — build the static site into `out/`
- `npm run lint` — run ESLint

## Build & preview

```bash
npm run lint
npm run build              # outputs a static site to ./out
npx serve out              # optional: preview the static build locally
```

## Deployment

`npm run build` produces a static export in `out/` that can be hosted anywhere.

- **Vercel:** import the repo; no configuration required.
- **Netlify:** build command `npm run build`, publish directory `out`.
- **GitHub Pages (automated):** `.github/workflows/deploy-pages.yml` builds with `NEXT_PUBLIC_BASE_PATH=/MD-Blog` and publishes to https://nathangr33n.github.io/MD-Blog/ on every push to `Master`.
- **Any static host / CDN (S3, Nginx, ...):** upload the contents of `out/`.

For subpath hosting, set `NEXT_PUBLIC_BASE_PATH` (URL prefix) and `NEXT_PUBLIC_SITE_URL` (absolute site URL) at build time.

## Continuous integration

`.github/workflows/ci.yml` runs lint and build on every push and pull request to `Master`; `.github/workflows/deploy-pages.yml` deploys to GitHub Pages.
