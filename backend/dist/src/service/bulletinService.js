import { bulletinRepository } from '../repositories/bulletin.js';
import { bulletinSchema } from '../validators/bulletin.js';
import { journalAuditService } from './journalAuditService.js';
export class BulletinService {
    bulletinRepository;
    constructor() {
        this.bulletinRepository = new bulletinRepository();
    }
    async createBulletin(data) {
        const parsed = bulletinSchema.safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        const bulletin = await this.bulletinRepository.create(data);
        // Log audit
        await journalAuditService.createJournalAudit({
            action: 'CREATE',
            entite: 'BULLETIN',
            entiteId: bulletin.id,
            utilisateurId: data.utilisateurId || null,
            details: `Bulletin créé pour employé ${data.employeId}`
        });
        return bulletin;
    }
    async getBulletin(id) {
        return this.bulletinRepository.findById(id);
    }
    async getAllBulletins(user) {
        if (user) {
            return this.bulletinRepository.findAllByUser(user);
        }
        return this.bulletinRepository.findAll();
    }
    async updateBulletin(id, data) {
        const parsed = bulletinSchema.partial().safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        return this.bulletinRepository.update(id, data);
    }
    async deleteBulletin(id) {
        return this.bulletinRepository.delete(id);
    }
    async setStatutPaiement(id, statutPaiement, utilisateurId) {
        const bulletin = await this.bulletinRepository.setStatutPaiement(id, statutPaiement);
        // Log audit
        await journalAuditService.createJournalAudit({
            action: 'UPDATE',
            entite: 'BULLETIN',
            entiteId: id,
            utilisateurId: utilisateurId || null,
            details: `Statut de paiement mis à jour à ${statutPaiement}`
        });
        return bulletin;
    }
}
//# sourceMappingURL=bulletinService.js.map