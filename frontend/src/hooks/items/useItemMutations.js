// src/hooks/items/useItemMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  createItem,
  deleteCategory,
  deleteItem,
  toggleCategoryActive,
  toggleItemActive,
  updateCategory,
  updateItem,
} from "../../services/itemService";

export function useItemMutations() {
  const queryClient = useQueryClient();

  const invalidateCatalogue = () =>
    queryClient.invalidateQueries({ queryKey: ["catalogue"] });

  return {
    createItemMutation: useMutation({
      mutationFn: createItem,
      onSuccess: invalidateCatalogue,
    }),
    updateItemMutation: useMutation({
      mutationFn: ({ id, payload }) => updateItem(id, payload),
      onSuccess: invalidateCatalogue,
    }),
    deleteItemMutation: useMutation({
      mutationFn: deleteItem,
      onSuccess: invalidateCatalogue,
    }),
    toggleItemActiveMutation: useMutation({
      mutationFn: ({ id, isActive }) => toggleItemActive(id, isActive),
      onSuccess: invalidateCatalogue,
    }),
    createCategoryMutation: useMutation({
      mutationFn: createCategory,
      onSuccess: invalidateCatalogue,
    }),
    updateCategoryMutation: useMutation({
      mutationFn: ({ id, payload }) => updateCategory(id, payload),
      onSuccess: invalidateCatalogue,
    }),
    deleteCategoryMutation: useMutation({
      mutationFn: deleteCategory,
      onSuccess: invalidateCatalogue,
    }),
    toggleCategoryActiveMutation: useMutation({
      mutationFn: ({ id, isActive }) => toggleCategoryActive(id, isActive),
      onSuccess: invalidateCatalogue,
    }),
  };
}