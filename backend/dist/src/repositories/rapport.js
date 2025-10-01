import { PrismaClient } from "@prisma/client";
import { mnprisma } from '../config/db.js';
export class rapportRepository {
    async create(data) {
        return mnprisma.rapport.create({ data });
    }
    async findById(id) {
        return mnprisma.rapport.findUnique({ where: { id } });
    }
    async findAll() {
        return mnprisma.rapport.findMany();
    }
    async findAllByUser(user) {
        // Super Admin voit tous les rapports
        if (user.profil === 'SUPER_ADMIN') {
            return mnprisma.rapport.findMany();
        }
        // Admin d'Entreprise voit seulement les rapports de son entreprise
        if (user.profil === 'ADMIN_ENTREPRISE' && user.entrepriseId) {
            return mnprisma.rapport.findMany({
                where: { entrepriseId: user.entrepriseId }
            });
        }
        // Autres rôles n'ont pas accès aux rapports
        return [];
    }
    async update(id, data) {
        return mnprisma.rapport.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.rapport.delete({ where: { id } });
    }
    async findByType(typeRapport) {
        return mnprisma.rapport.findMany({ where: { typeRapport } });
    }
}
//# sourceMappingURL=rapport.js.map