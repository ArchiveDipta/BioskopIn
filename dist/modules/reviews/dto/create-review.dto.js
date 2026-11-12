"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReviewDto = exports.ReviewSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.ReviewSchema = zod_1.z.object({
    rating: zod_1.z.coerce.number().int().min(1, 'Rating minimal 1 bintang').max(5, 'Rating maksimal 5 bintang'),
    comment: zod_1.z.string().optional(),
});
class CreateReviewDto extends (0, nestjs_zod_1.createZodDto)(exports.ReviewSchema) {
}
exports.CreateReviewDto = CreateReviewDto;
//# sourceMappingURL=create-review.dto.js.map