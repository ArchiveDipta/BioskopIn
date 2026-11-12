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
exports.FoodsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FoodsService = class FoodsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createFoodDto) {
        return this.prisma.foodItem.create({
            data: createFoodDto,
        });
    }
    async findAll(category) {
        return this.prisma.foodItem.findMany({
            where: {
                isAvailable: true,
                ...(category ? { category } : {}),
            },
            orderBy: { id: 'asc' },
        });
    }
    async findOne(id) {
        const item = await this.prisma.foodItem.findUnique({
            where: { id },
        });
        if (!item) {
            throw new common_1.NotFoundException('Menu makanan/minuman tidak ditemukan');
        }
        return item;
    }
    async update(id, updateFoodDto) {
        await this.findOne(id);
        return this.prisma.foodItem.update({
            where: { id },
            data: updateFoodDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.foodItem.delete({
            where: { id },
        });
    }
};
exports.FoodsService = FoodsService;
exports.FoodsService = FoodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FoodsService);
//# sourceMappingURL=foods.service.js.map