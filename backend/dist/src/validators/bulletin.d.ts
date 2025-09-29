import { z } from 'zod';
export declare const bulletinSchema: z.ZodObject<{
    numeroBulletin: z.ZodString;
    periodeDebut: z.ZodDate;
    periodeFin: z.ZodDate;
    salaireBase: z.ZodNumber;
    allocations: z.ZodOptional<z.ZodNumber>;
    deductions: z.ZodOptional<z.ZodNumber>;
    totalAPayer: z.ZodNumber;
    statutPaiement: z.ZodOptional<z.ZodEnum<{
        EN_ATTENTE: "EN_ATTENTE";
        PAYE: "PAYE";
        ECHEC: "ECHEC";
    }>>;
    dateGeneration: z.ZodOptional<z.ZodDate>;
    cycleId: z.ZodNumber;
    employeId: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=bulletin.d.ts.map