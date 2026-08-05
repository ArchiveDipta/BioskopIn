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
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
let MoviesService = class MoviesService {
    prisma;
    storageService;
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    async create(createMovieDto, file) {
        let posterUrl = createMovieDto.posterUrl;
        if (file) {
            const filename = `poster-${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            posterUrl = await this.storageService.uploadFile('movie-posters', filename, file.buffer, file.mimetype);
        }
        return this.prisma.movie.create({
            data: {
                ...createMovieDto,
                posterUrl,
            },
        });
    }
    async findAllActive() {
        return this.prisma.movie.findMany({
            include: {
                showtimes: {
                    where: {
                        startTime: {
                            gte: new Date(),
                        },
                    },
                    orderBy: {
                        startTime: 'asc',
                    },
                },
            },
        });
    }
    async update(id, updateMovieDto, file) {
        let posterUrl = updateMovieDto.posterUrl;
        if (file) {
            const filename = `poster-${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            posterUrl = await this.storageService.uploadFile('movie-posters', filename, file.buffer, file.mimetype);
        }
        const data = { ...updateMovieDto };
        if (posterUrl) {
            data.posterUrl = posterUrl;
        }
        return this.prisma.movie.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.movie.delete({
            where: { id },
        });
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], MoviesService);
//# sourceMappingURL=movies.service.js.map