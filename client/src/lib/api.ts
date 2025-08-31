import { apiRequest } from "@/lib/queryClient";

// Mock ApiClient for demonstration purposes. In a real application, this would be imported from a separate file.
class ApiClient {
  async get(url: string) {
    const response = await fetch(url, {
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async post(url: string, data: any) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async put(url: string, data: any) {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async delete(url: string) {
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Cart specific methods - using consistent get() method
  async getCart() {
    return this.get('/api/cart');
  }

  async addToCart(productId: string, quantity = 1) {
    return this.post('/api/cart', { productId, quantity });
  }

  async updateCartItem(id: string, quantity: number) {
    return this.put(`/api/cart/${id}`, { quantity });
  }

  async removeFromCart(id: string) {
    return this.delete(`/api/cart/${id}`);
  }

  async clearCart() {
    return this.delete('/api/cart');
  }
}

// Instantiate the ApiClient
const apiClient = new ApiClient();

export const api = {
  // Auth
  getUser: () => apiClient.get("/api/auth/user"),

  // Products
  getProducts: () => apiClient.get("/api/products"),
  getProduct: (id: string) => apiClient.get(`/api/products/${id}`),

  // Services
  getServices: () => apiClient.get("/api/services"),
  getService: (id: string) => apiClient.get(`/api/services/${id}`),

  // Categories
  getCategories: () => apiClient.get("/api/categories"),

  // Cart
  getCart: () => apiClient.getCart(),
  addToCart: (productId: string, quantity: number = 1) =>
    apiClient.addToCart(productId, quantity),
  updateCartItem: (id: string, quantity: number) =>
    apiClient.updateCartItem(id, quantity),
  removeFromCart: (id: string) =>
    apiClient.removeFromCart(id),
  clearCart: () =>
    apiClient.clearCart(),

  // Orders
  getOrders: () => apiClient.get("/api/orders"),
  createOrder: (orderData: any) =>
    apiRequest("POST", "/api/orders", orderData), // Assuming apiRequest is a fallback or for specific cases

  // Bookings
  getBookings: () => apiClient.get("/api/bookings"),
  createBooking: (bookingData: any) =>
    apiRequest("POST", "/api/bookings", bookingData), // Assuming apiRequest is a fallback or for specific cases

  // Admin
  getAdminStats: () => apiClient.get("/api/admin/stats"),
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