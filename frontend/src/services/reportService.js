import api from "./api";

function buildParams(filter, extras = {}) {
  const base =
    filter.type === "preset"
      ? { preset: filter.preset }
      : { startDate: filter.startDate, endDate: filter.endDate };

  return { ...base, ...extras };
}

export async function getOverviewReport(filter) {
  const params = new URLSearchParams(buildParams(filter)).toString();
  const res = await api.get(`/api/reports/overview?${params}`);
  return res.data.data;
}

export async function getReportOrders(filter, page = 1, limit = 20) {
  const params = new URLSearchParams(
    buildParams(filter, { page, limit })
  ).toString();

  const res = await api.get(`/api/reports/orders?${params}`);
  return res.data.data;
}