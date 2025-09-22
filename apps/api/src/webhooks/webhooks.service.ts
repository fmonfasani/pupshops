import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MercadoPagoService } from '../mercado-pago/mercado-pago.service';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private prisma: PrismaService,
    private mercadoPagoService: MercadoPagoService,
  ) {}

  verifyMercadoPagoSignature(body: any, signature: string, requestId: string): boolean {
    const secret = process.env.MP_WEBHOOK_SECRET;
    if (!secret) {
      this.logger.error('MP_WEBHOOK_SECRET not set');
      return false;
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(requestId)
      .digest('hex');

    return generatedSignature === signature;
  }

  async processMercadoPagoWebhook(body: any) {
    try {
      const { type, data } = body;

      if (type === 'payment') {
        const paymentId = data.id;
        const payment = await this.mercadoPagoService.getPayment(paymentId);

        if (payment.status === 'approved') {
          const externalReference = payment.external_reference;
          const mpPaymentId = payment.id;

          // Check if payment was already processed
          const existingOrder = await this.prisma.order.findFirst({
            where: {
              id: externalReference,
              status: 'PAID',
            },
          });

          if (existingOrder) {
            this.logger.log(`Payment ${mpPaymentId} already processed`);
            return { status: 'already_processed' };
          }

          // Process payment in a transaction
          await this.prisma.$transaction(async (prisma) => {
            // Update order status
            const order = await prisma.order.update({
              where: { id: externalReference },
              data: { status: 'PAID' },
              include: {
                items: true,
              },
            });

            // Update inventory
            for (const item of order.items) {
              await prisma.inventoryMovement.create({
                data: {
                  type: 'OUT',
                  quantity: item.quantity,
                  productId: item.productId,
                  notes: `Order ${order.id}`,
                },
              });

              await prisma.product.update({
                where: { id: item.productId },
                data: {
                  stock: {
                    decrement: item.quantity,
                  },
                },
              });
            }

            // Log event
            await prisma.eventLog.create({
              data: {
                event: 'payment_approved',
                data: {
                  orderId: order.id,
                  mpPaymentId,
                },
              },
            });

            // Update loyalty points (1 point per $10 spent)
            const pointsEarned = Math.floor(order.total / 10);
            if (pointsEarned > 0) {
              await prisma.loyalty.update({
                where: { userId: order.userId },
                data: {
                  points: {
                    increment: pointsEarned,
                  },
                  lastUpdated: new Date(),
                },
              });
            }
          });

          this.logger.log(`Payment ${mpPaymentId} processed successfully`);
          return { status: 'processed' };
        }
      }

      return { status: 'ignored' };
    } catch (error) {
      this.logger.error('Error processing MercadoPago webhook', error);
      throw error;
    }
  }
}