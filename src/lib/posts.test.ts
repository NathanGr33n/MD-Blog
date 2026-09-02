import { beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";

vi.mock("node:fs", () => ({
  default: {
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
  },
}));

const mockedFs = vi.mocked(fs);

/** In-memory fixture: maps a `<slug>.md` filename to its raw file contents. */
function setPostFiles(files: Record<string, string>) {
  mockedFs.existsSync.mockReturnValue(true);
  mockedFs.readdirSync.mockReturnValue(
    Object.keys(files) as unknown as ReturnType<typeof fs.readdirSync>,
  );
  mockedFs.readFileSync.mockImplementation(((filePath: string) => {
    const filename = filePath.split("/").pop() ?? "";
    if (filename in files) {
      return files[filename];
    }
    throw new Error(`Unexpected file read: ${filePath}`);
  }) as typeof fs.readFileSync);
}

function post(frontmatter: string, body = "Body text."): string {
  return `---\n${frontmatter}\n---\n${body}\n`;
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("getPostSlugs", () => {
  it("returns an empty array when the posts directory doesn't exist", async () => {
    mockedFs.existsSync.mockReturnValue(false);
    const { getPostSlugs } = await import("./posts");
    expect(getPostSlugs()).toEqual([]);
  });

  it("returns slugs for .md files only, without the extension", async () => {
    setPostFiles({
      "hello-world.md": post("title: Hello\ndate: 2025-01-01"),
      "notes.txt": "ignored",
    });
    const { getPostSlugs } = await import("./posts");
    expect(getPostSlugs()).toEqual(["hello-world"]);
  });
});

describe("getPostBySlug", () => {
  it("parses valid frontmatter and computes reading time", async () => {
    setPostFiles({
      "hello.md": post(
        "title: Hello\ndescription: Intro\ndate: 2025-01-01\ntags: [a, b]",
        "Just a short body.",
      ),
    });
    const { getPostBySlug } = await import("./posts");
    const result = getPostBySlug("hello");
    expect(result.title).toBe("Hello");
    expect(result.description).toBe("Intro");
    expect(result.tags).toEqual(["a", "b"]);
    expect(result.draft).toBe(false);
    expect(result.readingMinutes).toBeGreaterThanOrEqual(1);
    expect(result.content.trim()).toBe("Just a short body.");
  });

  it("throws for missing required frontmatter fields", async () => {
    setPostFiles({
      "bad.md": post("description: No title or date"),
    });
    const { getPostBySlug } = await import("./posts");
    expect(() => getPostBySlug("bad")).toThrow(/Invalid frontmatter/);
  });
});

describe("getAllPosts", () => {
  it("excludes drafts and sorts newest first", async () => {
    setPostFiles({
      "old.md": post("title: Old\ndate: 2025-01-01"),
      "new.md": post("title: New\ndate: 2025-06-01"),
      "hidden.md": post("title: Hidden\ndate: 2025-12-01\ndraft: true"),
    });
    const { getAllPosts } = await import("./posts");
    const slugs = getAllPosts().map((p) => p.slug);
    expect(slugs).toEqual(["new", "old"]);
  });

  it("omits the raw content field from post metadata", async () => {
    setPostFiles({
      "post.md": post("title: Post\ndate: 2025-01-01", "Secret body text."),
    });
    const { getAllPosts } = await import("./posts");
    const [meta] = getAllPosts();
    expect(meta).not.toHaveProperty("content");
  });
});

describe("getAllTags", () => {
  it("aggregates tag counts and sorts by count then name", async () => {
    setPostFiles({
      "a.md": post("title: A\ndate: 2025-01-01\ntags: [react, css]"),
      "b.md": post("title: B\ndate: 2025-01-02\ntags: [react]"),
      "c.md": post("title: C\ndate: 2025-01-03\ntags: [css]"),
    });
    const { getAllTags } = await import("./posts");
    expect(getAllTags()).toEqual([
      { tag: "css", slug: "css", count: 2 },
      { tag: "react", slug: "react", count: 2 },
    ]);
  });

  it("excludes tags that only appear on draft posts", async () => {
    setPostFiles({
      "draft.md": post(
        "title: Draft\ndate: 2025-01-01\ntags: [secret]\ndraft: true",
      ),
    });
    const { getAllTags } = await import("./posts");
    expect(getAllTags()).toEqual([]);
  });
});

describe("getPostsByTag", () => {
  it("returns only posts matching the given tag slug", async () => {
    setPostFiles({
      "a.md": post("title: A\ndate: 2025-01-01\ntags: [React]"),
      "b.md": post("title: B\ndate: 2025-01-02\ntags: [Vue]"),
    });
    const { getPostsByTag } = await import("./posts");
    expect(getPostsByTag("react").map((p) => p.slug)).toEqual(["a"]);
  });
});

describe("getSearchDocuments", () => {
  it("excludes drafts and includes plain-text body content", async () => {
    setPostFiles({
      "visible.md": post(
        "title: Visible\ndescription: Desc\ndate: 2025-01-01",
        "# Heading\n\nSome **bold** body text.",
      ),
      "hidden.md": post(
        "title: Hidden\ndate: 2025-01-02\ndraft: true",
        "Secret.",
      ),
    });
    const { getSearchDocuments } = await import("./posts");
    const docs = getSearchDocuments();
    expect(docs.map((d) => d.slug)).toEqual(["visible"]);
    expect(docs[0].text).toContain("bold body text");
  });
});
