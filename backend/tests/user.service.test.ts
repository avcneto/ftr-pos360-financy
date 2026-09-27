import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock, hashPasswordMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
  hashPasswordMock: vi.fn(),
}));

vi.mock("../src/db", () => ({
  prisma: prismaMock,
}));

vi.mock("../src/services/auth.service", () => ({
  hashPassword: hashPasswordMock,
}));

import {
  createUser,
  findUserByEmail,
  getUserById,
  updateUserName,
} from "../src/services/user.service";

describe("user.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("finds a user by email", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: "user-1" });

    await expect(findUserByEmail("ada@example.com")).resolves.toEqual({
      id: "user-1",
    });
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "ada@example.com" },
    });
  });

  it("creates a user with a hashed password", async () => {
    hashPasswordMock.mockResolvedValueOnce("hashed-password");
    prismaMock.user.create.mockResolvedValueOnce({ id: "user-1" });

    await expect(
      createUser({ name: "Ada", email: "ada@example.com", password: "secret" }),
    ).resolves.toEqual({ id: "user-1" });

    expect(hashPasswordMock).toHaveBeenCalledWith("secret");
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        name: "Ada",
        email: "ada@example.com",
        password: "hashed-password",
      },
    });
  });

  it("gets a user by id", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: "user-1" });

    await expect(getUserById("user-1")).resolves.toEqual({ id: "user-1" });
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-1" },
    });
  });

  it("updates only the authenticated user's name", async () => {
    prismaMock.user.update.mockResolvedValueOnce({ id: "user-1", name: "Ada Byron" });
    await expect(updateUserName("user-1", "  Ada Byron  ")).resolves.toEqual({ id: "user-1", name: "Ada Byron" });
    expect(prismaMock.user.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: { name: "Ada Byron" } });
    await expect(updateUserName("user-1", "A")).rejects.toThrow("O nome deve ter pelo menos 2 caracteres.");
  });
});
