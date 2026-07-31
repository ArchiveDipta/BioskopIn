"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStudioDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const StudioSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Nama studio wajib diisi'),
    rows: zod_1.z.number().int().min(1).max(26, 'Maksimal 26 baris (A-Z)'),
    seatsPerRow: zod_1.z.number().int().min(1).max(50, 'Maksimal 50 kursi per baris'),
});
class CreateStudioDto extends (0, nestjs_zod_1.createZodDto)(StudioSchema) {
}
exports.CreateStudioDto = CreateStudioDto;
//# sourceMappingURL=create-studio.dto.js.map