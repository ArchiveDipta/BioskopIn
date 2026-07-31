import { z } from 'zod';
declare const CreateShowtimeDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    movieId: z.ZodString;
    studioId: z.ZodString;
    startTime: z.ZodString;
    price: z.ZodNumber;
}, z.core.$strip>, false>;
export declare class CreateShowtimeDto extends CreateShowtimeDto_base {
}
export {};
