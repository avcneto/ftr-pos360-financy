import { beforeEach, describe, expect, it, vi } from "vitest";

const serverState = vi.hoisted(() => {
  const state: {
    handler?: (req: unknown, res: unknown) => void;
    listen: ReturnType<typeof vi.fn>;
    yoga: ReturnType<typeof vi.fn>;
    makeExecutableSchema: ReturnType<typeof vi.fn>;
    createYoga: ReturnType<typeof vi.fn>;
  } = {
    listen: vi.fn((_port: number, callback?: () => void) => {
      callback?.();
    }),
    yoga: vi.fn(),
    makeExecutableSchema: vi.fn(() => ({ schema: "schema-object" })),
    createYoga: vi.fn(),
  };

  state.createYoga.mockImplementation(() => state.yoga);
  return state;
});

vi.mock("node:http", () => ({
  createServer: vi.fn((handler: (req: unknown, res: unknown) => void) => {
    serverState.handler = handler;
    return { listen: serverState.listen };
  }),
}));

vi.mock("graphql-yoga", () => ({
  createYoga: serverState.createYoga,
}));

vi.mock("@graphql-tools/schema", () => ({
  makeExecutableSchema: serverState.makeExecutableSchema,
}));

vi.mock("../src/context", () => ({
  buildContext: vi.fn(),
}));

vi.mock("../src/resolvers", () => ({
  resolvers: { Query: {}, Mutation: {} },
}));

vi.mock("../src/schema", () => ({
  typeDefs: { kind: "Document" },
}));

describe("server", () => {
  const consoleLog = vi.spyOn(console, "log").mockImplementation(() => undefined);

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    serverState.handler = undefined;
    vi.stubEnv("PORT", "4100");
    vi.stubEnv("CORS_ORIGIN", "http://one.local, http://two.local");
  });

  it("configures yoga, creates the server and starts listening", async () => {
    await import("../src/server");

    expect(serverState.makeExecutableSchema).toHaveBeenCalledWith({
      typeDefs: { kind: "Document" },
      resolvers: { Query: {}, Mutation: {} },
    });
    expect(serverState.createYoga).toHaveBeenCalledWith(
      expect.objectContaining({
        graphqlEndpoint: "/graphql",
        cors: {
          origin: ["http://one.local", "http://two.local"],
          credentials: true,
        },
      }),
    );
    expect(serverState.listen).toHaveBeenCalledWith(4100, expect.any(Function));
    expect(consoleLog).toHaveBeenCalledWith(
      "GraphQL server running on http://localhost:4100/graphql",
    );

    serverState.handler?.({} as never, {} as never);
    expect(serverState.yoga).toHaveBeenCalledWith({}, {});
  });
});