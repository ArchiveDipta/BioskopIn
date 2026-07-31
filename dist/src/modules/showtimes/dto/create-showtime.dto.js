"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateShowtimeDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const ShowtimeSchema = zod_1.z.object({
    movieId: zod_1.z.string().min(1, 'Movie ID wajib diisi'),
    studioId: zod_1.z.string().min(1, 'Studio ID wajib diisi'),
    startTime: zod_1.z.string().datetime('Format waktu salah (ISO-8601)'),
    price: zod_1.z.number().positive('Harga tiket harus positif'),
});
class CreateShowtimeDto extends (0, nestjs_zod_1.createZodDto)(ShowtimeSchema) {
}
exports.CreateShowtimeDto = CreateShowtimeDto;
//# sourceMappingURL=create-showtime.dto.js.map