import { z } from 'zod';
export declare const HoldSeatsSchema: z.ZodObject<{
    seatIds: z.ZodArray<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const HoldSeatsDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    seatIds: z.ZodArray<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>, false>;
export declare class HoldSeatsDto extends HoldSeatsDto_base {
}
export {};
