"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFoodDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const create_food_dto_1 = require("./create-food.dto");
class UpdateFoodDto extends (0, nestjs_zod_1.createZodDto)(create_food_dto_1.FoodSchema.partial()) {
}
exports.UpdateFoodDto = UpdateFoodDto;
//# sourceMappingURL=update-food.dto.js.map