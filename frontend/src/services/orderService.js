// src/services/orderService.js
import api from "./api";

export async function fetchOrders(params = {}) {
  const response = await api.get("/api/orders", { params });
  return response.data.data;
}

export async function fetchOrderById(orderId) {
  const response = await api.get(`/api/orders/${orderId}`);
  return response.data.data;
}

export async function createOrder(payload) {
  const response = await api.post("/api/orders", payload);
  return response.data.data;
}

export async function updateOrder(orderId, payload) {
  const response = await api.patch(`/api/orders/${orderId}`, payload);
  return response.data.data;
}

export async function cancelOrder(orderId, payload) {
  const response = await api.patch(`/api/orders/${orderId}/cancel`, payload);
  return response.data.data;
}