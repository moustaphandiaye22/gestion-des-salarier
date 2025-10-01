import { PrismaClient } from '@prisma/client';
import { mnprisma } from '../config/db.js';
const prisma = new PrismaClient();
export class KpiService {
    prisma = mnprisma;
    /**
     * Calcule tous les KPIs pour une entreprise (ou toutes les entreprises pour le superadmin)
     */
    async calculateAllKPIs(entrepriseId, tableauDeBordId, isSuperAdmin = false) {
        const results = {};
        // Construire les conditions de filtrage
        const baseWhere = isSuperAdmin ? {} : { entrepriseId: entrepriseId };
        const employeWhere = isSuperAdmin ? { estActif: true } : { ...baseWhere, estActif: true };
        // Récupérer les données nécessaires en une seule requête
        const [employes, bulletins, paiements, cycles] = await Promise.all([
            this.prisma.employe.findMany({
                where: employeWhere,
                include: { bulletins: true }
            }),
            this.prisma.bulletin.findMany({
                where: { employe: baseWhere },
                include: { employe: true }
            }),
            this.prisma.paiement.findMany({
                where: baseWhere
            }),
            this.prisma.cyclePaie.findMany({
                where: baseWhere
            })
        ]);
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        // Calcul des KPIs de base
        results['NOMBRE_EMPLOYES'] = {
            valeur: employes.length,
            valeurPrecedente: isSuperAdmin ? 0 : await this.getPreviousMonthValue(entrepriseId, 'NOMBRE_EMPLOYES'),
            unite: 'employés',
            typeKpi: 'NOMBRE_EMPLOYES',
            periode: 'TEMPS_REEL'
        };
        results['NOMBRE_EMPLOYES_ACTIFS'] = {
            valeur: employes.filter(e => e.estActif).length,
            valeurPrecedente: isSuperAdmin ? 0 : await this.getPreviousMonthValue(entrepriseId, 'NOMBRE_EMPLOYES_ACTIFS'),
            unite: 'employés',
            typeKpi: 'NOMBRE_EMPLOYES_ACTIFS',
            periode: 'TEMPS_REEL'
        };
        results['TOTAL_SALAIRE_BASE'] = {
            valeur: employes.reduce((sum, emp) => sum + Number(emp.salaireBase), 0),
            valeurPrecedente: isSuperAdmin ? 0 : await this.getPreviousMonthValue(entrepriseId, 'TOTAL_SALAIRE_BASE'),
            unite: 'FCFA',
            typeKpi: 'TOTAL_SALAIRE_BASE',
            periode: 'TEMPS_REEL'
        };
        results['MASSE_SALARIALE'] = {
            valeur: bulletins.reduce((sum, bulletin) => sum + Number(bulletin.totalAPayer), 0),
            valeurPrecedente: isSuperAdmin ? 0 : await this.getPreviousMonthValue(entrepriseId, 'MASSE_SALARIALE'),
            unite: 'FCFA',
            typeKpi: 'MASSE_SALARIALE',
            periode: 'MOIS'
        };
        results['NOMBRE_BULLETINS'] = {
            valeur: bulletins.length,
            valeurPrecedente: isSuperAdmin ? 0 : await this.getPreviousMonthValue(entrepriseId, 'NOMBRE_BULLETINS'),
            unite: 'bulletins',
            typeKpi: 'NOMBRE_BULLETINS',
            periode: 'MOIS'
        };
        results['NOMBRE_PAIEMENTS'] = {
            valeur: paiements.length,
            valeurPrecedente: isSuperAdmin ? 0 : await this.getPreviousMonthValue(entrepriseId, 'NOMBRE_PAIEMENTS'),
            unite: 'paiements',
            typeKpi: 'NOMBRE_PAIEMENTS',
            periode: 'MOIS'
        };
        results['NOMBRE_PAIEMENTS_PAYES'] = {
            valeur: paiements.filter(p => p.statut === 'PAYE').length,
            valeurPrecedente: isSuperAdmin ? 0 : await this.getPreviousMonthValue(entrepriseId, 'NOMBRE_PAIEMENTS_PAYES'),
            unite: 'paiements',
            typeKpi: 'NOMBRE_PAIEMENTS_PAYES',
            periode: 'MOIS'
        };
        results['TAUX_PAIEMENT'] = {
            valeur: paiements.length > 0 ? (paiements.filter(p => p.statut === 'PAYE').length / paiements.length) * 100 : 0,
            valeurPrecedente: isSuperAdmin ? 0 : await this.getPreviousMonthValue(entrepriseId, 'TAUX_PAIEMENT'),
            unite: '%',
            typeKpi: 'TAUX_PAIEMENT',
            periode: 'MOIS'
        };
        results['NOMBRE_CYCLES'] = {
            valeur: cycles.length,
            valeurPrecedente: isSuperAdmin ? 0 : await this.getPreviousMonthValue(entrepriseId, 'NOMBRE_CYCLES'),
            unite: 'cycles',
            typeKpi: 'NOMBRE_CYCLES',
            periode: 'TEMPS_REEL'
        };
        // KPIs avancés utilisant les valeurs existantes de l'enum
        results['TOTAL_ALLOCATIONS'] = {
            valeur: employes.reduce((sum, emp) => sum + Number(emp.allocations), 0),
            valeurPrecedente: isSuperAdmin ? 0 : await this.getPreviousMonthValue(entrepriseId, 'TOTAL_ALLOCATIONS'),
            unite: 'FCFA',
            typeKpi: 'TOTAL_ALLOCATIONS',
            periode: 'MOIS'
        };
        results['TOTAL_DEDUCTIONS'] = {
            valeur: employes.reduce((sum, emp) => sum + Number(emp.deductions), 0),
            valeurPrecedente: isSuperAdmin ? 0 : await this.getPreviousMonthValue(entrepriseId, 'TOTAL_DEDUCTIONS'),
            unite: 'FCFA',
            typeKpi: 'TOTAL_DEDUCTIONS',
            periode: 'MOIS'
        };
        results['TAUX_ABSENTEISME'] = {
            valeur: await this.calculateTauxAbsentéisme(entrepriseId, isSuperAdmin),
            valeurPrecedente: isSuperAdmin ? 0 : await this.getPreviousMonthValue(entrepriseId, 'TAUX_ABSENTEISME'),
            unite: '%',
            typeKpi: 'TAUX_ABSENTEISME',
            periode: 'MOIS'
        };
        results['TURNOVER'] = {
            valeur: 0,
            valeurPrecedente: 0,
            unite: '%',
            typeKpi: 'TURNOVER',
            periode: 'ANNEE'
        };
        results['EVOLUTION_SALARIALE'] = {
            valeur: await this.calculateEvolutionMasseSalariale(entrepriseId, isSuperAdmin),
            valeurPrecedente: isSuperAdmin ? 0 : await this.getPreviousMonthValue(entrepriseId, 'EVOLUTION_SALARIALE'),
            unite: '%',
            typeKpi: 'EVOLUTION_SALARIALE',
            periode: 'MOIS'
        };
        // Sauvegarder les KPIs dans la base de données (seulement si ce n'est pas un superadmin)
        if (!isSuperAdmin && entrepriseId) {
            await this.saveKPIs(results, tableauDeBordId, entrepriseId);
        }
        return results;
    }
    /**
     * Calcule le taux d'absentéisme (simulé pour l'exemple)
     */
    async calculateTauxAbsentéisme(entrepriseId, isSuperAdmin) {
        // Simulation basée sur les données disponibles
        // En production, cela nécessiterait une table d'absentéisme
        const employes = await this.prisma.employe.findMany({
            where: isSuperAdmin ? { estActif: true } : { entrepriseId, estActif: true }
        });
        // Simulation: taux d'absentéisme basé sur le nombre d'employés inactifs
        const employesInactifs = employes.filter(e => !e.estActif).length;
        return employes.length > 0 ? (employesInactifs / employes.length) * 100 : 0;
    }
    /**
     * Calcule l'évolution de la masse salariale
     */
    async calculateEvolutionMasseSalariale(entrepriseId, isSuperAdmin) {
        const currentMonth = new Date();
        const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        const [currentData, previousData] = await Promise.all([
            this.prisma.kpiData.findFirst({
                where: {
                    entrepriseId: isSuperAdmin ? undefined : entrepriseId,
                    typeKpi: 'MASSE_SALARIALE',
                    dateCalcul: {
                        gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
                        lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                    }
                },
                orderBy: { dateCalcul: 'desc' }
            }),
            this.prisma.kpiData.findFirst({
                where: {
                    entrepriseId: isSuperAdmin ? undefined : entrepriseId,
                    typeKpi: 'MASSE_SALARIALE',
                    dateCalcul: {
                        gte: previousMonth,
                        lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
                    }
                },
                orderBy: { dateCalcul: 'desc' }
            })
        ]);
        const currentValue = currentData ? Number(currentData.valeur) : 0;
        const previousValue = previousData ? Number(previousData.valeur) : 0;
        return previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;
    }
    /**
     * Récupère la valeur précédente d'un KPI pour calculer l'évolution
     */
    async getPreviousMonthValue(entrepriseId, typeKpi) {
        try {
            const previousMonth = await this.prisma.kpiData.findFirst({
                where: {
                    entrepriseId,
                    typeKpi: typeKpi,
                    periode: 'MOIS',
                    dateCalcul: {
                        lt: new Date()
                    }
                },
                orderBy: {
                    dateCalcul: 'desc'
                }
            });
            return previousMonth ? Number(previousMonth.valeur) : 0;
        }
        catch (error) {
            // Si le type KPI n'existe pas dans la base de données, retourner 0
            console.warn(`KPI type ${typeKpi} not found in database, returning 0 for previous value`);
            return 0;
        }
    }
    /**
     * Sauvegarde les KPIs calculés dans la base de données
     */
    async saveKPIs(kpis, tableauDeBordId, entrepriseId) {
        const kpiRecords = Object.entries(kpis).map(([key, data]) => ({
            nom: key,
            valeur: data.valeur,
            valeurPrecedente: data.valeurPrecedente,
            unite: data.unite,
            typeKpi: data.typeKpi,
            periode: data.periode,
            dateCalcul: new Date(),
            tableauDeBordId,
            entrepriseId
        }));
        await this.prisma.kpiData.createMany({
            data: kpiRecords,
            skipDuplicates: true
        });
    }
    /**
     * Récupère les données d'évolution sur 6 mois pour les graphiques
     */
    async getEvolutionData(entrepriseId, typeKpi, months = 6) {
        const endDate = new Date();
        const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - months, 1);
        const evolutionData = await this.prisma.kpiData.findMany({
            where: {
                entrepriseId,
                typeKpi: typeKpi,
                periode: 'MOIS',
                dateCalcul: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                dateCalcul: 'asc'
            }
        });
        // Regrouper par mois et prendre la dernière valeur de chaque mois
        const monthlyData = new Map();
        evolutionData.forEach((kpi) => {
            const monthKey = `${kpi.dateCalcul.getFullYear()}-${String(kpi.dateCalcul.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlyData.has(monthKey) || kpi.dateCalcul > new Date(monthlyData.get(monthKey))) {
                monthlyData.set(monthKey, Number(kpi.valeur));
            }
        });
        // Remplir les mois manquants avec 0
        const result = [];
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            result.push({
                mois: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
                valeur: monthlyData.get(monthKey) || 0
            });
        }
        return result;
    }
    /**
     * Compare les données entre deux périodes
     */
    async comparePeriods(entrepriseId, typeKpi, period1Start, period1End, period2Start, period2End) {
        const [data1, data2] = await Promise.all([
            this.prisma.kpiData.findMany({
                where: {
                    entrepriseId,
                    typeKpi: typeKpi,
                    dateCalcul: {
                        gte: period1Start,
                        lte: period1End
                    }
                }
            }),
            this.prisma.kpiData.findMany({
                where: {
                    entrepriseId,
                    typeKpi: typeKpi,
                    dateCalcul: {
                        gte: period2Start,
                        lte: period2End
                    }
                }
            })
        ]);
        const avg1 = data1.length > 0 ? data1.reduce((sum, d) => sum + Number(d.valeur), 0) / data1.length : 0;
        const avg2 = data2.length > 0 ? data2.reduce((sum, d) => sum + Number(d.valeur), 0) / data2.length : 0;
        const evolution = avg1 !== 0 ? ((avg2 - avg1) / avg1) * 100 : 0;
        return {
            period1: avg1,
            period2: avg2,
            evolution
        };
    }
}
export const kpiService = new KpiService();
//# sourceMappingURL=kpiService.js.map