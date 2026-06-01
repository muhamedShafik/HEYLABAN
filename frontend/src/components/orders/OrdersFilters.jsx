// src/components/orders/OrdersFilters.jsx
function OrdersFilters({ params, onChange }) {
  return (
    <div className="rounded-2xl border border-[#ded9d3] bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <input
          value={params.search}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
          placeholder="Search order no / token"
          className="h-11 rounded-xl border border-[#ded9d3] px-3 outline-none focus:border-[#E8A020]"
        />

        <select
          value={params.status}
          onChange={(e) => onChange({ status: e.target.value, page: 1 })}
          className="h-11 rounded-xl border border-[#ded9d3] px-3 outline-none"
        >
          <option value="">All Status</option>
          <option value="OPEN">OPEN</option>
          <option value="DUE">DUE</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <select
          value={params.kotStatus}
          onChange={(e) => onChange({ kotStatus: e.target.value, page: 1 })}
          className="h-11 rounded-xl border border-[#ded9d3] px-3 outline-none"
        >
          <option value="">All KOT Status</option>
          <option value="NEW">NEW</option>
          <option value="PRINTED">PRINTED</option>
          <option value="REPRINTED">REPRINTED</option>
        </select>

        <select
          value={params.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value, page: 1 })}
          className="h-11 rounded-xl border border-[#ded9d3] px-3 outline-none"
        >
          <option value="createdAt">Created At</option>
          <option value="tokenNo">Token No</option>
          <option value="totalAmount">Total Amount</option>
        </select>

        <select
          value={params.sortDir}
          onChange={(e) => onChange({ sortDir: e.target.value, page: 1 })}
          className="h-11 rounded-xl border border-[#ded9d3] px-3 outline-none"
        >
          <option value="DESC">Newest First</option>
          <option value="ASC">Oldest First</option>
        </select>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() =>
            onChange({
              page: 1,
              limit: 20,
              status: "",
              kotStatus: "",
              search: "",
              sortBy: "createdAt",
              sortDir: "DESC",
              selectedOrderId: "",
              selectedOrderNo: "",
              selectedKotNo: "",
            })
          }
          className="text-sm font-bold text-red-600"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default OrdersFilters;