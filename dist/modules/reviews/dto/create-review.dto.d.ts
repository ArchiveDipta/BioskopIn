import { z } from 'zod';
export declare const ReviewSchema: z.ZodObject<{
    rating: z.ZodCoercedNumber<unknown>;
    comment: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const CreateReviewDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    rating: z.ZodCoercedNumber<unknown>;
    comment: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, false>;
export declare class CreateReviewDto extends CreateReviewDto_base {
}
export {};
