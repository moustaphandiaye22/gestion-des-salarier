import { z } from 'zod';
export declare const cyclePaieSchema: z.ZodObject<{
    periodeDebut: z.ZodDate;
    periodeFin: z.ZodDate;
    typeCycle: z.ZodEnum<{
        MENSUEL: "MENSUEL";
        HEBDOMADAIRE: "HEBDOMADAIRE";
        QUINZAINE: "QUINZAINE";
    }>;
    estFerme: z.ZodOptional<z.ZodBoolean>;
    entrepriseId: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=cyclePaie.d.ts.map