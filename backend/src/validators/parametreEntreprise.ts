import { z } from 'zod';

export const parametreEntrepriseValidator = z.object({
  cle: z.string().min(2, 'La clé doit contenir au moins 2 caractères.').max(100, 'La clé ne doit pas dépasser 100 caractères.'),
  valeur: z.string().min(1, 'La valeur est obligatoire.').max(255, 'La valeur ne doit pas dépasser 255 caractères.'),
  entrepriseId: z.number(),
});
