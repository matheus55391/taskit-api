import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import {
  createUser,
  findUserByEmail,
} from "../../../src/services/user.service";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.user.deleteMany();
});
afterAll(async () => {
  await prisma.$disconnect();
});

describe("user.service", () => {
  describe("findUserByEmail", () => {
    it("should return user when email exists", async () => {
      const data = {
        name: "Find Test User",
        email: "finduser@example.com",
        password: "password123",
      };
      await createUser(prisma, data);
      const found = await findUserByEmail(prisma, data.email);
      expect(found).not.toBeNull();
      expect(found?.email).toBe(data.email);
    });

    it("should return null when email does not exist", async () => {
      const found = await findUserByEmail(prisma, "notfound@example.com");
      expect(found).toBeNull();
    });
  });

  describe("createUser", () => {
    it("should create a user successfully", async () => {
      const data = {
        name: "Create Test User",
        email: "createuser@example.com",
        password: "password123",
      };
      const user = await createUser(prisma, data);
      expect(user).toHaveProperty("id");
      expect(user.email).toBe(data.email);
    });

    it("should throw error if email already exists", async () => {
      const data = {
        name: "Duplicate User",
        email: "duplicate@example.com",
        password: "password123",
      };
      await createUser(prisma, data);
      await expect(createUser(prisma, data)).rejects.toThrow();
    });
  });
});
