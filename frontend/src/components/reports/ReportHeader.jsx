function formatDisplayDate(filter) {
  if (filter.type === "preset") {
    const label = filter.preset === "today" ? "Today" : "Yesterday";
    const date = new Date();

    if (filter.preset === "yesterday") {
      date.setDate(date.getDate() - 1);
    }

    return `${label} — ${date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
  }

  return `${filter.startDate} to ${filter.endDate}`;
}

export default function ReportHeader({
  navigate,
  filter,
  today,
  customStart,
  customEnd,
  setCustomStart,
  setCustomEnd,
  applyCustomRange,
  setPresetFilter,
}) {
  return (
    <header className="fixed left-0 top-0 z-50 flex h-[80px] w-full items-center justify-between bg-[#3d0c02] px-4 text-white shadow-md md:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-white/10"
          aria-label="Back to Settings"
        >
          <span className="text-[28px]">←</span>
        </button>

        <div className="flex flex-col">
          <h1 className="text-[24px] font-bold leading-tight text-white">
            Summary
          </h1>
          <p className="text-[13px] font-semibold text-white/60">
            {formatDisplayDate(filter)}
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        {["today", "yesterday"].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPresetFilter(p)}
            className={`rounded-full px-4 py-2 text-[13px] font-bold capitalize transition ${
              filter.type === "preset" && filter.preset === p
                ? "bg-white text-[#3d0c02]"
                : "border border-white/20 text-white hover:bg-white/10"
            }`}
          >
            {p}
          </button>
        ))}

        <div className="mx-2 h-8 w-px bg-white/20" />

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customStart}
            max={today}
            onChange={(e) => setCustomStart(e.target.value)}
            className="rounded-lg border border-white/20 bg-white/10 px-2 py-1.5 text-[12px] text-white outline-none focus:border-[#feb234]"
          />

          <span className="text-[12px] text-white/50">→</span>

          <input
            type="date"
            value={customEnd}
            max={today}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="rounded-lg border border-white/20 bg-white/10 px-2 py-1.5 text-[12px] text-white outline-none focus:border-[#feb234]"
          />

          <button
            type="button"
            onClick={applyCustomRange}
            className="rounded-full bg-[#feb234] px-4 py-1.5 text-[12px] font-bold text-[#3d0c02] transition hover:bg-[#ffd06a]"
          >
            Apply
          </button>
        </div>
      </div>
    </header>
  );
}