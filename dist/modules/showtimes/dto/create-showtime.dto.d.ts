import { z } from 'zod';
export declare const ShowtimeSchema: z.ZodObject<{
    movieId: z.ZodCoercedNumber<unknown>;
    studioId: z.ZodCoercedNumber<unknown>;
    startTime: z.ZodString;
    price: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
declare const CreateShowtimeDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    movieId: z.ZodCoercedNumber<unknown>;
    studioId: z.ZodCoercedNumber<unknown>;
    startTime: z.ZodString;
    price: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>, false>;
export declare class CreateShowtimeDto extends CreateShowtimeDto_base {
}
export {};
