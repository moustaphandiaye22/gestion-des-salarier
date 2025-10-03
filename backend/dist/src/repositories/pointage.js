import { mnprisma } from '../config/db.js';
export class pointageRepository {
    async findByEmployeAndDate(employeId, datePointage) {
        const startOfDay = new Date(datePointage);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(datePointage);
        endOfDay.setHours(23, 59, 59, 999);
        return mnprisma.pointage.findMany({
            where: {
                employeId,
                datePointage: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            include: {
                employe: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                        matricule: true
                    }
                },
                entreprise: true
            },
            orderBy: { datePointage: 'desc' }
        });
    }
    async findByEntrepriseAndDate(entrepriseId, dateDebut, dateFin) {
        return mnprisma.pointage.findMany({
            where: {
                entrepriseId,
                datePointage: {
                    gte: dateDebut,
                    lte: dateFin
                }
            },
            include: {
                employe: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                        matricule: true
                    }
                }
            },
            orderBy: [
                { datePointage: 'desc' },
                { employe: { nom: 'asc' } }
            ]
        });
    }
    async findByType(typePointage) {
        return mnprisma.pointage.findMany({
            where: { typePointage },
            include: {
                employe: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                        matricule: true
                    }
                },
                entreprise: true
            },
            orderBy: { datePointage: 'desc' }
        });
    }
    async findByStatut(statut) {
        return mnprisma.pointage.findMany({
            where: { statut },
            include: {
                employe: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                        matricule: true
                    }
                },
                entreprise: true
            },
            orderBy: { datePointage: 'desc' }
        });
    }
    async findByEmployeAndPeriode(employeId, dateDebut, dateFin) {
        return mnprisma.pointage.findMany({
            where: {
                employeId,
                datePointage: {
                    gte: dateDebut,
                    lte: dateFin
                }
            },
            include: {
                employe: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                        matricule: true
                    }
                },
                entreprise: true
            },
            orderBy: { datePointage: 'asc' }
        });
    }
    async calculateHeuresTravaillees(employeId, dateDebut, dateFin) {
        const pointages = await mnprisma.pointage.findMany({
            where: {
                employeId,
                datePointage: {
                    gte: dateDebut,
                    lte: dateFin
                },
                statut: 'PRESENT',
                dureeTravail: {
                    not: null
                }
            }
        });
        return pointages.reduce((total, pointage) => {
            return total + (Number(pointage.dureeTravail) || 0);
        }, 0);
    }
    async create(data) {
        return mnprisma.pointage.create({ data });
    }
    async findById(id) {
        return mnprisma.pointage.findUnique({
            where: { id },
            include: {
                employe: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                        matricule: true,
                        email: true,
                        telephone: true
                    }
                },
                entreprise: true
            }
        });
    }
    async findAll() {
        return mnprisma.pointage.findMany({
            include: {
                employe: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                        matricule: true
                    }
                },
                entreprise: true
            },
            orderBy: { datePointage: 'desc' }
        });
    }
    async findAllByUser(user, entrepriseId) {
        // Super Admin voit tous les pointages, ou seulement ceux de l'entreprise sélectionnée
        if (user.profil === 'SUPER_ADMIN') {
            if (entrepriseId) {
                return mnprisma.pointage.findMany({
                    where: { entrepriseId },
                    include: {
                        employe: {
                            select: {
                                id: true,
                                prenom: true,
                                nom: true,
                                matricule: true
                            }
                        },
                        entreprise: true
                    },
                    orderBy: { datePointage: 'desc' }
                });
            }
            return mnprisma.pointage.findMany({
                include: {
                    employe: {
                        select: {
                            id: true,
                            prenom: true,
                            nom: true,
                            matricule: true
                        }
                    },
                    entreprise: true
                },
                orderBy: { datePointage: 'desc' }
            });
        }
        // Admin d'Entreprise et Caissier voient seulement les pointages de leur entreprise
        if ((user.profil === 'ADMIN_ENTREPRISE' || user.profil === 'CAISSIER') && user.entrepriseId) {
            return mnprisma.pointage.findMany({
                where: { entrepriseId: user.entrepriseId },
                include: {
                    employe: {
                        select: {
                            id: true,
                            prenom: true,
                            nom: true,
                            matricule: true
                        }
                    },
                    entreprise: true
                },
                orderBy: { datePointage: 'desc' }
            });
        }
        // Employé voit seulement ses propres pointages
        if (user.profil === 'EMPLOYE' && user.employeId) {
            return mnprisma.pointage.findMany({
                where: { employeId: user.employeId },
                include: {
                    employe: {
                        select: {
                            id: true,
                            prenom: true,
                            nom: true,
                            matricule: true
                        }
                    },
                    entreprise: true
                },
                orderBy: { datePointage: 'desc' }
            });
        }
        // Autres rôles n'ont pas accès à la liste des pointages
        return [];
    }
    async update(id, data) {
        return mnprisma.pointage.update({
            where: { id },
            data,
            include: {
                employe: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                        matricule: true
                    }
                },
                entreprise: true
            }
        });
    }
    async delete(id) {
        await mnprisma.pointage.delete({ where: { id } });
    }
    async bulkCreate(pointages) {
        return mnprisma.pointage.createManyAndReturn({
            data: pointages,
            include: {
                employe: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                        matricule: true
                    }
                },
                entreprise: true
            }
        });
    }
    async getStatistiques(entrepriseId, dateDebut, dateFin) {
        const totalPointages = await mnprisma.pointage.count({
            where: {
                entrepriseId,
                datePointage: {
                    gte: dateDebut,
                    lte: dateFin
                }
            }
        });
        const pointagesPresent = await mnprisma.pointage.count({
            where: {
                entrepriseId,
                statut: 'PRESENT',
                datePointage: {
                    gte: dateDebut,
                    lte: dateFin
                }
            }
        });
        const pointagesAbsent = await mnprisma.pointage.count({
            where: {
                entrepriseId,
                statut: 'ABSENT',
                datePointage: {
                    gte: dateDebut,
                    lte: dateFin
                }
            }
        });
        const heuresTotales = await mnprisma.pointage.aggregate({
            where: {
                entrepriseId,
                statut: 'PRESENT',
                dureeTravail: { not: null },
                datePointage: {
                    gte: dateDebut,
                    lte: dateFin
                }
            },
            _sum: {
                dureeTravail: true
            }
        });
        return {
            total: totalPointages,
            presents: pointagesPresent,
            absents: pointagesAbsent,
            heuresTotales: heuresTotales._sum.dureeTravail?.toNumber() || 0
        };
    }
}
//# sourceMappingURL=pointage.js.map