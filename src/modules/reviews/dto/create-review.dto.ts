import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ReviewSchema = z.object({
  rating: z.coerce.number().int().min(1, 'Rating minimal 1 bintang').max(5, 'Rating maksimal 5 bintang'),
  comment: z.string().optional(),
});

export class CreateReviewDto extends createZodDto(ReviewSchema) {}
