import { z } from 'zod';
export declare const journalAuditValidator: z.ZodObject<{
    action: z.ZodEnum<{
        CREATION: "CREATION";
        MODIFICATION: "MODIFICATION";
        SUPPRESSION: "SUPPRESSION";
        CONNEXION: "CONNEXION";
        DECONNEXION: "DECONNEXION";
        EXPORTATION: "EXPORTATION";
        GENERATION: "GENERATION";
    }>;
    details: z.ZodAny;
    dateAction: z.ZodOptional<z.ZodDate>;
    utilisateurId: z.ZodOptional<z.ZodNumber>;
    entrepriseId: z.ZodOptional<z.ZodNumber>;
    employeId: z.ZodOptional<z.ZodNumber>;
    bulletinId: z.ZodOptional<z.ZodNumber>;
    paiementId: z.ZodOptional<z.ZodNumber>;
    cyclePaieId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=journalAudit.d.ts.map