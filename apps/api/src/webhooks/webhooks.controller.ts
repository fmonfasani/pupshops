import { Body, Controller, Post } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('mercado-pago')
  handleMercadoPago(@Body() body: { orderId: number; status: string }) {
    return this.webhooksService.handleMercadoPagoEvent(body);
  }
}
