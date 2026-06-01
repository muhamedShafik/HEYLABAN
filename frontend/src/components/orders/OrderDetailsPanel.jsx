// src/components/orders/OrderDetailsPanel.jsx
function OrderDetailsPanel({ order, loading }) {
  if (loading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-white" />;
  }

  if (!order) {
    return (
      <div className="rounded-2xl border border-dashed border-[#ded9d3] bg-white p-8 text-center text-[#3d0c02]/50">
        Select an order to view details.
      </div>
    );
  }

  return (
    <div className="sticky top-6 rounded-2xl border border-[#ded9d3] bg-white p-5 shadow-sm">
      <div className="border-b border-[#ded9d3] pb-4">
        <h2 className="text-2xl font-extrabold">{order.orderNo}</h2>
        <p className="mt-1 text-sm text-[#54433f]">Token #{order.tokenNo}</p>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between">
          <span>Status</span>
          <span className="font-bold">{order.status}</span>
        </div>
        <div className="flex justify-between">
          <span>KOT Status</span>
          <span className="font-bold">{order.kotStatus}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-bold">₹{Number(order.subtotal || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount</span>
          <span className="font-bold">₹{Number(order.discountAmount || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-bold">₹{Number(order.totalAmount || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Paid</span>
          <span className="font-bold">₹{Number(order.totalPaid || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Balance</span>
          <span className="font-bold">₹{Number(order.balanceDue || 0).toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-lg font-bold">Items</h3>
        <div className="space-y-3">
          {order.orderItems?.map((item) => (
            <div key={item.id} className="rounded-xl bg-[#f8f3ec]/40 p-3">
              <div className="flex justify-between">
                <span className="font-semibold">{item.name}</span>
                <span className="font-bold">₹{Number(item.total || 0).toFixed(2)}</span>
              </div>
              <p className="text-sm text-[#54433f]">Qty: {item.quantity}</p>
              {item.note ? <p className="text-sm text-[#54433f]">Note: {item.note}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPanel;