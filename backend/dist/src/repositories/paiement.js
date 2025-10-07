import { PrismaClient, Prisma } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class paiementRepository {
    async findByBulletin(bulletinId) {
        return mnprisma.paiement.findMany({
            where: { bulletinId },
            include: { bulletin: true, entreprise: true },
            orderBy: { id: 'desc' }
        });
    }
    async setStatut(id, statut) {
        return mnprisma.paiement.update({ where: { id }, data: { statut } });
    }
    async create(data) {
        return mnprisma.paiement.create({ data });
    }
    async findById(id) {
        return mnprisma.paiement.findUnique({ where: { id }, include: { bulletin: { include: { employe: true } }, entreprise: true } });
    }
    async findAll() {
        return mnprisma.paiement.findMany({
            include: { bulletin: true, entreprise: true },
            orderBy: { id: 'desc' }
        });
    }
    async findAllByUser(user) {
        // Super Admin voit tous les paiements
        if (user.profil === 'SUPER_ADMIN') {
            return mnprisma.paiement.findMany({
                include: { bulletin: { include: { employe: true } }, entreprise: true },
                orderBy: { id: 'desc' }
            });
        }
        // Admin d'Entreprise et Caissier voient seulement les paiements de leur entreprise
        if ((user.profil === 'ADMIN_ENTREPRISE' || user.profil === 'CAISSIER') && user.entrepriseId) {
            return mnprisma.paiement.findMany({
                where: { entrepriseId: user.entrepriseId },
                include: { bulletin: { include: { employe: true } }, entreprise: true },
                orderBy: { id: 'desc' }
            });
        }
        // Employé voit seulement ses propres paiements
        if (user.profil === 'EMPLOYE' && user.employeId) {
            return mnprisma.paiement.findMany({
                where: {
                    bulletin: {
                        employeId: user.employeId
                    }
                },
                include: { bulletin: { include: { employe: true } }, entreprise: true },
                orderBy: { id: 'desc' }
            });
        }
        // Autres rôles n'ont pas accès aux paiements
        return [];
    }
    async update(id, data) {
        return mnprisma.paiement.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.paiement.delete({ where: { id } });
    }
}
;
//# sourceMappingURL=paiement.js.map