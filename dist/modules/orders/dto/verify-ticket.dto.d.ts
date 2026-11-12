import { z } from 'zod';
export declare const VerifyTicketSchema: z.ZodObject<{
    bookingCode: z.ZodString;
}, z.core.$strip>;
declare const VerifyTicketDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    bookingCode: z.ZodString;
}, z.core.$strip>, false>;
export declare class VerifyTicketDto extends VerifyTicketDto_base {
}
export {};
