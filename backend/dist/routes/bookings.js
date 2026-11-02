import { Router } from "express";
import { prisma } from "../db.js";
import { bookingSchema, lookupSchema, lookupDetailSchema, } from "@apexdrive/shared";
import { createBooking, cancelBooking } from "../services/booking.js";
import { publicWriteLimiter, lookupLimiter } from "../rateLimit.js";
import { notFound } from "../errors.js";
export const bookingsRouter = Router();
function bookingDto(b) {
    return {
        reference: b.reference,
        carId: b.carId,
        city: b.cityName,
        start: b.startAt,
        end: b.endAt,
        days: b.days,
        subtotalPaise: b.subtotalPaise,
        gstPaise: b.gstPaise,
        totalPaise: b.totalPaise,
        status: b.status,
        createdAt: b.createdAt,
    };
}
function maskPhone(phone) {
    return phone.slice(0, 2) + "XXXXX" + phone.slice(-2);
}
bookingsRouter.post("/", publicWriteLimiter, async (req, res, next) => {
    try {
        const input = bookingSchema.parse(req.body);
        const created = await createBooking({
            clientId: input.clientId,
            carId: input.carId,
            city: input.city,
            startISO: input.start,
            endISO: input.end,
            name: input.name,
            phone: input.phone,
            email: input.email,
        });
        res.status(201).json({
            data: {
                ...bookingDto(created),
                name: created.name,
                phone: created.phone,
                email: created.email,
            },
        });
    }
    catch (e) {
        next(e);
    }
});
// Lookup by phone: returns masked summaries ONLY (no personal data, no refs).
bookingsRouter.post("/lookup", lookupLimiter, async (req, res, next) => {
    try {
        const { phone } = lookupSchema.parse(req.body);
        const rows = await prisma.booking.findMany({
            where: { phone },
            orderBy: { createdAt: "desc" },
            take: 20,
        });
        res.json({
            data: rows.map((b) => ({
                reference: b.reference,
                carId: b.carId,
                city: b.cityName,
                start: b.startAt,
                end: b.endAt,
                status: b.status,
                totalPaise: b.totalPaise,
                phoneMasked: maskPhone(b.phone),
            })),
            meta: { count: rows.length, note: "Summaries only. Use reference + phone to fetch full details or cancel." },
        });
    }
    catch (e) {
        next(e);
    }
});
// Detail / cancel require BOTH phone + reference (demo-grade "verification").
bookingsRouter.post("/detail", lookupLimiter, async (req, res, next) => {
    try {
        const input = lookupDetailSchema.parse(req.body);
        const b = await prisma.booking.findUnique({ where: { reference: input.reference } });
        if (!b || b.phone !== input.phone)
            throw notFound("Booking not found for this number.");
        res.json({
            data: {
                ...bookingDto(b),
                name: b.name,
                phone: b.phone,
                email: b.email,
            },
        });
    }
    catch (e) {
        next(e);
    }
});
bookingsRouter.post("/cancel", lookupLimiter, async (req, res, next) => {
    try {
        const input = lookupDetailSchema.parse(req.body);
        const updated = await cancelBooking(input.reference, input.phone);
        res.json({ data: bookingDto(updated) });
    }
    catch (e) {
        next(e);
    }
});
bookingsRouter.get("/:reference", async (req, res, next) => {
    // Reference alone only returns a redacted status view — no personal data.
    try {
        const b = await prisma.booking.findUnique({ where: { reference: req.params.reference } });
        if (!b)
            throw notFound("Booking not found");
        res.json({
            data: {
                reference: b.reference,
                carId: b.carId,
                city: b.cityName,
                start: b.startAt,
                end: b.endAt,
                status: b.status,
            },
            note: "Redacted view. Use POST /bookings/detail with phone + reference for full details.",
        });
    }
    catch (e) {
        next(e);
    }
});
