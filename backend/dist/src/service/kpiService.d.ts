export interface KPIData {
    nom: string;
    valeur: number;
    valeurPrecedente: number;
    unite: string;
    typeKpi: string;
    periode: string;
    dateCalcul: Date;
    tableauDeBordId: number;
    entrepriseId: number;
}
export interface KPICalculationResult {
    [key: string]: {
        valeur: number;
        valeurPrecedente: number;
        unite: string;
        typeKpi: string;
        periode: string;
    };
}
export declare class KpiService {
    private prisma;
    /**
     * Calcule tous les KPIs pour une entreprise (ou toutes les entreprises pour le superadmin)
     */
    calculateAllKPIs(entrepriseId: number | null, tableauDeBordId: number, isSuperAdmin?: boolean): Promise<KPICalculationResult>;
    /**
     * Calcule le taux d'absentéisme (simulé pour l'exemple)
     */
    private calculateTauxAbsentéisme;
    /**
     * Calcule l'évolution de la masse salariale
     */
    private calculateEvolutionMasseSalariale;
    /**
     * Récupère la valeur précédente d'un KPI pour calculer l'évolution
     */
    private getPreviousMonthValue;
    /**
     * Sauvegarde les KPIs calculés dans la base de données
     */
    private saveKPIs;
    /**
     * Récupère les données d'évolution sur 6 mois pour les graphiques
     */
    getEvolutionData(entrepriseId: number, typeKpi: string, months?: number): Promise<Array<{
        mois: string;
        valeur: number;
    }>>;
    /**
     * Compare les données entre deux périodes
     */
    comparePeriods(entrepriseId: number, typeKpi: string, period1Start: Date, period1End: Date, period2Start: Date, period2End: Date): Promise<{
        period1: number;
        period2: number;
        evolution: number;
    }>;
}
export declare const kpiService: KpiService;
//# sourceMappingURL=kpiService.d.ts.map