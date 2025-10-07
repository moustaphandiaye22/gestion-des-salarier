import { z } from 'zod';
export declare const utilisateurValidator: z.ZodObject<{
    nom: z.ZodString;
    email: z.ZodString;
    motDePasse: z.ZodString;
    role: z.ZodEnum<{
        SUPER_ADMIN: "SUPER_ADMIN";
        ADMIN_ENTREPRISE: "ADMIN_ENTREPRISE";
        CAISSIER: "CAISSIER";
        VIGILE: "VIGILE";
        EMPLOYE: "EMPLOYE";
    }>;
    estActif: z.ZodOptional<z.ZodBoolean>;
    entrepriseId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=utilisateur.d.ts.map