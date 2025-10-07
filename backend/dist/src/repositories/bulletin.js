import { PrismaClient, Prisma } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class bulletinRepository {
    async findByEmploye(employeId) {
        return mnprisma.bulletin.findMany({
            where: { employeId },
            include: {
                employe: {
                    include: {
                        entreprise: true,
                        profession: true
                    }
                },
                cycle: true,
                paiements: true
            },
            orderBy: { id: 'desc' }
        });
    }
    async findByCycle(cycleId) {
        return mnprisma.bulletin.findMany({
            where: { cycleId },
            include: {
                employe: {
                    include: {
                        entreprise: true,
                        profession: true
                    }
                },
                cycle: true,
                paiements: true
            },
            orderBy: { id: 'desc' }
        });
    }
    async findByEmployeeAndCycle(employeId, cycleId) {
        return mnprisma.bulletin.findFirst({
            where: {
                employeId,
                cycleId
            },
            include: {
                employe: {
                    include: {
                        entreprise: true,
                        profession: true
                    }
                },
                cycle: true,
                paiements: true
            }
        });
    }
    async setStatutPaiement(id, statutPaiement) {
        return mnprisma.bulletin.update({ where: { id }, data: { statutPaiement } });
    }
    async create(data) {
        return mnprisma.bulletin.create({ data });
    }
    async findById(id) {
        return mnprisma.bulletin.findUnique({
            where: { id },
            include: {
                employe: {
                    include: {
                        entreprise: true,
                        profession: true
                    }
                },
                cycle: true,
                paiements: true
            }
        });
    }
    async findAll() {
        return mnprisma.bulletin.findMany({
            include: {
                employe: {
                    include: {
                        entreprise: true,
                        profession: true
                    }
                },
                cycle: true,
                paiements: true
            },
            orderBy: { id: 'desc' }
        });
    }
    async findAllByUser(user) {
        const includeClause = {
            employe: {
                include: {
                    entreprise: true,
                    profession: true
                }
            },
            cycle: true,
            paiements: true
        };
        // Super Admin voit tous les bulletins
        if (user.profil === 'SUPER_ADMIN') {
            return mnprisma.bulletin.findMany({
                include: includeClause,
                orderBy: { id: 'desc' }
            });
        }
        // Admin d'Entreprise et Caissier voient seulement les bulletins de leur entreprise
        if ((user.profil === 'ADMIN_ENTREPRISE' || user.profil === 'CAISSIER') && user.entrepriseId) {
            return mnprisma.bulletin.findMany({
                where: {
                    employe: {
                        entrepriseId: user.entrepriseId
                    }
                },
                include: includeClause,
                orderBy: { id: 'desc' }
            });
        }
        // Employé voit seulement ses propres bulletins
        if (user.profil === 'EMPLOYE' && user.employeId) {
            return mnprisma.bulletin.findMany({
                where: { employeId: user.employeId },
                include: includeClause,
                orderBy: { id: 'desc' }
            });
        }
        // Autres rôles n'ont pas accès aux bulletins
        return [];
    }
    async update(id, data) {
        return mnprisma.bulletin.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.bulletin.delete({ where: { id } });
    }
}
;
//# sourceMappingURL=bulletin.js.map