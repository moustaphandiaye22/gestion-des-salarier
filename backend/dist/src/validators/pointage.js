import { z } from 'zod';
export const pointageSchema = z.object({
    datePointage: z.union([z.date(), z.string()]).transform((val) => {
        if (typeof val === 'string') {
            return new Date(val);
        }
        return val;
    }).refine((date) => !isNaN(date.getTime()), {
        message: 'Date de pointage invalide.'
    }),
    heureEntree: z.union([z.date(), z.string()]).transform((val) => {
        if (typeof val === 'string') {
            return new Date(val);
        }
        return val;
    }).optional().nullable(),
    heureSortie: z.union([z.date(), z.string()]).transform((val) => {
        if (typeof val === 'string') {
            return new Date(val);
        }
        return val;
    }).optional().nullable(),
    dureeTravail: z.number()
        .min(0, 'La durée de travail doit être positive.')
        .max(24, 'La durée de travail ne peut pas dépasser 24 heures.')
        .optional(),
    typePointage: z.enum([
        'PRESENCE',
        'ABSENCE',
        'CONGE',
        'MALADIE',
        'MISSION',
        'FORMATION',
        'TELETRAVAIL',
        'HEURE_SUPPLEMENTAIRE'
    ]).default('PRESENCE'),
    statut: z.enum([
        'PRESENT',
        'ABSENT',
        'EN_ATTENTE',
        'VALIDE',
        'REJETE',
        'MODIFIE'
    ]).default('PRESENT'),
    lieu: z.string()
        .max(100, 'Le lieu ne doit pas dépasser 100 caractères.')
        .optional()
        .nullable(),
    commentaire: z.string()
        .max(500, 'Le commentaire ne doit pas dépasser 500 caractères.')
        .optional()
        .nullable(),
    ipAddress: z.string()
        .max(45, 'L\'adresse IP ne doit pas dépasser 45 caractères.')
        .optional()
        .nullable(),
    localisation: z.object({
        latitude: z.number(),
        longitude: z.number()
    }).optional().nullable(),
    employeId: z.number()
        .min(1, 'L\'ID de l\'employé est obligatoire.'),
    entrepriseId: z.number()
        .min(1, 'L\'ID de l\'entreprise est obligatoire.')
}).refine((data) => {
    // Si les heures d'entrée et sortie sont fournies, vérifier la logique
    if (data.heureEntree && data.heureSortie) {
        const entree = new Date(data.heureEntree);
        const sortie = new Date(data.heureSortie);
        return sortie > entree;
    }
    return true;
}, {
    message: 'L\'heure de sortie doit être après l\'heure d\'entrée.',
    path: ['heureSortie']
}).refine((data) => {
    // Si la durée est fournie, elle doit être cohérente avec les heures
    if (data.dureeTravail && data.heureEntree && data.heureSortie) {
        const dureeCalculee = (new Date(data.heureSortie).getTime() - new Date(data.heureEntree).getTime()) / (1000 * 60 * 60);
        const tolerance = 0.1; // Tolérance de 6 minutes
        return Math.abs(dureeCalculee - data.dureeTravail) <= tolerance;
    }
    return true;
}, {
    message: 'La durée de travail n\'est pas cohérente avec les heures d\'entrée et sortie.',
    path: ['dureeTravail']
});
export const pointageFilterSchema = z.object({
    employeId: z.number().optional(),
    entrepriseId: z.number().optional(),
    dateDebut: z.string().optional(),
    dateFin: z.string().optional(),
    typePointage: z.enum([
        'PRESENCE',
        'ABSENCE',
        'CONGE',
        'MALADIE',
        'MISSION',
        'FORMATION',
        'TELETRAVAIL',
        'HEURE_SUPPLEMENTAIRE'
    ]).optional(),
    statut: z.enum([
        'PRESENT',
        'ABSENT',
        'EN_ATTENTE',
        'VALIDE',
        'REJETE',
        'MODIFIE'
    ]).optional()
});
export const pointageEntreeSchema = z.object({
    employeId: z.number()
        .min(1, 'L\'ID de l\'employé est obligatoire.'),
    entrepriseId: z.number()
        .min(1, 'L\'ID de l\'entreprise est obligatoire.'),
    lieu: z.string()
        .max(100, 'Le lieu ne doit pas dépasser 100 caractères.')
        .optional(),
    ipAddress: z.string()
        .max(45, 'L\'adresse IP ne doit pas dépasser 45 caractères.')
        .optional(),
    localisation: z.object({
        latitude: z.number(),
        longitude: z.number()
    }).optional()
});
export const pointageSortieSchema = z.object({
    employeId: z.number()
        .min(1, 'L\'ID de l\'employé est obligatoire.'),
    entrepriseId: z.number()
        .min(1, 'L\'ID de l\'entreprise est obligatoire.'),
    lieu: z.string()
        .max(100, 'Le lieu ne doit pas dépasser 100 caractères.')
        .optional(),
    ipAddress: z.string()
        .max(45, 'L\'adresse IP ne doit pas dépasser 45 caractères.')
        .optional(),
    localisation: z.object({
        latitude: z.number(),
        longitude: z.number()
    }).optional()
});
//# sourceMappingURL=pointage.js.map