import { z } from 'zod';

export const cyclePaieSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(100, "Le nom ne doit pas dépasser 100 caractères"),
  description: z.string().optional(),
  dateDebut: z.string().refine((val) => !isNaN(Date.parse(val)), "Date de début invalide"),
  dateFin: z.string().refine((val) => !isNaN(Date.parse(val)), "Date de fin invalide"),
  frequence: z.enum(['MENSUEL', 'HEBDOMADAIRE', 'QUINZAINE']),
  entrepriseId: z.number().int().positive("L'ID de l'entreprise doit être un nombre positif"),
});
