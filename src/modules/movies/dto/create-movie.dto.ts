import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const MovieSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  description: z.string().optional(),
  duration: z.coerce.number().int().positive('Durasi harus angka positif'),
  posterUrl: z.string().url().optional().or(z.literal('')),
  trailerUrl: z.string().url('URL Trailer tidak valid').optional().or(z.literal('')),
});

export class CreateMovieDto extends createZodDto(MovieSchema) {}
