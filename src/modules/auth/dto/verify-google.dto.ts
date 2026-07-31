import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const VerifyGoogleSchema = z.object({
  idToken: z.string().min(1, 'idToken wajib dikirim dari aplikasi Android'),
});

export class VerifyGoogleDto extends createZodDto(VerifyGoogleSchema) {}
