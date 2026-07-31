"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyGoogleDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const VerifyGoogleSchema = zod_1.z.object({
    idToken: zod_1.z.string().min(1, 'idToken wajib dikirim dari aplikasi Android'),
});
class VerifyGoogleDto extends (0, nestjs_zod_1.createZodDto)(VerifyGoogleSchema) {
}
exports.VerifyGoogleDto = VerifyGoogleDto;
//# sourceMappingURL=verify-google.dto.js.map