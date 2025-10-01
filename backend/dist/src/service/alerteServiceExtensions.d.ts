export interface AlerteData {
    titre: string;
    message: string;
    type: string;
    severite: string;
    tableauDeBordId: number;
    entrepriseId: number | null;
    utilisateurId?: number;
}
export declare class AlerteServiceExtensions {
    private prisma;
    /**
     * Génère des alertes prédictives basées sur les tendances
     */
    generatePredictiveAlerts(entrepriseId: number | null, isSuperAdmin?: boolean): Promise<AlerteData[]>;
    /**
     * Génère des alertes de performance
     */
    generatePerformanceAlerts(entrepriseId: number | null, isSuperAdmin?: boolean): Promise<AlerteData[]>;
    /**
     * Calcule la tendance d'un KPI sur les 3 derniers mois
     */
    private calculateTrend;
}
export declare const alerteServiceExtensions: AlerteServiceExtensions;
//# sourceMappingURL=alerteServiceExtensions.d.ts.map