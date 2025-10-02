import { journalAuditRepository } from '../repositories/journalAudit.js';
import { journalAuditValidator } from '../validators/journalAudit.js';

export class JournalAuditService {
  private journalAuditRepository = new journalAuditRepository();

  async createJournalAudit(data: any) {
    const parsed = journalAuditValidator.safeParse(data);
    if (!parsed.success) throw parsed.error;
    return this.journalAuditRepository.create(data);
  }

  async getJournalAudit(id: number) {
    return this.journalAuditRepository.findById(id);
  }

  async getAllJournalAudits(user?: any) {
    if (user) {
      return this.journalAuditRepository.findAllByUser(user);
    }
    return this.journalAuditRepository.findAll();
  }

  async updateJournalAudit(id: number, data: any) {
    const parsed = journalAuditValidator.partial().safeParse(data);
    if (!parsed.success) throw parsed.error;
    return this.journalAuditRepository.update(id, data);
  }

  async deleteJournalAudit(id: number) {
    return this.journalAuditRepository.delete(id);
  }
}

export const journalAuditService = new JournalAuditService();
