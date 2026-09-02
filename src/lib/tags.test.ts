import { describe, expect, it } from "vitest";
import { slugifyTag } from "./tags";

describe("slugifyTag", () => {
  it("lowercases the tag", () => {
    expect(slugifyTag("JavaScript")).toBe("javascript");
  });

  it("collapses whitespace into a single hyphen", () => {
    expect(slugifyTag("Hello World")).toBe("hello-world");
  });

  it("collapses runs of non-alphanumeric characters into one hyphen", () => {
    expect(slugifyTag("C++ & Friends")).toBe("c-friends");
  });

  it("strips leading and trailing hyphens", () => {
    expect(slugifyTag("  -Next.js-  ")).toBe("next-js");
  });

  it("trims surrounding whitespace before slugifying", () => {
    expect(slugifyTag("  spaced out  ")).toBe("spaced-out");
  });

  it("returns an empty string for input with no alphanumeric characters", () => {
    expect(slugifyTag("!!!")).toBe("");
  });
});
