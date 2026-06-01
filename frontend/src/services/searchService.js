// src/services/searchService.js
import api from "./api";

export async function searchTickets(q) {
  const response = await api.get("/api/search/tickets", {
    params: { q },
  });
  return response.data.data;
}