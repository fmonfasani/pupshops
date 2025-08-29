import { apiRequest } from "@/lib/queryClient";

export const api = {
  // Products
  getProducts: () => fetch("/api/products").then(res => res.json()),
  getProduct: (id: string) => fetch(`/api/products/${id}`).then(res => res.json()),
  
  // Services
  getServices: () => fetch("/api/services").then(res => res.json()),
  getService: (id: string) => fetch(`/api/services/${id}`).then(res => res.json()),
  
  // Categories
  getCategories: () => fetch("/api/categories").then(res => res.json()),
  
  // Cart
  getCart: () => fetch("/api/cart", { credentials: 'include' }).then(res => res.json()),
  addToCart: (productId: string, quantity: number = 1) => 
    apiRequest("POST", "/api/cart", { productId, quantity }),
  updateCartItem: (id: string, quantity: number) =>
    apiRequest("PUT", `/api/cart/${id}`, { quantity }),
  removeFromCart: (id: string) =>
    apiRequest("DELETE", `/api/cart/${id}`),
  clearCart: () =>
    apiRequest("DELETE", "/api/cart"),
  
  // Orders
  getOrders: () => fetch("/api/orders", { credentials: 'include' }).then(res => res.json()),
  createOrder: (orderData: any) =>
    apiRequest("POST", "/api/orders", orderData),
  
  // Bookings
  getBookings: () => fetch("/api/bookings", { credentials: 'include' }).then(res => res.json()),
  createBooking: (bookingData: any) =>
    apiRequest("POST", "/api/bookings", bookingData),
  
  // Admin
  getAdminStats: () => fetch("/api/admin/stats", { credentials: 'include' }).then(res => res.json()),
  createProduct: (productData: any) =>
    apiRequest("POST", "/api/products", productData),
  updateProduct: (id: string, productData: any) =>
    apiRequest("PUT", `/api/products/${id}`, productData),
  deleteProduct: (id: string) =>
    apiRequest("DELETE", `/api/products/${id}`),
  createService: (serviceData: any) =>
    apiRequest("POST", "/api/services", serviceData),
  updateBookingStatus: (id: string, status: string) =>
    apiRequest("PUT", `/api/bookings/${id}`, { status }),
};
