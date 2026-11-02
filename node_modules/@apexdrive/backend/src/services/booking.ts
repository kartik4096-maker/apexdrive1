import { prisma } from "../db.js";
import { computePrice } from "@apexdrive/shared";
import { conflict, notFound, badRequest } from "../errors.js";

function randomRef() {
  // AD-XXXXXX
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return "AD-" + out;
}

export async function createBooking(input: {
  clientId: string;
  carId: string;
  city: string;
  startISO: string;
  endISO: string;
  name: string;
  phone: string;
  email: string;
}) {
  const car = await prisma.car.findUnique({
    where: { id: input.carId },
    include: { cities: { include: { city: true } } },
  });
  if (!car) throw notFound("Car not found");
  if (!car.cities.some((cc) => cc.city.name === input.city)) {
    throw badRequest("Car is not available in this city.");
  }

  const start = new Date(input.startISO);
  const end = new Date(input.endISO);
  const price = computePrice(car.dailyPricePaise, input.startISO, input.endISO);

  // Serialize overlapping booking attempts with a per-car advisory lock,
  // then re-check overlap inside a transaction. This makes two concurrent
  // requests for the same car + window fail safely instead of double-booking.
  const booking = await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      `SELECT pg_advisory_xact_lock(hashtext($1))`,
      car.id
    );

    const overlap = await tx.booking.count({
      where: {
        carId: car.id,
        status: "confirmed",
        startAt: { lt: end },
        endAt: { gt: start },
      },
    });
    if (overlap > 0) {
      throw conflict("This car was just booked for those dates. Please choose another car or time.");
    }

    // Retry a few times on the very unlikely reference collision.
    let created;
    for (let attempt = 0; attempt < 5 && !created; attempt++) {
      try {
        created = await tx.booking.create({
          data: {
            reference: randomRef(),
            carId: car.id,
            cityName: input.city,
            clientId: input.clientId,
            name: input.name,
            phone: input.phone,
            email: input.email,
            startAt: start,
            endAt: end,
            days: price.days,
            subtotalPaise: price.subtotalPaise,
            gstPaise: price.gstPaise,
            totalPaise: price.totalPaise,
          },
        });
      } catch (err: any) {
        if (err?.code === "P2002") continue; // reference collision
        throw err;
      }
    }
    if (!created) throw conflict("Could not allocate a booking reference. Please retry.");
    return created;
  });

  return booking;
}

export async function cancelBooking(reference: string, phone: string) {
  const booking = await prisma.booking.findUnique({ where: { reference } });
  if (!booking || booking.phone !== phone) {
    throw notFound("Booking not found for this number.");
  }
  if (booking.status !== "confirmed") {
    throw badRequest("This booking cannot be cancelled.");
  }
  if (booking.startAt.getTime() <= Date.now()) {
    throw badRequest("This trip has already started and cannot be cancelled online.");
  }
  return prisma.booking.update({
    where: { reference },
    data: { status: "cancelled" },
  });
}