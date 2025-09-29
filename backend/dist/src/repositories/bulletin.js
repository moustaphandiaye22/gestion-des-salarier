import { PrismaClient, Prisma } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class bulletinRepository {
    async findByEmploye(employeId) {
        return mnprisma.bulletin.findMany({ where: { employeId }, include: { employe: true, cycle: true, paiements: true } });
    }
    async findByCycle(cycleId) {
        return mnprisma.bulletin.findMany({ where: { cycleId }, include: { employe: true, cycle: true, paiements: true } });
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
    async update(id, data) {
        return mnprisma.bulletin.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.bulletin.delete({ where: { id } });
    }
}
;
//# sourceMappingURL=bulletin.js.map