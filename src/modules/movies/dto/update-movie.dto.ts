import { createZodDto } from 'nestjs-zod';
import { MovieSchema } from './create-movie.dto';

export class UpdateMovieDto extends createZodDto(MovieSchema.partial()) {}
