import { Body, Controller, Get, Post } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateAppointmentDto } from './dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  list() {
    return this.servicesService.listServices();
  }

  @Post('appointments')
  createAppointment(@Body() dto: CreateAppointmentDto) {
    return this.servicesService.bookAppointment(dto);
  }
}
