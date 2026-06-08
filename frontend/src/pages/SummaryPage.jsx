import { useNavigate } from "react-router-dom";
import ReportHeader from "../components/reports/ReportHeader";
import ReportStatCards from "../components/reports/ReportStatCards";
import RevenueSection from "../components/reports/RevenueSection";
import PaymentsSection from "../components/reports/PaymentsSection";
import OrdersTable from "../components/reports/OrdersTable";
import useSummaryFilters from "../hooks/reports/useSummaryFilters";
import useOverviewQuery from "../hooks/reports/useOverviewQuery";
import useReportOrdersQuery from "../hooks/reports/useReportOrdersQuery";

export default function SummaryPage() {
  const navigate = useNavigate();

  const {
    today,
    filter,
    customStart,
    customEnd,
    customError,
    page,
    setPage,
    setCustomStart,
    setCustomEnd,
    applyCustomRange,
    setPresetFilter,
  } = useSummaryFilters();

  const {
    data: overview,
    isLoading: overviewLoading,
    isError: overviewError,
    error: overviewQueryError,
  } = useOverviewQuery(filter);

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
    error: ordersQueryError,
  } = useReportOrdersQuery(filter, page, 20);

  const orders = overview?.orders;
  const payments = overview?.payments;
  const orderRows = ordersData?.orders ?? [];
  const pagination = ordersData?.pagination;

  return (
    <div className="min-h-screen bg-[#fef9f2] font-sans text-[#1d1c18]">
      <ReportHeader
        navigate={navigate}
        filter={filter}
        today={today}
        customStart={customStart}
        customEnd={customEnd}
        setCustomStart={setCustomStart}
        setCustomEnd={setCustomEnd}
        applyCustomRange={applyCustomRange}
        setPresetFilter={setPresetFilter}
      />

      <main className="min-h-screen px-4 pb-10 pt-[96px] md:px-6">
        <div className="mx-auto max-w-6xl">
          {customError && (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-[12px] text-red-700">
              {customError}
            </p>
          )}

          <section className="mb-6">
            <h2 className="mb-3 text-[13px] font-bold uppercase tracking-widest text-[#54433f]/60">
              Orders
            </h2>

            {overviewLoading ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse space-y-2 rounded-2xl border border-[#d9c1bc]/20 bg-white p-4 shadow-sm"
                  >
                    <div className="h-3 w-24 rounded bg-[#f3ede7]" />
                    <div className="h-8 w-32 rounded bg-[#f3ede7]" />
                    <div className="h-3 w-20 rounded bg-[#f3ede7]" />
                  </div>
                ))}
              </div>
            ) : overviewError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                {overviewQueryError?.response?.data?.message ||
                  overviewQueryError?.message ||
                  "Failed to load overview."}
              </p>
            ) : (
              <ReportStatCards orders={orders} />
            )}
          </section>

          {!overviewLoading && !overviewError && (
            <RevenueSection orders={orders} />
          )}

          {!overviewLoading && !overviewError && (
            <PaymentsSection payments={payments} navigate={navigate} />
          )}

          <OrdersTable
            ordersLoading={ordersLoading}
            ordersError={ordersError}
            ordersQueryError={ordersQueryError}
            orderRows={orderRows}
            pagination={pagination}
            page={page}
            setPage={setPage}
            limit={20}
          />
        </div>
      </main>
    </div>
  );
}