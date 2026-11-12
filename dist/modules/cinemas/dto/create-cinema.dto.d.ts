import { z } from 'zod';
export declare const CinemaSchema: z.ZodObject<{
    name: z.ZodString;
    city: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const CreateCinemaDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodString;
    city: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, false>;
export declare class CreateCinemaDto extends CreateCinemaDto_base {
}
export {};
