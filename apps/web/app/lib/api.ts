import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
});

export const getProducts = () => api.get('/products').then((res) => res.data);
export const getServices = () => api.get('/services').then((res) => res.data);
export const login = (credentials: { email: string; password: string }) =>
  api.post('/auth/login', credentials).then((res) => res.data);
export const register = (payload: { email: string; password: string; name?: string }) =>
  api.post('/auth/register', payload).then((res) => res.data);
export const createOrder = (payload: { userId: number; total: number }) =>
  api.post('/orders', payload).then((res) => res.data);
export const createAppointment = (payload: {
  serviceId: number;
  customerName: string;
  customerEmail: string;
  scheduledFor: string;
}) => api.post('/services/appointments', payload).then((res) => res.data);
export const createCheckoutPreference = (payload: { userId: number }) =>
  api.post('/mercado-pago/checkout', payload).then((res) => res.data);
