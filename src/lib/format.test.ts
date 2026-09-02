import { describe, expect, it } from "vitest";
import { formatDate } from "./format";

describe("formatDate", () => {
  it("formats a date as 'Month D, YYYY'", () => {
    expect(formatDate(new Date("2025-01-01T00:00:00.000Z"))).toBe(
      "January 1, 2025",
    );
  });

  it("uses UTC so it is stable regardless of local timezone", () => {
    // 23:30 UTC on Dec 31 would roll over to Jan 1 in timezones ahead of UTC
    // if the function used local time instead of a fixed UTC timezone.
    expect(formatDate(new Date("2025-12-31T23:30:00.000Z"))).toBe(
      "December 31, 2025",
    );
  });
});
