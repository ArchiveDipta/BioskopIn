"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDto = exports.RegisterSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.RegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Nama wajib diisi'),
    email: zod_1.z.string().email('Format email tidak valid'),
    password: zod_1.z.string().min(6, 'Password minimal 6 karakter'),
});
class RegisterDto extends (0, nestjs_zod_1.createZodDto)(exports.RegisterSchema) {
}
exports.RegisterDto = RegisterDto;
//# sourceMappingURL=register.dto.js.map