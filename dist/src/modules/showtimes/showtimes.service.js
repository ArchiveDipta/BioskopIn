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
        });
    }
    async getSeatsAvailability(showtimeId) {
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
        const seatsWithAvailability = showtime.studio.seats.map((seat) => ({
            ...seat,
            isAvailable: !bookedSeatIds.has(seat.id),
        }));
        return seatsWithAvailability;
    }
};
exports.ShowtimesService = ShowtimesService;
exports.ShowtimesService = ShowtimesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShowtimesService);
//# sourceMappingURL=showtimes.service.js.map