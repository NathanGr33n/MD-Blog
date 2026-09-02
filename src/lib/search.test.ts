import { describe, expect, it } from "vitest";
import { searchDocuments, type SearchDocument } from "./search";

const docs: SearchDocument[] = [
  {
    slug: "react-hooks",
    title: "Understanding React Hooks",
    description: "A deep dive into hooks.",
    tags: ["react", "javascript"],
    text: "Hooks let you use state in function components.",
  },
  {
    slug: "python-basics",
    title: "Python Basics",
    description: "Getting started with Python.",
    tags: ["python"],
    text: "Variables, loops, and functions in Python.",
  },
  {
    slug: "css-grid",
    title: "Mastering Layout",
    description: "Building layouts with CSS Grid.",
    tags: ["css", "grid"],
    text: "React components can be styled with CSS Grid too.",
  },
];

describe("searchDocuments", () => {
  it("returns an empty array for an empty query", () => {
    expect(searchDocuments(docs, "")).toEqual([]);
    expect(searchDocuments(docs, "   ")).toEqual([]);
  });

  it("returns an empty array when no document matches", () => {
    expect(searchDocuments(docs, "rust")).toEqual([]);
  });

  it("matches case-insensitively", () => {
    const results = searchDocuments(docs, "REACT");
    expect(results.map((d) => d.slug)).toEqual(["react-hooks", "css-grid"]);
  });

  it("requires every term to match (AND semantics)", () => {
    const results = searchDocuments(docs, "python loops");
    expect(results.map((d) => d.slug)).toEqual(["python-basics"]);
  });

  it("excludes documents missing any query term", () => {
    const results = searchDocuments(docs, "python javascript");
    expect(results).toEqual([]);
  });

  it("ranks title matches above tag matches, and tag matches above body matches", () => {
    // "react" appears in react-hooks' title and tags, and only in css-grid's body.
    const results = searchDocuments(docs, "react");
    expect(results.map((d) => d.slug)).toEqual(["react-hooks", "css-grid"]);
  });

  it("matches against tags even when absent from title and body", () => {
    const results = searchDocuments(docs, "grid");
    expect(results.map((d) => d.slug)).toEqual(["css-grid"]);
  });
});
