"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMovieDto = exports.MovieSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.MovieSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Judul wajib diisi'),
    description: zod_1.z.string().optional(),
    duration: zod_1.z.coerce.number().int().positive('Durasi harus angka positif'),
    posterUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    trailerUrl: zod_1.z.string().url('URL Trailer tidak valid').optional().or(zod_1.z.literal('')),
    category: zod_1.z.string().optional(),
    ageRating: zod_1.z.string().optional(),
});
class CreateMovieDto extends (0, nestjs_zod_1.createZodDto)(exports.MovieSchema) {
}
exports.CreateMovieDto = CreateMovieDto;
//# sourceMappingURL=create-movie.dto.js.map