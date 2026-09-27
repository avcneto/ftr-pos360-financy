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

import { useTransactions } from "./useTransactions";

describe("useTransactions", () => {
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

    const transactions = useTransactions();

    await expect(useQueryMock.mock.calls[0][0].queryFn()).resolves.toEqual([]);
    await expect(
      useMutationMock.mock.calls[0][0].mutationFn({
        title: "Salary",
        amount: 2500,
        type: "INCOME",
        date: "2025-01-01",
        description: "Monthly",
        categoryId: null,
      }),
    ).rejects.toThrow("Sessão expirada. Faça login novamente.");
    await expect(
      useMutationMock.mock.calls[1][0].mutationFn({
        id: "tx-1",
        values: {
          title: "Salary",
          amount: 2500,
          type: "INCOME",
          date: "2025-01-01",
          description: "Monthly",
          categoryId: null,
        },
      }),
    ).rejects.toThrow("Sessão expirada. Faça login novamente.");
    await expect(
      useMutationMock.mock.calls[2][0].mutationFn("tx-1"),
    ).rejects.toThrow("Sessão expirada. Faça login novamente.");

    await useMutationMock.mock.calls[0][0].onSuccess?.();

    expect(transactions.transactions).toEqual([]);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["transactions"],
    });
  });

  it("wires transaction operations and queries", async () => {
    useAuthMock.mockReturnValue({ token: "token-1", user: { id: "user-1" } });
    useQueryMock.mockReturnValue({ data: [{ id: "tx-1" }], isLoading: false });
    useMutationMock.mockImplementation((options: any) => ({
      mutateAsync: options.mutationFn,
      error: null,
      isPending: false,
    }));
    requestGraphQLMock.mockResolvedValue({ transactions: [{ id: "tx-1" }] });

    const transactions = useTransactions();

    await expect(useQueryMock.mock.calls[0][0].queryFn()).resolves.toEqual([
      { id: "tx-1" },
    ]);
    expect(requestGraphQLMock.mock.calls[0][0]).toContain("category { id title color icon }");
    await expect(
      useMutationMock.mock.calls[0][0].mutationFn({
        title: "Salary",
        amount: 2500,
        type: "INCOME",
        date: "2025-01-01",
        description: "Monthly",
        categoryId: null,
      }),
    ).resolves.toEqual({ transactions: [{ id: "tx-1" }] });
    await expect(
      useMutationMock.mock.calls[1][0].mutationFn({
        id: "tx-1",
        values: {
          title: "Salary",
          amount: 2500,
          type: "INCOME",
          date: "2025-01-01",
          description: "Monthly",
          categoryId: null,
        },
      }),
    ).resolves.toEqual({ transactions: [{ id: "tx-1" }] });
    await expect(
      useMutationMock.mock.calls[2][0].mutationFn("tx-1"),
    ).resolves.toEqual({ transactions: [{ id: "tx-1" }] });

    await useMutationMock.mock.calls[0][0].onSuccess?.();

    expect(useQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ["transactions", "user-1"] }),
    );
    expect(transactions.transactions).toEqual([{ id: "tx-1" }]);
    expect(transactions.createPending).toBe(false);
    expect(requestGraphQLMock).toHaveBeenCalledWith(
      expect.stringContaining("mutation CreateTransaction"),
      expect.objectContaining({
        title: "Salary",
        amount: 2500,
        type: "INCOME",
        date: "2025-01-01",
        categoryId: null,
      }),
      "token-1",
    );
  });

  it("requests a filtered page from GraphQL and exposes its total", async () => {
    useAuthMock.mockReturnValue({ token: "token-1", user: { id: "user-1" } });
    useQueryMock.mockReturnValue({ data: { items: [{ id: "tx-11" }], total: 27, page: 2 }, isLoading: false });
    useMutationMock.mockImplementation((options: any) => ({ mutateAsync: options.mutationFn, error: null, isPending: false }));
    requestGraphQLMock.mockResolvedValueOnce({ transactionsPage: { items: [{ id: "tx-11" }], total: 27, page: 2 } });

    const options = { page: 2, pageSize: 10, search: "Almoço", type: "EXPENSE", categoryId: "cat-1", month: "2025-11" };
    const result = useTransactions(options);
    await expect(useQueryMock.mock.calls[0][0].queryFn()).resolves.toEqual({ items: [{ id: "tx-11" }], total: 27, page: 2 });

    expect(result.transactions).toEqual([{ id: "tx-11" }]);
    expect(result.total).toBe(27);
    expect(result.currentPage).toBe(2);
    expect(requestGraphQLMock).toHaveBeenCalledWith(expect.stringContaining("transactionsPage("), options, "token-1");
  });
});
