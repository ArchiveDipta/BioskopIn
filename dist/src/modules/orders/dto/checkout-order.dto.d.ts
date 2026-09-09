import { z } from 'zod';
declare const CheckoutDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    showtimeId: z.ZodCoercedNumber<unknown>;
    seatIds: z.ZodArray<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>, false>;
export declare class CheckoutDto extends CheckoutDto_base {
}
export {};
