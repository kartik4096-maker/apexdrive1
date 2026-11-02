import { Router } from "express";
import { prisma } from "../db.js";
import { searchSchema, } from "@apexdrive/shared";
import { carIdsAvailableInWindow as availabilityByIds } from "../services/availability.js";
import { badRequest } from "../errors.js";
export const carsRouter = Router();
function toDto(car, reviewAgg) {
    return {
        id: car.id,
        name: car.name,
        brand: car.brand,
        type: car.type,
        fuel: car.fuel,
        transmission: car.transmission,
        seats: car.seats,
        bags: car.bags,
        dailyPricePaise: car.dailyPricePaise,
        mileage: car.mileage,
        engine: car.engine,
        description: car.description,
        badge: car.badge,
        badgeIcon: car.badgeIcon,
        badgeTag: car.badgeTag,
        image: car.image,
        fallback: car.fallback,
        features: car.features,
        cities: car.cities.map((cc) => cc.city.name),
        rating: reviewAgg ? Number(reviewAgg.avg.toFixed(1)) : 0,
        reviewCount: reviewAgg ? reviewAgg.count : 0,
    };
}
carsRouter.get("/", async (req, res, next) => {
    try {
        const q = searchSchema.parse(req.query);
        const where = {};
        if (q.category)
            where.type = q.category;
        if (q.brand)
            where.brand = q.brand;
        if (q.fuel)
            where.fuel = q.fuel;
        if (q.transmission)
            where.transmission = q.transmission;
        if (q.maxPricePaise)
            where.dailyPricePaise = { lte: q.maxPricePaise };
        if (q.city)
            where.cities = { some: { city: { name: q.city } } };
        if (q.savedOnly) {
            if (!q.clientId)
                throw badRequest("clientId is required for savedOnly filter.");
            where.savedBy = { some: { clientId: q.clientId } };
        }
        const cars = await prisma.car.findMany({
            where,
            include: {
                cities: { include: { city: true } },
                reviews: { select: { rating: true } },
            },
        });
        // Availability filter: if dates given, drop cars with overlapping bookings.
        let visible = cars;
        if (q.city && q.start && q.end) {
            const start = new Date(q.start);
            const end = new Date(q.end);
            if (Number.isFinite(start.getTime()) && Number.isFinite(end.getTime()) && end > start) {
                const ids = cars.map((c) => c.id);
                const available = await availabilityByIds(ids, q.city, start, end);
                visible = cars.filter((c) => available.has(c.id));
            }
        }
        const withRatings = visible.map((c) => {
            const count = c.reviews.length;
            const avg = count === 0 ? 0 : c.reviews.reduce((s, r) => s + r.rating, 0) / count;
            return { ...c, __avg: avg, __count: count };
        });
        // Sorting
        const sort = q.sort ?? "recommended";
        if (sort === "price-low")
            withRatings.sort((a, b) => a.dailyPricePaise - b.dailyPricePaise);
        else if (sort === "price-high")
            withRatings.sort((a, b) => b.dailyPricePaise - a.dailyPricePaise);
        else if (sort === "rating")
            withRatings.sort((a, b) => b.__avg - a.__avg);
        const total = withRatings.length;
        const limit = q.limit ?? 6;
        const offset = q.offset ?? 0;
        const page = withRatings.slice(offset, offset + limit);
        res.json({
            data: page.map((c) => toDto(c, { avg: c.__avg, count: c.__count })),
            meta: { total, limit, offset },
        });
    }
    catch (e) {
        next(e);
    }
});
carsRouter.get("/:id", async (req, res, next) => {
    try {
        const car = await prisma.car.findUnique({
            where: { id: req.params.id },
            include: {
                cities: { include: { city: true } },
                reviews: { orderBy: { createdAt: "desc" } },
            },
        });
        if (!car)
            return res.status(404).json({ error: { code: "not_found", message: "Car not found" } });
        const count = car.reviews.length;
        const avg = count === 0 ? 0 : car.reviews.reduce((s, r) => s + r.rating, 0) / count;
        res.json({
            data: {
                ...toDto(car, { avg, count }),
                reviews: car.reviews.map((r) => ({
                    id: r.id,
                    name: r.name,
                    rating: r.rating,
                    text: r.text,
                    createdAt: r.createdAt,
                })),
            },
        });
    }
    catch (e) {
        next(e);
    }
});
