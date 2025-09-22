import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MercadoPagoService {
  constructor(private readonly prisma: PrismaService) {}

  async createCheckoutPreference(userId: number) {
    const items = await this.prisma.listProducts();
    const total = items.reduce((sum, product) => sum + product.price, 0);
    return {
      preferenceId: `pref-${Date.now()}`,
      initPoint: 'https://sandbox.mercadopago.com/checkout/start',
      total,
      userId,
      items
    };
  }
}
