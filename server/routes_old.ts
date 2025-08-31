// server/routes.ts
import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";

import { storage } from "./storage";
import { register, login, authRequired } from "./auth";
import { sql } from 'drizzle-orm';
import {
  insertProductSchema,
  insertServiceSchema,
  insertBookingSchema,
  insertCategorySchema,
  insertPromotionSchema,
} from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health
  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  // Auth (JWT)
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.get("/api/me", authRequired, (req, res) => {
    // @ts-ignore (si no agregaste types para Request.user)
    res.json({ userId: req.user?.id });
  });

  // ------------------------------
  // Categories
  // ------------------------------
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get('/api/_diag', async (_req, res) => {
    const hasDbUrl = Boolean(process.env.DATABASE_URL);
    const hasJwt = Boolean(process.env.JWT_SECRET);
    let dbOk = false, dbErr: string | null = null;

    try {
      // ping a la DB (no filtra secretos)
      // @ts-ignore
      const r = await storage.db?.execute?.(sql`select 1 as ok`) ?? await (await import('./db')).db.execute(sql`select 1 as ok`);
      dbOk = Array.isArray(r?.rows) ? true : true; // drizzle-http vs node-postgres shape
    } catch (e: any) {
      dbErr = e?.message || String(e);
    }

    res.json({ env: { hasDbUrl, hasJwt, vercel: !!process.env.VERCEL, node: process.version }, db: { ok: dbOk, error: dbErr } });
  });

  app.post("/api/categories", authRequired, async (req: any, res) => {
    try {
      const userId = req.user?.id as string;
      const user = await storage.getUser(userId);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error) {
      res
        .status(400)
        .json({
          message:
            error instanceof Error ? error.message : "Invalid category data",
        });
    }
  });

  // ------------------------------
  // Products
  // ------------------------------
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId } = req.query;
      const products = categoryId
        ? await storage.getProductsByCategory(String(categoryId))
        : await storage.getProducts();
      res.json(products);
    } catch {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", authRequired, async (req: any, res) => {
    try {
      const userId = req.user?.id as string;
      const user = await storage.getUser(userId);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      res
        .status(400)
        .json({
          message:
            error instanceof Error ? error.message : "Invalid product data",
        });
    }
  });

  app.put("/api/products/:id", authRequired, async (req: any, res) => {
    try {
      const userId = req.user?.id as string;
      const user = await storage.getUser(userId);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const product = await storage.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      res
        .status(400)
        .json({
          message:
            error instanceof Error ? error.message : "Failed to update product",
        });
    }
  });

  app.delete("/api/products/:id", authRequired, async (req: any, res) => {
    try {
      const userId = req.user?.id as string;
      const user = await storage.getUser(userId);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.deleteProduct(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // ------------------------------
  // Services
  // ------------------------------
  app.get("/api/services", async (_req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) return res.status(404).json({ message: "Service not found" });
      res.json(service);
    } catch {
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  app.post("/api/services", authRequired, async (req: any, res) => {
    try {
      const userId = req.user?.id as string;
      const user = await storage.getUser(userId);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const serviceData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(serviceData);
      res.json(service);
    } catch (error) {
      res
        .status(400)
        .json({
          message:
            error instanceof Error ? error.message : "Invalid service data",
        });
    }
  });

  // ------------------------------
  // Cart
  // ------------------------------
  app.get("/api/cart", authRequired, async (req: any, res) => {
    try {
      const userId = req.user?.id as string;
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", authRequired, async (req: any, res) => {
    try {
      const userId = req.user?.id as string;
      const { productId, quantity } = req.body;

      const cartItem = await storage.addToCart({
        userId,
        productId,
        quantity: quantity || 1,
      });
      res.json(cartItem);
    } catch {
      res.status(400).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", authRequired, async (req: any, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      res.json(cartItem);
    } catch {
      res.status(400).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", authRequired, async (_req: any, res) => {
    try {
      await storage.removeFromCart(_req.params.id);
      res.json({ message: "Item removed from cart" });
    } catch {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart", authRequired, async (req: any, res) => {
    try {
      const userId = req.user?.id as string;
      await storage.clearCart(userId);
      res.json({ message: "Cart cleared" });
    } catch {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // ------------------------------
  // Orders
  // ------------------------------
  app.get("/api/orders", authRequired, async (req: any, res) => {
    try {
      const userId = req.user?.id as string;
      const user = await storage.getUser(userId);

      if (user?.role === "admin") {
        const orders = await storage.getOrders();
        res.json(orders);
      } else {
        const orders = await storage.getUserOrders(userId);
        res.json(orders);
      }
    } catch {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", authRequired, async (req: any, res) => {
    try {
      const userId = req.user?.id as string;
      const { items, shippingAddress, totalAmount } = req.body;

      const order = await storage.createOrder(
        {
          userId,
          status: "pending",
          totalAmount,
          shippingAddress,
          paymentStatus: "pending",
        },
        items
      );

      // Clear cart after creating order
      await storage.clearCart(userId);

      // Award points (1 point per dollar)
      const user = await storage.getUser(userId);
      if (user) {
        const currentPoints = Number(user?.points ?? 0);
        const newPoints = currentPoints + Math.floor(parseFloat(totalAmount));
        await storage.updateUserPoints(userId, newPoints);
      }

      res.json(order);
    } catch {
      res.status(400).json({ message: "Failed to create order" });
    }
  });

  // ------------------------------
  // Bookings
  // ------------------------------
  app.get("/api/bookings", authRequired, async (req: any, res) => {
    try {
      const userId = req.user?.id as string;
      const user = await storage.getUser(userId);

      if (user?.role === "admin") {
        const { date } = req.query;
        const bookings = date
          ? await storage.getBookingsByDate(String(date))
          : await storage.getBookings();
        res.json(bookings);
      } else {
        const bookings = await storage.getUserBookings(userId);
        res.json(bookings);
      }
    } catch {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.post("/api/bookings", authRequired, async (req: any, res) => {
    try {
      const userId = req.user?.id as string;
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        userId,
        status: "scheduled",
      });

      const booking = await storage.createBooking(bookingData);

      // Award points for booking service (1 point per $10 spent)
      const user = await storage.getUser(userId);
      if (user) {
        const servicePoints = Math.floor(parseFloat(booking.price) / 10);
        const basePoints = Number(user?.points ?? 0);
        const newPoints = basePoints + servicePoints;
        await storage.updateUserPoints(userId, newPoints);
      }

      res.json(booking);
    } catch (error) {
      res
        .status(400)
        .json({
          message:
            error instanceof Error ? error.message : "Invalid booking data",
        });
    }
  });

  app.put("/api/bookings/:id", authRequired, async (req: any, res) => {
    try {
      const userId = req.user?.id as string;
      const user = await storage.getUser(userId);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { status } = req.body;
      const booking = await storage.updateBookingStatus(req.params.id, status);
      res.json(booking);
    } catch {
      res.status(400).json({ message: "Failed to update booking status" });
    }
  });

  // ------------------------------
  // Promotions
  // ------------------------------
  app.get("/api/promotions", async (_req, res) => {
    try {
      const promotions = await storage.getActivePromotions();
      res.json(promotions);
    } catch {
      res.status(500).json({ message: "Failed to fetch promotions" });
    }
  });

  app.post("/api/promotions", authRequired, async (req: any, res) => {
    try {
      const userId = req.user?.id as string;
      const user = await storage.getUser(userId);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const promotionData = insertPromotionSchema.parse(req.body);
      const promotion = await storage.createPromotion(promotionData);
      res.json(promotion);
    } catch (error) {
      res
        .status(400)
        .json({
          message:
            error instanceof Error ? error.message : "Invalid promotion data",
        });
    }
  });

  // ------------------------------
  // Admin stats
  // ------------------------------
  app.get("/api/admin/stats", authRequired, async (req: any, res) => {
    try {
      const userId = req.user?.id as string;
      const user = await storage.getUser(userId);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const orders = await storage.getOrders();
      const bookings = await storage.getBookings();

      const totalSales = orders.reduce(
        (sum, order) => sum + parseFloat(order.totalAmount),
        0
      );
      const activeOrders = orders.filter(
        (order) => order.status === "processing" || order.status === "shipped"
      ).length;
      const today = new Date().toISOString().split("T")[0];
      const todayBookings = bookings.filter(
        (b) => b.appointmentDate === today
      ).length;

      res.json({
        totalSales: totalSales.toFixed(2),
        activeOrders,
        todayBookings,
        totalOrders: orders.length,
        totalBookings: bookings.length,
      });
    } catch {
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // Devuelve un http.Server (lo usa index.ts para .listen)
  const httpServer = createServer(app);
  return httpServer;
}
