import { PrismaClient, Prisma } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class entrepriseRepository {
    async setEstActive(id, estActive) {
        return mnprisma.entreprise.update({ where: { id }, data: { estActive } });
    }
    async create(data) {
        return mnprisma.entreprise.create({ data });
    }
    async findById(id) {
        return mnprisma.entreprise.findUnique({
            where: { id },
            select: {
                id: true,
                nom: true,
                description: true,
                adresse: true,
                telephone: true,
                email: true,
                siteWeb: true,
                secteurActivite: true,
                dateCreation: true,
                estActive: true,
                logo: true,
                couleurPrimaire: true,
                couleurSecondaire: true,
                employes: true,
                cyclesPaie: true,
                paiements: true,
                utilisateurs: true
            }
        });
    }
    async findAll() {
        return mnprisma.entreprise.findMany({ include: { employes: true, cyclesPaie: true, paiements: true, utilisateurs: true } });
    }
    async findAllByUser(user) {
        // Super Admin voit toutes les entreprises
        if (user.profil === 'SUPER_ADMIN') {
            return mnprisma.entreprise.findMany({
                include: { employes: true, cyclesPaie: true, paiements: true, utilisateurs: true }
            });
        }
        // Admin d'Entreprise et Caissier voient seulement leur propre entreprise
        if ((user.profil === 'ADMIN_ENTREPRISE' || user.profil === 'CAISSIER') && user.entrepriseId) {
            return mnprisma.entreprise.findMany({
                where: { id: user.entrepriseId },
                include: { employes: true, cyclesPaie: true, paiements: true, utilisateurs: true }
            });
        }
        // Autres rôles n'ont pas accès à la liste des entreprises
        return [];
    }
    async update(id, data) {
        return mnprisma.entreprise.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.entreprise.delete({ where: { id } });
    }
}
;
//# sourceMappingURL=entreprise.js.map