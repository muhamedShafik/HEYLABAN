import { useQuery } from "@tanstack/react-query";
import { getOverviewReport } from "../../services/reportService";

export default function useOverviewQuery(filter) {
  return useQuery({
    queryKey: ["reports-overview", filter],
    queryFn: () => getOverviewReport(filter),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}