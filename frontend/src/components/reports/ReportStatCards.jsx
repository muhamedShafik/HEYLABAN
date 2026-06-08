function StatCard({ label, value, sub, accent, icon }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-[#d9c1bc]/20 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#54433f]/60">
          {label}
        </span>
        {icon && <span className="text-[16px]">{icon}</span>}
      </div>

      <p
        className={`text-[28px] font-extrabold leading-tight ${
          accent || "text-[#1d1c18]"
        }`}
      >
        {value}
      </p>

      {sub && <p className="text-[11px] text-[#54433f]/50">{sub}</p>}
    </div>
  );
}

function OrderStatusBar({ completed = 0, cancelled = 0, due = 0 }) {
  const total = completed + cancelled + due || 1;

  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-full">
      <div
        style={{ width: `${(completed / total) * 100}%` }}
        className="bg-[#437a22] transition-all duration-700"
      />
      <div
        style={{ width: `${(cancelled / total) * 100}%` }}
        className="bg-[#a12c7b] transition-all duration-700"
      />
      <div
        style={{ width: `${(due / total) * 100}%` }}
        className="bg-[#feb234] transition-all duration-700"
      />
    </div>
  );
}

export default function ReportStatCards({ orders }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={orders?.totalOrderCount ?? 0}
          sub={`+${
            Math.max(
              0,
              (orders?.totalOrderCount ?? 0) - (orders?.cancelledOrderCount ?? 0)
            )
          } active`}
          icon="🧾"
        />

        <StatCard
          label="Completed"
          value={orders?.completedOrdersCount ?? 0}
          sub={`${
            orders?.totalOrderCount
              ? Math.round(
                  (orders.completedOrdersCount / orders.totalOrderCount) * 100
                )
              : 0
          }% completion rate`}
          accent="text-[#437a22]"
          icon="✅"
        />

        <StatCard
          label="Cancelled"
          value={orders?.cancelledOrderCount ?? 0}
          sub={`${
            orders?.totalOrderCount
              ? Math.round(
                  (orders.cancelledOrderCount / orders.totalOrderCount) * 100
                )
              : 0
          }% of total`}
          accent="text-[#a12c7b]"
          icon="❌"
        />

        <StatCard
          label="Due / Unpaid"
          value={orders?.dueOrderCount ?? 0}
          sub="Outstanding orders"
          accent="text-[#da7101]"
          icon="⏳"
        />
      </div>

      <div className="mt-3 rounded-2xl border border-[#d9c1bc]/20 bg-white p-4 shadow-sm">
        <OrderStatusBar
          completed={orders?.completedOrdersCount}
          cancelled={orders?.cancelledOrderCount}
          due={orders?.dueOrderCount}
        />

        <div className="mt-2 flex flex-wrap gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#437a22]" />
            Completed({orders?.completedOrdersCount ?? 0})
          </span>

          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#a12c7b]" />
            Cancelled({orders?.cancelledOrderCount ?? 0})
          </span>

          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#feb234]" />
            Unpaid({orders?.dueOrderCount ?? 0})
          </span>
        </div>
      </div>
    </>
  );
}