export declare class QrCodeService {
    /**
     * Génère un QR code unique pour un employé
     */
    generateEmployeeQrCode(employeId: number, entrepriseId: number): Promise<string>;
    /**
     * Génère le contenu du QR code (le texte encodé)
     */
    generateQrContent(employeId: number, entrepriseId: number): string;
    /**
     * Valide un QR code scanné
     */
    validateQrCode(qrContent: string): {
        isValid: boolean;
        employeId?: number;
        entrepriseId?: number;
    };
    /**
     * Génère un QR code pour pointage rapide (avec URL de callback)
     */
    generatePointageQrCode(baseUrl: string, employeId: number, entrepriseId: number): Promise<string>;
    /**
     * Génère plusieurs QR codes pour une entreprise
     */
    generateMultipleQrCodes(employeIds: number[], entrepriseId: number): Promise<{
        [key: number]: string;
    }>;
}
//# sourceMappingURL=qrCodeService.d.ts.map