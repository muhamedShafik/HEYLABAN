import { useState } from "react";

function toISODate(date) {
  return date.toISOString().split("T")[0];
}

export default function useSummaryFilters() {
  const today = toISODate(new Date());

  const [filter, setFilter] = useState({ type: "preset", preset: "today" });
  const [customStart, setCustomStart] = useState(today);
  const [customEnd, setCustomEnd] = useState(today);
  const [customError, setCustomError] = useState("");
  const [page, setPage] = useState(1);

  const applyCustomRange = () => {
    setCustomError("");

    if (!customStart || !customEnd) {
      setCustomError("Both start and end dates are required.");
      return;
    }

    if (customEnd < customStart) {
      setCustomError("End date must be on or after start date.");
      return;
    }

    setFilter({
      type: "custom",
      startDate: customStart,
      endDate: customEnd,
    });
    setPage(1);
  };

  const setPresetFilter = (preset) => {
    setFilter({ type: "preset", preset });
    setPage(1);
  };

  return {
    today,
    filter,
    customStart,
    customEnd,
    customError,
    page,
    setPage,
    setCustomStart,
    setCustomEnd,
    applyCustomRange,
    setPresetFilter,
  };
}