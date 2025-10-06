import { z } from 'zod';
// Custom error messages in French for better user experience
const customErrorMessages = {
    nom: {
        required: "Le nom du cycle de paie est obligatoire",
        tooLong: "Le nom du cycle de paie ne peut pas dépasser 100 caractères",
        tooShort: "Le nom du cycle de paie doit contenir au moins 1 caractère"
    },
    description: {
        tooLong: "La description ne peut pas dépasser 1000 caractères"
    },
    dateDebut: {
        invalid: "La date de début n'est pas une date valide",
        required: "La date de début est obligatoire"
    },
    dateFin: {
        invalid: "La date de fin n'est pas une date valide",
        required: "La date de fin est obligatoire"
    },
    frequence: {
        invalid: "La fréquence doit être MENSUEL, HEBDOMADAIRE ou QUINZAINE"
    },
    entrepriseId: {
        invalid: "L'identifiant de l'entreprise doit être un nombre positif",
        required: "L'entreprise est obligatoire"
    }
};
export const cyclePaieSchema = z.object({
    nom: z.string()
        .min(1, customErrorMessages.nom.required)
        .max(100, customErrorMessages.nom.tooLong),
    description: z.string()
        .max(1000, customErrorMessages.description.tooLong)
        .optional(),
    dateDebut: z.string()
        .min(1, customErrorMessages.dateDebut.required)
        .refine((val) => !isNaN(Date.parse(val)), customErrorMessages.dateDebut.invalid),
    dateFin: z.string()
        .min(1, customErrorMessages.dateFin.required)
        .refine((val) => !isNaN(Date.parse(val)), customErrorMessages.dateFin.invalid),
    frequence: z.enum(['MENSUEL', 'HEBDOMADAIRE', 'QUINZAINE'], {
        message: customErrorMessages.frequence.invalid
    }),
    entrepriseId: z.number()
        .int(customErrorMessages.entrepriseId.invalid)
        .positive(customErrorMessages.entrepriseId.invalid)
});
//# sourceMappingURL=cyclePaie.js.map