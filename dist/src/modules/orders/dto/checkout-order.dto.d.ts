import { z } from 'zod';
declare const CheckoutDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    showtimeId: z.ZodString;
    seatIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>, false>;
export declare class CheckoutDto extends CheckoutDto_base {
}
export {};
