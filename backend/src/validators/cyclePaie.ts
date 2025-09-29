import { z } from 'zod';

export const cyclePaieSchema = z.object({
  periodeDebut: z.date(),
  periodeFin: z.date(),
  typeCycle: z.enum(['MENSUEL', 'HEBDOMADAIRE', 'QUINZAINE']),
  estFerme: z.boolean().optional(),
  entrepriseId: z.number(),
});
