import { useQuery } from "@tanstack/react-query";
import { getReportOrders } from "../../services/reportService";

export default function useReportOrdersQuery(filter, page, limit = 20) {
  return useQuery({
    queryKey: ["reports-orders", filter, page, limit],
    queryFn: () => getReportOrders(filter, page, limit),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
  });
}