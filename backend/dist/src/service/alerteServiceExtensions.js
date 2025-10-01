import { PrismaClient } from '@prisma/client';
import { mnprisma } from '../config/db.js';
export class AlerteServiceExtensions {
    prisma = mnprisma;
    /**
     * Génère des alertes prédictives basées sur les tendances
     */
    async generatePredictiveAlerts(entrepriseId, isSuperAdmin = false) {
        const alertes = [];
        const baseWhere = isSuperAdmin ? {} : { entrepriseId: entrepriseId };
        // Alerte prédictive: Tendance à la baisse de la masse salariale
        const masseSalarialeTrend = await this.calculateTrend('MASSE_SALARIALE', entrepriseId, isSuperAdmin);
        if (masseSalarialeTrend < -10) { // Baisse de plus de 10%
            alertes.push({
                titre: 'Tendance à la baisse de la masse salariale',
                message: `La masse salariale a diminué de ${Math.abs(masseSalarialeTrend).toFixed(1)}% ces derniers mois. Cela pourrait indiquer des problèmes structurels.`,
                type: 'TENDANCE_MASSE_SALARIALE',
                severite: 'ELEVEE',
                tableauDeBordId: 1, // À adapter selon le contexte
                entrepriseId: isSuperAdmin ? 1 : entrepriseId,
                utilisateurId: 1
            });
        }
        // Alerte prédictive: Augmentation du taux d'absentéisme
        const tauxAbsentéismeTrend = await this.calculateTrend('TAUX_ABSENTEISME', entrepriseId, isSuperAdmin);
        if (tauxAbsentéismeTrend > 20) { // Augmentation de plus de 20%
            alertes.push({
                titre: 'Augmentation du taux d\'absentéisme',
                message: `Le taux d'absentéisme a augmenté de ${tauxAbsentéismeTrend.toFixed(1)}% ces derniers mois. Considérez des mesures préventives.`,
                type: 'TENDANCE_ABSENTEISME',
                severite: 'MOYENNE',
                tableauDeBordId: 1,
                entrepriseId: isSuperAdmin ? 1 : entrepriseId,
                utilisateurId: 1
            });
        }
        return alertes;
    }
    /**
     * Génère des alertes de performance
     */
    async generatePerformanceAlerts(entrepriseId, isSuperAdmin = false) {
        const alertes = [];
        const baseWhere = isSuperAdmin ? {} : { entrepriseId: entrepriseId };
        // Alerte: Productivité mensuelle faible
        const employes = await this.prisma.employe.findMany({
            where: { ...baseWhere, estActif: true }
        });
        const bulletins = await this.prisma.bulletin.findMany({
            where: baseWhere
        });
        const productivite = employes.length > 0 ? bulletins.length / employes.length : 0;
        if (productivite < 0.8) { // Moins d'un bulletin par employé en moyenne
            alertes.push({
                titre: 'Productivité mensuelle faible',
                message: `La productivité mensuelle est de ${productivite.toFixed(2)} bulletins par employé, ce qui est inférieur à la moyenne attendue.`,
                type: 'PRODUCTIVITE_FAIBLE',
                severite: 'MOYENNE',
                tableauDeBordId: 1,
                entrepriseId: isSuperAdmin ? 1 : entrepriseId,
                utilisateurId: 1
            });
        }
        // Alerte: Coût moyen par employé élevé
        const masseSalariale = bulletins.reduce((sum, b) => sum + Number(b.totalAPayer), 0);
        const coutMoyen = employes.length > 0 ? masseSalariale / employes.length : 0;
        const seuilCoutMoyen = 500000; // Seuil à adapter selon le contexte
        if (coutMoyen > seuilCoutMoyen) {
            alertes.push({
                titre: 'Coût moyen par employé élevé',
                message: `Le coût moyen par employé est de ${coutMoyen.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF' })}, ce qui dépasse le seuil recommandé.`,
                type: 'COUT_ELEVE',
                severite: 'ELEVEE',
                tableauDeBordId: 1,
                entrepriseId: isSuperAdmin ? 1 : entrepriseId,
                utilisateurId: 1
            });
        }
        return alertes;
    }
    /**
     * Calcule la tendance d'un KPI sur les 3 derniers mois
     */
    async calculateTrend(typeKpi, entrepriseId, isSuperAdmin) {
        const endDate = new Date();
        const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 3, 1);
        const kpiData = await this.prisma.kpiData.findMany({
            where: {
                entrepriseId: isSuperAdmin ? undefined : entrepriseId,
                typeKpi: typeKpi,
                dateCalcul: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: { dateCalcul: 'asc' }
        });
        if (kpiData.length < 2)
            return 0;
        const firstValue = Number(kpiData[0].valeur);
        const lastValue = Number(kpiData[kpiData.length - 1].valeur);
        return firstValue !== 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
    }
}
export const alerteServiceExtensions = new AlerteServiceExtensions();
//# sourceMappingURL=alerteServiceExtensions.js.map