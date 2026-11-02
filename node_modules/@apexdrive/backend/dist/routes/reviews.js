import { Router } from "express";
import { prisma } from "../db.js";
import { reviewSchema } from "@apexdrive/shared";
import { publicWriteLimiter } from "../rateLimit.js";
import { notFound } from "../errors.js";
export const reviewsRouter = Router();
reviewsRouter.post("/cars/:carId/reviews", publicWriteLimiter, async (req, res, next) => {
    try {
        const car = await prisma.car.findUnique({ where: { id: req.params.carId } });
        if (!car)
            throw notFound("Car not found");
        const input = reviewSchema.parse(req.body);
        const created = await prisma.review.create({
            data: { carId: car.id, name: input.name, rating: input.rating, text: input.text },
        });
        res.status(201).json({ data: created });
    }
    catch (e) {
        next(e);
    }
});
