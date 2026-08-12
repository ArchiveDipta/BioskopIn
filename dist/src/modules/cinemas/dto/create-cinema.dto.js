"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCinemaDto = exports.CinemaSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.CinemaSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Nama bioskop wajib diisi'),
    city: zod_1.z.string().min(1, 'Kota wajib diisi'),
    address: zod_1.z.string().optional(),
});
class CreateCinemaDto extends (0, nestjs_zod_1.createZodDto)(exports.CinemaSchema) {
}
exports.CreateCinemaDto = CreateCinemaDto;
//# sourceMappingURL=create-cinema.dto.js.map