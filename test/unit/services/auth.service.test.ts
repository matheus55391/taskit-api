import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { registerUser } from "../../../src/services/auth.service";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.user.deleteMany();
});
afterAll(async () => {
  await prisma.$disconnect();
});

describe("auth.service", () => {
  it("should register a new user", async () => {
    const data = {
      name: "Auth Service Test",
      email: "authservicetest@example.com",
      password: "password123",
    };
    const user = await registerUser(prisma, data);
    expect(user).toHaveProperty("id");
    expect(user.email).toBe(data.email);
  });

  it("should not register a user with duplicate email", async () => {
    const data = {
      name: "Auth Service Test 2",
      email: "authservicetest@example.com",
      password: "password123",
    };
    await expect(registerUser(prisma, data)).rejects.toThrow(
      "Email already registered"
    );
  });
});
