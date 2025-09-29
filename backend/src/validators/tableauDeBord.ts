import { z } from 'zod';

export const tableauDeBordValidator = z.object({
  nom: z.string().min(2, 'Le nom du tableau doit contenir au moins 2 caractères.').max(100, 'Le nom ne doit pas dépasser 100 caractères.'),
  configuration: z.any(),
  entrepriseId: z.number(),
});
