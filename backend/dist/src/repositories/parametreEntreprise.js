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
        return mnprisma.parametreEntreprise.findMany({
            orderBy: { id: 'desc' }
        });
    }
    async findAllByUser(user) {
        // Super Admin voit tous les paramètres d'entreprise
        if (user.profil === 'SUPER_ADMIN') {
            return mnprisma.parametreEntreprise.findMany({
                orderBy: { id: 'desc' }
            });
        }
        // Admin d'Entreprise voit seulement les paramètres de son entreprise
        if (user.profil === 'ADMIN_ENTREPRISE' && user.entrepriseId) {
            return mnprisma.parametreEntreprise.findMany({
                where: { entrepriseId: user.entrepriseId },
                orderBy: { id: 'desc' }
            });
        }
        // Autres rôles n'ont pas accès aux paramètres d'entreprise
        return [];
    }
    async update(id, data) {
        return mnprisma.parametreEntreprise.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.parametreEntreprise.delete({ where: { id } });
    }
    async findByCle(cle) {
        return mnprisma.parametreEntreprise.findMany({
            where: { cle },
            orderBy: { id: 'desc' }
        });
    }
    async findByEntreprise(entrepriseId) {
        return mnprisma.parametreEntreprise.findMany({
            where: { entrepriseId },
            orderBy: { id: 'desc' }
        });
    }
}
//# sourceMappingURL=parametreEntreprise.js.map