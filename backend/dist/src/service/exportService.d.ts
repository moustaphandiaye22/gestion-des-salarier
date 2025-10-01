export interface ExportRequest {
    type: string;
    format: string;
    parametres: any;
    utilisateurId: number;
    entrepriseId: number | null;
}
export declare class ExportService {
    private prisma;
    private exportDir;
    constructor();
    /**
     * Lance une nouvelle exportation
     */
    createExport(request: ExportRequest): Promise<any>;
    /**
     * Traite l'export de manière asynchrone
     */
    private processExport;
    /**
     * Export des données analytiques
     */
    private exportDonneesAnalytiques;
    /**
     * Export du rapport salarial
     */
    private exportRapportSalarial;
    /**
     * Export de la liste des employés
     */
    private exportListeEmployes;
    /**
     * Export des bulletins de paie
     */
    private exportBulletinsPaie;
    /**
     * Export des paiements
     */
    private exportPaiements;
    /**
     * Export des KPIs du dashboard
     */
    private exportKpiDashboard;
    /**
     * Sauvegarde les données dans un fichier selon le format demandé
     */
    private saveDataToFile;
    /**
     * Convertit un objet JSON en CSV
     */
    private jsonToCsv;
    /**
     * Génère un PDF à partir des données
     */
    private generatePDF;
    /**
     * Récupère la liste des exports pour un utilisateur
     */
    getExportsUtilisateur(utilisateurId: number, entrepriseId: number | null, isSuperAdmin?: boolean): Promise<any>;
    /**
     * Télécharge un fichier d'export
     */
    downloadExport(exportId: number, utilisateurId: number): Promise<{
        filePath: string;
        fileName: any;
        mimeType: string;
    }>;
    /**
     * Récupère le type MIME selon le format
     */
    private getMimeType;
}
export declare const exportService: ExportService;
//# sourceMappingURL=exportService.d.ts.map