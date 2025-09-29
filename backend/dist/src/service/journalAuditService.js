import { journalAuditRepository } from '../repositories/journalAudit.js';
import { journalAuditValidator } from '../validators/journalAudit.js';
export class JournalAuditService {
    journalAuditRepository = new journalAuditRepository();
    async createJournalAudit(data) {
        const parsed = journalAuditValidator.safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        return this.journalAuditRepository.create(data);
    }
    async getJournalAudit(id) {
        return this.journalAuditRepository.findById(id);
    }
    async getAllJournalAudits() {
        return this.journalAuditRepository.findAll();
    }
    async updateJournalAudit(id, data) {
        const parsed = journalAuditValidator.partial().safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        return this.journalAuditRepository.update(id, data);
    }
    async deleteJournalAudit(id) {
        return this.journalAuditRepository.delete(id);
    }
}
export const journalAuditService = new JournalAuditService();
//# sourceMappingURL=journalAuditService.js.map