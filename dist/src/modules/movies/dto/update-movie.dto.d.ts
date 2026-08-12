declare const UpdateMovieDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    title: import("zod").ZodOptional<import("zod").ZodString>;
    description: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
    duration: import("zod").ZodOptional<import("zod").ZodCoercedNumber<unknown>>;
    posterUrl: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodOptional<import("zod").ZodString>, import("zod").ZodLiteral<"">]>>;
    trailerUrl: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodOptional<import("zod").ZodString>, import("zod").ZodLiteral<"">]>>;
    category: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
    ageRating: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateMovieDto extends UpdateMovieDto_base {
}
export {};
