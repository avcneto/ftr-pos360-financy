import { useQuery } from "@tanstack/react-query";
import { requestGraphQL } from "../api/graphql";
import { useAuth } from "../providers/AuthProvider";
import type { Category, Transaction } from "../types";

export function useDashboardSummary() {
  const { token } = useAuth();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    enabled: !!token,
    queryFn: async () => {
      if (!token) {
        return [] as Category[];
      }

      const response = await requestGraphQL<{ categories: Category[] }>(
        `query Categories { categories { id title description color icon } }`,
        {},
        token,
      );

      return response.categories;
    },
  });

  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    enabled: !!token,
    queryFn: async () => {
      if (!token) {
        return [] as Transaction[];
      }

      const response = await requestGraphQL<{ transactions: Transaction[] }>(
        `query Transactions { transactions { id title amount type date description categoryId category { id title } } }`,
        {},
        token,
      );

      return response.transactions;
    },
  });

  const transactions = transactionsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const income = transactions
    .filter((item) => item.type === "INCOME")
    .reduce((total, item) => total + Number(item.amount), 0);

  const expense = transactions
    .filter((item) => item.type === "EXPENSE")
    .reduce((total, item) => total + Number(item.amount), 0);

  const balance = income - expense;
  const recentTransactions = [...transactions]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 5);

  return {
    categories,
    transactions,
    recentTransactions,
    income,
    expense,
    balance,
    isLoading: categoriesQuery.isLoading || transactionsQuery.isLoading,
  };
}
