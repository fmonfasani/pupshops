import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateOrderDto) {
    return this.prisma.createOrder({
      userId: dto.userId,
      total: dto.total
    });
  }

  findByUser(userId: number) {
    return this.prisma.listOrdersByUser(userId);
  }
}
