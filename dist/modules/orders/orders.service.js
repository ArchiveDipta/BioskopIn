"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const QRCode = __importStar(require("qrcode"));
const axios_1 = __importDefault(require("axios"));
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateBookingCode() {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    async createPaymentSession(order, user) {
        const serverKey = process.env.MIDTRANS_SERVER_KEY;
        if (serverKey) {
            try {
                const auth = Buffer.from(serverKey + ':').toString('base64');
                const res = await axios_1.default.post('https://app.sandbox.midtrans.com/snap/v1/transactions', {
                    transaction_details: {
                        order_id: `ORDER-${order.id}-${order.bookingCode}`,
                        gross_amount: Math.round(order.totalPrice),
                    },
                    customer_details: {
                        first_name: user?.name || 'Customer',
                        email: user?.email || 'customer@bioskopin.com',
                    },
                }, {
                    headers: {
                        Authorization: `Basic ${auth}`,
                        'Content-Type': 'application/json',
                    },
                });
                return {
                    snapToken: res.data.token,
                    paymentUrl: res.data.redirect_url,
                };
            }
            catch (err) {
                console.error('Midtrans Snap Error:', err?.response?.data || err?.message);
            }
        }
        return {
            snapToken: `mock_snap_${order.bookingCode}`,
            paymentUrl: `https://bioskopin-production.up.railway.app/orders/${order.id}/pay`,
        };
    }
    async checkout(userId, checkoutDto) {
        const { showtimeId, seatIds, foodItems } = checkoutDto;
        try {
            const order = await this.prisma.$transaction(async (tx) => {
                const user = await tx.user.findUnique({ where: { id: userId } });
                const showtime = await tx.showtime.findUnique({
                    where: { id: showtimeId },
                });
                if (!showtime) {
                    throw new common_1.NotFoundException('Jadwal tayang tidak ditemukan');
                }
                const validSeats = await tx.seat.findMany({
                    where: {
                        id: { in: seatIds },
                        studioId: showtime.studioId,
                    },
                });
                if (validSeats.length !== seatIds.length) {
                    throw new common_1.BadRequestException('Satu atau lebih kursi tidak valid untuk studio pada jadwal ini');
                }
                const alreadyBooked = await tx.orderTicket.findMany({
                    where: {
                        showtimeId,
                        seatId: { in: seatIds },
                    },
                });
                if (alreadyBooked.length > 0) {
                    throw new common_1.ConflictException('Mohon maaf, satu atau lebih kursi yang Anda pilih telah dipesan orang lain.');
                }
                let totalPrice = showtime.price * seatIds.length;
                const foodOrderData = [];
                if (foodItems && foodItems.length > 0) {
                    const foodItemIds = foodItems.map((f) => f.foodItemId);
                    const foundFoods = await tx.foodItem.findMany({
                        where: { id: { in: foodItemIds }, isAvailable: true },
                    });
                    if (foundFoods.length !== foodItems.length) {
                        throw new common_1.BadRequestException('Satu atau lebih menu makanan/minuman tidak tersedia');
                    }
                    const foodMap = new Map(foundFoods.map((f) => [f.id, f.price]));
                    for (const item of foodItems) {
                        const price = foodMap.get(item.foodItemId);
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
                await tx.seatHold.deleteMany({
                    where: {
                        showtimeId,
                        seatId: { in: seatIds },
                        userId,
                    },
                });
                return updatedOrder;
            });
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
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Mohon maaf, kursi telah dipesan orang lain.');
            }
            throw error;
        }
    }
    async simulatePay(orderId, user) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        if (user.role !== 'ADMIN' && order.userId !== user.id) {
            throw new common_1.ForbiddenException('Anda tidak berhak membayar pesanan ini');
        }
        if (order.status === 'SUCCESS') {
            throw new common_1.ConflictException('Pesanan ini sudah berhasil dibayar sebelumnya');
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
    async handleMidtransWebhook(body) {
        const { order_id, transaction_status, payment_type } = body;
        if (!order_id)
            throw new common_1.BadRequestException('Payload notifikasi tidak valid');
        const parts = order_id.split('-');
        const id = parseInt(parts[1], 10);
        if (!id)
            return { message: 'Order ID tidak valid' };
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            return { message: 'Pesanan tidak ditemukan' };
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
    async generateQrCode(orderId, user) {
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
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        }
        if (user.role !== 'ADMIN' && order.userId !== user.id) {
            throw new common_1.ForbiddenException('Anda tidak berhak mengakses tiket ini');
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
    async verifyTicket(bookingCode) {
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
            throw new common_1.NotFoundException('Kode tiket tidak ditemukan');
        }
        if (order.status !== 'SUCCESS') {
            throw new common_1.BadRequestException(`Tiket belum dibayar / tidak valid (Status: ${order.status})`);
        }
        if (order.isCheckedIn) {
            throw new common_1.ConflictException(`Tiket ini sudah pernah digunakan untuk check-in pada: ${order.checkedInAt?.toISOString()}`);
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
    async findMyOrders(userId) {
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
    async findOne(id, user) {
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
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        }
        if (user.role !== 'ADMIN' && order.userId !== user.id) {
            throw new common_1.ForbiddenException('Anda tidak berhak melihat pesanan ini');
        }
        return order;
    }
    async updateStatus(id, updateDto) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        return this.prisma.order.update({
            where: { id },
            data: { status: updateDto.status },
        });
    }
    async remove(id) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        return this.prisma.$transaction(async (tx) => {
            await tx.orderTicket.deleteMany({ where: { orderId: id } });
            await tx.orderFoodItem.deleteMany({ where: { orderId: id } });
            return tx.order.delete({ where: { id } });
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map