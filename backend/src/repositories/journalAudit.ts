import { PrismaClient } from '@prisma/client';
import type { ActionAudit, JournalAudit } from '@prisma/client';
import type { InterfaceRepository } from './InterfaceRepository.js';
import { mnprisma } from '../config/db.js';

export class journalAuditRepository implements InterfaceRepository<JournalAudit> {

  async create(data: Omit<JournalAudit, "id"> & { details: any }): Promise<JournalAudit> {
    return mnprisma.journalAudit.create({ data });
  }

  async findById(id: number): Promise<JournalAudit | null> {
    return mnprisma.journalAudit.findUnique({ where: { id } });
  }

  async findAll(): Promise<JournalAudit[]> {
    return mnprisma.journalAudit.findMany({
      orderBy: { id: 'desc' }
    });
  }

  async update(id: number, data: Partial<Omit<JournalAudit, "id">> & { details?: any }): Promise<JournalAudit> {
    return mnprisma.journalAudit.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await mnprisma.journalAudit.delete({ where: { id } });
  }

  async findByAction(action: ActionAudit): Promise<JournalAudit[]> {
    return mnprisma.journalAudit.findMany({
      where: { action },
      orderBy: { id: 'desc' }
    });
  }

  async findByUser(utilisateurId: number): Promise<JournalAudit[]> {
    return mnprisma.journalAudit.findMany({
      where: { utilisateurId },
      orderBy: { id: 'desc' }
    });
  }

  async findAllByUser(user: any): Promise<JournalAudit[]> {
    // Super Admin voit tous les journaux d'audit
    if (user.profil === 'SUPER_ADMIN') {
      return mnprisma.journalAudit.findMany({
        orderBy: { id: 'desc' }
      });
    }

    // Admin d'Entreprise et Caissier voient seulement les journaux d'audit de leur entreprise
    if ((user.profil === 'ADMIN_ENTREPRISE' || user.profil === 'CAISSIER') && user.entrepriseId) {
      return mnprisma.journalAudit.findMany({
        where: { entrepriseId: user.entrepriseId },
        orderBy: { id: 'desc' }
      });
    }

    // Autres rôles n'ont pas accès aux journaux d'audit
    return [];
  }

}
