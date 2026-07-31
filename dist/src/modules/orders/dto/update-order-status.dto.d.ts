import { z } from 'zod';
declare const UpdateOrderStatusDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    status: z.ZodEnum<{
        PENDING: "PENDING";
        SUCCESS: "SUCCESS";
        FAILED: "FAILED";
        CANCELLED: "CANCELLED";
    }>;
}, z.core.$strip>, false>;
export declare class UpdateOrderStatusDto extends UpdateOrderStatusDto_base {
}
export {};
