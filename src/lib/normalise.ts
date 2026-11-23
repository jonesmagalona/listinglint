import makesData from "../../data/makes.json";
import priceData from "../../data/price-guides.json";
import type { Category } from "./schemas";

export interface MakeInfo {
  name: string;
  aliases: string[];
  categories: string[];
}

const MAKES: MakeInfo[] = makesData.makes;

function squash(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Map a make as written by a seller ("CAT", "Catepillar") to its canonical record, or null if unknown. */
export function normaliseMake(raw: string | null | undefined): MakeInfo | null {
  if (!raw) return null;
  const key = squash(raw);
  if (!key) return null;
  return MAKES.find((m) => m.aliases.some((a) => squash(a) === key)) ?? null;
}

/** Model numbers are compared without spaces, dashes or case: "320 D" and "320-d" both become "320D". */
export function normaliseModel(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9.]/g, "");
  return cleaned.length > 0 ? cleaned : null;
}

/** Convert an amount to USD using the fixed demo rates. Returns null for unsupported currencies. */
export function toUsd(amount: number, currency: string | null | undefined): number | null {
  if (!currency) return null;
  const rates: Record<string, number> = priceData.fxToUsd;
  const rate = rates[currency.toUpperCase()];
  return rate === undefined ? null : amount * rate;
}

export function isSupportedCurrency(currency: string | null | undefined): boolean {
  if (!currency) return false;
  return Object.prototype.hasOwnProperty.call(priceData.fxToUsd, currency.toUpperCase());
}

export function priceBand(category: Category | null): { minUsd: number; maxUsd: number } | null {
  if (!category || category === "other") return null;
  const bands: Record<string, { minUsd: number; maxUsd: number }> = priceData.bands;
  return bands[category] ?? null;
}

const CATEGORY_LABELS: Record<Category, string> = {
  excavator: "Excavator",
  wheel_loader: "Wheel Loader",
  dozer: "Dozer",
  skid_steer: "Skid Steer Loader",
  forklift: "Forklift",
  tractor: "Tractor",
  crane: "Crane",
  generator: "Generator",
  cnc_machining_center: "CNC Machining Center",
  cnc_lathe: "CNC Lathe",
  other: "",
};

export function categoryLabel(category: Category | null): string {
  return category ? CATEGORY_LABELS[category] : "";
}

/**
 * Remove markdown and control characters from AI text and cap its length,
 * so the UI always shows plain text whatever the model returns.
 */
export function sanitiseText(raw: string, maxLength = 400): string {
  const plain = raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>~|]/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength - 1).trimEnd() + "…";
}
