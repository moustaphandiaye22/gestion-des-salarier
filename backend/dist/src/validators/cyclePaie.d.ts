import { z } from 'zod';
export declare const cyclePaieSchema: z.ZodObject<{
    nom: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    dateDebut: z.ZodString;
    dateFin: z.ZodString;
    frequence: z.ZodEnum<{
        MENSUEL: "MENSUEL";
        HEBDOMADAIRE: "HEBDOMADAIRE";
        QUINZAINE: "QUINZAINE";
    }>;
    entrepriseId: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=cyclePaie.d.ts.map