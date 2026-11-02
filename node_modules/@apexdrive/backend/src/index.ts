import "dotenv/config";
import { createApp } from "./app.js";
import { env } from "./env.js";

const app = createApp();
app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`ApexDrive API listening on http://localhost:${env.PORT}`);
});