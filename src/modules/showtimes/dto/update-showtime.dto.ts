import { createZodDto } from 'nestjs-zod';
import { ShowtimeSchema } from './create-showtime.dto';

export class UpdateShowtimeDto extends createZodDto(ShowtimeSchema.partial()) {}
