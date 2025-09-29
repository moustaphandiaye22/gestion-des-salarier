import { PrismaClient } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class utilisateurRepository {
    async create(data) {
        return mnprisma.utilisateur.create({ data });
    }
    async findById(id) {
        return mnprisma.utilisateur.findUnique({ where: { id } });
    }
    async findAll() {
        return mnprisma.utilisateur.findMany();
    }
    async update(id, data) {
        return mnprisma.utilisateur.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.utilisateur.delete({ where: { id } });
    }
    async findByRole(role) {
        return mnprisma.utilisateur.findMany({ where: { role } });
    }
    async setActif(id, estActif) {
        return mnprisma.utilisateur.update({ where: { id }, data: { estActif } });
    }
    async findByEmail(email) {
        return mnprisma.utilisateur.findUnique({ where: { email } });
    }
}
//# sourceMappingURL=utilisateur.js.map