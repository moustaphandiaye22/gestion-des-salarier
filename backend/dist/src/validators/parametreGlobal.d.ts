import { z } from 'zod';
export declare const parametreGlobalSchema: z.ZodObject<{
    cle: z.ZodString;
    valeur: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    categorie: z.ZodOptional<z.ZodString>;
    estModifiable: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const parametreGlobalUpdateSchema: z.ZodObject<{
    cle: z.ZodOptional<z.ZodString>;
    valeur: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    categorie: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    estModifiable: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
}, z.core.$strip>;
//# sourceMappingURL=parametreGlobal.d.ts.map