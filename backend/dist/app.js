import express from "express";
import cors from "cors";
import path from "path";
import { env } from "./env.js";
import { HttpError } from "./errors.js";
import { citiesRouter } from "./routes/cities.js";
import { carsRouter } from "./routes/cars.js";
import { reviewsRouter } from "./routes/reviews.js";
import { savedRouter } from "./routes/saved.js";
import { bookingsRouter } from "./routes/bookings.js";
export function createApp() {
    const app = express();
    app.use(cors({ origin: env.CORS_ORIGIN, credentials: false }));
    app.use(express.json({ limit: "100kb" }));
    app.get("/api/health", (_req, res) => res.json({ ok: true }));
    // --- API ROUTES ---
    app.use("/api/cities", citiesRouter);
    app.use("/api/cars", carsRouter);
    app.use("/api", reviewsRouter); // /api/cars/:carId/reviews
    app.use("/api/saved", savedRouter);
    app.use("/api/bookings", bookingsRouter);
    // --- SERVE FRONTEND ---
    // Serve the built frontend from the frontend/dist directory
    const frontendDist = path.resolve(process.cwd(), "../frontend/dist");
    app.use(express.static(frontendDist));
    // Fallback for React Router: send index.html for any non-API route
    app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api"))
            return next();
        res.sendFile(path.join(frontendDist, "index.html"));
    });
    // --- 404 HANDLER ---
    app.use((_req, res) => res.status(404).json({ error: { code: "not_found", message: "Route not found" } }));
    // --- CENTRAL ERROR HANDLER ---
    app.use((err, _req, res, _next) => {
        if (err instanceof HttpError) {
            return res.status(err.status).json({ error: { code: err.code, message: err.message } });
        }
        if (err?.name === "ZodError") {
            return res.status(400).json({
                error: {
                    code: "validation_error",
                    message: "Invalid request data.",
                    issues: err.issues?.map((i) => ({ path: i.path, message: i.message })),
                },
            });
        }
        console.error("[unhandled]", err);
        res.status(500).json({ error: { code: "internal_error", message: "Something went wrong." } });
    });
    return app;
}
