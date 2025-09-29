import { z } from 'zod';
export declare const entrepriseSchema: z.ZodObject<{
    nom: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    adresse: z.ZodOptional<z.ZodString>;
    telephone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    estActive: z.ZodOptional<z.ZodBoolean>;
    dateCreation: z.ZodOptional<z.ZodDate>;
}, z.core.$strip>;
//# sourceMappingURL=entreprise.d.ts.map