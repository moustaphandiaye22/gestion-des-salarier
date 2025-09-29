import { z } from 'zod';

export const rapportValidator = z.object({
  typeRapport: z.enum(['BULLETINS', 'EMPLOYES', 'PAIEMENTS', 'STATISTIQUES']),
  contenu: z.any(),
  dateGeneration: z.date().optional(),
  entrepriseId: z.number(),
});
