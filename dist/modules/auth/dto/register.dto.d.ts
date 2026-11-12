import { z } from 'zod';
export declare const RegisterSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        USER: "USER";
        CUSTOMER: "CUSTOMER";
    }>>;
}, z.core.$strip>;
declare const RegisterDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        USER: "USER";
        CUSTOMER: "CUSTOMER";
    }>>;
}, z.core.$strip>, false>;
export declare class RegisterDto extends RegisterDto_base {
}
export {};
