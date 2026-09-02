import { describe, expect, it } from "vitest";
import { extractToc } from "./toc";

describe("extractToc", () => {
  it("excludes h1 headings", () => {
    const items = extractToc("# Title\n\n## Section");
    expect(items).toEqual([{ depth: 2, text: "Section", id: "section" }]);
  });

  it("includes h2 and h3 headings by default", () => {
    const items = extractToc("## One\n\n### Two");
    expect(items).toEqual([
      { depth: 2, text: "One", id: "one" },
      { depth: 3, text: "Two", id: "two" },
    ]);
  });

  it("respects a custom maxDepth", () => {
    const items = extractToc("## One\n\n### Two\n\n#### Three", 2);
    expect(items).toEqual([{ depth: 2, text: "One", id: "one" }]);
  });

  it("disambiguates duplicate heading text with incrementing slugs", () => {
    const items = extractToc("## Overview\n\n## Overview");
    expect(items).toEqual([
      { depth: 2, text: "Overview", id: "overview" },
      { depth: 2, text: "Overview", id: "overview-1" },
    ]);
  });

  it("returns an empty array when there are no headings", () => {
    expect(extractToc("Just a paragraph.")).toEqual([]);
  });
});
