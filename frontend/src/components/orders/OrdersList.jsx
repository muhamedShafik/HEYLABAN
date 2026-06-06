// src/components/orders/OrdersList.jsx
import { useEffect, useRef } from "react";

function Badge({ value, className = "" }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}
    >
      {value}
    </span>
  );
}

function getStatusClass(value) {
  const map = {
    OPEN: "bg-blue-50 text-blue-700 border-blue-200",
    DUE: "bg-yellow-50 text-yellow-700 border-yellow-200",
    COMPLETED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    NEW: "bg-gray-50 text-gray-700 border-gray-200",
    PRINTED: "bg-purple-50 text-purple-700 border-purple-200",
    REPRINTED: "bg-orange-50 text-orange-700 border-orange-200",
  };

  return map[value] || "bg-gray-50 text-gray-700 border-gray-200";
}

function derivePaymentMeta(order) {
  const total = Number(order.totalAmount || 0);

  const paid =
    order.totalPaid != null
      ? Number(order.totalPaid)
      : (order.payments ?? [])
          .filter((p) => p.status === "COMPLETED")
          .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const balance =
    order.balanceDue != null
      ? Number(order.balanceDue)
      : Math.max(0, total - paid);

  if (order.status === "CANCELLED") {
    return {
      label: "Cancelled",
      className: "bg-red-50 text-red-700 border-red-200",
      isUnpaid: false,
    };
  }

  if (total > 0 && balance <= 0 && paid > 0) {
    const methods = order.payments?.length
      ? [...new Set(order.payments.map((p) => p.method))].join(" + ")
      : null;

    return {
      label: methods ? `Paid · ${methods}` : "Payment Completed",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      isUnpaid: false,
    };
  }

  if (paid > 0 && balance > 0) {
    return {
      label: "Partially Paid",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      isUnpaid: false,
    };
  }

  return {
    label: "Not Paid",
    className: "bg-orange-50 text-orange-700 border-orange-200",
    isUnpaid: true,
  };
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
  const selectedRef = useRef(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedOrderId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-3xl border border-[#ded9d3] bg-white p-6 shadow-sm"
          >
            <div className="animate-pulse space-y-4">
              <div className="h-7 w-40 rounded bg-[#ece7e1]" />
              <div className="h-5 w-24 rounded bg-[#ece7e1]" />
              <div className="flex gap-2">
                <div className="h-8 w-24 rounded-full bg-[#ece7e1]" />
                <div className="h-8 w-24 rounded-full bg-[#ece7e1]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load orders.
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[#ded9d3] bg-white p-10 text-center text-[#54433f]">
        No orders found.
      </div>
    );
  }

  return (
    <>
      {/* Keyframe for slow red pulse */}
      <style>{`
  @keyframes unpaid-pulse {
    0%, 100% {
      background-color: #ffffff;
      border-color: #ded9d3;
    }
    50% {
      background-color: #fee2e2;
      border-color: #f87171;
    }
  }
  .unpaid-pulse {
    animation: unpaid-pulse 2.5s ease-in-out infinite;
  }
`}</style>

      <div className="space-y-5">
        {orders.map((order) => {
          const paymentMeta = derivePaymentMeta(order);
          const isSelected = selectedOrderId === order.id;

          return (
            <button
              key={order.id}
              ref={isSelected ? selectedRef : null}
              type="button"
              onClick={() => onSelectOrder(order)}
              className={`w-full rounded-3xl border p-6 text-left shadow-sm transition ${
                isSelected
                  ? "border-[#E8A020] bg-white ring-1 ring-[#E8A020]"
                  : "border-[#ded9d3] bg-white"
              } ${paymentMeta.isUnpaid ? "unpaid-pulse" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#3d0c02]">
                    {order.orderNo}
                  </h3>
                  <p className="mt-2 text-sm text-[#54433f]">
                    Token #{order.tokenNo}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-extrabold text-[#3d0c02]">
                    ₹{Number(order.totalAmount || 0).toFixed(2)}
                  </p>
                  <p className="mt-2 text-sm text-[#6b5a56]">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Badge
                  value={paymentMeta.label}
                  className={paymentMeta.className}
                />
                {order.status && (
                  <Badge
                    value={order.status}
                    className={getStatusClass(order.status)}
                  />
                )}
                {order.kotStatus && (
                  <Badge
                    value={order.kotStatus}
                    className={getStatusClass(order.kotStatus)}
                  />
                )}
              </div>
            </button>
          );
        })}

        {pagination ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-[#ded9d3] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#54433f]">
              Page {pagination.page} of {pagination.totalPages} • Total{" "}
              {pagination.total}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={pagination.limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="h-10 rounded-xl border border-[#ded9d3] bg-white px-3 text-sm outline-none"
              >
                {[10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="rounded-xl border border-[#ded9d3] px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>

              <button
                type="button"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="rounded-xl border border-[#ded9d3] px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default OrdersList;