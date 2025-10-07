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
        return mnprisma.rapport.findMany({
            orderBy: { id: 'desc' }
        });
    }
    async findAllByUser(user) {
        // Super Admin voit tous les rapports
        if (user.profil === 'SUPER_ADMIN') {
            return mnprisma.rapport.findMany({
                orderBy: { id: 'desc' }
            });
        }
        // Admin d'Entreprise et Caissier voient seulement les rapports de leur entreprise
        if ((user.profil === 'ADMIN_ENTREPRISE' || user.profil === 'CAISSIER') && user.entrepriseId) {
            return mnprisma.rapport.findMany({
                where: { entrepriseId: user.entrepriseId },
                orderBy: { id: 'desc' }
            });
        }
        // Employé voit seulement les rapports qui le concernent directement
        if (user.profil === 'EMPLOYE' && user.employeId) {
            return mnprisma.rapport.findMany({
                where: {
                    typeRapport: 'EMPLOYES' // Pour l'instant, seulement les rapports généraux sur les employés
                },
                orderBy: { id: 'desc' }
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
        return mnprisma.rapport.findMany({
            where: { typeRapport },
            orderBy: { id: 'desc' }
        });
    }
}
//# sourceMappingURL=rapport.js.map