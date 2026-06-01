// src/hooks/orders/useOrdersQuery.js
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../../services/orderService";

export function useOrdersQuery(params) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => fetchOrders(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}