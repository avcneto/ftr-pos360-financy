import { beforeEach, describe, expect, it, vi } from "vitest";

const useAuthMock = vi.fn();
const useQueryMock = vi.fn();
const { requestGraphQLMock } = vi.hoisted(() => ({
  requestGraphQLMock: vi.fn(),
}));

vi.mock("../providers/AuthProvider", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: (options: { queryKey: string[] }) => useQueryMock(options),
  useQueryClient: () => ({ invalidateQueries: vi.fn().mockResolvedValue(undefined) }),
}));

vi.mock("../api/graphql", () => ({
  requestGraphQL: requestGraphQLMock,
}));

import { useDashboardSummary } from "./useDashboardSummary";

describe("useDashboardSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty totals when there is no token", async () => {
    useAuthMock.mockReturnValue({ token: null });
    useQueryMock.mockReturnValue({ data: [], isLoading: false });

    const summary = useDashboardSummary();

    await expect(useQueryMock.mock.calls[0][0].queryFn()).resolves.toEqual([]);
    await expect(useQueryMock.mock.calls[1][0].queryFn()).resolves.toEqual([]);

    expect(summary.categories).toEqual([]);
    expect(summary.transactions).toEqual([]);
    expect(summary.recentTransactions).toEqual([]);
    expect(summary.income).toBe(0);
    expect(summary.expense).toBe(0);
    expect(summary.balance).toBe(0);
  });

  it("creates category and transaction queries and calculates the summary", async () => {
    useAuthMock.mockReturnValue({ token: "token-1", user: { id: "user-1" } });
    useQueryMock.mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "categories") {
        return {
          data: [{ id: "cat-1", title: "Food", color: "#1f6f43", icon: "🍔" }],
          isLoading: false,
        };
      }

      return {
        data: [
          {
            id: "tx-1",
            title: "Salary",
            amount: 2500,
            type: "INCOME",
            date: "2025-01-02",
            category: { title: "General" },
          },
          {
            id: "tx-2",
            title: "Groceries",
            amount: 120,
            type: "EXPENSE",
            date: "2025-01-03",
            category: { title: "Food" },
          },
        ],
        isLoading: false,
      };
    });

    requestGraphQLMock.mockImplementation(async (query: string) => {
      if (query.includes("Categories")) {
        return {
          categories: [
            { id: "cat-1", title: "Food", color: "#1f6f43", icon: "🍔" },
          ],
        };
      }

      return {
        transactions: [
          {
            id: "tx-1",
            title: "Salary",
            amount: 2500,
            type: "INCOME",
            date: "2025-01-02",
            category: { title: "General" },
          },
          {
            id: "tx-2",
            title: "Groceries",
            amount: 120,
            type: "EXPENSE",
            date: "2025-01-03",
            category: { title: "Food" },
          },
        ],
      };
    });

    const summary = useDashboardSummary();

    await expect(useQueryMock.mock.calls[0][0].queryFn()).resolves.toEqual([
      { id: "cat-1", title: "Food", color: "#1f6f43", icon: "🍔" },
    ]);
    await expect(useQueryMock.mock.calls[1][0].queryFn()).resolves.toEqual([
      {
        id: "tx-1",
        title: "Salary",
        amount: 2500,
        type: "INCOME",
        date: "2025-01-02",
        category: { title: "General" },
      },
      {
        id: "tx-2",
        title: "Groceries",
        amount: 120,
        type: "EXPENSE",
        date: "2025-01-03",
        category: { title: "Food" },
      },
    ]);
    expect(requestGraphQLMock.mock.calls[1][0]).toContain("category { id title color icon }");

    expect(useQueryMock).toHaveBeenCalledTimes(2);
    expect(summary.categories).toHaveLength(1);
    expect(summary.transactions).toHaveLength(2);
    expect(summary.recentTransactions[0]?.id).toBe("tx-2");
    expect(summary.income).toBe(2500);
    expect(summary.expense).toBe(120);
    expect(summary.balance).toBe(2380);
  });
});
