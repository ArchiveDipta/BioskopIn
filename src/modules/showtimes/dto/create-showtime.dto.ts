import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ShowtimeSchema = z.object({
  movieId: z.string().min(1, 'Movie ID wajib diisi'),
  studioId: z.string().min(1, 'Studio ID wajib diisi'),
  startTime: z.string().datetime('Format waktu salah (ISO-8601)'),
  price: z.number().positive('Harga tiket harus positif'),
});

export class CreateShowtimeDto extends createZodDto(ShowtimeSchema) {}
