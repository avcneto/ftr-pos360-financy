import { beforeEach, describe, expect, it, vi } from "vitest";

const invalidateQueries = vi.fn();
const useAuthMock = vi.fn();
const useQueryMock = vi.fn();
const useMutationMock = vi.fn();
const { requestGraphQLMock } = vi.hoisted(() => ({
  requestGraphQLMock: vi.fn(),
}));

vi.mock("../providers/AuthProvider", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: (options: { queryKey: string[] }) => useQueryMock(options),
  useMutation: (options: unknown) => useMutationMock(options),
  useQueryClient: () => ({ invalidateQueries }),
}));

vi.mock("../api/graphql", () => ({
  requestGraphQL: requestGraphQLMock,
}));

import { useCategories } from "./useCategories";

describe("useCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty data and rejects mutations without a token", async () => {
    useAuthMock.mockReturnValue({ token: null });
    useQueryMock.mockReturnValue({ data: [], isLoading: false });
    useMutationMock.mockImplementation((options: any) => ({
      mutateAsync: options.mutationFn,
      error: null,
      isPending: false,
    }));

    const categories = useCategories();

    await expect(useQueryMock.mock.calls[0][0].queryFn()).resolves.toEqual([]);
    await expect(
      useMutationMock.mock.calls[0][0].mutationFn({
        title: "Food",
        description: "Meals",
        color: "#1f6f43",
        icon: "🍔",
      }),
    ).rejects.toThrow("Sessão expirada. Faça login novamente.");
    await expect(
      useMutationMock.mock.calls[1][0].mutationFn({
        id: "cat-1",
        values: {
          title: "Food",
          description: "Meals",
          color: "#1f6f43",
          icon: "🍔",
        },
      }),
    ).rejects.toThrow("Sessão expirada. Faça login novamente.");
    await expect(
      useMutationMock.mock.calls[2][0].mutationFn("cat-1"),
    ).rejects.toThrow("Sessão expirada. Faça login novamente.");

    await useMutationMock.mock.calls[0][0].onSuccess?.();

    expect(categories.categories).toEqual([]);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["categories"],
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["transactions"],
    });
  });

  it("loads categories and performs mutations with a token", async () => {
    useAuthMock.mockReturnValue({ token: "token-1", user: { id: "user-1" } });
    useQueryMock.mockReturnValue({ data: [{ id: "cat-1" }], isLoading: false });
    useMutationMock.mockImplementation((options: any) => ({
      mutateAsync: options.mutationFn,
      error: null,
      isPending: false,
    }));
    requestGraphQLMock.mockResolvedValue({ categories: [{ id: "cat-1" }] });

    const categories = useCategories();

    await expect(useQueryMock.mock.calls[0][0].queryFn()).resolves.toEqual([
      { id: "cat-1" },
    ]);
    await expect(
      useMutationMock.mock.calls[0][0].mutationFn({
        title: "Food",
        description: "Meals",
        color: "#1f6f43",
        icon: "🍔",
      }),
    ).resolves.toEqual({ categories: [{ id: "cat-1" }] });
    await expect(
      useMutationMock.mock.calls[1][0].mutationFn({
        id: "cat-1",
        values: {
          title: "Food",
          description: "Meals",
          color: "#1f6f43",
          icon: "🍔",
        },
      }),
    ).resolves.toEqual({ categories: [{ id: "cat-1" }] });
    await expect(
      useMutationMock.mock.calls[2][0].mutationFn("cat-1"),
    ).resolves.toEqual({
      categories: [{ id: "cat-1" }],
    });

    await useMutationMock.mock.calls[0][0].onSuccess?.();

    useAuthMock.mockReturnValue({ token: "token-1", user: { id: "user-1" } });

    expect(useQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ["categories", "user-1"] }),
    );
    expect(categories.categories).toEqual([{ id: "cat-1" }]);
    expect(categories.createPending).toBe(false);
    expect(requestGraphQLMock).toHaveBeenCalledWith(
      expect.stringContaining("mutation CreateCategory"),
      {
        title: "Food",
        description: "Meals",
        color: "#1f6f43",
        icon: "🍔",
      },
      "token-1",
    );
  });
});
