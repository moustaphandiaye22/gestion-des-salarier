import { z } from 'zod';
export declare const paiementSchema: z.ZodObject<{
    montant: z.ZodNumber;
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
    bulletinId: z.ZodNumber;
    entrepriseId: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=paiement.d.ts.map