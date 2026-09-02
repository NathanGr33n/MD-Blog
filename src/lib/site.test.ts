import { afterEach, describe, expect, it, vi } from "vitest";

describe("site", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("defaults to http://localhost:3000 when NEXT_PUBLIC_SITE_URL is unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    const { siteConfig } = await import("./site");
    expect(siteConfig.url).toBe("http://localhost:3000");
  });

  it("strips a trailing slash from NEXT_PUBLIC_SITE_URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/");
    const { siteConfig } = await import("./site");
    expect(siteConfig.url).toBe("https://example.com");
  });

  it("builds an absolute URL for a path with a leading slash", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const { absoluteUrl } = await import("./site");
    expect(absoluteUrl("/posts/hello")).toBe(
      "https://example.com/posts/hello",
    );
  });

  it("builds an absolute URL for a path without a leading slash", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const { absoluteUrl } = await import("./site");
    expect(absoluteUrl("posts/hello")).toBe(
      "https://example.com/posts/hello",
    );
  });

  it("defaults to the root path when none is given", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const { absoluteUrl } = await import("./site");
    expect(absoluteUrl()).toBe("https://example.com/");
  });

  it("preserves a base path in NEXT_PUBLIC_SITE_URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/MD-Blog");
    const { absoluteUrl } = await import("./site");
    expect(absoluteUrl("/posts/hello")).toBe(
      "https://example.com/MD-Blog/posts/hello",
    );
  });
});
