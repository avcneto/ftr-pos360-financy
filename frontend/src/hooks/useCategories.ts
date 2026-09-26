import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { requestGraphQL } from "../api/graphql";
import { useAuth } from "../providers/AuthProvider";
import type { Category } from "../types";
import type { CategoryFormInput } from "../types/forms";

export function useCategories() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

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

  const refreshRelatedData = async () => {
    await queryClient.invalidateQueries({ queryKey: ["categories"] });
    await queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  const createMutation = useMutation({
    mutationFn: async (values: CategoryFormInput) => {
      if (!token) {
        throw new Error("Unauthorized");
      }

      return requestGraphQL(
        `mutation CreateCategory($title: String!, $description: String, $color: String, $icon: String) {
          createCategory(title: $title, description: $description, color: $color, icon: $icon) {
            id title description color icon
          }
        }`,
        values,
        token,
      );
    },
    onSuccess: refreshRelatedData,
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: CategoryFormInput;
    }) => {
      if (!token) {
        throw new Error("Unauthorized");
      }

      return requestGraphQL(
        `mutation UpdateCategory($id: ID!, $title: String, $description: String, $color: String, $icon: String) {
          updateCategory(id: $id, title: $title, description: $description, color: $color, icon: $icon) {
            id title description color icon
          }
        }`,
        { id, ...values },
        token,
      );
    },
    onSuccess: refreshRelatedData,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) {
        throw new Error("Unauthorized");
      }

      return requestGraphQL(
        `mutation DeleteCategory($id: ID!) { deleteCategory(id: $id) }`,
        { id },
        token,
      );
    },
    onSuccess: refreshRelatedData,
  });

  return {
    categories: categoriesQuery.data ?? [],
    isLoading: categoriesQuery.isLoading,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    createPending: createMutation.isPending,
    updatePending: updateMutation.isPending,
    deletePending: deleteMutation.isPending,
  };
}
