import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const HoldSeatsSchema = z.object({
  seatIds: z
    .array(z.coerce.number().int())
    .min(1, 'Pilih minimal 1 kursi')
    .refine((items) => new Set(items).size === items.length, {
      message: 'Terdapat duplikasi kursi',
    }),
});

export class HoldSeatsDto extends createZodDto(HoldSeatsSchema) {}
