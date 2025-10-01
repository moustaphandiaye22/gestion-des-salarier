import { z } from 'zod';
export const entrepriseSchema = z.object({
    nom: z.string()
        .min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères.')
        .max(100, 'Le nom de l\'entreprise ne doit pas dépasser 100 caractères.'),
    description: z.string()
        .max(1000, 'La description ne doit pas dépasser 1000 caractères.')
        .optional(),
    adresse: z.string()
        .max(255, 'L\'adresse ne doit pas dépasser 255 caractères.')
        .optional(),
    telephone: z.string()
        .max(20, 'Le numéro de téléphone ne doit pas dépasser 20 caractères.')
        .optional(),
    email: z.string()
        .email('L\'email doit être une adresse valide.')
        .max(100, 'L\'email ne doit pas dépasser 100 caractères.'),
    logo: z.string()
        .max(255, 'Le chemin du logo ne doit pas dépasser 255 caractères.')
        .optional(),
    estActive: z.boolean().optional(),
    dateCreation: z.date().optional(),
});
//# sourceMappingURL=entreprise.js.map