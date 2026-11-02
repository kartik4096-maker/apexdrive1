import { z } from "zod";
import { CITIES } from "./cities.js";

export const cityEnum = z.enum(CITIES);

export const isoDateTime = z.string().refine((s) => Number.isFinite(new Date(s).getTime()), {
  message: "Invalid date-time",
});

export const searchSchema = z.object({
  city: cityEnum.optional(),
  start: isoDateTime.optional(),
  end: isoDateTime.optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  fuel: z.string().optional(),
  transmission: z.string().optional(),
  maxPricePaise: z.coerce.number().int().positive().optional(),
  savedOnly: z.coerce.boolean().optional(),
  sort: z.enum(["recommended", "price-low", "price-high", "rating"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  clientId: z.string().min(6).max(64).optional(),
});
export type SearchQuery = z.infer<typeof searchSchema>;

export const reviewSchema = z.object({
  name: z.string().trim().min(2).max(40),
  rating: z.number().int().min(1).max(5),
  text: z.string().trim().min(10).max(600),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const indianPhone = z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

export const bookingSchema = z
  .object({
    clientId: z.string().min(6).max(64),
    carId: z.string().min(1),
    city: cityEnum,
    start: isoDateTime,
    end: isoDateTime,
    name: z.string().trim().min(2).max(70),
    phone: indianPhone,
    email: z.string().trim().email().max(100),
    acceptedTerms: z.literal(true),
  })
  .superRefine((val, ctx) => {
    const s = new Date(val.start).getTime();
    const e = new Date(val.end).getTime();
    if (!Number.isFinite(s) || !Number.isFinite(e)) return;
    if (s < Date.now() - 60_000) {
      ctx.addIssue({ code: "custom", path: ["start"], message: "Pick-up time must be in the future." });
    }
    if (e <= s) {
      ctx.addIssue({ code: "custom", path: ["end"], message: "Return time must be after pick-up." });
    }
    const days = Math.ceil((e - s) / 86_400_000);
    if (days > 90) {
      ctx.addIssue({ code: "custom", path: ["end"], message: "Trips are limited to 90 days." });
    }
  });
export type BookingInput = z.infer<typeof bookingSchema>;

export const lookupSchema = z.object({
  phone: indianPhone,
});
export type LookupInput = z.infer<typeof lookupSchema>;

export const lookupDetailSchema = z.object({
  phone: indianPhone,
  reference: z.string().min(4).max(20),
});

export const savedToggleSchema = z.object({
  clientId: z.string().min(6).max(64),
  carId: z.string().min(1),
});