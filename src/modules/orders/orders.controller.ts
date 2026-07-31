import { Controller, Get, Post, Body, Req, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Membuat pesanan tiket baru (Checkout)' })
  checkout(@Body() checkoutDto: CheckoutDto, @Req() req: any) {
    // userId didapat otomatis dari token JWT yang sudah di-decode oleh AuthGuard
    return this.ordersService.checkout(req.user.id, checkoutDto);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Mengambil riwayat pesanan milik user yang sedang login' })
  findMyOrders(@Req() req: any) {
    return this.ordersService.findMyOrders(req.user.id);
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Mengambil seluruh data pesanan (Khusus Admin)' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mengambil detail satu pesanan (Hanya pemilik atau Admin)' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.ordersService.findOne(id, req.user);
  }

  @Patch(':id/status')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Memperbarui status pesanan (Khusus Admin)' })
  updateStatus(@Param('id') id: string, @Body() updateDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, updateDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Menghapus pesanan secara permanen (Khusus Admin)' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
