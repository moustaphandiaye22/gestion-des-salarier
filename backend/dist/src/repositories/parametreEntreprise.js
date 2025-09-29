import { PrismaClient } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class parametreEntrepriseRepository {
    async create(data) {
        return mnprisma.parametreEntreprise.create({ data });
    }
    async findById(id) {
        return mnprisma.parametreEntreprise.findUnique({ where: { id } });
    }
    async findAll() {
        return mnprisma.parametreEntreprise.findMany();
    }
    async update(id, data) {
        return mnprisma.parametreEntreprise.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.parametreEntreprise.delete({ where: { id } });
    }
    async findByCle(cle) {
        return mnprisma.parametreEntreprise.findMany({ where: { cle } });
    }
    async findByEntreprise(entrepriseId) {
        return mnprisma.parametreEntreprise.findMany({ where: { entrepriseId } });
    }
}
//# sourceMappingURL=parametreEntreprise.js.map