export interface AlerteData {
    titre: string;
    message: string;
    type: string;
    severite: string;
    tableauDeBordId: number;
    entrepriseId: number | null;
    utilisateurId?: number;
}
export declare class AlerteService {
    private prisma;
    /**
     * Crée une nouvelle alerte
     */
    createAlerte(data: AlerteData): Promise<any>;
    /**
     * Récupère les alertes non lues pour un tableau de bord
     */
    getAlertesNonLues(tableauDeBordId: number, entrepriseId: number | null, isSuperAdmin?: boolean): Promise<any>;
    /**
     * Marque une alerte comme lue
     */
    marquerCommeLue(alerteId: number): Promise<any>;
    /**
     * Génère des alertes automatiques basées sur les règles métier
     */
    genererAlertesAutomatiques(entrepriseId: number | null, tableauDeBordId: number, isSuperAdmin?: boolean): Promise<AlerteData[]>;
    /**
     * Nettoie les anciennes alertes lues
     */
    nettoyerAnciennesAlertes(jours?: number): Promise<any>;
    /**
     * Récupère les statistiques des alertes
     */
    getStatistiquesAlertes(entrepriseId: number | null, isSuperAdmin?: boolean): Promise<{
        total: any;
        nonLues: any;
        parType: any;
        parSeverite: any;
    }>;
}
export declare const alerteService: AlerteService;
//# sourceMappingURL=alerteService.d.ts.map