// src/pages/POSPage.jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PaymentModal from "../components/pos/PaymentModal";
import { useCartStore } from "../store/cartStore";
import { useSessionStore } from "../store/sessionStore";
import { fetchCatalogue } from "../services/catalogueService";

function POSPage() {
  const navigate = useNavigate();

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCloseSaleModal, setShowCloseSaleModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [closingNote, setClosingNote] = useState("");
  const [expenses, setExpenses] = useState([{ categoryName: "", amount: "", note: "" }]);
  const [closeLoading, setCloseLoading] = useState(false);
  const [closeError, setCloseError] = useState("");

  const todaySession = useSessionStore((state) => state.todaySession);
  const fetchTodaySession = useSessionStore((state) => state.fetchTodaySession);
  const closeSession = useSessionStore((state) => state.closeSession);

  const addToCart = useCartStore((state) => state.addToCart);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const clearCart = useCartStore((state) => state.clearCart);
  const getCartItems = useCartStore((state) => state.getCartItems);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTotal = useCartStore((state) => state.getTotal);
  const products = useCartStore((state) => state.products);

  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ["catalogue"],
    queryFn: fetchCatalogue,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    const ensureSession = async () => {
      try {
        const session = todaySession || (await fetchTodaySession());

        if (!session || session.status !== "OPEN") {
          navigate("/open-sales", { replace: true });
        }
      } catch {
        navigate("/open-sales", { replace: true });
      }
    };

    ensureSession();
  }, [todaySession, fetchTodaySession, navigate]);

  const cartItems = useMemo(() => getCartItems(), [products, getCartItems]);
  const subtotal = useMemo(() => getSubtotal(), [products, getSubtotal]);
  const total = useMemo(() => getTotal(), [products, getTotal]);

  const visibleProducts = useMemo(() => {
    if (searchQuery.trim()) {
      return categories.flatMap((cat) =>
        cat.products.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
        )
      );
    }

    const selectedCat = categories.find((cat) => cat.id === selectedCategoryId);
    return selectedCat ? selectedCat.products : [];
  }, [categories, selectedCategoryId, searchQuery]);

  const cartQtyMap = useMemo(() => {
    const map = {};
    cartItems.forEach((item) => {
      map[item.id] = item.quantity;
    });
    return map;
  }, [cartItems]);

  const totalCartQty = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const formatMoney = (value) => {
    const numeric = Number(value || 0);
    return numeric.toFixed(2);
  };

  const handleAddExpenseRow = () => {
    setExpenses((prev) => [...prev, { categoryName: "", amount: "", note: "" }]);
  };

  const handleRemoveExpenseRow = (index) => {
    setExpenses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExpenseChange = (index, field, value) => {
    setExpenses((prev) =>
      prev.map((expense, i) =>
        i === index ? { ...expense, [field]: value } : expense
      )
    );
  };

  const resetCloseModal = () => {
    setClosingNote("");
    setExpenses([{ categoryName: "", amount: "", note: "" }]);
    setCloseError("");
    setShowCloseSaleModal(false);
  };

  const handleConfirmCloseSale = async () => {
    setCloseError("");

    const cleanedExpenses = expenses
      .map((expense) => ({
        categoryName: expense.categoryName.trim(),
        amount: expense.amount === "" ? "" : Number(expense.amount),
        note: expense.note.trim() || null,
      }))
      .filter(
        (expense) =>
          expense.categoryName !== "" ||
          expense.amount !== "" ||
          expense.note !== null
      );

    for (const expense of cleanedExpenses) {
      if (!expense.categoryName) {
        setCloseError("Expense category name is required.");
        return;
      }

      if (expense.amount === "" || Number.isNaN(expense.amount) || expense.amount < 0) {
        setCloseError(`Valid amount is required for ${expense.categoryName || "expense"}.`);
        return;
      }
    }

    try {
      setCloseLoading(true);

      await closeSession({
        closingNote: closingNote.trim() || null,
        expenses: cleanedExpenses,
      });

      clearCart();
      resetCloseModal();
      navigate("/open-sales", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to close sales session.";
      setCloseError(message);
    } finally {
      setCloseLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-screen flex-col overflow-hidden bg-[#fef9f2] text-[#3d0c02]">
        <header className="flex h-[56px] shrink-0 items-center justify-between bg-[#3d0c02] px-6 text-white">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-extrabold tracking-tight">Confectionery POS</h1>

            <span className="border-l border-white/20 pl-4 text-sm opacity-60">
              {todaySession?.date
                ? new Date(todaySession.date).toLocaleDateString()
                : "Today"}
            </span>

            <div className="ml-4 flex items-center gap-2">
              <input
                className="h-8 w-32 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
                placeholder="Search KOT"
                type="text"
              />
              <input
                className="h-8 w-32 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
                placeholder="Search Order"
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide">
              {todaySession?.status || "No Session"}
            </span>

            {todaySession?.openingCash !== undefined && (
              <span className="text-sm opacity-80">
                Opening Cash: ₹{formatMoney(todaySession.openingCash)}
              </span>
            )}

            <button className="opacity-80">↺</button>
            <button className="opacity-80">⚙</button>
            <button className="opacity-80">👤</button>

            <button
              onClick={() => setShowCloseSaleModal(true)}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700"
            >
              Close Sale
            </button>

            <button className="rounded-lg border border-white/30 px-6 py-2 text-sm font-bold">
              Orders
            </button>
          </div>
        </header>

        <main className="flex flex-1 overflow-hidden">
          <section className="flex w-[60%] flex-col border-r border-[#ded9d3]">
            <div className="border-b border-[#ded9d3] bg-white/50 p-4">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-xl bg-[#ece7e1] px-4 text-[#3d0c02] placeholder:text-[#3d0c02]/40 focus:outline-none"
                placeholder="Search products..."
                type="text"
              />
            </div>

            <nav className="bg-white/50 p-4">
              <div className="flex gap-3 overflow-x-auto">
                {isLoading ? (
                  [1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-11 w-28 animate-pulse rounded-full bg-[#ece7e1]"
                    />
                  ))
                ) : (
                  categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategoryId(category.id);
                        setSearchQuery("");
                      }}
                      className={`flex min-h-[44px] min-w-[96px] max-w-[140px] items-center justify-center rounded-full px-4 py-2 text-center text-sm font-semibold leading-tight break-words ${
                        selectedCategoryId === category.id
                          ? "bg-[#E8A020] text-white shadow-md"
                          : "border border-[#ded9d3] bg-white text-[#3d0c02]"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))
                )}
              </div>
            </nav>

            <div className="grid flex-1 grid-cols-3 content-start gap-6 overflow-y-auto p-6">
              {isLoading &&
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square animate-pulse rounded-2xl bg-[#ece7e1]"
                  />
                ))}

              {isError && (
                <div className="col-span-3 flex h-full items-center justify-center text-red-500">
                  Failed to load products. Please refresh.
                </div>
              )}

              {!isLoading && !isError && visibleProducts.length === 0 && (
                <div className="col-span-3 flex h-40 items-center justify-center text-[#3d0c02]/40">
                  No products found
                </div>
              )}

              {!isLoading &&
                visibleProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product.id, product)}
                    className="relative flex aspect-square flex-col items-center justify-center gap-4 rounded-2xl bg-white p-6 text-center shadow-[0_4px_12px_rgba(61,12,2,0.08)] active:scale-[0.97]"
                  >
                    {cartQtyMap[product.id] > 0 && (
                      <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#E8A020] text-sm font-bold text-white">
                        {cartQtyMap[product.id]}
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-bold leading-tight">{product.name}</h3>
                      {product.description && (
                        <p className="mt-1 text-xs text-[#3d0c02]/50">{product.description}</p>
                      )}
                      <p className="mt-2 font-bold text-[#E8A020]">
                        ₹{formatMoney(product.price)}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </section>

          <section className="flex w-[40%] flex-col bg-white">
            <div className="border-b border-[#ded9d3] bg-[#f8f3ec]/50 p-4">
              <div className="flex items-center overflow-hidden rounded-xl border border-[#ded9d3] bg-white">
                <button className="flex-1 bg-[#E8A020] py-3 text-sm font-bold text-white">Dine in</button>
                <div className="h-6 w-px bg-[#ded9d3]" />
                <button className="flex-1 py-3 text-sm font-semibold text-[#3d0c02]/70">Delivery</button>
                <div className="h-6 w-px bg-[#ded9d3]" />
                <button className="flex-1 py-3 text-sm font-semibold text-[#3d0c02]/70">Takeout</button>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-[#ded9d3] p-6">
              <h2 className="text-2xl font-bold">Cart ({totalCartQty})</h2>
              <button onClick={clearCart} className="text-sm font-bold text-red-600">
                Clear All
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-[#f8f3ec]/30 p-4">
              {cartItems.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-[#ded9d3] bg-white p-8 text-center text-gray-500">
                  No items in cart
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[#ded9d3] bg-white p-4 shadow-[0_4px_12px_rgba(61,12,2,0.08)]"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold leading-tight">{item.name}</h4>
                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                      </div>
                      <span className="text-lg font-bold">₹{formatMoney(item.total)}</span>
                    </div>

                    <div className="flex justify-end">
                      <div className="flex items-center gap-4 rounded-lg border border-[#ded9d3] bg-[#fef9f2] p-1">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="h-10 w-10 rounded-md border border-[#ded9d3] bg-white"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xl font-bold">{item.quantity}</span>
                        <button
                          onClick={() => increaseQty(item.id)}
                          className="h-10 w-10 rounded-md border border-[#ded9d3] bg-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-[#ded9d3] bg-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="opacity-70">Subtotal</span>
                  <span>₹{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="opacity-70">Discount</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-[#ded9d3] pt-4">
                  <span className="text-2xl font-bold">Total</span>
                  <span className="text-4xl font-extrabold text-[#3d0c02]">
                    ₹{formatMoney(total)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button className="flex h-[64px] w-full items-center justify-center gap-3 rounded-xl border-2 border-[#3d0c02] text-xl font-bold">
                  Print KOT
                </button>
                <div className="flex h-[72px] gap-3">
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={cartItems.length === 0}
                    className={`flex-1 rounded-xl text-lg font-extrabold text-white shadow-lg ${
                      cartItems.length === 0 ? "cursor-not-allowed bg-gray-300" : "bg-[#E8A020]"
                    }`}
                  >
                    Collect Payment
                  </button>
                  <button className="flex-1 rounded-xl bg-green-600 text-lg font-extrabold text-white shadow-lg">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {showCloseSaleModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#3a0a01]/60 p-4">
            <div className="w-full max-w-[640px] rounded-2xl border border-[#ded9d3] bg-[#fef9f2] shadow-2xl">
              <div className="flex flex-col gap-6 p-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#3d0c02]">Close Sale for Today?</h2>
                  <p className="mt-1 text-sm text-[#54433f]">
                    Review summary, add note and expenses, then confirm.
                  </p>
                </div>

                <div className="space-y-3 rounded-xl border border-[#ded9d3]/50 bg-[#f8f3ec] p-4">
                  <div className="flex justify-between">
                    <span>Session Status</span>
                    <span className="font-bold">{todaySession?.status || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Opening Cash</span>
                    <span className="font-bold">₹{formatMoney(todaySession?.openingCash)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cart Items</span>
                    <span className="font-bold">{totalCartQty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Cart Total</span>
                    <span className="font-bold">₹{formatMoney(total)}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-[#ded9d3] bg-white p-4">
                  <label className="mb-2 block text-sm font-bold text-[#3d0c02]">
                    Closing Note
                  </label>
                  <textarea
                    rows="3"
                    value={closingNote}
                    onChange={(e) => setClosingNote(e.target.value)}
                    placeholder="Cash counted and day closed..."
                    className="w-full rounded-xl border border-[#ded9d3] p-3 outline-none focus:border-[#E8A020]"
                  />
                </div>

                <div className="rounded-xl border border-[#ded9d3] bg-white p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">Session Expenses</h3>
                    <button
                      type="button"
                      onClick={handleAddExpenseRow}
                      className="rounded-lg bg-[#E8A020] px-4 py-2 text-sm font-bold text-white"
                    >
                      Add Row
                    </button>
                  </div>

                  <div className="space-y-4">
                    {expenses.map((expense, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-[#ded9d3] bg-[#f8f3ec]/40 p-4"
                      >
                        <div className="grid gap-3 md:grid-cols-3">
                          <input
                            type="text"
                            value={expense.categoryName}
                            onChange={(e) =>
                              handleExpenseChange(index, "categoryName", e.target.value)
                            }
                            placeholder="Category name"
                            className="rounded-xl border border-[#ded9d3] bg-white px-3 py-3 outline-none focus:border-[#E8A020]"
                          />

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={expense.amount}
                            onChange={(e) =>
                              handleExpenseChange(index, "amount", e.target.value)
                            }
                            placeholder="Amount"
                            className="rounded-xl border border-[#ded9d3] bg-white px-3 py-3 outline-none focus:border-[#E8A020]"
                          />

                          <input
                            type="text"
                            value={expense.note}
                            onChange={(e) =>
                              handleExpenseChange(index, "note", e.target.value)
                            }
                            placeholder="Note (optional)"
                            className="rounded-xl border border-[#ded9d3] bg-white px-3 py-3 outline-none focus:border-[#E8A020]"
                          />
                        </div>

                        {expenses.length > 1 && (
                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleRemoveExpenseRow(index)}
                              className="text-sm font-bold text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {closeError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {closeError}
                  </div>
                ) : null}

                <div className="flex gap-3">
                  <button
                    onClick={resetCloseModal}
                    className="h-14 flex-1 rounded-xl border-2 border-[#ded9d3] font-bold text-[#3d0c02]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmCloseSale}
                    disabled={closeLoading}
                    className={`h-14 flex-1 rounded-xl text-lg font-extrabold text-white shadow-lg ${
                      closeLoading ? "cursor-not-allowed bg-gray-400" : "bg-red-600"
                    }`}
                  >
                    {closeLoading ? "Closing..." : "Confirm & Close Sale"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <PaymentModal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
      </div>
    </>
  );
}

export default POSPage;