import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { requestGraphQL } from "../api/graphql";
import { useAuth } from "../providers/AuthProvider";
import type { Transaction } from "../types";
import type { TransactionFormInput } from "../types/forms";

export function useTransactions() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

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

  const refreshTransactions = async () => {
    await queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  const createMutation = useMutation({
    mutationFn: async (values: TransactionFormInput) => {
      if (!token) {
        throw new Error("Unauthorized");
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
        throw new Error("Unauthorized");
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
        throw new Error("Unauthorized");
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
    transactions: transactionsQuery.data ?? [],
    isLoading: transactionsQuery.isLoading,
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
