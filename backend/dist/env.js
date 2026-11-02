import { z } from "zod";
const Env = z.object({
    DATABASE_URL: z.string().min(1),
    PORT: z.coerce.number().int().positive().default(4000),
    CORS_ORIGIN: z.string().default("http://localhost:5173"),
    NODE_ENV: z.string().default("development"),
});
export const env = Env.parse(process.env);
