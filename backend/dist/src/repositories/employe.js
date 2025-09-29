import { PrismaClient } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class employeRepository {
    async findByStatus(statutEmploi) {
        return mnprisma.employe.findMany({ where: { statutEmploi }, include: { entreprise: true, bulletins: true } });
    }
    async findByTypeContrat(typeContrat) {
        return mnprisma.employe.findMany({ where: { typeContrat }, include: { entreprise: true, bulletins: true } });
    }
    //   async findByPoste(poste: Poste): Promise<Employe[]> {
    //   return prisma.employe.findMany({ where: { poste }, include: { entreprise: true, bulletins: true } });
    //   }
    async findActifs() {
        return mnprisma.employe.findMany({ where: { estActif: true }, include: { entreprise: true, bulletins: true } });
    }
    async findInactifs() {
        return mnprisma.employe.findMany({ where: { estActif: false }, include: { entreprise: true, bulletins: true } });
    }
    async setStatus(id, statutEmploi) {
        return mnprisma.employe.update({ where: { id }, data: { statutEmploi } });
    }
    async create(data) {
        return mnprisma.employe.create({ data });
    }
    async findById(id) {
        return mnprisma.employe.findUnique({ where: { id }, include: { entreprise: true, bulletins: true } });
    }
    async findAll() {
        return mnprisma.employe.findMany({ include: { entreprise: true, bulletins: true } });
    }
    async update(id, data) {
        return mnprisma.employe.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.employe.delete({ where: { id } });
    }
}
;
//# sourceMappingURL=employe.js.map