declare const UpdateShowtimeDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    movieId: import("zod").ZodOptional<import("zod").ZodString>;
    studioId: import("zod").ZodOptional<import("zod").ZodString>;
    startTime: import("zod").ZodOptional<import("zod").ZodString>;
    price: import("zod").ZodOptional<import("zod").ZodNumber>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateShowtimeDto extends UpdateShowtimeDto_base {
}
export {};
