// src/hooks/orders/useTicketSearchQuery.js
import { useQuery } from "@tanstack/react-query";
import { searchTickets } from "../../services/searchService";

export function useTicketSearchQuery(searchValue, enabled = true) {
  return useQuery({
    queryKey: ["ticket-search", searchValue],
    queryFn: () => searchTickets(searchValue),
    enabled: enabled && !!searchValue,
    staleTime: 15 * 1000,
  });
}