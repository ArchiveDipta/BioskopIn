"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderStatusDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const UpdateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED']),
});
class UpdateOrderStatusDto extends (0, nestjs_zod_1.createZodDto)(UpdateStatusSchema) {
}
exports.UpdateOrderStatusDto = UpdateOrderStatusDto;
//# sourceMappingURL=update-order-status.dto.js.map