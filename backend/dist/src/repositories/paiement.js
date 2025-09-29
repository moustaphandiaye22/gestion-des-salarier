import { PrismaClient, Prisma } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class paiementRepository {
    async findByBulletin(bulletinId) {
        return mnprisma.paiement.findMany({ where: { bulletinId }, include: { bulletin: true, entreprise: true } });
    }
    async setStatut(id, statut) {
        return mnprisma.paiement.update({ where: { id }, data: { statut } });
    }
    async create(data) {
        return mnprisma.paiement.create({ data });
    }
    async findById(id) {
        return mnprisma.paiement.findUnique({ where: { id }, include: { bulletin: true, entreprise: true } });
    }
    async findAll() {
        return mnprisma.paiement.findMany({ include: { bulletin: true, entreprise: true } });
    }
    async update(id, data) {
        return mnprisma.paiement.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.paiement.delete({ where: { id } });
    }
}
;
//# sourceMappingURL=paiement.js.map