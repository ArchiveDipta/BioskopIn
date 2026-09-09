import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ShowtimeSchema = z.object({
  movieId: z.coerce.number().int(),
  studioId: z.coerce.number().int(),
  startTime: z.string().datetime('Format waktu salah (ISO-8601)'),
  price: z.number().positive('Harga tiket harus positif'),
});

export class CreateShowtimeDto extends createZodDto(ShowtimeSchema) {}
