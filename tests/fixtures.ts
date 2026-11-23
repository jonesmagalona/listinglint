import type { Extraction } from "../src/lib/schemas";

/** A complete, valid listing that should pass every rule. Override fields per test. */
export function validExtraction(overrides: Partial<Extraction> = {}): Extraction {
  return {
    isEquipmentListing: true,
    category: "excavator",
    make: "Komatsu",
    model: "PC210LC-10",
    year: 2018,
    hours: 6200,
    priceAmount: 4_500_000,
    priceCurrency: "PHP",
    priceOnRequest: false,
    country: "Philippines",
    city: "Cebu City",
    condition: "used",
    serial: "DEMO000001",
    buyerSummary: "2018 Komatsu PC210LC-10 excavator with 6,200 hours, located in Cebu City.",
    ambiguities: [],
    ...overrides,
  };
}

export const NOW = new Date("2026-11-23T00:00:00Z");
