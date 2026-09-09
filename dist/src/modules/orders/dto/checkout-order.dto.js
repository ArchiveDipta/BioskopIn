"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const CheckoutSchema = zod_1.z.object({
    showtimeId: zod_1.z.coerce.number().int(),
    seatIds: zod_1.z
        .array(zod_1.z.coerce.number().int())
        .min(1, 'Pilih minimal 1 kursi')
        .refine((items) => new Set(items).size === items.length, {
        message: 'Terdapat duplikasi kursi',
    }),
});
class CheckoutDto extends (0, nestjs_zod_1.createZodDto)(CheckoutSchema) {
}
exports.CheckoutDto = CheckoutDto;
//# sourceMappingURL=checkout-order.dto.js.map