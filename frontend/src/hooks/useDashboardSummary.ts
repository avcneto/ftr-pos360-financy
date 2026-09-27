import { useQuery, useQueryClient } from "@tanstack/react-query";
import { requestGraphQL } from "../api/graphql";
import { useAuth } from "../providers/AuthProvider";
import type { Category, Transaction } from "../types";
import type { TransactionFormInput } from "../types/forms";

export function useDashboardSummary() {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ["categories", user?.id],
    enabled: !!token && !!user,
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
    queryKey: ["transactions", user?.id],
    enabled: !!token && !!user,
    queryFn: async () => {
      if (!token) {
        return [] as Transaction[];
      }

      const response = await requestGraphQL<{ transactions: Transaction[] }>(
        `query Transactions { transactions { id title amount type date description categoryId category { id title color icon } } }`,
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
  const now = new Date();
  const thisMonth = transactions.filter((item) => {
    const date = new Date(item.date);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  });
  const monthlyIncome = thisMonth.filter((item) => item.type === "INCOME").reduce((total, item) => total + Number(item.amount), 0);
  const monthlyExpense = thisMonth.filter((item) => item.type === "EXPENSE").reduce((total, item) => total + Number(item.amount), 0);
  const recentTransactions = [...transactions]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 5);

  const createTransaction = async (values: TransactionFormInput) => {
    if (!token) throw new Error("Sessão expirada");
    await requestGraphQL(
      `mutation CreateTransaction($title: String!, $amount: Float!, $type: String!, $date: String!, $description: String, $categoryId: ID) {
        createTransaction(title: $title, amount: $amount, type: $type, date: $date, description: $description, categoryId: $categoryId) { id }
      }`,
      values,
      token,
    );
    await queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
  };

  return {
    categories,
    transactions,
    recentTransactions,
    income,
    expense,
    balance,
    monthlyIncome,
    monthlyExpense,
    isLoading: categoriesQuery.isLoading || transactionsQuery.isLoading,
    error: categoriesQuery.error ?? transactionsQuery.error,
    createTransaction,
  };
}
