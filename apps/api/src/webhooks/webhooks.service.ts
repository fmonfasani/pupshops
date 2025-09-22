import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  constructor(private readonly prisma: PrismaService) {}

  async handleMercadoPagoEvent(event: { orderId: number; status: string }) {
    const statusMap: Record<string, 'pending' | 'paid' | 'cancelled'> = {
      approved: 'paid',
      success: 'paid',
      pending: 'pending',
      cancelled: 'cancelled'
    };
    const status = statusMap[event.status?.toLowerCase?.() ?? 'pending'] ?? 'pending';
    const order = await this.prisma.updateOrderStatus(event.orderId, status);
    return {
      received: true,
      order
    };
  }
}
