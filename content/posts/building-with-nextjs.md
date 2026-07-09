---
title: "Building with Next.js 16"
description: "Notes on the App Router, static generation, and server components."
date: "2026-07-01"
tags: ["nextjs", "react", "guide"]
---

Next.js 16 uses the App Router with React Server Components by default.

## Static generation

Using `generateStaticParams`, every post is prerendered at build time, so the
site can be deployed as static files.

## Server components

Data loading happens on the server, so there is no client-side fetching needed
to render post content.
