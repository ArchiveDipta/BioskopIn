import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Payments & Webhooks')
@Controller('orders/payment-webhook')
export class PaymentWebhookController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Webhook notifikasi status pembayaran dari Midtrans (Publik)' })
  handleWebhook(@Body() body: any) {
    return this.ordersService.handleMidtransWebhook(body);
  }
}
