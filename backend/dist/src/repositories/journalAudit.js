import { PrismaClient } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class journalAuditRepository {
    async create(data) {
        return mnprisma.journalAudit.create({ data });
    }
    async findById(id) {
        return mnprisma.journalAudit.findUnique({ where: { id } });
    }
    async findAll() {
        return mnprisma.journalAudit.findMany();
    }
    async update(id, data) {
        return mnprisma.journalAudit.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.journalAudit.delete({ where: { id } });
    }
    async findByAction(action) {
        return mnprisma.journalAudit.findMany({ where: { action } });
    }
    async findByUser(utilisateurId) {
        return mnprisma.journalAudit.findMany({ where: { utilisateurId } });
    }
}
//# sourceMappingURL=journalAudit.js.map