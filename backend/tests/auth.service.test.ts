import { beforeAll, describe, expect, it } from "vitest";

import {
  comparePasswords,
  generateToken,
  hashPassword,
  verifyToken,
} from "../src/services/auth.service";

describe("auth.service", () => {
  beforeAll(() => { process.env.JWT_SECRET = "test-only-secret"; });
  it("hashes passwords and validates correct/incorrect inputs", async () => {
    const plainPassword = "my-secret-password";
    const hash = await hashPassword(plainPassword);

    expect(hash).not.toBe(plainPassword);
    await expect(comparePasswords(plainPassword, hash)).resolves.toBe(true);
    await expect(comparePasswords("wrong-password", hash)).resolves.toBe(false);
  });

  it("generates and verifies JWT tokens", () => {
    const userId = "user-123";
    const token = generateToken(userId);
    const payload = verifyToken(token);

    expect(payload.userId).toBe(userId);
  });

  it("throws when token is invalid", () => {
    expect(() => verifyToken("invalid-token")).toThrow();
  });
});
