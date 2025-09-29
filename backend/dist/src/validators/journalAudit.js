import { z } from 'zod';
export const journalAuditValidator = z.object({
    action: z.enum(['CREATION', 'MODIFICATION', 'SUPPRESSION', 'CONNEXION', 'DECONNEXION', 'EXPORTATION', 'GENERATION']),
    details: z.any(),
    dateAction: z.date().optional(),
    utilisateurId: z.number().optional(),
    entrepriseId: z.number().optional(),
    employeId: z.number().optional(),
    bulletinId: z.number().optional(),
    paiementId: z.number().optional(),
    cyclePaieId: z.number().optional(),
});
//# sourceMappingURL=journalAudit.js.map