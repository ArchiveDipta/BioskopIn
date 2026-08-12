import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const StudioSchema = z.object({
  cinemaId: z.string().min(1, 'ID Bioskop wajib diisi'),
  name: z.string().min(1, 'Nama studio wajib diisi'),
  rows: z.number().int().min(1).max(26, 'Maksimal 26 baris (A-Z)'),
  seatsPerRow: z.number().int().min(1).max(50, 'Maksimal 50 kursi per baris'),
});

export class CreateStudioDto extends createZodDto(StudioSchema) {}
