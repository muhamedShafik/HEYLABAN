// src/pages/OrdersPage.jsx
import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useOrdersQuery } from "../hooks/orders/useOrdersQuery";
import { fetchOrderById } from "../services/orderService";
import {
  getOrdersParamsFromSearch,
  buildOrdersSearchParams,
} from "../utils/orderQueryParams";
import OrdersFilters from "../components/orders/OrdersFilters";
import OrdersList from "../components/orders/OrdersList";
import OrderDetailsPanel from "../components/orders/OrderDetailsPanel";

function OrdersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const params = useMemo(
    () => getOrdersParamsFromSearch(searchParams),
    [searchParams]
  );

  const ordersQuery = useOrdersQuery({
    page: params.page,
    limit: params.limit,
    status: params.status || undefined,
    kotStatus: params.kotStatus || undefined,
    orderType: params.orderType || undefined,
    search: params.search || undefined,
    from: params.from || undefined,
    to: params.to || undefined,
    sortBy: params.sortBy,
    sortDir: params.sortDir,
  });

  const selectedOrderQuery = useQuery({
    queryKey: ["order", params.selectedOrderId],
    queryFn: () => fetchOrderById(params.selectedOrderId),
    enabled: !!params.selectedOrderId,
  });

  const orders = ordersQuery.data?.items || ordersQuery.data?.data || [];
  const pagination = ordersQuery.data?.pagination || null;

  useEffect(() => {
    if (!params.selectedOrderId && orders.length > 0) {
      const query = buildOrdersSearchParams({
        ...params,
        selectedOrderId: orders[0].id,
        selectedOrderNo: orders[0].orderNo,
      });

      navigate(`/orders?${query.toString()}`, { replace: true });
    }
  }, [params, orders, navigate]);

  const handleParamsChange = (patch) => {
    const nextParams = {
      ...params,
      ...patch,
    };

    const query = buildOrdersSearchParams(nextParams);
    navigate(`/orders?${query.toString()}`);
  };

  const handleSelectOrder = (order) => {
    handleParamsChange({
      selectedOrderId: order.id,
      selectedOrderNo: order.orderNo,
    });
  };

  const handlePageChange = (page) => {
    handleParamsChange({ page });
  };

  const handleLimitChange = (limit) => {
    handleParamsChange({ limit, page: 1 });
  };

  

  return (
    <div className="min-h-screen bg-[#fef9f2] p-6 text-[#3d0c02]">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Orders</h1>
            <p className="mt-1 text-sm text-[#54433f]">
              View all orders and inspect full order details.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/pos")}
            className="rounded-xl border border-[#ded9d3] bg-white px-5 py-3 text-sm font-bold shadow-sm"
          >
            Back to POS
          </button>
        </div>

        <OrdersFilters params={params} onChange={handleParamsChange} />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <OrdersList
            orders={orders}
            loading={ordersQuery.isLoading}
            error={ordersQuery.isError}
            selectedOrderId={params.selectedOrderId}
            pagination={pagination}
            onSelectOrder={handleSelectOrder}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />

          <OrderDetailsPanel
            order={selectedOrderQuery.data || null}
            loading={selectedOrderQuery.isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;