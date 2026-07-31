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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRevenue(startDate, endDate) {
        const whereClause = {
            status: 'SUCCESS',
        };
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate)
                whereClause.createdAt.gte = new Date(startDate);
            if (endDate)
                whereClause.createdAt.lte = new Date(endDate);
        }
        const result = await this.prisma.order.aggregate({
            _sum: {
                totalPrice: true,
            },
            where: whereClause,
        });
        return { totalRevenue: result._sum.totalPrice || 0 };
    }
    async getTopMovies() {
        const topMovies = await this.prisma.$queryRaw `
      SELECT 
        m.id, 
        m.title, 
        COUNT(ot.id) as ticketsSold
      FROM Movie m
      JOIN Showtime s ON s.movieId = m.id
      JOIN OrderTicket ot ON ot.showtimeId = s.id
      JOIN \`Order\` o ON ot.orderId = o.id
      WHERE o.status = 'SUCCESS'
      GROUP BY m.id, m.title
      ORDER BY ticketsSold DESC
      LIMIT 5
    `;
        return topMovies.map((movie) => ({
            ...movie,
            ticketsSold: Number(movie.ticketsSold),
        }));
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map