export declare class ExportService {
    private bulletinRepository;
    private paiementRepository;
    constructor();
    /**
     * Export bulletins to Excel format
     */
    exportBulletinsToExcel(user?: any): Promise<Buffer>;
    /**
     * Export payments to Excel format
     */
    exportPaiementsToExcel(user?: any): Promise<Buffer>;
    /**
     * Export employee template to Excel format
     */
    exportEmployeeTemplate(): Promise<Buffer>;
}
//# sourceMappingURL=exportService.d.ts.map