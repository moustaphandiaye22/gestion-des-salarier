import { PrismaClient } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class tableauDeBordRepository {
    async create(data) {
        return mnprisma.tableauDeBord.create({ data });
    }
    async findById(id) {
        return mnprisma.tableauDeBord.findUnique({ where: { id } });
    }
    async findAll() {
        return mnprisma.tableauDeBord.findMany();
    }
    async update(id, data) {
        return mnprisma.tableauDeBord.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.tableauDeBord.delete({ where: { id } });
    }
    async findByEntreprise(entrepriseId) {
        return mnprisma.tableauDeBord.findMany({ where: { entrepriseId } });
    }
}
//# sourceMappingURL=tableauDeBord.js.map