import { z } from 'zod';
declare const CreateStudioDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    cinemaId: z.ZodString;
    name: z.ZodString;
    rows: z.ZodNumber;
    seatsPerRow: z.ZodNumber;
}, z.core.$strip>, false>;
export declare class CreateStudioDto extends CreateStudioDto_base {
}
export {};
