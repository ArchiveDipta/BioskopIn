import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CinemaSchema = z.object({
  name: z.string().min(1, 'Nama bioskop wajib diisi'),
  city: z.string().min(1, 'Kota wajib diisi'),
  address: z.string().optional(),
});

export class CreateCinemaDto extends createZodDto(CinemaSchema) {}
