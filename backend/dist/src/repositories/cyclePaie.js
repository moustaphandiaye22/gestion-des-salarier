import { PrismaClient, Prisma } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class cyclePaieRepository {
    async findByEntreprise(entrepriseId) {
        return mnprisma.cyclePaie.findMany({ where: { entrepriseId }, include: { entreprise: true, bulletins: true } });
    }
    async setEstFerme(id, estFerme) {
        return mnprisma.cyclePaie.update({ where: { id }, data: { estFerme } });
    }
    async create(data) {
        return mnprisma.cyclePaie.create({ data });
    }
    async findById(id) {
        return mnprisma.cyclePaie.findUnique({ where: { id }, include: { entreprise: true, bulletins: true } });
    }
    async findAll() {
        return mnprisma.cyclePaie.findMany({ include: { entreprise: true, bulletins: true } });
    }
    async update(id, data) {
        return mnprisma.cyclePaie.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.cyclePaie.delete({ where: { id } });
    }
}
;
//# sourceMappingURL=cyclePaie.js.map