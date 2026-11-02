import rateLimit from "express-rate-limit";

// Public endpoints that create or read sensitive data get a basic limiter.
export const publicWriteLimiter = rateLimit({
  windowMs: 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "rate_limited", message: "Too many requests. Please slow down." } },
});

export const lookupLimiter = rateLimit({
  windowMs: 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "rate_limited", message: "Too many lookup attempts. Please wait a moment." } },
});