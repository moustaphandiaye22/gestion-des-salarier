import { PrismaClient, Prisma } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class bulletinRepository {
    async findByEmploye(employeId) {
        return mnprisma.bulletin.findMany({ where: { employeId }, include: { employe: true, cycle: true, paiements: true } });
    }
    async findByCycle(cycleId) {
        return mnprisma.bulletin.findMany({ where: { cycleId }, include: { employe: true, cycle: true, paiements: true } });
    }
    async findByEmployeeAndCycle(employeId, cycleId) {
        return mnprisma.bulletin.findFirst({
            where: {
                employeId,
                cycleId
            },
            include: { employe: true, cycle: true, paiements: true }
        });
    }
    async setStatutPaiement(id, statutPaiement) {
        return mnprisma.bulletin.update({ where: { id }, data: { statutPaiement } });
    }
    async create(data) {
        return mnprisma.bulletin.create({ data });
    }
    async findById(id) {
        return mnprisma.bulletin.findUnique({ where: { id }, include: { employe: true, cycle: true, paiements: true } });
    }
    async findAll() {
        return mnprisma.bulletin.findMany({ include: { employe: true, cycle: true, paiements: true } });
    }
    async findAllByUser(user) {
        // Super Admin voit tous les bulletins
        if (user.profil === 'SUPER_ADMIN') {
            return mnprisma.bulletin.findMany({
                include: { employe: true, cycle: true, paiements: true }
            });
        }
        // Admin d'Entreprise et Caissier voient seulement les bulletins de leur entreprise
        if ((user.profil === 'ADMIN_ENTREPRISE' || user.profil === 'CAISSIER') && user.entrepriseId) {
            return mnprisma.bulletin.findMany({
                where: {
                    employe: {
                        entrepriseId: user.entrepriseId
                    }
                },
                include: { employe: true, cycle: true, paiements: true }
            });
        }
        // Autres rôles n'ont pas accès aux bulletins
        return [];
    }
    async update(id, data) {
        return mnprisma.bulletin.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.bulletin.delete({ where: { id } });
    }
}
;
//# sourceMappingURL=bulletin.js.map