"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateBookingCode() {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    async checkout(userId, checkoutDto) {
        const { showtimeId, seatIds } = checkoutDto;
        try {
            const order = await this.prisma.$transaction(async (tx) => {
                const showtime = await tx.showtime.findUnique({
                    where: { id: showtimeId },
                });
                if (!showtime) {
                    throw new common_1.NotFoundException('Jadwal tidak ditemukan');
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
            return order;
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Mohon maaf, kursi telah dipesan orang lain.');
            }
            throw error;
        }
    }
    async findAll() {
        return this.prisma.order.findMany({
            include: {
                user: { select: { id: true, name: true, email: true } },
                tickets: { include: { showtime: { include: { movie: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findMyOrders(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                tickets: { include: { showtime: { include: { movie: true } } } },
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
                            include: { movie: true, studio: true },
                        },
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        }
        if (user.role !== 'ADMIN' && order.userId !== user.id) {
            throw new common_1.ConflictException('Anda tidak berhak melihat pesanan ini');
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