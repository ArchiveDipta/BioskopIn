"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoldSeatsDto = exports.HoldSeatsSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.HoldSeatsSchema = zod_1.z.object({
    seatIds: zod_1.z
        .array(zod_1.z.coerce.number().int())
        .min(1, 'Pilih minimal 1 kursi')
        .refine((items) => new Set(items).size === items.length, {
        message: 'Terdapat duplikasi kursi',
    }),
});
class HoldSeatsDto extends (0, nestjs_zod_1.createZodDto)(exports.HoldSeatsSchema) {
}
exports.HoldSeatsDto = HoldSeatsDto;
//# sourceMappingURL=hold-seats.dto.js.map