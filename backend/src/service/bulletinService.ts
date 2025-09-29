import type { StatutPaiement } from '@prisma/client';
import { bulletinRepository } from '../repositories/bulletin.js';
import { bulletinSchema } from '../validators/bulletin.js';
import { journalAuditService } from './journalAuditService.js';

export class BulletinService {
     
    private bulletinRepository : bulletinRepository

    constructor(){
        this.bulletinRepository = new bulletinRepository()
    }

  async createBulletin(data: any) {
    const parsed = bulletinSchema.safeParse(data);
    if (!parsed.success) throw parsed.error;
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

  async getBulletin(id: number) {
    return this.bulletinRepository.findById(id);
  }

  async getAllBulletins() {
    return this.bulletinRepository.findAll();
  }

  async updateBulletin(id: number, data: any) {
    const parsed = bulletinSchema.partial().safeParse(data);
    if (!parsed.success) throw parsed.error;
    return this.bulletinRepository.update(id, data);
  }

  async deleteBulletin(id: number) {
    return this.bulletinRepository.delete(id);
  }

  async setStatutPaiement(id: number, statutPaiement: StatutPaiement, utilisateurId?: number) {
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
