// test/utils/createTestApp.ts
import { buildApp } from "../../src/app";
import { config } from "dotenv";
import { join } from "path";

export async function createTestApp() {
  config({ path: join(__dirname, "../../.env.test") });
  const app = buildApp();
  await app.ready();
  return app;
}
