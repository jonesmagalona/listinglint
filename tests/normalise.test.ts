import { describe, expect, it } from "vitest";
import { isSupportedCurrency, normaliseMake, normaliseModel, sanitiseText, toUsd } from "../src/lib/normalise";
import { findDuplicates, type ExistingListing } from "../src/lib/duplicates";

describe("normaliseMake", () => {
  it("maps aliases and misspellings to the canonical make, ignoring case and spacing", () => {
    expect(normaliseMake("CAT")?.name).toBe("Caterpillar");
    expect(normaliseMake("  catepillar ")?.name).toBe("Caterpillar");
    expect(normaliseMake("John-Deere")?.name).toBe("John Deere");
  });

  it("returns null for unknown or empty makes", () => {
    expect(normaliseMake("Acme Diggers")).toBeNull();
    expect(normaliseMake("")).toBeNull();
    expect(normaliseMake(null)).toBeNull();
  });
});

describe("normaliseModel", () => {
  it("removes spaces, dashes and case", () => {
    expect(normaliseModel("320 d")).toBe("320D");
    expect(normaliseModel("PC200-8")).toBe("PC2008");
    expect(normaliseModel("  ")).toBeNull();
  });
});

describe("currency", () => {
  it("converts supported currencies with the demo rates", () => {
    expect(toUsd(100, "USD")).toBe(100);
    expect(toUsd(1_000_000, "php")).toBeCloseTo(17_000);
    expect(toUsd(100, "XYZ")).toBeNull();
    expect(isSupportedCurrency("EUR")).toBe(true);
    expect(isSupportedCurrency(null)).toBe(false);
  });
});

describe("sanitiseText", () => {
  it("strips markdown, links and control characters", () => {
    expect(sanitiseText("**Great** [deal](http://x.y) # now\u0007!")).toBe("Great deal now !");
  });

  it("caps length with an ellipsis", () => {
    const out = sanitiseText("a".repeat(500), 50);
    expect(out).toHaveLength(50);
    expect(out.endsWith("…")).toBe(true);
  });
});

describe("findDuplicates", () => {
  const existing: ExistingListing[] = [
    { id: "L-1", make: "Caterpillar", model: "320D", category: "excavator", year: 2014, hours: 9850, serial: "DEMO552901", country: "PH", priceUsd: 1 },
  ];

  it("matches on serial number regardless of other fields", () => {
    const m = findDuplicates({ make: null, model: null, year: null, hours: null, serial: "demo552901" }, existing);
    expect(m).toEqual([{ id: "L-1", reason: "serial" }]);
  });

  it("matches make, model, year with hours within 2%", () => {
    expect(findDuplicates({ make: "cat", model: "320-D", year: 2014, hours: 9700, serial: null }, existing)).toHaveLength(1);
  });

  it("does not match when hours differ by more than 2% or year differs", () => {
    expect(findDuplicates({ make: "cat", model: "320D", year: 2014, hours: 8000, serial: null }, existing)).toHaveLength(0);
    expect(findDuplicates({ make: "cat", model: "320D", year: 2015, hours: 9850, serial: null }, existing)).toHaveLength(0);
  });
});
