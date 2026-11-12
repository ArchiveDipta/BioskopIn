import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const FoodOrderItemSchema = z.object({
  foodItemId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
});

const CheckoutSchema = z.object({
  showtimeId: z.coerce.number().int(),
  seatIds: z
    .array(z.coerce.number().int())
    .min(1, 'Pilih minimal 1 kursi')
    .refine((items) => new Set(items).size === items.length, {
      message: 'Terdapat duplikasi kursi',
    }),
  foodItems: z.array(FoodOrderItemSchema).optional(),
});

export class CheckoutDto extends createZodDto(CheckoutSchema) {}
