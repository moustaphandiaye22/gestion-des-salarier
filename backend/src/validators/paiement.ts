import { z } from 'zod';

export const paiementSchema = z.object({
  montant: z.number().min(0, { message: 'Le montant doit être positif ou nul.' }),
  datePaiement: z.union([z.date(), z.string()]).transform((val) => {
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }).optional(),
  modePaiement: z.enum(['ESPECES', 'CHEQUE', 'VIREMENT', 'WAVE', 'ORANGE_MONEY']),
  statut: z.enum(['EN_ATTENTE', 'PAYE', 'ECHEC']).optional(),
  reference: z.string().max(100, { message: 'La référence ne doit pas dépasser 100 caractères.' }).optional(),
  bulletinId: z.number(),
  entrepriseId: z.number(),
});
