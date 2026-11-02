import { Router } from "express";
import { prisma } from "../db.js";
export const citiesRouter = Router();
citiesRouter.get("/", async (_req, res, next) => {
    try {
        const rows = await prisma.city.findMany({ orderBy: { name: "asc" } });
        res.json({ data: rows.map((r) => r.name) });
    }
    catch (e) {
        next(e);
    }
});
