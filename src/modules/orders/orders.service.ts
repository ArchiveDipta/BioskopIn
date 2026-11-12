import { Injectable, ConflictException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CheckoutDto } from './dto/checkout-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private generateBookingCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  async checkout(userId: number, checkoutDto: CheckoutDto) {
    const { showtimeId, seatIds } = checkoutDto;

    try {
      const order = await this.prisma.$transaction(async (tx) => {
        const showtime = await tx.showtime.findUnique({
          where: { id: showtimeId },
        });

        if (!showtime) {
          throw new NotFoundException('Jadwal tayang tidak ditemukan');
        }

        // Validasi: pastikan semua kursi yang dipilih terdaftar di studio jadwal ini
        const validSeats = await tx.seat.findMany({
          where: {
            id: { in: seatIds },
            studioId: showtime.studioId,
          },
        });

        if (validSeats.length !== seatIds.length) {
          throw new BadRequestException('Satu atau lebih kursi tidak valid untuk studio pada jadwal ini');
        }

        // Validasi: pastikan kursi belum dipesan orang lain
        const alreadyBooked = await tx.orderTicket.findMany({
          where: {
            showtimeId,
            seatId: { in: seatIds },
          },
        });

        if (alreadyBooked.length > 0) {
          throw new ConflictException('Mohon maaf, satu atau lebih kursi yang Anda pilih telah dipesan orang lain.');
        }

        const totalPrice = showtime.price * seatIds.length;
        const bookingCode = this.generateBookingCode();

        const newOrder = await tx.order.create({
          data: {
            userId,
            totalPrice,
            status: 'SUCCESS',
            bookingCode,
          },
        });

        const orderTicketsData = seatIds.map((seatId) => ({
          orderId: newOrder.id,
          showtimeId,
          seatId,
          price: showtime.price,
        }));

        await tx.orderTicket.createMany({
          data: orderTicketsData,
        });

        return newOrder;
      });

      // Kembalikan data lengkap pesanan beserta tiket, film, studio, dan nomor kursi
      return this.prisma.order.findUnique({
        where: { id: order.id },
        include: {
          tickets: {
            include: {
              seat: true,
              showtime: {
                include: {
                  movie: true,
                  studio: { include: { cinema: true } },
                },
              },
            },
          },
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Mohon maaf, kursi telah dipesan orang lain.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        tickets: { 
          include: { 
            showtime: { 
              include: { 
                movie: true,
                studio: { include: { cinema: true } }
              } 
            } 
          } 
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        tickets: { 
          include: { 
            showtime: { 
              include: { 
                movie: true,
                studio: { include: { cinema: true } }
              } 
            } 
          } 
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, user: any) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        tickets: {
          include: {
            seat: true,
            showtime: {
              include: { 
                movie: true, 
                studio: { include: { cinema: true } } 
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }
    
    // Authorization Check
    if (user.role !== 'ADMIN' && order.userId !== user.id) {
      throw new ForbiddenException('Anda tidak berhak melihat pesanan ini');
    }
    
    return order;
  }

  async updateStatus(id: number, updateDto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Pesanan tidak ditemukan');

    return this.prisma.order.update({
      where: { id },
      data: { status: updateDto.status as any },
    });
  }

  async remove(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Pesanan tidak ditemukan');

    // Hapus tiket yang berelasi terlebih dahulu, baru pesanan utamanya
    return this.prisma.$transaction(async (tx) => {
      await tx.orderTicket.deleteMany({ where: { orderId: id } });
      return tx.order.delete({ where: { id } });
    });
  }
}
