import { describe, expect, it } from "vitest";
import { markdownToHtml } from "./markdown";

describe("markdownToHtml", () => {
  it("renders a paragraph as HTML", async () => {
    const html = await markdownToHtml("Hello world.");
    expect(html).toContain("<p>Hello world.</p>");
  });

  it("adds an id to headings for anchor links", async () => {
    const html = await markdownToHtml("## My Section");
    expect(html).toContain('id="my-section"');
  });

  it("wraps headings in a self-link anchor", async () => {
    const html = await markdownToHtml("## My Section");
    expect(html).toContain('href="#my-section"');
  });

  it("sanitizes raw script tags out of the output", async () => {
    const html = await markdownToHtml('Hello <script>alert("xss")</script>');
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("</script>");
  });

  it("sanitizes inline event handler attributes", async () => {
    const html = await markdownToHtml('<img src="x.png" onerror="alert(1)">');
    expect(html).not.toContain("onerror");
  });

  it("syntax-highlights fenced code blocks", async () => {
    const html = await markdownToHtml(
      "```js\nconst x = 1;\n```",
    );
    expect(html).toContain("<pre");
    // rehype-pretty-code emits per-token spans with Shiki-generated styles.
    expect(html).toContain("<span");
  });

  it("renders GFM tables via remark-gfm", async () => {
    const html = await markdownToHtml(
      "| A | B |\n| - | - |\n| 1 | 2 |",
    );
    expect(html).toContain("<table>");
  });
});
