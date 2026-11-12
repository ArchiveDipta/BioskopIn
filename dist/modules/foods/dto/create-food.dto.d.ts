import { z } from 'zod';
export declare const FoodSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodCoercedNumber<unknown>;
    imageUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    category: z.ZodDefault<z.ZodString>;
    isAvailable: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
declare const CreateFoodDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodCoercedNumber<unknown>;
    imageUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    category: z.ZodDefault<z.ZodString>;
    isAvailable: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>, false>;
export declare class CreateFoodDto extends CreateFoodDto_base {
}
export {};
