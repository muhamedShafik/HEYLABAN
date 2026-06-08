function PaymentBar({ cash = 0, upi = 0, card = 0 }) {
  const total = cash + upi + card || 1;
  const cashPct = (cash / total) * 100;
  const upiPct = (upi / total) * 100;
  const cardPct = (card / total) * 100;

  return (
    <div className="space-y-3">
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        <div style={{ width: `${cashPct}%` }} className="bg-[#3d0c02]" />
        <div style={{ width: `${upiPct}%` }} className="bg-[#feb234]" />
        <div style={{ width: `${cardPct}%` }} className="bg-[#d9c1bc]" />
      </div>

      <div className="grid grid-cols-1 gap-2 text-[12px] sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#3d0c02]" />
          <span className="text-[#54433f]">Cash</span>
          <span className="ml-auto font-bold text-[#1d1c18]">
            ₹{cash.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#feb234]" />
          <span className="text-[#54433f]">UPI</span>
          <span className="ml-auto font-bold text-[#1d1c18]">
            ₹{upi.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#a0857e]" />
          <span className="text-[#54433f]">Card</span>
          <span className="ml-auto font-bold text-[#1d1c18]">
            ₹{card.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PaymentsSection({ payments, navigate }) {
  return (
    <section className="mb-6">
      <h2 className="mb-3 text-[13px] font-bold uppercase tracking-widest text-[#54433f]/60">
        Payments
      </h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-[#d9c1bc]/20 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#54433f]/60">
              Total Collected
            </p>
          </div>

          <p className="text-[28px] font-extrabold text-[#1d1c18]">
            ₹{(payments?.totalCollectedPayments ?? 0).toLocaleString("en-IN")}
          </p>

          <div className="mt-4">
            <PaymentBar
              cash={payments?.paymentBreakdown?.cash ?? 0}
              upi={payments?.paymentBreakdown?.upi ?? 0}
              card={payments?.paymentBreakdown?.card ?? 0}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <span className="text-[18px]">⚠️</span>
            </div>

            <div className="flex-grow">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-red-600">
                Outstanding Liability
              </p>

              <p className="mt-1 text-[28px] font-extrabold text-red-700">
                ₹{(payments?.liability?.unpaidAmount ?? 0).toLocaleString("en-IN")}
              </p>

              <div className="mt-3 flex gap-6 text-[12px] text-red-700/80">
                <span>
                  <span className="font-bold">
                    {payments?.liability?.unpaidOrderCount ?? 0}
                  </span>{" "}
                  unpaid orders
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="shrink-0 rounded-full bg-red-700 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-red-800"
            >
              View Unpaid
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}