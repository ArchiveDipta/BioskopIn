import { Controller, Get, Post, Body, Req, Param, Patch, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { VerifyTicketDto } from './dto/verify-ticket.dto';
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
  @ApiOperation({ summary: 'Membuat pesanan tiket baru & F&B (Checkout)' })
  checkout(@Body() checkoutDto: CheckoutDto, @Req() req: any) {
    return this.ordersService.checkout(req.user.id, checkoutDto);
  }

  @Post(':id/pay')
  @ApiOperation({ summary: 'Simulasi pembayaran pesanan tiket (Mengubah status PENDING -> SUCCESS)' })
  simulatePay(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.ordersService.simulatePay(id, req.user);
  }

  @Post('verify-ticket')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Verifikasi tiket bioskop & check-in penonton oleh staf (Khusus Admin)' })
  verifyTicket(@Body() verifyDto: VerifyTicketDto) {
    return this.ordersService.verifyTicket(verifyDto.bookingCode);
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
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.ordersService.findOne(id, req.user);
  }

  @Get(':id/qrcode')
  @ApiOperation({ summary: 'Mendapatkan QR Code E-Ticket (DataURL Gambar)' })
  getQrCode(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.ordersService.generateQrCode(id, req.user);
  }

  @Patch(':id/status')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Memperbarui status pesanan (Khusus Admin)' })
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, updateDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Menghapus pesanan secara permanen (Khusus Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
