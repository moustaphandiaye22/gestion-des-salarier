export declare class FileService {
    private qrCodesDir;
    constructor();
    /**
     * S'assure que le dossier des QR codes existe
     */
    private ensureQrCodesDirectory;
    /**
      * Sauvegarde une image QR code dans le dossier dédié
      */
    saveQrCodeImage(qrCodeDataURL: string, employeId: number, entrepriseId: number): Promise<string>;
    /**
     * Supprime une image QR code
     */
    deleteQrCodeImage(imagePath: string): Promise<void>;
    /**
     * Récupère le chemin complet d'une image QR code
     */
    getFullImagePath(imagePath: string): string;
    /**
     * Vérifie si une image QR code existe
     */
    qrCodeImageExists(imagePath: string): Promise<boolean>;
    /**
     * Génère le nom du dossier pour une entreprise
     */
    getEntrepriseQrCodeDir(entrepriseId: number): string;
    /**
     * Sauvegarde les QR codes en lot pour une entreprise
     */
    saveMultipleQrCodes(qrCodesData: {
        [employeId: number]: string;
    }, entrepriseId: number): Promise<{
        [employeId: number]: string;
    }>;
}
//# sourceMappingURL=fileService.d.ts.map