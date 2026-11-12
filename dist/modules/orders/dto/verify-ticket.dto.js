"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyTicketDto = exports.VerifyTicketSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.VerifyTicketSchema = zod_1.z.object({
    bookingCode: zod_1.z.string().min(1, 'Kode booking wajib diisi'),
});
class VerifyTicketDto extends (0, nestjs_zod_1.createZodDto)(exports.VerifyTicketSchema) {
}
exports.VerifyTicketDto = VerifyTicketDto;
//# sourceMappingURL=verify-ticket.dto.js.map