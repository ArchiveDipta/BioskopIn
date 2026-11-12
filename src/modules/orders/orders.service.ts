import { Injectable, ConflictException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CheckoutDto } from './dto/checkout-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import * as QRCode from 'qrcode';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private generateBookingCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  async checkout(userId: number, checkoutDto: CheckoutDto) {
    const { showtimeId, seatIds, foodItems } = checkoutDto;

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

        // Hitung total harga kursi
        let totalPrice = showtime.price * seatIds.length;

        // Validasi & hitung makanan/minuman (F&B) jika ada
        const foodOrderData: { foodItemId: number; quantity: number; price: number }[] = [];
        if (foodItems && foodItems.length > 0) {
          const foodItemIds = foodItems.map((f) => f.foodItemId);
          const foundFoods = await tx.foodItem.findMany({
            where: { id: { in: foodItemIds }, isAvailable: true },
          });

          if (foundFoods.length !== foodItems.length) {
            throw new BadRequestException('Satu atau lebih menu makanan/minuman tidak tersedia');
          }

          const foodMap = new Map(foundFoods.map((f) => [f.id, f.price]));
          for (const item of foodItems) {
            const price = foodMap.get(item.foodItemId)!;
            totalPrice += price * item.quantity;
            foodOrderData.push({
              foodItemId: item.foodItemId,
              quantity: item.quantity,
              price,
            });
          }
        }

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

        if (foodOrderData.length > 0) {
          await tx.orderFoodItem.createMany({
            data: foodOrderData.map((f) => ({
              orderId: newOrder.id,
              ...f,
            })),
          });
        }

        // Hapus kunci kursi sementara (SeatHold) milik user untuk kursi ini
        await tx.seatHold.deleteMany({
          where: {
            showtimeId,
            seatId: { in: seatIds },
            userId,
          },
        });

        return newOrder;
      });

      // Kembalikan data lengkap pesanan beserta tiket, film, studio, kursi, dan F&B
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
          foodItems: {
            include: {
              foodItem: true,
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

  async generateQrCode(orderId: number, user: any) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
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

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    if (user.role !== 'ADMIN' && order.userId !== user.id) {
      throw new ForbiddenException('Anda tidak berhak mengakses tiket ini');
    }

    const qrCodeDataUrl = await QRCode.toDataURL(order.bookingCode, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return {
      orderId: order.id,
      bookingCode: order.bookingCode,
      status: order.status,
      isCheckedIn: order.isCheckedIn,
      checkedInAt: order.checkedInAt,
      qrCodeDataUrl,
      ticketsCount: order.tickets.length,
      movieTitle: order.tickets[0]?.showtime?.movie?.title,
    };
  }

  async verifyTicket(bookingCode: string) {
    const order = await this.prisma.order.findUnique({
      where: { bookingCode },
      include: {
        user: { select: { id: true, name: true, email: true } },
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
        foodItems: {
          include: {
            foodItem: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Kode tiket tidak ditemukan');
    }

    if (order.status !== 'SUCCESS') {
      throw new BadRequestException(`Tiket belum dibayar / tidak valid (Status: ${order.status})`);
    }

    if (order.isCheckedIn) {
      throw new ConflictException(`Tiket ini sudah pernah digunakan untuk check-in pada: ${order.checkedInAt?.toISOString()}`);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        isCheckedIn: true,
        checkedInAt: new Date(),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
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
        foodItems: {
          include: {
            foodItem: true,
          },
        },
      },
    });

    return {
      message: 'Tiket berhasil diverifikasi! Selamat menonton.',
      checkedInAt: updatedOrder.checkedInAt,
      order: updatedOrder,
    };
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        tickets: { 
          include: { 
            seat: true,
            showtime: { 
              include: { 
                movie: true,
                studio: { include: { cinema: true } }
              } 
            } 
          } 
        },
        foodItems: {
          include: {
            foodItem: true,
          },
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
            seat: true,
            showtime: { 
              include: { 
                movie: true,
                studio: { include: { cinema: true } }
              } 
            } 
          } 
        },
        foodItems: {
          include: {
            foodItem: true,
          },
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
        foodItems: {
          include: {
            foodItem: true,
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

    // Hapus tiket dan F&B yang berelasi terlebih dahulu, baru pesanan utamanya
    return this.prisma.$transaction(async (tx) => {
      await tx.orderTicket.deleteMany({ where: { orderId: id } });
      await tx.orderFoodItem.deleteMany({ where: { orderId: id } });
      return tx.order.delete({ where: { id } });
    });
  }
}
