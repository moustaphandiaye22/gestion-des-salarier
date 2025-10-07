import { PrismaClient } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class employeRepository {
    async findByStatus(statutEmploi) {
        return mnprisma.employe.findMany({
            where: { statutEmploi },
            include: { entreprise: true, bulletins: true, profession: true },
            orderBy: { id: 'desc' }
        });
    }
    async findByTypeContrat(typeContrat) {
        return mnprisma.employe.findMany({
            where: { typeContrat },
            include: { entreprise: true, bulletins: true, profession: true },
            orderBy: { id: 'desc' }
        });
    }
    //   async findByPoste(poste: Poste): Promise<Employe[]> {
    //   return prisma.employe.findMany({ where: { poste }, include: { entreprise: true, bulletins: true } });
    //   }
    async findActifs() {
        return mnprisma.employe.findMany({
            where: { estActif: true },
            include: { entreprise: true, bulletins: true, profession: true },
            orderBy: { id: 'desc' }
        });
    }
    async findInactifs() {
        return mnprisma.employe.findMany({
            where: { estActif: false },
            include: { entreprise: true, bulletins: true, profession: true },
            orderBy: { id: 'desc' }
        });
    }
    async findByMatricule(matricule) {
        return mnprisma.employe.findFirst({
            where: { matricule },
            include: { entreprise: true, bulletins: true, profession: true }
        });
    }
    async findByEmail(email) {
        return mnprisma.employe.findFirst({
            where: { email },
            include: { entreprise: true, bulletins: true, profession: true }
        });
    }
    async setStatus(id, statutEmploi) {
        return mnprisma.employe.update({ where: { id }, data: { statutEmploi } });
    }
    async create(data) {
        return mnprisma.employe.create({ data });
    }
    async findById(id) {
        return mnprisma.employe.findUnique({ where: { id }, include: { entreprise: true, bulletins: true, profession: true } });
    }
    async findAll() {
        return mnprisma.employe.findMany({
            include: { entreprise: true, bulletins: true, profession: true },
            orderBy: { id: 'desc' }
        });
    }
    async findAllByUser(user, entrepriseId) {
        // Super Admin voit tous les employés, ou seulement ceux de l'entreprise sélectionnée
        if (user.profil === 'SUPER_ADMIN') {
            if (entrepriseId) {
                return mnprisma.employe.findMany({
                    where: { entrepriseId },
                    include: { entreprise: true, bulletins: true, profession: true },
                    orderBy: { id: 'desc' }
                });
            }
            return mnprisma.employe.findMany({
                include: { entreprise: true, bulletins: true, profession: true },
                orderBy: { id: 'desc' }
            });
        }
        // Admin d'Entreprise et Caissier voient seulement les employés de leur entreprise
        if ((user.profil === 'ADMIN_ENTREPRISE' || user.profil === 'CAISSIER') && user.entrepriseId) {
            return mnprisma.employe.findMany({
                where: { entrepriseId: user.entrepriseId },
                include: { entreprise: true, bulletins: true, profession: true },
                orderBy: { id: 'desc' }
            });
        }
        // Employé voit seulement ses propres informations
        if (user.profil === 'EMPLOYE' && user.employeId) {
            return mnprisma.employe.findMany({
                where: { id: user.employeId },
                include: { entreprise: true, bulletins: true, profession: true },
                orderBy: { id: 'desc' }
            });
        }
        // Autres rôles n'ont pas accès à la liste des employés
        return [];
    }
    async update(id, data) {
        return mnprisma.employe.update({ where: { id }, data });
    }
    async delete(id) {
        await mnprisma.employe.delete({ where: { id } });
    }
    async getEmployePointages(employeId) {
        return mnprisma.pointage.findMany({
            where: { employeId },
            orderBy: { datePointage: 'desc' }
        });
    }
}
;
//# sourceMappingURL=employe.js.map