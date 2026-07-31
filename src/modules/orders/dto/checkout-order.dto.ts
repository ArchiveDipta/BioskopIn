import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CheckoutSchema = z.object({
  showtimeId: z.string().min(1, 'Jadwal tidak valid'),
  seatIds: z
    .array(z.string())
    .min(1, 'Pilih minimal 1 kursi')
    .refine((items) => new Set(items).size === items.length, {
      message: 'Terdapat duplikasi kursi',
    }),
});

export class CheckoutDto extends createZodDto(CheckoutSchema) {}
