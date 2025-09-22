import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  listServices() {
    return this.prisma.listServices();
  }

  bookAppointment(dto: CreateAppointmentDto) {
    return this.prisma.createAppointment({
      serviceId: dto.serviceId,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      scheduledFor: dto.scheduledFor
    });
  }
}
