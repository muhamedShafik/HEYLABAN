// src/services/paymentService.js
import api from "./api";

export async function createOrderPayment(orderId, payload) {
  const response = await api.post(`/api/orders/${orderId}/payments`, payload);
  return response.data?.data || response.data;
}