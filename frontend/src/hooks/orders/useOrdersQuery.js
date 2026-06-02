// src/hooks/orders/useOrdersQuery.js
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../../services/orderService";

export function useOrdersQuery(params, options = {}) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => fetchOrders(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    ...options,              // ← spreads refetchOnMount: "always" when passed
  });
}