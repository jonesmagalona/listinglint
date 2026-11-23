import listingsData from "../../data/listings.json";
import { normaliseMake, normaliseModel } from "./normalise";

export interface ExistingListing {
  id: string;
  make: string;
  model: string;
  category: string;
  year: number;
  hours: number;
  serial: string;
  country: string;
  priceUsd: number;
}

export const EXISTING_LISTINGS: ExistingListing[] = listingsData.listings;

export interface DuplicateCandidate {
  make: string | null;
  model: string | null;
  year: number | null;
  hours: number | null;
  serial: string | null;
}

export interface DuplicateMatch {
  id: string;
  reason: "serial" | "make_model_year_hours";
}

/** Hours within this fraction are treated as the same machine (sellers often round). */
export const HOURS_TOLERANCE = 0.02;

/**
 * Find existing listings that are probably the same machine.
 * A serial match wins. Otherwise make + model + year must match and hours must be within 2%.
 */
export function findDuplicates(
  candidate: DuplicateCandidate,
  existing: ExistingListing[] = EXISTING_LISTINGS,
): DuplicateMatch[] {
  const matches: DuplicateMatch[] = [];
  const serial = candidate.serial?.trim().toUpperCase() || null;
  const make = normaliseMake(candidate.make)?.name ?? null;
  const model = normaliseModel(candidate.model);

  for (const row of existing) {
    if (serial && row.serial.toUpperCase() === serial) {
      matches.push({ id: row.id, reason: "serial" });
      continue;
    }
    if (
      make &&
      model &&
      candidate.year !== null &&
      candidate.hours !== null &&
      row.make === make &&
      normaliseModel(row.model) === model &&
      row.year === candidate.year
    ) {
      const diff = Math.abs(row.hours - candidate.hours);
      if (diff <= Math.max(row.hours, candidate.hours) * HOURS_TOLERANCE) {
        matches.push({ id: row.id, reason: "make_model_year_hours" });
      }
    }
  }
  return matches;
}
