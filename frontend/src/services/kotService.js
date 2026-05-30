// src/services/kotService.js
import api from "./api";

export const createKot = async (orderId, payload) => {
  const response = await api.post(`/api/orders/${orderId}/kot`, payload);
  return response.data?.data || response.data;
};

export const getKotById = async (kotId) => {
  const response = await api.get(`/api/orders/kot/${kotId}`);
  return response.data?.data || response.data;
};