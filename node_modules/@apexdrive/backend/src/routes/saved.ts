import { Router } from "express";
import { prisma } from "../db.js";
import { savedToggleSchema } from "@apexdrive/shared";

export const savedRouter = Router();

savedRouter.get("/", async (req, res, next) => {
  try {
    const clientId = String(req.query.clientId ?? "");
    if (!clientId) return res.json({ data: [] });
    const rows = await prisma.savedCar.findMany({ where: { clientId }, select: { carId: true } });
    res.json({ data: rows.map((r) => r.carId) });
  } catch (e) { next(e); }
});

savedRouter.post("/toggle", async (req, res, next) => {
  try {
    const { clientId, carId } = savedToggleSchema.parse(req.body);
    const existing = await prisma.savedCar.findUnique({
      where: { clientId_carId: { clientId, carId } },
    });
    if (existing) {
      await prisma.savedCar.delete({ where: { clientId_carId: { clientId, carId } } });
      return res.json({ data: { saved: false } });
    }
    await prisma.savedCar.create({ data: { clientId, carId } });
    res.json({ data: { saved: true } });
  } catch (e) { next(e); }
});