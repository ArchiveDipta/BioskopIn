import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const FoodSchema = z.object({
  name: z.string().min(1, 'Nama makanan/minuman wajib diisi'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Harga harus lebih dari 0'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().default('SNACK'),
  isAvailable: z.boolean().optional().default(true),
});

export class CreateFoodDto extends createZodDto(FoodSchema) {}
