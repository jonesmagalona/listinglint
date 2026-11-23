import { z } from "zod";

export const CATEGORIES = [
  "excavator",
  "wheel_loader",
  "dozer",
  "skid_steer",
  "forklift",
  "tractor",
  "crane",
  "generator",
  "cnc_machining_center",
  "cnc_lathe",
  "other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CONDITIONS = ["new", "used", "refurbished", "for_parts"] as const;

/** What the browser sends to POST /api/check. */
export const CheckRequestSchema = z.object({
  text: z
    .string({ required_error: "Listing text is required." })
    .trim()
    .min(20, "Paste at least 20 characters of listing text.")
    .max(4000, "Listing text must be 4,000 characters or fewer."),
});

export type CheckRequest = z.infer<typeof CheckRequestSchema>;

/**
 * What the AI must return through the record_listing tool.
 * Every field is nullable: the AI must use null when the text does not say.
 */
export const ExtractionSchema = z.object({
  isEquipmentListing: z.boolean(),
  category: z.enum(CATEGORIES).nullable(),
  make: z.string().trim().max(80).nullable(),
  model: z.string().trim().max(80).nullable(),
  year: z.number().int().nullable(),
  hours: z.number().nullable(),
  priceAmount: z.number().nullable(),
  priceCurrency: z.string().trim().max(8).nullable(),
  priceOnRequest: z.boolean(),
  country: z.string().trim().max(80).nullable(),
  city: z.string().trim().max(80).nullable(),
  condition: z.enum(CONDITIONS).nullable(),
  serial: z.string().trim().max(80).nullable(),
  buyerSummary: z.string().max(2000),
  ambiguities: z
    .array(z.object({ field: z.string().max(40), note: z.string().max(300) }))
    .max(10),
});

export type Extraction = z.infer<typeof ExtractionSchema>;

/** JSON Schema given to the model as the tool's parameters. Keep in sync with ExtractionSchema. */
export const extractionJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "isEquipmentListing",
    "category",
    "make",
    "model",
    "year",
    "hours",
    "priceAmount",
    "priceCurrency",
    "priceOnRequest",
    "country",
    "city",
    "condition",
    "serial",
    "buyerSummary",
    "ambiguities",
  ],
  properties: {
    isEquipmentListing: {
      type: "boolean",
      description: "true only if the text is an offer to sell a machine or piece of equipment",
    },
    category: { type: ["string", "null"], enum: [...CATEGORIES, null] },
    make: { type: ["string", "null"], description: "Manufacturer exactly as written, e.g. 'CAT'" },
    model: { type: ["string", "null"] },
    year: { type: ["integer", "null"], description: "Year of manufacture" },
    hours: { type: ["number", "null"], description: "Operating hours as a plain number, e.g. '9.8k hrs' -> 9800" },
    priceAmount: { type: ["number", "null"], description: "Asking price as a plain number, no symbols" },
    priceCurrency: { type: ["string", "null"], description: "ISO 4217 code, e.g. USD, PHP, EUR. '₱' or 'pesos' -> PHP" },
    priceOnRequest: { type: "boolean", description: "true if the seller says 'call for price', 'POA', 'PM for price' or similar" },
    country: { type: ["string", "null"] },
    city: { type: ["string", "null"] },
    condition: { type: ["string", "null"], enum: [...CONDITIONS, null] },
    serial: { type: ["string", "null"] },
    buyerSummary: {
      type: "string",
      description: "One or two plain sentences, in English, describing the machine using only facts in the text. No markdown.",
    },
    ambiguities: {
      type: "array",
      description: "Fields where the text was unclear, e.g. hours vs km",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["field", "note"],
        properties: { field: { type: "string" }, note: { type: "string" } },
      },
    },
  },
} as const;
