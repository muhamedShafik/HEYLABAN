// src/components/orders/OrdersList.jsx
function StatusBadge({ value }) {
  const colorMap = {
    OPEN: "bg-blue-50 text-blue-700 border-blue-200",
    DUE: "bg-yellow-50 text-yellow-700 border-yellow-200",
    COMPLETED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    NEW: "bg-gray-50 text-gray-700 border-gray-200",
    PRINTED: "bg-purple-50 text-purple-700 border-purple-200",
    REPRINTED: "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${colorMap[value] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
      {value}
    </span>
  );
}

function OrdersList({
  orders,
  loading,
  error,
  selectedOrderId,
  pagination,
  onSelectOrder,
  onPageChange,
  onLimitChange,
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-28 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load orders.
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#ded9d3] bg-white p-10 text-center text-[#3d0c02]/50">
        No orders found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const selected = selectedOrderId === order.id;

        return (
          <button
            type="button"
            key={order.id}
            onClick={() => onSelectOrder(order)}
            className={`w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition ${
              selected ? "border-[#E8A020] ring-2 ring-[#E8A020]/20" : "border-[#ded9d3]"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold">{order.orderNo}</h3>
                <p className="mt-1 text-sm text-[#54433f]">Token #{order.tokenNo}</p>
                {order.note ? (
                  <p className="mt-2 text-sm text-[#54433f]">{order.note}</p>
                ) : null}
              </div>

              <div className="text-right">
                <p className="text-2xl font-extrabold">₹{Number(order.totalAmount || 0).toFixed(2)}</p>
                <p className="mt-1 text-xs text-[#54433f]">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge value={order.status} />
              <StatusBadge value={order.kotStatus} />
            </div>
          </button>
        );
      })}

      {pagination ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#ded9d3] bg-white p-4">
          <div className="text-sm text-[#54433f]">
            Page {pagination.page} • Total {pagination.total}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={pagination.limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-10 rounded-lg border border-[#ded9d3] px-3"
            >
              {[10, 20, 50].map((value) => (
                <option key={value} value={value}>
                  {value} / page
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={!pagination.hasPrev}
              onClick={() => onPageChange(pagination.page - 1)}
              className="rounded-lg border border-[#ded9d3] px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>

            <button
              type="button"
              disabled={!pagination.hasNext}
              onClick={() => onPageChange(pagination.page + 1)}
              className="rounded-lg border border-[#ded9d3] px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default OrdersList;