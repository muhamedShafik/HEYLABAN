// src/services/orderService.js
import api from "./api";

export const createOrder = async (payload) => {
  const response = await api.post("/api/orders", payload);
  return response.data?.data || response.data;
};

export const updateOrder = async (orderId, payload) => {
  const response = await api.patch(`/api/orders/${orderId}`, payload);
  return response.data?.data || response.data;
};