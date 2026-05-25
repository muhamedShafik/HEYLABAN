import api from "./api";

export const fetchCatalogue = async () => {
  const response = await api.get("/api/catalogue");
  return response.data.data.categories; // returns the categories array directly
};