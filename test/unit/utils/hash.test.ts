import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "../../../src/utils/hash";

describe("hash utils", () => {
  it("should hash and compare password correctly", async () => {
    const password = "mySecret123";
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    const isMatch = await comparePassword(password, hash);
    expect(isMatch).toBe(true);
    const isNotMatch = await comparePassword("wrong", hash);
    expect(isNotMatch).toBe(false);
  });
});
