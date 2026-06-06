import { useState, useEffect } from "react";
import { useCartStore } from "../../store/cartStore";

function PaymentModal({ open, onClose, onConfirm, loading = false }) {
  const paymentMethod = useCartStore((state) => state.paymentMethod);
  const setPaymentMethod = useCartStore((state) => state.setPaymentMethod);
  const cashReceived = useCartStore((state) => state.cashReceived);
  const setCashReceived = useCartStore((state) => state.setCashReceived);
  const getTotal = useCartStore((state) => state.getTotal);
  const getChange = useCartStore((state) => state.getChange);

  const [referenceNo, setReferenceNo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setError("");
      setReferenceNo("");
    }
  }, [open]);

  if (!open) return null;

  const total = Number(getTotal());
  const change = getChange();

  const quickCash = (amount) => {
    setCashReceived(String(Number(cashReceived || 0) + amount));
  };

  
const submitPayment = async () => {
  setError("");

  const amount = Number(total);

  if (paymentMethod === "not paid") {
    try {
      await onConfirm({ type: "UNPAID" });
      onClose();
    } catch {}
    return;
  }

  const payments = [];

  if (paymentMethod === "cash") {
    const tendered = Number(cashReceived);

    if (!cashReceived || Number.isNaN(tendered)) {
      setError("Please enter cash tendered.");
      return;
    }

    if (tendered < amount) {
      setError("Cash tendered must be greater than or equal to total.");
      return;
    }

    payments.push({
      method: "CASH",
      amount,
      cashTendered: tendered,
    });
  } else if (paymentMethod === "upi") {
    payments.push({
      method: "UPI",
      amount,
      ...(referenceNo.trim() ? { referenceNo: referenceNo.trim() } : {}),
    });
  } else if (paymentMethod === "card") {
    payments.push({
      method: "CARD",
      amount,
      ...(referenceNo.trim() ? { referenceNo: referenceNo.trim() } : {}),
    });
  } else {
    setError("Please choose a valid payment method.");
    return;
  }

  try {
    await onConfirm({
      type: "PAID",
      payments,
    });
    onClose();
  } catch {}
};
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3d0c02]/60 p-4">
      <div className="w-full max-w-[420px] rounded-2xl bg-[#fef9f2] p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#3d0c02]">Collect Payment</h2>
            <p className="mt-2 text-[48px] font-extrabold text-[#3d0c02]">₹{total.toFixed(2)}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-[#3d0c02]"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {["cash", "upi", "card", "not paid"].map((method) => (
            <button
              type="button"
              key={method}
              onClick={() => {
                setPaymentMethod(method);
                setError("");
              }}
              disabled={loading}
              className={`rounded-xl border p-4 text-sm font-bold capitalize shadow-sm ${
                paymentMethod === method
                  ? "border-[#815500] bg-[#feb234]"
                  : "border-[#ded9d3] bg-white"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

       <div className="mt-5">
  {paymentMethod === "cash" ? (
    <>
      <label className="mb-2 block text-sm font-bold text-[#54433f]">
        Cash Tendered
      </label>

      <input
        value={cashReceived}
        onChange={(e) => {
          setCashReceived(e.target.value);
          setError("");
        }}
        className="h-14 w-full rounded-xl border border-[#3d0c02] px-4 text-center text-2xl font-bold"
        placeholder="₹500"
        type="number"
        disabled={loading}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {[50, 100, 200, 500, 1000].map((amt) => (
          <button
            type="button"
            key={amt}
            onClick={() => quickCash(amt)}
            disabled={loading}
            className="rounded-full border border-[#ded9d3] bg-white px-4 py-2 text-sm font-bold"
          >
            ₹{amt}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-[#f4efe7] p-4 text-center">
        <span className="text-2xl font-extrabold text-green-600">
          Change: ₹{Number(change).toFixed(2)}
        </span>
      </div>
    </>
  ) : paymentMethod === "upi" || paymentMethod === "card" ? (
    <>
      <label className="mb-2 block text-sm font-bold text-[#54433f]">
        Reference
      </label>
      <input
        value={referenceNo}
        onChange={(e) => {
          setReferenceNo(e.target.value);
          setError("");
        }}
        className="h-14 w-full rounded-xl border border-[#ded9d3] px-4 text-lg"
        placeholder="UPI Ref / Last 4 Digits"
        type="text"
        disabled={loading}
      />
    </>
  ) : paymentMethod === "not paid" ? (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
      This order will be saved as unpaid. You can collect payment later from Orders.
    </div>
  ) : (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      Select Cash, UPI, Card, or Not Paid.
    </div>
  )}
</div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={submitPayment}
            disabled={loading}
            className={`h-14 rounded-xl text-lg font-extrabold text-[#3d0c02] ${
              loading ? "cursor-not-allowed bg-gray-300" : "bg-[#feb234]"
            }`}
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-14 rounded-xl border border-[#3d0c02] text-lg font-medium text-[#3d0c02]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;