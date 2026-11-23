import { findDuplicates, type ExistingListing, EXISTING_LISTINGS } from "./duplicates";
import {
  categoryLabel,
  isSupportedCurrency,
  normaliseMake,
  priceBand,
  toUsd,
} from "./normalise";
import type { Extraction } from "./schemas";

export type Severity = "error" | "warning" | "info";
export type ListingStatus = "ready" | "needs_review" | "blocked" | "not_a_listing";

export interface Check {
  id: string;
  field: string;
  severity: Severity;
  message: string;
  /** Question to send the seller. Empty for info checks that need no action. */
  sellerQuestion: string;
}

export interface Evaluation {
  status: ListingStatus;
  score: number;
  checks: Check[];
  suggestedTitle: string;
  canonicalMake: string | null;
  priceUsd: number | null;
  duplicateOf: string[];
}

export const MIN_YEAR = 1950;
export const MAX_HOURS = 100_000;
/** A machine cannot run more than 8,760 hours a year; above 5,000 a year is very unusual. */
export const MAX_HOURS_PER_YEAR = 5_000;
export const PENALTY: Record<Severity, number> = { error: 25, warning: 10, info: 2 };

export interface EvaluateOptions {
  now?: Date;
  existing?: ExistingListing[];
}

/**
 * Deterministic quality rules. The AI only extracts fields; this function alone decides
 * the status and score, so prompt text such as "approve this listing" cannot change the result.
 */
