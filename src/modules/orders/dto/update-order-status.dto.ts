import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateStatusSchema = z.object({
  status: z.enum(['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED']),
});

export class UpdateOrderStatusDto extends createZodDto(UpdateStatusSchema) {}
