// src/pages/OpenSalesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../store/sessionStore";

function OpenSalesPage() {
  const navigate = useNavigate();
  const openTodaySession = useSessionStore((state) => state.openTodaySession);
  const fetchTodaySession = useSessionStore((state) => state.fetchTodaySession);

  const [openingCash, setOpeningCash] = useState("0");
  const [openingNote, setOpeningNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");

  const quickAmounts = [500, 1000, 1500, 2000];

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await fetchTodaySession();

        if (session?.status === "OPEN") {
          navigate("/pos", { replace: true });
          return;
        }
      } catch {
        // ignore here, page stays in open-sales
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [fetchTodaySession, navigate]);

  const handleQuickAmount = (amount) => {
    setOpeningCash(String(amount));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const parsedCash = Number(openingCash);

    if (Number.isNaN(parsedCash) || parsedCash < 0) {
      setError("Please enter a valid opening cash amount.");
      return;
    }

    try {
      setLoading(true);

      const session = await openTodaySession({
        openingCash: parsedCash,
        openingNote: openingNote.trim() || null,
      });

      if (session?.status === "OPEN") {
        navigate("/pos", { replace: true });
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to open sales session.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fef9f2] text-[#3d0c02]">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef9f2] px-4 py-6 text-[#3d0c02]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-5">
          <h2 className="text-xl font-bold text-red-700">Session Closed</h2>
          <p className="mt-1 text-sm text-red-600">
            Open sales to start billing and print orders. Ensure opening cash is verified.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-[#ded9d3] bg-white p-5 shadow-sm">
            <h3 className="mb-1 text-lg font-bold">Opening Cash</h3>
            <p className="mb-4 text-sm text-[#54433f]">
              Enter the physical cash available in the drawer before starting.
            </p>

            <div className="mb-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={openingCash}
                  onChange={(e) => setOpeningCash(e.target.value)}
                  className="h-14 w-full rounded-xl border border-[#ded9d3] pl-10 pr-4 text-lg font-bold outline-none focus:border-[#E8A020]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleQuickAmount(amount)}
                  className="rounded-full border border-[#ded9d3] bg-[#f8f3ec] px-5 py-2 text-sm font-semibold"
                >
                  ₹{amount}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#ded9d3] bg-white p-5 shadow-sm">
            <h3 className="mb-1 text-lg font-bold">Opening Note</h3>
            <p className="mb-4 text-sm text-[#54433f]">Optional</p>
            <textarea
              rows="4"
              value={openingNote}
              onChange={(e) => setOpeningNote(e.target.value)}
              placeholder="Add any notes regarding the drawer state..."
              className="w-full rounded-xl border border-[#ded9d3] p-4 outline-none focus:border-[#E8A020]"
            />
          </section>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="h-12 rounded-xl border border-[#3d0c02] px-6 text-sm font-bold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`h-12 rounded-xl px-6 text-sm font-bold text-white ${
                loading ? "cursor-not-allowed bg-gray-300" : "bg-[#E8A020]"
              }`}
            >
              {loading ? "Opening..." : "Open Sales"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OpenSalesPage;