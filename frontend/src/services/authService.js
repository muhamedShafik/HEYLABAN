import api from "./api";

export const changePassword = async (payload) => {
  const response = await api.post("/api/profile/password/change", payload);
  return response.data;
};