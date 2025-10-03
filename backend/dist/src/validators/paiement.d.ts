import { z } from 'zod';
export declare const paiementSchema: z.ZodObject<{
    montant: z.ZodOptional<z.ZodNumber>;
    datePaiement: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodDate, z.ZodString]>, z.ZodTransform<Date, string | Date>>>;
    modePaiement: z.ZodEnum<{
        ESPECES: "ESPECES";
        CHEQUE: "CHEQUE";
        VIREMENT: "VIREMENT";
        WAVE: "WAVE";
        ORANGE_MONEY: "ORANGE_MONEY";
    }>;
    statut: z.ZodOptional<z.ZodEnum<{
        EN_ATTENTE: "EN_ATTENTE";
        PAYE: "PAYE";
        ECHEC: "ECHEC";
    }>>;
    reference: z.ZodOptional<z.ZodString>;
    employeId: z.ZodNumber;
    cycleId: z.ZodNumber;
    entrepriseId: z.ZodNumber;
    bulletinId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=paiement.d.ts.map