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
exports.StudiosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let StudiosService = class StudiosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createStudioDto) {
        const { cinemaId, name, rows, seatsPerRow } = createStudioDto;
        const totalCapacity = rows * seatsPerRow;
        return this.prisma.$transaction(async (tx) => {
            const studio = await tx.studio.create({
                data: {
                    cinemaId,
                    name,
                    totalCapacity,
                },
            });
            const seatsData = [];
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for (let i = 0; i < rows; i++) {
                const rowLetter = alphabet[i];
                for (let j = 1; j <= seatsPerRow; j++) {
                    seatsData.push({
                        studioId: studio.id,
                        row: rowLetter,
                        number: j,
                    });
                }
            }
            await tx.seat.createMany({
                data: seatsData,
            });
            return studio;
        });
    }
    async findAll(cinemaId) {
        return this.prisma.studio.findMany({
            where: cinemaId ? { cinemaId } : undefined,
            include: {
                _count: {
                    select: { seats: true },
                },
            },
        });
    }
    async findOne(id) {
        const studio = await this.prisma.studio.findUnique({
            where: { id },
            include: { seats: true },
        });
        if (!studio)
            throw new common_1.NotFoundException('Studio tidak ditemukan');
        return studio;
    }
    async remove(id) {
        return this.prisma.$transaction(async (tx) => {
            await tx.seat.deleteMany({ where: { studioId: id } });
            return tx.studio.delete({ where: { id } });
        });
    }
};
exports.StudiosService = StudiosService;
exports.StudiosService = StudiosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudiosService);
//# sourceMappingURL=studios.service.js.map