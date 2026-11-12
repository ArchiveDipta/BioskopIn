declare const UpdateShowtimeDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    movieId: import("zod").ZodOptional<import("zod").ZodCoercedNumber<unknown>>;
    studioId: import("zod").ZodOptional<import("zod").ZodCoercedNumber<unknown>>;
    startTime: import("zod").ZodOptional<import("zod").ZodString>;
    price: import("zod").ZodOptional<import("zod").ZodCoercedNumber<unknown>>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateShowtimeDto extends UpdateShowtimeDto_base {
}
export {};
