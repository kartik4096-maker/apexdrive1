CREATE TABLE "City" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "City_name_key" ON "City"("name");

CREATE TABLE "Car" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "brand" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "fuel" TEXT NOT NULL,
  "transmission" TEXT NOT NULL,
  "seats" INTEGER NOT NULL,
  "bags" INTEGER NOT NULL,
  "dailyPricePaise" INTEGER NOT NULL,
  "mileage" TEXT NOT NULL,
  "engine" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "badge" TEXT NOT NULL,
  "badgeIcon" TEXT NOT NULL,
  "badgeTag" TEXT,
  "image" TEXT NOT NULL,
  "fallback" TEXT NOT NULL,
  "features" TEXT[] NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CarCity" (
  "carId" TEXT NOT NULL,
  "cityId" INTEGER NOT NULL,
  CONSTRAINT "CarCity_pkey" PRIMARY KEY ("carId","cityId")
);
CREATE INDEX "CarCity_cityId_idx" ON "CarCity"("cityId");

CREATE TABLE "Review" (
  "id" TEXT NOT NULL,
  "carId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "text" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Review_carId_idx" ON "Review"("carId");

CREATE TABLE "Booking" (
  "id" TEXT NOT NULL,
  "reference" TEXT NOT NULL,
  "carId" TEXT NOT NULL,
  "cityName" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "startAt" TIMESTAMP(3) NOT NULL,
  "endAt" TIMESTAMP(3) NOT NULL,
  "days" INTEGER NOT NULL,
  "subtotalPaise" INTEGER NOT NULL,
  "gstPaise" INTEGER NOT NULL,
  "totalPaise" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'confirmed',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Booking_reference_key" ON "Booking"("reference");
CREATE INDEX "Booking_carId_startAt_endAt_idx" ON "Booking"("carId","startAt","endAt");
CREATE INDEX "Booking_phone_idx" ON "Booking"("phone");

CREATE TABLE "SavedCar" (
  "clientId" TEXT NOT NULL,
  "carId" TEXT NOT NULL,
  CONSTRAINT "SavedCar_pkey" PRIMARY KEY ("clientId","carId")
);

ALTER TABLE "CarCity" ADD CONSTRAINT "CarCity_carId_fkey"
  FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CarCity" ADD CONSTRAINT "CarCity_cityId_fkey"
  FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_carId_fkey"
  FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_carId_fkey"
  FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SavedCar" ADD CONSTRAINT "SavedCar_carId_fkey"
  FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;