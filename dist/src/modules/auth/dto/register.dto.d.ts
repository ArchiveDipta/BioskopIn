import { z } from 'zod';
export declare const RegisterSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
declare const RegisterDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>, false>;
export declare class RegisterDto extends RegisterDto_base {
}
export {};
