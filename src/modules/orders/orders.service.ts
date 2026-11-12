import { Injectable, ConflictException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CheckoutDto } from './dto/checkout-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import * as QRCode from 'qrcode';
import axios from 'axios';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private generateBookingCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  private async createPaymentSession(order: any, user: any) {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (serverKey) {
      try {
        const auth = Buffer.from(serverKey + ':').toString('base64');
        const res = await axios.post(
          'https://app.sandbox.midtrans.com/snap/v1/transactions',
          {
            transaction_details: {
              order_id: `ORDER-${order.id}-${order.bookingCode}`,
              gross_amount: Math.round(order.totalPrice),
            },
            customer_details: {
              first_name: user?.name || 'Customer',
              email: user?.email || 'customer@bioskopin.com',
            },
          },
          {
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
          },
        );
        return {
          snapToken: res.data.token,
          paymentUrl: res.data.redirect_url,
        };
      } catch (err: any) {
        console.error('Midtrans Snap Error:', err?.response?.data || err?.message);
      }
    }

    // Fallback Simulator Mode jika MIDTRANS_SERVER_KEY belum diisi
    return {
      snapToken: `mock_snap_${order.bookingCode}`,
      paymentUrl: `https://bioskopin-production.up.railway.app/orders/${order.id}/pay`,
    };
  }

  async checkout(userId: number, checkoutDto: CheckoutDto) {
    const { showtimeId, seatIds, foodItems } = checkoutDto;

    try {
      const order = await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({ where: { id: userId } });
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
            status: 'PENDING',
            bookingCode,
          },
        });

        const paymentSession = await this.createPaymentSession(newOrder, user);

        const updatedOrder = await tx.order.update({
          where: { id: newOrder.id },
          data: {
            snapToken: paymentSession.snapToken,
            paymentUrl: paymentSession.paymentUrl,
          },
        });

        const orderTicketsData = seatIds.map((seatId) => ({
          orderId: updatedOrder.id,
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
              orderId: updatedOrder.id,
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

        return updatedOrder;
      });

      // Kembalikan data lengkap pesanan beserta tiket, film, studio, kursi, F&B, dan URL pembayaran
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

  async simulatePay(orderId: number, user: any) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Pesanan tidak ditemukan');
    if (user.role !== 'ADMIN' && order.userId !== user.id) {
      throw new ForbiddenException('Anda tidak berhak membayar pesanan ini');
    }
    if (order.status === 'SUCCESS') {
      throw new ConflictException('Pesanan ini sudah berhasil dibayar sebelumnya');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'SUCCESS',
        paidAt: new Date(),
        paymentType: 'MOCK_SIMULATION',
      },
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
  }

  async handleMidtransWebhook(body: any) {
    const { order_id, transaction_status, payment_type } = body;
    if (!order_id) throw new BadRequestException('Payload notifikasi tidak valid');

    // Format order_id: ORDER-{id}-{bookingCode}
    const parts = order_id.split('-');
    const id = parseInt(parts[1], 10);
    if (!id) return { message: 'Order ID tidak valid' };

    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) return { message: 'Pesanan tidak ditemukan' };

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      await this.prisma.order.update({
        where: { id },
        data: {
          status: 'SUCCESS',
          paidAt: new Date(),
          paymentType: payment_type || 'MIDTRANS',
        },
      });
      return { message: 'Pembayaran sukses tercatat' };
    }

    if (transaction_status === 'cancel' || transaction_status === 'expire' || transaction_status === 'deny') {
      await this.prisma.$transaction(async (tx) => {
        await tx.orderTicket.deleteMany({ where: { orderId: id } });
        await tx.order.update({
          where: { id },
          data: { status: 'CANCELLED' },
        });
      });
      return { message: 'Pesanan dibatalkan dan kursi dilepaskan kembali' };
    }

    return { message: 'Status transaksi diperbarui', status: transaction_status };
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
