import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock, verifyTokenMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findUnique: vi.fn(),
    },
  },
  verifyTokenMock: vi.fn(),
}));

vi.mock("../src/db", () => ({
  prisma: prismaMock,
}));

vi.mock("../src/services/auth.service", () => ({
  verifyToken: verifyTokenMock,
}));

import { buildContext } from "../src/context";

describe("buildContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an anonymous context without an authorization header", async () => {
    const context = await buildContext({
      request: new Request("http://localhost"),
    });

    expect(context.user).toBeNull();
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    expect(verifyTokenMock).not.toHaveBeenCalled();
  });

  it("loads the user from a valid bearer token", async () => {
    verifyTokenMock.mockReturnValueOnce({ userId: "user-1" });
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: "user-1" });

    const context = await buildContext({
      request: new Request("http://localhost", {
        headers: { authorization: "Bearer token-1" },
      }),
    });

    expect(verifyTokenMock).toHaveBeenCalledWith("token-1");
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-1" },
      select: { id: true },
    });
    expect(context.user).toEqual({ id: "user-1" });
  });

  it("falls back to anonymous when the token is invalid", async () => {
    verifyTokenMock.mockImplementationOnce(() => {
      throw new Error("invalid token");
    });

    const context = await buildContext({
      request: new Request("http://localhost", {
        headers: { authorization: "Bearer invalid" },
      }),
    });

    expect(context.user).toBeNull();
  });

  it("returns anonymous when the token user no longer exists", async () => {
    verifyTokenMock.mockReturnValueOnce({ userId: "user-1" });
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const context = await buildContext({
      request: new Request("http://localhost", {
        headers: { authorization: "Bearer token-1" },
      }),
    });

    expect(context.user).toBeNull();
  });
});
