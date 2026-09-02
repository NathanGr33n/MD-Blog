import { describe, expect, it } from "vitest";
import { markdownToPlainText } from "./plaintext";

describe("markdownToPlainText", () => {
  it("strips heading syntax", () => {
    expect(markdownToPlainText("# Hello World")).toBe("Hello World");
  });

  it("strips emphasis and bold syntax", () => {
    expect(markdownToPlainText("This is *italic* and **bold**.")).toBe(
      "This is italic and bold.",
    );
  });

  it("strips link syntax but keeps the link text", () => {
    expect(markdownToPlainText("See [the docs](https://example.com).")).toBe(
      "See the docs.",
    );
  });

  it("strips inline code and code fences", () => {
    // Note: mdast-util-to-string concatenates block-level nodes with no
    // separator, so adjacent blocks run together with no space/newline.
    expect(
      markdownToPlainText("Use `npm install` or:\n\n```\nnpm ci\n```"),
    ).toBe("Use npm install or:npm ci");
  });

  it("flattens list items into text", () => {
    // Same block-concatenation behavior applies to separate list items.
    expect(markdownToPlainText("- one\n- two\n- three")).toBe("onetwothree");
  });

  it("returns an empty string for empty input", () => {
    expect(markdownToPlainText("")).toBe("");
  });
});
