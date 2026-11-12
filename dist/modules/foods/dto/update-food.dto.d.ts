declare const UpdateFoodDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    name: import("zod").ZodOptional<import("zod").ZodString>;
    description: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
    price: import("zod").ZodOptional<import("zod").ZodCoercedNumber<unknown>>;
    imageUrl: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodOptional<import("zod").ZodString>, import("zod").ZodLiteral<"">]>>;
    category: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodString>>;
    isAvailable: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateFoodDto extends UpdateFoodDto_base {
}
export {};
