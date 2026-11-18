import { z } from "zod";

export const NOTICE_FIELDS = [
  "noticeType",
  "saleNoticeType",
  "bankName",
  "branchName",
  "noticeDate",
  "auctionDate",
  "auctionTime",
  "inspectionDate",
  "reservePrice",
  "emdAmount",
  "bidIncrementAmount",
  "totalDues",
  "loanReference",
  "borrowerName",
  "borrowerAddress",
  "contactNumber",
  "assetCategory",
  "assetType",
  "propertyAddress",
  "propertyAddressEvidence",
  "locality",
  "city",
  "propertyType",
  "propertyArea",
  "propertyDescription",
  "possessionStatus",
  "guidelineValue",
  "vehicleRegistrationNumber",
  "vehicleMake",
  "vehicleModel",
  "vehicleYear",
  "vehicleEngineNumber",
  "vehicleChassisNumber",
  "vehicleLocation",
  "machineryName",
  "machineryModel",
  "machinerySerialNumber",
  "machineryYear",
  "machineryLocation",
  "machineryDescription",
  "extractionNotes",
];
export const PROPERTY_FIELDS = [
  "doorNumber",
  "flatNumber",
  "plotNumber",
  "surveyNumber",
  "floor",
  "projectName",
  "village",
  "taluk",
  "district",
  "state",
  "pincode",
  "extent",
  "builtUpArea",
  "boundaries",
];
const text = z
  .union([z.string(), z.number()])
  .nullable()
  .optional()
  .transform((value) => (value == null ? "" : String(value)));
export const noticeSchema = z
  .object({
    ...Object.fromEntries(NOTICE_FIELDS.map((key) => [key, text])),
    addressCandidates: z
      .array(z.object({ text, type: text, heading: text }).passthrough())
      .default([]),
    propertyDetails: z
      .object(Object.fromEntries(PROPERTY_FIELDS.map((key) => [key, text])))
      .passthrough()
      .default({}),
    boundingBox: z
      .object({
        ymin: z.number().min(0).max(1000),
        xmin: z.number().min(0).max(1000),
        ymax: z.number().min(0).max(1000),
        xmax: z.number().min(0).max(1000),
      })
      .refine(
        (b) => b.ymin <= b.ymax && b.xmin <= b.xmax,
        "Invalid bounding box",
      )
      .optional(),
    fieldConfidence: z.record(z.string(), z.enum(["HIGH", "LOW"])).default({}),
    additionalDetails: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

export function parseMoney(value) {
  const source = String(value ?? "").trim();
  if (!source) return null;
  const clean = source
    .replace(/^(?:Rs\.?|INR|₹)\s*/i, "")
    .replace(/\s*\/-$/, "")
    .replace(/,/g, "")
    .trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(clean)) return null;
  const number = Number(clean);
  return Number.isFinite(number) && number >= 0 && number <= 1e13
    ? number
    : null;
}
export function parseNoticeDate(value) {
  const match = String(value || "")
    .trim()
    .match(/^(?:(\d{4})-(\d{2})-(\d{2})|(\d{2})[./](\d{2})[./](\d{4}))$/);
  if (!match) return null;
  const [year, month, day] = match[1]
    ? [match[1], match[2], match[3]]
    : [match[6], match[5], match[4]];
  const iso = `${year}-${month}-${day}`;
  const date = new Date(`${iso}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === iso
    ? iso
    : null;
}
export function auctionTimestamp(date, time) {
  const iso = parseNoticeDate(date);
  const match = String(time || "")
    .trim()
    .match(/^(\d{1,2})[:.](\d{2})(?:\s*(AM|PM))?(?:\s*(?:to|-).*|$)/i);
  if (!iso || !match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (minute > 59 || (match[3] ? hour < 1 || hour > 12 : hour > 23))
    return null;
  if (match[3]) hour = (hour % 12) + (match[3].toUpperCase() === "PM" ? 12 : 0);
  return new Date(
    `${iso}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+05:30`,
  );
}
export function reviewWarnings(record) {
  const warnings = [];
  for (const [field, confidence] of Object.entries(
    record.fieldConfidence || {},
  ))
    if (confidence === "LOW")
      warnings.push(`${field}: low extraction confidence`);
  if (
    record.noticeType === "POSSESSION" &&
    (record.auctionDate || record.reservePrice)
  )
    warnings.push(
      "Possession notice includes auction values. Verify the notice classification and supporting sale notice.",
    );
  if (!record.city)
    warnings.push(
      "City is missing; do not infer it from bank or borrower addresses.",
    );
  if (record.additionalDetails?.documentCompleteness?.isComplete === false)
    warnings.push("Source document is marked incomplete.");
  for (const item of record.additionalDetails?.reviewItems || [])
    warnings.push(`${item.field}: ${item.reason || "Manual review requested"}`);
  return warnings;
}
export function publicationErrors(record) {
  const errors = [];
  for (const field of [
    "bankName",
    "city",
    "locality",
    "assetType",
    "assetCategory",
    "propertyAddress",
    "propertyAddressEvidence",
  ])
    if (!String(record[field] || "").trim())
      errors.push(`${field} is required for publication`);
  if (record.noticeType !== "AUCTION")
    errors.push(
      "Only a verified AUCTION notice may be published in the auction catalog. Possession notices stay in the checker registry.",
    );
  if (!["IMMOBILE", "MOVABLE"].includes(record.assetCategory))
    errors.push("Select IMMOBILE or MOVABLE");
  if (!["PHYSICAL", "SYMBOLIC"].includes(record.possessionStatus))
    errors.push("Confirm PHYSICAL or SYMBOLIC possession");
  if (!(parseMoney(record.reservePrice) > 0))
    errors.push("Enter a valid positive reservePrice in rupees");
  if (
    !(parseMoney(record.emdAmount) > 0) ||
    parseMoney(record.emdAmount) > parseMoney(record.reservePrice)
  )
    errors.push("EMD must be positive and no greater than reserve price");
  if (!auctionTimestamp(record.auctionDate, record.auctionTime))
    errors.push("Enter a valid auction date and start time (IST)");
  if (record.bidIncrementAmount && !(parseMoney(record.bidIncrementAmount) > 0))
    errors.push("Invalid bid increment amount");
  return errors;
}
export const ASSET_CATEGORY_MAP = {
  FLAT: "flat",
  APARTMENT: "flat",
  HOUSE: "house",
  BUILDING: "house",
  RESIDENTIAL_PROPERTY: "house",
  PLOT: "land",
  LAND: "land",
  SHOP: "shop",
  COMMERCIAL_PROPERTY: "shop",
  OFFICE: "office",
  WAREHOUSE: "warehouse",
  VEHICLE: "vehicle",
  MACHINERY: "machinery",
  PLANT_AND_MACHINERY: "machinery",
  EQUIPMENT: "machinery",
  OTHER: "other",
};
