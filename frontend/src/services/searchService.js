import api from "./api";

export async function searchTickets(q) {
  try {
    const response = await api.get("/api/search/tickets", {
      params: { q },
    });

    return response.data.data;
  } catch (error) {
    if (error?.response?.status === 404) {
      return null;
    }

    throw error;
  }
}