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
        .email('L’email doit être une adresse valide.')
        .max(100, 'L’email ne doit pas dépasser 100 caractères.')
        .optional(),
    telephone: z.string()
        .max(20, 'Le numéro de téléphone ne doit pas dépasser 20 caractères.')
        .optional(),
    adresse: z.string()
        .max(255, 'L’adresse ne doit pas dépasser 255 caractères.')
        .optional(),
    dateEmbauche: z.date(),
    statutEmploi: z.enum(['ACTIF', 'CONGE', 'LICENCIE', 'RETRAITE']),
    typeContrat: z.enum(['CDI', 'CDD', 'INTERIM', 'STAGE']),
    salaireBase: z.number().min(0, 'Le salaire de base doit être positif ou nul.'),
    allocations: z.number().min(0, 'Les allocations doivent être positives ou nulles.').optional(),
    deductions: z.number().min(0, 'Les déductions doivent être positives ou nulles.').optional(),
    estActif: z.boolean().optional(),
    entrepriseId: z.number(),
});
//# sourceMappingURL=employe.js.map