import { z } from 'zod';
export const utilisateurValidator = z.object({
    nom: z.string().min(1, 'Le nom est requis'),
    email: z.string().email('Email invalide'),
    motDePasse: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    role: z.enum(['SUPER_ADMIN', 'ADMIN_ENTREPRISE', 'CAISSIER', 'VIGILE', 'EMPLOYE']),
    estActif: z.boolean().optional(),
    entrepriseId: z.number().optional(),
});
//# sourceMappingURL=utilisateur.js.map