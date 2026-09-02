import { describe, expect, it } from "vitest";
import { readingTime } from "./reading-time";

describe("readingTime", () => {
  it("returns 1 minute for very short content", () => {
    expect(readingTime("A short sentence.")).toBe(1);
  });

  it("returns 1 minute for empty content", () => {
    expect(readingTime("")).toBe(1);
  });

  it("rounds to the nearest minute at 200 words per minute", () => {
    const words = Array.from({ length: 400 }, (_, i) => `word${i}`).join(" ");
    expect(readingTime(words)).toBe(2);
  });

  it("rounds down when under the halfway point to the next minute", () => {
    // 220 words -> 1.1 minutes -> rounds to 1.
    const words = Array.from({ length: 220 }, (_, i) => `word${i}`).join(" ");
    expect(readingTime(words)).toBe(1);
  });

  it("rounds up when past the halfway point to the next minute", () => {
    // 320 words -> 1.6 minutes -> rounds to 2.
    const words = Array.from({ length: 320 }, (_, i) => `word${i}`).join(" ");
    expect(readingTime(words)).toBe(2);
  });
});
