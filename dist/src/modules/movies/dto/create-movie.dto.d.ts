import { z } from 'zod';
declare const CreateMovieDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    duration: z.ZodNumber;
    posterUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    trailerUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>, false>;
export declare class CreateMovieDto extends CreateMovieDto_base {
}
export {};