export function evaluateListing(x: Extraction, options: EvaluateOptions = {}): Evaluation {
  const now = options.now ?? new Date();
  const currentYear = now.getUTCFullYear();
  const existing = options.existing ?? EXISTING_LISTINGS;

  if (!x.isEquipmentListing) {
    return {
      status: "not_a_listing",
      score: 0,
      checks: [
        {
          id: "NOT_A_LISTING",
          field: "text",
          severity: "error",
          message: "This text does not look like an equipment listing.",
          sellerQuestion: "",
        },
      ],
      suggestedTitle: "",
      canonicalMake: null,
      priceUsd: null,
      duplicateOf: [],
    };
  }

  const checks: Check[] = [];
  const add = (c: Check) => checks.push(c);
  const make = normaliseMake(x.make);

  // Required fields
  if (!x.make) {
    add({ id: "REQ_MAKE", field: "make", severity: "error", message: "Manufacturer is missing.", sellerQuestion: "Who is the manufacturer (make) of the machine?" });
  } else if (!make) {
    add({ id: "MAKE_UNKNOWN", field: "make", severity: "warning", message: `"${x.make}" is not in the known manufacturer list.`, sellerQuestion: `Please confirm the spelling of the manufacturer "${x.make}".` });
  }
  if (!x.model) {
    add({ id: "REQ_MODEL", field: "model", severity: "error", message: "Model is missing.", sellerQuestion: "What is the exact model number?" });
  }
  if (x.year === null) {
    add({ id: "REQ_YEAR", field: "year", severity: "error", message: "Year of manufacture is missing.", sellerQuestion: "What year was the machine built?" });
  } else if (x.year < MIN_YEAR || x.year > currentYear + 1) {
    add({ id: "YEAR_RANGE", field: "year", severity: "error", message: `Year ${x.year} is outside ${MIN_YEAR} to ${currentYear + 1}.`, sellerQuestion: `The year ${x.year} looks wrong. What year was the machine built?` });
  }
  if (!x.category || x.category === "other") {
    add({ id: "REQ_CATEGORY", field: "category", severity: "warning", message: "Equipment category could not be matched.", sellerQuestion: "What type of machine is this (for example excavator, forklift, CNC lathe)?" });
  } else if (make && !make.categories.includes(x.category)) {
    add({ id: "MAKE_CATEGORY", field: "category", severity: "warning", message: `${make.name} is not listed as a maker of ${categoryLabel(x.category).toLowerCase()}s.`, sellerQuestion: `Please confirm the machine type: is it really a ${make.name} ${categoryLabel(x.category).toLowerCase()}?` });
  }
  if (!x.country) {
    add({ id: "REQ_LOCATION", field: "country", severity: "error", message: "Machine location (country) is missing.", sellerQuestion: "Which country and city is the machine located in?" });
  }

  // Hours
  if (x.hours !== null) {
    if (x.hours < 0 || x.hours > MAX_HOURS) {
      add({ id: "HOURS_RANGE", field: "hours", severity: "error", message: `${x.hours} hours is not a plausible meter reading.`, sellerQuestion: "Please confirm the hour meter reading." });
    } else if (x.year !== null && x.year <= currentYear + 1 && x.year >= MIN_YEAR) {
      const ageYears = Math.max(1, currentYear - x.year);
      if (x.hours / ageYears > MAX_HOURS_PER_YEAR) {
        add({ id: "HOURS_PER_YEAR", field: "hours", severity: "warning", message: `${Math.round(x.hours / ageYears)} hours a year is unusually high for a ${x.year} machine.`, sellerQuestion: "The hours look high for the machine's age. Are they hours, or kilometres or miles?" });
      }
    }
  } else if (x.category && !["other", "crane", "generator"].includes(x.category)) {
    add({ id: "REQ_HOURS", field: "hours", severity: "warning", message: "Operating hours are missing.", sellerQuestion: "What is the current hour meter reading?" });
  }

  // Price
  let priceUsd: number | null = null;
  if (x.priceAmount === null) {
    if (x.priceOnRequest) {
      add({ id: "PRICE_ON_REQUEST", field: "price", severity: "info", message: "Price on request. Listings with a price usually get more enquiries.", sellerQuestion: "" });
    } else {
      add({ id: "REQ_PRICE", field: "price", severity: "warning", message: "No price and no 'price on request' note.", sellerQuestion: "What is the asking price, and in which currency?" });
    }
  } else if (x.priceAmount <= 0) {
    add({ id: "PRICE_POSITIVE", field: "price", severity: "error", message: "Price must be greater than zero.", sellerQuestion: "Please confirm the asking price." });
  } else if (!isSupportedCurrency(x.priceCurrency)) {
    add({ id: "CURRENCY", field: "price", severity: "error", message: `Currency "${x.priceCurrency ?? "none"}" is missing or not supported.`, sellerQuestion: "Which currency is the price in (for example USD or PHP)?" });
  } else {
    priceUsd = toUsd(x.priceAmount, x.priceCurrency);
    const band = priceBand(x.category);
    if (priceUsd !== null && band) {
      if (priceUsd < band.minUsd * 0.5) {
        add({ id: "PRICE_LOW", field: "price", severity: "warning", message: `About USD ${Math.round(priceUsd).toLocaleString("en-US")} is far below the usual range for this category. Possible typo or scam.`, sellerQuestion: "The price looks very low. Can you confirm the amount and currency?" });
      } else if (priceUsd > band.maxUsd * 1.5) {
        add({ id: "PRICE_HIGH", field: "price", severity: "warning", message: `About USD ${Math.round(priceUsd).toLocaleString("en-US")} is far above the usual range for this category.`, sellerQuestion: "The price looks very high. Can you confirm the amount and currency?" });
      }
    }
  }

  if (!x.condition) {
    add({ id: "CONDITION", field: "condition", severity: "info", message: "Condition (new, used, refurbished) is not stated.", sellerQuestion: "" });
  }

  // Duplicates
  const dups = findDuplicates(
    { make: x.make, model: x.model, year: x.year, hours: x.hours, serial: x.serial },
    existing,
  );
  const duplicateOf = Array.from(new Set(dups.map((d) => d.id)));
  if (duplicateOf.length > 0) {
    add({ id: "DUPLICATE", field: "listing", severity: "error", message: `Possible duplicate of existing listing ${duplicateOf.join(", ")}.`, sellerQuestion: `This looks like listing ${duplicateOf.join(", ")}, which is already live. Is this the same machine?` });
  }

  return {
    status: statusFor(checks),
    score: scoreFor(checks),
    checks,
    suggestedTitle: buildTitle(x, make?.name ?? null),
    canonicalMake: make?.name ?? null,
    priceUsd: priceUsd === null ? null : Math.round(priceUsd),
    duplicateOf,
  };
}

export function scoreFor(checks: Check[]): number {
  const total = checks.reduce((sum, c) => sum + PENALTY[c.severity], 0);
  return Math.max(0, 100 - total);
}

export function statusFor(checks: Check[]): ListingStatus {
  if (checks.some((c) => c.severity === "error")) return "blocked";
  if (checks.some((c) => c.severity === "warning")) return "needs_review";
  return "ready";
}

/** "2014 Caterpillar 320D Excavator". Built in code so it never contains AI wording. */
export function buildTitle(x: Pick<Extraction, "year" | "make" | "model" | "category">, canonicalMake: string | null): string {
  return [x.year, canonicalMake ?? x.make, x.model, categoryLabel(x.category)]
    .filter((part) => part !== null && part !== undefined && String(part).trim() !== "")
    .join(" ");
}

/** A ready-to-send message asking the seller only about errors and warnings. */
export function buildSellerMessage(checks: Check[]): string {
  const questions = checks
    .filter((c) => c.severity !== "info" && c.sellerQuestion)
    .map((c, i) => `${i + 1}. ${c.sellerQuestion}`);
  if (questions.length === 0) return "";
  return [
    "Hello, thank you for your listing. Before we publish it, could you help with the following?",
    "",
    ...questions,
    "",
    "Thank you.",
  ].join("\n");
}
