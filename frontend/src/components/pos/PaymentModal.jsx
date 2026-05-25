import { useCartStore } from "../../store/cartStore";

function PaymentModal({ open, onClose }) {
  const paymentMethod = useCartStore((state) => state.paymentMethod);
  const setPaymentMethod = useCartStore((state) => state.setPaymentMethod);
  const cashReceived = useCartStore((state) => state.cashReceived);
  const setCashReceived = useCartStore((state) => state.setCashReceived);
  const getTotal = useCartStore((state) => state.getTotal);
  const getChange = useCartStore((state) => state.getChange);
  const resetAfterPayment = useCartStore((state) => state.resetAfterPayment);

  if (!open) return null;

  const total = getTotal();
  const change = getChange();

  const confirmPayment = () => {
    resetAfterPayment();
    onClose();
  };

  const quickCash = (amount) => {
    setCashReceived(String(Number(cashReceived || 0) + amount));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3d0c02]/60 p-4">
      <div className="w-full max-w-[420px] rounded-2xl bg-[#fef9f2] p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#3d0c02]">Collect Payment</h2>
            <p className="mt-2 text-[48px] font-extrabold text-[#3d0c02]">₹{total}</p>
          </div>

          <button onClick={onClose} className="text-2xl text-[#3d0c02]">
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {["cash", "upi", "card", "not paid"].map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
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
                onChange={(e) => setCashReceived(e.target.value)}
                className="h-14 w-full rounded-xl border border-[#3d0c02] px-4 text-center text-2xl font-bold"
                placeholder="₹500"
                type="number"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {[50, 100, 200, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => quickCash(amt)}
                    className="rounded-full border border-[#ded9d3] bg-white px-4 py-2 text-sm font-bold"
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-[#f4efe7] p-4 text-center">
                <span className="text-2xl font-extrabold text-green-600">
                  Change: ₹{change}
                </span>
              </div>
            </>
          ) : (
            <>
              <label className="mb-2 block text-sm font-bold text-[#54433f]">
                Reference
              </label>
              <input
                className="h-14 w-full rounded-xl border border-[#ded9d3] px-4 text-lg"
                placeholder="UPI Ref / Last 4 Digits"
                type="text"
              />
            </>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={confirmPayment}
            className="h-14 rounded-xl bg-[#feb234] text-lg font-extrabold text-[#3d0c02]"
          >
            Confirm Payment
          </button>
          <button
            onClick={onClose}
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