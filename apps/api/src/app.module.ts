import { Module, Controller, Get } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { ServicesModule } from './services/services.module';
import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Controller('health')
class HealthController {
  @Get()
  getHealth() {
    return { ok: true };
  }
}

@Controller('products')
class ProductsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.listProducts();
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    PrismaModule,
    AuthModule,
    OrdersModule,
    ServicesModule,
    MercadoPagoModule,
    WebhooksModule
  ],
  controllers: [HealthController, ProductsController]
})
export class AppModule {}
