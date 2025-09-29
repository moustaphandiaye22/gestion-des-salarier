import { z } from 'zod';

export const bulletinSchema = z.object({
  numeroBulletin: z.string()
    .max(50, 'Le numéro de bulletin ne doit pas dépasser 50 caractères.'),
  periodeDebut: z.date(),
  periodeFin: z.date(),
  salaireBase: z.number().min(0, 'Le salaire de base doit être positif ou nul.'),
  allocations: z.number().min(0, 'Les allocations doivent être positives ou nulles.').optional(),
  deductions: z.number().min(0, 'Les déductions doivent être positives ou nulles.').optional(),
  totalAPayer: z.number().min(0, 'Le total à payer doit être positif ou nul.'),
  statutPaiement: z.enum(['EN_ATTENTE', 'PAYE', 'ECHEC']).optional(),
  dateGeneration: z.date().optional(),
  cycleId: z.number(),
  employeId: z.number(),
});
