import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { requestGraphQL } from "../api/graphql";
import { useAuth } from "../providers/AuthProvider";
import type { Transaction } from "../types";
import type { TransactionFormInput } from "../types/forms";

export type TransactionsPageOptions = {
  page: number;
  pageSize: number;
  search?: string;
  type?: string;
  categoryId?: string;
  month?: string;
};

type TransactionsPageResult = { items: Transaction[]; total: number; page: number };

export function useTransactions(pageOptions?: TransactionsPageOptions) {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: pageOptions ? ["transactions", user?.id, "page", pageOptions] : ["transactions", user?.id],
    enabled: !!token && !!user,
    queryFn: async () => {
      if (!token) {
        return [] as Transaction[];
      }

      if (pageOptions) {
        const response = await requestGraphQL<{ transactionsPage: TransactionsPageResult }>(
          `query TransactionsPage($page: Int!, $pageSize: Int!, $search: String, $type: String, $categoryId: ID, $month: String) {
            transactionsPage(page: $page, pageSize: $pageSize, search: $search, type: $type, categoryId: $categoryId, month: $month) {
              total
              page
              items { id title amount type date description categoryId category { id title color icon } }
            }
          }`,
          { ...pageOptions },
          token,
        );
        return response.transactionsPage;
      }

      const response = await requestGraphQL<{ transactions: Transaction[] }>(
        `query Transactions { transactions { id title amount type date description categoryId category { id title color icon } } }`,
        {},
        token,
      );

      return response.transactions;
    },
  });

  const refreshTransactions = async () => {
    await queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  const createMutation = useMutation({
    mutationFn: async (values: TransactionFormInput) => {
      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      return requestGraphQL(
        `mutation CreateTransaction($title: String!, $amount: Float!, $type: String!, $date: String!, $description: String, $categoryId: ID) {
          createTransaction(title: $title, amount: $amount, type: $type, date: $date, description: $description, categoryId: $categoryId) {
            id
          }
        }`,
        values,
        token,
      );
    },
    onSuccess: refreshTransactions,
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: TransactionFormInput;
    }) => {
      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      return requestGraphQL(
        `mutation UpdateTransaction($id: ID!, $title: String, $amount: Float, $type: String, $date: String, $description: String, $categoryId: ID) {
          updateTransaction(id: $id, title: $title, amount: $amount, type: $type, date: $date, description: $description, categoryId: $categoryId) {
            id
          }
        }`,
        { id, ...values },
        token,
      );
    },
    onSuccess: refreshTransactions,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      return requestGraphQL(
        `mutation DeleteTransaction($id: ID!) { deleteTransaction(id: $id) }`,
        { id },
        token,
      );
    },
    onSuccess: refreshTransactions,
  });

  return {
    transactions: Array.isArray(transactionsQuery.data) ? transactionsQuery.data : transactionsQuery.data?.items ?? [],
    total: Array.isArray(transactionsQuery.data) ? transactionsQuery.data.length : transactionsQuery.data?.total ?? 0,
    currentPage: Array.isArray(transactionsQuery.data) ? 1 : transactionsQuery.data?.page ?? pageOptions?.page ?? 1,
    isLoading: transactionsQuery.isLoading,
    error: transactionsQuery.error,
    createTransaction: createMutation.mutateAsync,
    updateTransaction: updateMutation.mutateAsync,
    deleteTransaction: deleteMutation.mutateAsync,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    createPending: createMutation.isPending,
    updatePending: updateMutation.isPending,
    deletePending: deleteMutation.isPending,
  };
}
