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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(movieId, userId, createReviewDto) {
        const movie = await this.prisma.movie.findUnique({
            where: { id: movieId },
        });
        if (!movie) {
            throw new common_1.NotFoundException('Film tidak ditemukan');
        }
        const existingReview = await this.prisma.review.findUnique({
            where: {
                userId_movieId: {
                    userId,
                    movieId,
                },
            },
        });
        if (existingReview) {
            throw new common_1.ConflictException('Anda sudah memberikan ulasan untuk film ini');
        }
        const verifiedTicket = await this.prisma.orderTicket.findFirst({
            where: {
                order: {
                    userId,
                    status: 'SUCCESS',
                },
                showtime: {
                    movieId,
                },
            },
        });
        if (!verifiedTicket) {
            throw new common_1.ForbiddenException('Hanya penonton yang telah membeli tiket film ini yang dapat memberikan ulasan');
        }
        return this.prisma.review.create({
            data: {
                movieId,
                userId,
                rating: createReviewDto.rating,
                comment: createReviewDto.comment,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });
    }
    async findByMovie(movieId) {
        const movie = await this.prisma.movie.findUnique({
            where: { id: movieId },
        });
        if (!movie) {
            throw new common_1.NotFoundException('Film tidak ditemukan');
        }
        const reviews = await this.prisma.review.findMany({
            where: { movieId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
            : 0;
        return {
            movieId,
            movieTitle: movie.title,
            totalReviews,
            averageRating,
            reviews,
        };
    }
    async remove(id, userId, role) {
        const review = await this.prisma.review.findUnique({
            where: { id },
        });
        if (!review) {
            throw new common_1.NotFoundException('Ulasan tidak ditemukan');
        }
        if (role !== 'ADMIN' && review.userId !== userId) {
            throw new common_1.ForbiddenException('Anda tidak berhak menghapus ulasan ini');
        }
        return this.prisma.review.delete({
            where: { id },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map