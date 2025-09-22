import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

type User = {
  id: number;
  email: string;
  name?: string;
  passwordHash: string;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

type Service = {
  id: number;
  name: string;
  slug: string;
  durationMinutes: number;
  description: string;
  price: number;
};

type Appointment = {
  id: number;
  serviceId: number;
  customerName: string;
  customerEmail: string;
  scheduledFor: string;
};

type Order = {
  id: number;
  userId: number;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
};

@Injectable()
export class PrismaService {
  private users: User[] = [];
  private products: Product[] = [];
  private services: Service[] = [];
  private appointments: Appointment[] = [];
  private orders: Order[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    this.products = [
      {
        id: 1,
        name: 'Alimento Premium para Perros',
        slug: 'alimento-premium-perros',
        price: 45,
        description: 'Bolsa de 10kg de alimento balanceado para perros adultos.',
        category: 'alimentos',
        image: 'https://images.unsplash.com/photo-1619983081593-ec39b6f0195d?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 2,
        name: 'Arena Sanitaria Aglomerante',
        slug: 'arena-sanitaria-aglomerante',
        price: 15,
        description: 'Arena sanitaria con alta absorción para gatos.',
        category: 'higiene',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80'
      }
    ];

    this.services = [
      {
        id: 1,
        name: 'Baño y Corte Canino',
        slug: 'bano-y-corte-canino',
        durationMinutes: 60,
        description: 'Servicio completo de baño, secado y corte higiénico.',
        price: 35
      },
      {
        id: 2,
        name: 'Consulta Veterinaria',
        slug: 'consulta-veterinaria',
        durationMinutes: 30,
        description: 'Evaluación clínica general y asesoramiento nutricional.',
        price: 25
      }
    ];
  }

  async findUserByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  async findUserById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  async createUser(params: { email: string; password: string; name?: string }) {
    const id = this.users.length + 1;
    const passwordHash = await bcrypt.hash(params.password, 10);
    const user: User = {
      id,
      email: params.email,
      name: params.name,
      passwordHash
    };
    this.users.push(user);
    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  async listProducts() {
    return this.products;
  }

  async listServices() {
    return this.services;
  }

  async createAppointment(data: Omit<Appointment, 'id'>) {
    const appointment: Appointment = {
      id: this.appointments.length + 1,
      ...data
    };
    this.appointments.push(appointment);
    return appointment;
  }

  async createOrder(data: Omit<Order, 'id' | 'createdAt' | 'status'>) {
    const order: Order = {
      id: this.orders.length + 1,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...data
    };
    this.orders.push(order);
    return order;
  }

  async listOrdersByUser(userId: number) {
    return this.orders.filter((order) => order.userId === userId);
  }

  async updateOrderStatus(orderId: number, status: Order['status']) {
    const order = this.orders.find((item) => item.id === orderId);
    if (order) {
      order.status = status;
    }
    return order ?? null;
  }
}
