import { z } from 'zod';

export const employeSchema = z.object({
  matricule: z.string()
    .min(1, 'Le matricule est obligatoire.')
    .max(50, 'Le matricule ne doit pas dépasser 50 caractères.'),
  prenom: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères.')
    .max(100, 'Le prénom ne doit pas dépasser 100 caractères.'),
  nom: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères.')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères.'),
  email: z.string()
    .email('L\'email doit être une adresse valide.')
    .max(100, 'L\'email ne doit pas dépasser 100 caractères.')
    .optional()
    .nullable(),
  telephone: z.string()
    .max(20, 'Le numéro de téléphone ne doit pas dépasser 20 caractères.')
    .optional()
    .nullable(),
  adresse: z.string()
    .max(255, 'L\'adresse ne doit pas dépasser 255 caractères.')
    .optional()
    .nullable(),
  dateEmbauche: z.union([z.date(), z.string()]).transform((val) => {
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }),
  statutEmploi: z.enum(['ACTIF', 'CONGE', 'LICENCIE', 'RETRAITE']),
  typeContrat: z.enum(['CDI', 'CDD', 'INTERIM', 'STAGE']),
  typeSalaire: z.enum(['MENSUEL', 'HONORAIRES', 'JOURNALIER']).default('MENSUEL'),
  salaireBase: z.number().min(0, 'Le salaire de base doit être positif ou nul.'),
  salaireHoraire: z.number().min(0, 'Le salaire horaire doit être positif.').optional().nullable(),
  tauxJournalier: z.number().min(0, 'Le taux journalier doit être positif.').optional().nullable(),
  allocations: z.number().min(0, 'Les allocations doivent être positives ou nulles.').optional().default(0),
  deductions: z.number().min(0, 'Les déductions doivent être positives ou nulles.').optional().default(0),
  roleUtilisateur: z.enum(['EMPLOYE', 'CAISSIER', 'VIGILE']).default('EMPLOYE'),
  motDePasse: z.string().optional().nullable(),
  estActif: z.boolean().optional().default(true),
  entrepriseId: z.number(),
  professionId: z.number().optional().nullable(),
});
