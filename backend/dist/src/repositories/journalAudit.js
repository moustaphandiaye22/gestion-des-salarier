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
    async findAllByUser(user) {
        // Super Admin voit tous les journaux d'audit
        if (user.profil === 'SUPER_ADMIN') {
            return mnprisma.journalAudit.findMany();
        }
        // Admin d'Entreprise et Caissier voient seulement les journaux d'audit de leur entreprise
        if ((user.profil === 'ADMIN_ENTREPRISE' || user.profil === 'CAISSIER') && user.entrepriseId) {
            return mnprisma.journalAudit.findMany({
                where: { entrepriseId: user.entrepriseId }
            });
        }
        // Autres rôles n'ont pas accès aux journaux d'audit
        return [];
    }
}
//# sourceMappingURL=journalAudit.js.map