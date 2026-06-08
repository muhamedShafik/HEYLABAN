export default function RevenueSection({ orders }) {
  return (
    <section className="mb-6">
      <h2 className="mb-3 text-[13px] font-bold uppercase tracking-widest text-[#54433f]/60">
        Revenue
      </h2>

      <div className="rounded-2xl bg-[#3d0c02] p-5 text-white shadow-md">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
          Total Revenue
        </p>

        <p className="mt-1 text-[36px] font-extrabold">
          ₹{(orders?.totalRevenueAmount ?? 0).toLocaleString("en-IN")}
        </p>

        <p className="text-[12px] text-white/50">
          from {(orders?.totalOrderCount ?? 0) - (orders?.cancelledOrderCount ?? 0)} non-cancelled orders
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 border-t border-white/10 pt-4 text-[13px] sm:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/50">
              Avg. Order Value
            </p>
            <p className="mt-0.5 text-[20px] font-bold">
              ₹
              {(orders?.avgOrderValue ?? 0).toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/50">
              Peak Hours
            </p>
            <p className="mt-0.5 text-[14px] font-semibold">
              {orders?.peakHours?.length
                ? orders.peakHours.map((h) => h.hour).join(", ")
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}