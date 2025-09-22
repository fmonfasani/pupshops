import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MercadoPagoService } from '../mercado-pago/mercado-pago.service';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private mercadoPagoService: MercadoPagoService,
  ) {}

  async checkout(createOrderDto: CreateOrderDto) {
    const { items, couponCode, userId } = createOrderDto;

    // Calculate total
    let total = 0;
    const productIds = items.map(item => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        throw new BadRequestException(`Product with id ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Not enough stock for product ${product.name}`);
      }
      total += product.price * item.quantity;
    }

    // Apply coupon if provided
    let coupon = null;
    if (couponCode) {
      coupon = await this.prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (!coupon) {
        throw new BadRequestException('Invalid coupon');
      }

      if (coupon.expiryDate && coupon.expiryDate < new Date()) {
        throw new BadRequestException('Coupon has expired');
      }

      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        throw new BadRequestException('Coupon has been fully used');
      }

      if (coupon.minAmount && total < coupon.minAmount) {
        throw new BadRequestException(`Minimum amount for coupon is ${coupon.minAmount}`);
      }

      // Apply discount
      if (coupon.type === 'PERCENTAGE') {
        total = total * (1 - coupon.value / 100);
      } else {
        total = total - coupon.value;
      }
    }

    // Create order with pending status
    const order = await this.prisma.$transaction(async (prisma) => {
      const createdOrder = await prisma.order.create({
        data: {
          total,
          status: 'PENDING',
          userId,
          items: {
            create: items.map(item => {
              const product = products.find(p => p.id === item.productId);
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
              };
            }),
          },
          coupons: coupon
            ? {
                create: {
                  couponId: coupon.id,
                },
              }
            : undefined,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          coupons: {
            include: {
              coupon: true,
            },
          },
        },
      });

      // Update coupon usage count
      if (coupon) {
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      return createdOrder;
    });

    // Create MercadoPago preference
    const preference = await this.mercadoPagoService.createPreference({
      items: order.items.map(item => ({
        title: item.product.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'ARS',
      })),
      external_reference: order.id,
      notification_url: `${process.env.API_URL}/webhooks/mercadopago`,
    });

    return {
      orderId: order.id,
      preferenceId: preference.id,
      initPoint: preference.init_point,
    };
  }
}