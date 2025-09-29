import { PrismaClient, Prisma } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class entrepriseRepository {
    async setEstActive(id, estActive) {
        return mnprisma.entreprise.update({ where: { id }, data: { estActive } });
    }
    async create(data) {
        return mnprisma.entreprise.create({ data });
    }
    async findById(id) {
        return mnprisma.entreprise.findUnique({ where: { id }, include: { employes: true, cyclesPaie: true, paiements: true, utilisateurs: true } });
    }
    async findAll() {
        return mnprisma.entreprise.findMany({ include: { employes: true, cyclesPaie: true, paiements: true, utilisateurs: true } });
    }
    async update(id, data) {
        return mnprisma.entreprise.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.entreprise.delete({ where: { id } });
    }
}
;
//# sourceMappingURL=entreprise.js.map