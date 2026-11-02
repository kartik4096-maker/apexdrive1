import { prisma } from "../db.js";

// A car is available in a city for [start, end) if:
//  1. The car supports the city (CarCity row exists), and
//  2. There is no confirmed overlapping booking on that car.
export async function isCarAvailable(
  carId: string,
  cityName: string,
  start: Date,
  end: Date
): Promise<boolean> {
  const car = await prisma.car.findUnique({
    where: { id: carId },
    include: { cities: { include: { city: true } } },
  });
  if (!car) return false;
  if (!car.cities.some((cc) => cc.city.name === cityName)) return false;

  const overlap = await prisma.booking.count({
    where: {
      carId,
      status: "confirmed",
      startAt: { lt: end },
      endAt: { gt: start },
    },
  });
  return overlap === 0;
}

export async function carIdsAvailableInWindow(
  carIds: string[],
  cityName: string,
  start: Date,
  end: Date
): Promise<Set<string>> {
  if (carIds.length === 0) return new Set();
  const booked = await prisma.booking.findMany({
    where: {
      carId: { in: carIds },
      status: "confirmed",
      startAt: { lt: end },
      endAt: { gt: start },
    },
    select: { carId: true },
  });
  const bookedIds = new Set(booked.map((b) => b.carId));
  return new Set(carIds.filter((id) => !bookedIds.has(id)));
}