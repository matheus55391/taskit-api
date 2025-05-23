// test/auth/register.test.ts
import { PrismaClient } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createTestApp } from "../utils/createTestApp";

const prisma = new PrismaClient();
let app: Awaited<ReturnType<typeof createTestApp>>;

beforeAll(async () => {
  app = await createTestApp();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await app.close();
  await prisma.$disconnect();
});

describe("POST /auth/register", () => {
  it("should register a new user", async () => {
    const response = await request(app.server).post("/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
