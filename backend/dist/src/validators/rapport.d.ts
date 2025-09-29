import { z } from 'zod';
export declare const rapportValidator: z.ZodObject<{
    typeRapport: z.ZodEnum<{
        BULLETINS: "BULLETINS";
        EMPLOYES: "EMPLOYES";
        PAIEMENTS: "PAIEMENTS";
        STATISTIQUES: "STATISTIQUES";
    }>;
    contenu: z.ZodAny;
    dateGeneration: z.ZodOptional<z.ZodDate>;
    entrepriseId: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=rapport.d.ts.map