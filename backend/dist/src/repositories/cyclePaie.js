import { PrismaClient, Prisma } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class cyclePaieRepository {
    async findByEntreprise(entrepriseId) {
        return mnprisma.cyclePaie.findMany({ where: { entrepriseId }, include: { entreprise: true, bulletins: true } });
    }
    async setStatut(id, statut) {
        return mnprisma.cyclePaie.update({ where: { id }, data: { statut } });
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
    async findAllByUser(user) {
        // Super Admin voit tous les cycles de paie
        if (user.profil === 'SUPER_ADMIN') {
            return mnprisma.cyclePaie.findMany({
                include: { entreprise: true, bulletins: true }
            });
        }
        // Admin d'Entreprise et Caissier voient seulement les cycles de leur entreprise
        if ((user.profil === 'ADMIN_ENTREPRISE' || user.profil === 'CAISSIER') && user.entrepriseId) {
            return mnprisma.cyclePaie.findMany({
                where: { entrepriseId: user.entrepriseId },
                include: { entreprise: true, bulletins: true }
            });
        }
        // Autres rôles n'ont pas accès aux cycles de paie
        return [];
    }
    async update(id, data) {
        return mnprisma.cyclePaie.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.cyclePaie.delete({ where: { id } });
    }
    async setStatutValidation(id, statutValidation) {
        return mnprisma.cyclePaie.update({ where: { id }, data: { statutValidation } });
    }
    async getBulletinsByCycleId(id) {
        return mnprisma.bulletin.findMany({
            where: { cycleId: id },
            include: { paiements: true }
        });
    }
}
;
//# sourceMappingURL=cyclePaie.js.map