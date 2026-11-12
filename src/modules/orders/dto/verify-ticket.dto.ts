import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const VerifyTicketSchema = z.object({
  bookingCode: z.string().min(1, 'Kode booking wajib diisi'),
});

export class VerifyTicketDto extends createZodDto(VerifyTicketSchema) {}
