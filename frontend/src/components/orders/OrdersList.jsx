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
    OPEN:      "bg-blue-50 text-blue-700 border-blue-200",
    DUE:       "bg-yellow-50 text-yellow-700 border-yellow-200",
    COMPLETED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    NEW:       "bg-gray-50 text-gray-700 border-gray-200",
    PRINTED:   "bg-purple-50 text-purple-700 border-purple-200",
    REPRINTED: "bg-orange-50 text-orange-700 border-orange-200",
  };
  return map[value] || "bg-gray-50 text-gray-700 border-gray-200";
}

function derivePaymentMeta(order) {
  const total   = Number(order.totalAmount || 0);
  const paid    = Number(order.totalPaid   || 0);
  const balance = Number(order.balanceDue  ?? total - paid);

  if (order.status === "CANCELLED") {
    return {
      label: "Cancelled",
      className: "bg-red-50 text-red-700 border-red-200",
      isPaid: false,
      code: "CANCELLED",
    };
  }
  if (total > 0 && balance <= 0) {
    return {
      label: "Payment Completed",
      className: "bg-green-50 text-green-700 border-green-200",
      isPaid: true,
      code: "PAID",
    };
  }
  if (paid > 0) {
    return {
      label: "Partially Paid",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      isPaid: false,
      code: "PARTIALLY_PAID",
    };
  }
  return {
    label: "Not Paid",
    className: "bg-orange-50 text-orange-700 border-orange-200",
    isPaid: false,
    code: "NOT_PAID",
  };
}

function deriveKotLabel(order) {
  const hasKot =
    !!order.kotNo ||
    order.kotStatus === "PRINTED" ||
    order.kotStatus === "REPRINTED";
  return hasKot ? "KOT Reprint" : "Print KOT";
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
  onGoToCart,
  onCompletePayment,
  onPrintKot,
  onCancelOrder,
  actionLoadingId,
}) {
  const cardRefs = useRef({});

  useEffect(() => {
    if (selectedOrderId && cardRefs.current[selectedOrderId]) {
      cardRefs.current[selectedOrderId].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedOrderId, orders]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />
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
        const selected     = selectedOrderId === order.id;
        const payMeta      = derivePaymentMeta(order);
        const kotLabel     = deriveKotLabel(order);
        const isCancelled  = order.status === "CANCELLED";
        const isBusy       = actionLoadingId === order.id;

        const canPay       = !isCancelled && !payMeta.isPaid;
        const canEdit      = !isCancelled && !payMeta.isPaid;
        const canKot       = !isCancelled;
        const canCancel    = !isCancelled && !payMeta.isPaid;

        return (
          <div
            key={order.id}
            ref={(el) => { if (el) cardRefs.current[order.id] = el; }}
            className={`w-full rounded-2xl border bg-white p-5 shadow-sm transition ${
              selected
                ? "border-[#E8A020] ring-2 ring-[#E8A020]/20"
                : "border-[#ded9d3]"
            }`}
          >
            {/* ── clickable info row ── */}
            <button
              type="button"
              onClick={() => onSelectOrder(order)}
              className="w-full text-left"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold">{order.orderNo}</h3>
                  <p className="mt-1 text-sm text-[#54433f]">
                    Token #{order.tokenNo}
                  </p>
                  {order.kotNo && (
                    <p className="mt-1 text-xs font-semibold text-[#54433f]">
                      KOT: {order.kotNo}
                    </p>
                  )}
                  {order.note && (
                    <p className="mt-2 text-sm text-[#54433f]">{order.note}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold">
                    ₹{Number(order.totalAmount || 0).toFixed(2)}
                  </p>
                  <p className="mt-1 text-xs text-[#54433f]">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge value={payMeta.label} className={payMeta.className} />
                <Badge value={order.status} className={getStatusClass(order.status)} />
                {order.kotStatus && (
                  <Badge
                    value={order.kotStatus}
                    className={getStatusClass(order.kotStatus)}
                  />
                )}
              </div>
            </button>

            {/* ── action buttons ── */}
            <div className="mt-4 flex flex-wrap gap-3">
              {/* Payment action */}
              {payMeta.isPaid ? (
                <span className="inline-flex items-center rounded-xl bg-green-50 px-4 py-2 text-sm font-bold text-green-700 ring-1 ring-green-200">
                  ✓ Payment Completed
                </span>
              ) : (
                <button
                  type="button"
                  disabled={!canPay || isBusy}
                  onClick={() => onCompletePayment(order)}
                  title={!canPay ? "Not available" : ""}
                  className={`rounded-xl px-4 py-2 text-sm font-bold text-white ${
                    !canPay || isBusy
                      ? "cursor-not-allowed bg-gray-300"
                      : "bg-[#E8A020]"
                  }`}
                >
                  {payMeta.code === "PARTIALLY_PAID"
                    ? "Complete Payment"
                    : "Go to Cart"}
                </button>
              )}

              {/* Go to Cart (edit) */}
              <button
                type="button"
                disabled={!canEdit || isBusy}
                onClick={() => onGoToCart(order)}
                title={
                  payMeta.isPaid
                    ? "Paid orders cannot be edited"
                    : isCancelled
                    ? "Cancelled orders cannot be edited"
                    : ""
                }
                className={`rounded-xl px-4 py-2 text-sm font-bold ${
                  !canEdit || isBusy
                    ? "cursor-not-allowed border border-[#ded9d3] bg-gray-100 text-gray-400"
                    : "border border-[#ded9d3] bg-white text-[#3d0c02] hover:bg-[#f8f3ec]"
                }`}
              >
                Edit / Go to Cart
              </button>

              {/* KOT Print / Reprint */}
              <button
                type="button"
                disabled={!canKot || isBusy}
                onClick={() => onPrintKot(order)}
                title={isCancelled ? "Cannot print KOT for cancelled orders" : ""}
                className={`rounded-xl px-4 py-2 text-sm font-bold ${
                  !canKot || isBusy
                    ? "cursor-not-allowed border border-[#ded9d3] bg-gray-100 text-gray-400"
                    : "border border-[#ded9d3] bg-white text-[#3d0c02] hover:bg-[#f8f3ec]"
                }`}
              >
                {kotLabel}
              </button>

              {/* Cancel Order */}
              {!isCancelled && (
                <button
                  type="button"
                  disabled={!canCancel || isBusy}
                  onClick={() => onCancelOrder(order)}
                  className={`rounded-xl px-4 py-2 text-sm font-bold ${
                    !canCancel || isBusy
                      ? "cursor-not-allowed border border-[#ded9d3] bg-gray-100 text-gray-400"
                      : "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                  }`}
                >
                  Cancel Order
                </button>
              )}

              {isCancelled && (
                <span className="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
                  Cancelled
                </span>
              )}
            </div>
          </div>
        );
      })}

      {pagination && (
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
              {[10, 20, 50].map((v) => (
                <option key={v} value={v}>{v} / page</option>
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
      )}
    </div>
  );
}

export default OrdersList;