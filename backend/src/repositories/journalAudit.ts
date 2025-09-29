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
    return mnprisma.journalAudit.findMany();
  }

  async update(id: number, data: Partial<Omit<JournalAudit, "id">> & { details?: any }): Promise<JournalAudit> {
    return mnprisma.journalAudit.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await mnprisma.journalAudit.delete({ where: { id } });
  }

  async findByAction(action: ActionAudit): Promise<JournalAudit[]> {
    return mnprisma.journalAudit.findMany({ where: { action } });
  }

  async findByUser(utilisateurId: number): Promise<JournalAudit[]> {
    return mnprisma.journalAudit.findMany({ where: { utilisateurId } });
  }

}
