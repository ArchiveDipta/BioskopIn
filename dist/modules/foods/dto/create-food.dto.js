"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFoodDto = exports.FoodSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.FoodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Nama makanan/minuman wajib diisi'),
    description: zod_1.z.string().optional(),
    price: zod_1.z.coerce.number().positive('Harga harus lebih dari 0'),
    imageUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    category: zod_1.z.string().default('SNACK'),
    isAvailable: zod_1.z.boolean().optional().default(true),
});
class CreateFoodDto extends (0, nestjs_zod_1.createZodDto)(exports.FoodSchema) {
}
exports.CreateFoodDto = CreateFoodDto;
//# sourceMappingURL=create-food.dto.js.map