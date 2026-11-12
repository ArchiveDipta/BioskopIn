import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PaymentWebhookController } from './webhook.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OrdersService],
  controllers: [OrdersController, PaymentWebhookController],
  exports: [OrdersService],
})
export class OrdersModule {}
