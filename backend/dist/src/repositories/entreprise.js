import { PrismaClient } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class entrepriseRepository {
    async create(data) {
        return mnprisma.entreprise.create({ data });
    }
    async findById(id) {
        return mnprisma.entreprise.findUnique({ where: { id } });
    }
    async findByIdForAccessCheck(id) {
        return mnprisma.entreprise.findUnique({
            where: { id },
            select: {
                superAdminAccessGranted: true
            }
        });
    }
    async findAll() {
        return mnprisma.entreprise.findMany();
    }
    async findAllByUser(user) {
        // Super Admin voit toutes les entreprises
        if (user.profil === 'SUPER_ADMIN') {
            return mnprisma.entreprise.findMany();
        }
        // Admin d'Entreprise et Caissier voient seulement leur entreprise
        if ((user.profil === 'ADMIN_ENTREPRISE' || user.profil === 'CAISSIER') && user.entrepriseId) {
            return mnprisma.entreprise.findMany({
                where: { id: user.entrepriseId }
            });
        }
        // Employé voit seulement son entreprise
        if (user.profil === 'EMPLOYE' && user.employeId) {
            const employe = await mnprisma.employe.findUnique({
                where: { id: user.employeId },
                select: { entrepriseId: true }
            });
            if (employe?.entrepriseId) {
                return mnprisma.entreprise.findMany({
                    where: { id: employe.entrepriseId }
                });
            }
        }
        // Autres rôles n'ont pas accès aux entreprises
        return [];
    }
    async update(id, data) {
        return mnprisma.entreprise.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.entreprise.delete({ where: { id } });
    }
    async setEstActive(id, estActive) {
        return mnprisma.entreprise.update({ where: { id }, data: { estActive } });
    }
}
;
//# sourceMappingURL=entreprise.js.map