import { beforeEach, describe, expect, it, vi } from "vitest";

const PrismaClientMock = vi.fn();

vi.mock("@prisma/client", () => ({
  PrismaClient: PrismaClientMock,
}));

describe("db index", () => {
  beforeEach(() => {
    vi.resetModules();
    PrismaClientMock.mockReset();
    delete (globalThis as typeof globalThis & { prisma?: unknown }).prisma;
    vi.unstubAllEnvs();
  });

  it("creates and caches a Prisma client outside production", async () => {
    const prismaClient = { client: true };
    PrismaClientMock.mockReturnValueOnce(prismaClient);
    vi.stubEnv("NODE_ENV", "development");

    const { prisma } = await import("../src/db/index");

    expect(PrismaClientMock).toHaveBeenCalledWith({ log: ["warn", "error"] });
    expect(prisma).toBe(prismaClient);
    expect(
      (globalThis as typeof globalThis & { prisma?: unknown }).prisma,
    ).toBe(prismaClient);
  });

  it("reuses an existing global Prisma client", async () => {
    const existingClient = { client: "existing" };
    (globalThis as typeof globalThis & { prisma?: unknown }).prisma =
      existingClient;
    vi.stubEnv("NODE_ENV", "production");

    const { prisma } = await import("../src/db/index");

    expect(PrismaClientMock).not.toHaveBeenCalled();
    expect(prisma).toBe(existingClient);
  });
});
