import { Controller, Post, Body } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';

@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @Post('checkout')
  createCheckout(@Body('userId') userId: number) {
    const id = Number(userId ?? 0);
    return this.mercadoPagoService.createCheckoutPreference(Number.isNaN(id) ? 0 : id);
  }
}
