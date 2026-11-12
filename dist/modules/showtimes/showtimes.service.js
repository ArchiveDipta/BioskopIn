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
exports.ShowtimesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ShowtimesService = class ShowtimesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createShowtimeDto) {
        return this.prisma.showtime.create({
            data: {
                ...createShowtimeDto,
                startTime: new Date(createShowtimeDto.startTime),
            },
            include: {
                movie: true,
                studio: {
                    include: {
                        cinema: true,
                    },
                },
            },
        });
    }
    async findAll(movieId, studioId, cinemaId) {
        const where = {};
        if (movieId)
            where.movieId = movieId;
        if (studioId)
            where.studioId = studioId;
        if (cinemaId) {
            where.studio = { cinemaId };
        }
        return this.prisma.showtime.findMany({
            where,
            include: {
                movie: true,
                studio: {
                    include: {
                        cinema: true,
                    },
                },
            },
            orderBy: {
                startTime: 'asc',
            },
        });
    }
    async findOne(id) {
        const showtime = await this.prisma.showtime.findUnique({
            where: { id },
            include: {
                movie: true,
                studio: {
                    include: {
                        cinema: true,
                    },
                },
            },
        });
        if (!showtime) {
            throw new common_1.NotFoundException('Jadwal tayang tidak ditemukan');
        }
        return showtime;
    }
    async holdSeats(showtimeId, userId, seatIds) {
        const now = new Date();
        await this.prisma.seatHold.deleteMany({
            where: { expiresAt: { lte: now } },
        });
        const showtime = await this.prisma.showtime.findUnique({
            where: { id: showtimeId },
        });
        if (!showtime) {
            throw new common_1.NotFoundException('Jadwal tayang tidak ditemukan');
        }
        const validSeats = await this.prisma.seat.findMany({
            where: {
                id: { in: seatIds },
                studioId: showtime.studioId,
            },
        });
        if (validSeats.length !== seatIds.length) {
            throw new common_1.BadRequestException('Satu atau lebih kursi tidak valid untuk studio pada jadwal ini');
        }
        const alreadyBooked = await this.prisma.orderTicket.findMany({
            where: {
                showtimeId,
                seatId: { in: seatIds },
            },
        });
        if (alreadyBooked.length > 0) {
            throw new common_1.ConflictException('Satu atau lebih kursi telah dibeli pengguna lain');
        }
        const activeHolds = await this.prisma.seatHold.findMany({
            where: {
                showtimeId,
                seatId: { in: seatIds },
                userId: { not: userId },
                expiresAt: { gt: now },
            },
        });
        if (activeHolds.length > 0) {
            throw new common_1.ConflictException('Satu atau lebih kursi sedang dikunci sementara oleh pengguna lain');
        }
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        return this.prisma.$transaction(async (tx) => {
            await tx.seatHold.deleteMany({
                where: { showtimeId, userId },
            });
            await tx.seatHold.createMany({
                data: seatIds.map((seatId) => ({
                    showtimeId,
                    userId,
                    seatId,
                    expiresAt,
                })),
            });
            return {
                message: 'Kursi berhasil dikunci selama 10 menit',
                showtimeId,
                heldSeatIds: seatIds,
                expiresAt,
            };
        });
    }
    async getSeatsAvailability(showtimeId, currentUserId) {
        const now = new Date();
        await this.prisma.seatHold.deleteMany({
            where: { expiresAt: { lte: now } },
        });
        const showtime = await this.prisma.showtime.findUnique({
            where: { id: showtimeId },
            include: {
                studio: {
                    include: {
                        seats: true,
                    },
                },
                tickets: true,
            },
        });
        if (!showtime) {
            throw new common_1.NotFoundException('Jadwal tayang tidak ditemukan');
        }
        const bookedSeatIds = new Set(showtime.tickets.map((t) => t.seatId));
        const activeHolds = await this.prisma.seatHold.findMany({
            where: {
                showtimeId,
                expiresAt: { gt: now },
            },
        });
        const heldMap = new Map(activeHolds.map((h) => [h.seatId, h.userId]));
        const seatsWithAvailability = showtime.studio.seats.map((seat) => {
            let status = 'AVAILABLE';
            let isAvailable = true;
            if (bookedSeatIds.has(seat.id)) {
                status = 'BOOKED';
                isAvailable = false;
            }
            else if (heldMap.has(seat.id)) {
                const heldUserId = heldMap.get(seat.id);
                if (currentUserId && heldUserId === currentUserId) {
                    status = 'HELD_BY_YOU';
                    isAvailable = true;
                }
                else {
                    status = 'LOCKED';
                    isAvailable = false;
                }
            }
            return {
                ...seat,
                isAvailable,
                status,
            };
        });
        return seatsWithAvailability;
    }
    async update(id, updateShowtimeDto) {
        const data = { ...updateShowtimeDto };
        if (data.startTime) {
            data.startTime = new Date(data.startTime);
        }
        return this.prisma.showtime.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.showtime.delete({
            where: { id },
        });
    }
};
exports.ShowtimesService = ShowtimesService;
exports.ShowtimesService = ShowtimesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShowtimesService);
//# sourceMappingURL=showtimes.service.js.map