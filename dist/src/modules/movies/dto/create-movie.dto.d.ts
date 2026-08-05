import { z } from 'zod';
export declare const MovieSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    duration: z.ZodCoercedNumber<unknown>;
    posterUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    trailerUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
declare const CreateMovieDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    duration: z.ZodCoercedNumber<unknown>;
    posterUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    trailerUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>, false>;
export declare class CreateMovieDto extends CreateMovieDto_base {
}
export {};
