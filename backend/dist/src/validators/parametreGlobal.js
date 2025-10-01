import { z } from 'zod';
export const parametreGlobalSchema = z.object({
    cle: z.string().min(1, 'La clé est obligatoire').max(100, 'La clé ne peut pas dépasser 100 caractères'),
    valeur: z.string().min(1, 'La valeur est obligatoire').max(255, 'La valeur ne peut pas dépasser 255 caractères'),
    description: z.string().optional(),
    categorie: z.string().max(50, 'La catégorie ne peut pas dépasser 50 caractères').optional(),
    estModifiable: z.boolean().optional().default(true),
});
export const parametreGlobalUpdateSchema = parametreGlobalSchema.partial();
//# sourceMappingURL=parametreGlobal.js.map