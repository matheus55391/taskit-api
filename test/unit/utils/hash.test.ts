import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "../../../src/utils/hash";

describe("utils/hash.ts", () => {
  describe("with correct password", () => {
    it("should hash and compare password correctly", async () => {
      const password = "mySecret123";
      const hash = await hashPassword(password);
      expect(hash).not.toBe(password);
      const isMatch = await comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });
  });
  describe("with incorrect password", () => {
    it("should return false when password is invalid", async () => {
      const password = "mySecret123";
      const invalidPassword = "wrong";
      const hash = await hashPassword(password);
      expect(hash).not.toBe(password);
      const isNotMatch = await comparePassword(invalidPassword, hash);
      expect(isNotMatch).toBe(false);
    });
  });
});
