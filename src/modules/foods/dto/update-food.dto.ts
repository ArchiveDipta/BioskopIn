import { createZodDto } from 'nestjs-zod';
import { FoodSchema } from './create-food.dto';

export class UpdateFoodDto extends createZodDto(FoodSchema.partial()) {}
