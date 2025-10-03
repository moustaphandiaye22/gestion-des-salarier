import * as fs from 'fs/promises';
import * as path from 'path';
export class FileService {
    qrCodesDir;
    constructor() {
        this.qrCodesDir = path.join(process.cwd(), 'assets', 'qrcodes');
        this.ensureQrCodesDirectory();
    }
    /**
     * S'assure que le dossier des QR codes existe
     */
    async ensureQrCodesDirectory() {
        try {
            await fs.access(this.qrCodesDir);
            console.log(`✅ Dossier QR codes existe: ${this.qrCodesDir}`);
        }
        catch {
            await fs.mkdir(this.qrCodesDir, { recursive: true, mode: 0o755 });
            console.log(`📁 Dossier QR codes créé: ${this.qrCodesDir}`);
        }
    }
    /**
      * Sauvegarde une image QR code dans le dossier dédié
      */
    async saveQrCodeImage(qrCodeDataURL, employeId, entrepriseId) {
        try {
            console.log(`🔄 Sauvegarde du QR code pour employé ${employeId}, entreprise ${entrepriseId}`);
            // S'assurer que le dossier existe
            await this.ensureQrCodesDirectory();
            // Extraire les données base64 de l'URL data
            const matches = qrCodeDataURL.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
            if (!matches) {
                throw new Error('Format d\'image QR code invalide');
            }
            const [, extension, base64Data] = matches;
            if (!base64Data) {
                throw new Error('Données base64 manquantes');
            }
            console.log(`📊 Taille des données base64: ${base64Data.length} caractères`);
            const buffer = Buffer.from(base64Data, 'base64');
            console.log(`📊 Taille du buffer: ${buffer.length} octets`);
            // Créer un nom de fichier unique
            const timestamp = Date.now();
            const fileName = `qr_employe_${employeId}_${entrepriseId}_${timestamp}.${extension}`;
            const filePath = path.join(this.qrCodesDir, fileName);
            console.log(`💾 Sauvegarde vers: ${filePath}`);
            // Sauvegarder le fichier
            await fs.writeFile(filePath, buffer);
            console.log(`✅ QR code sauvegardé avec succès: ${fileName}`);
            // Vérifier que le fichier existe
            const exists = await this.qrCodeImageExists(`qrcodes/${fileName}`);
            if (exists) {
                console.log(`✅ Vérification réussie: fichier existe`);
            }
            else {
                console.error(`❌ Erreur: fichier non trouvé après sauvegarde`);
            }
            // Retourner le chemin relatif pour la base de données
            return `qrcodes/${fileName}`;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde du QR code:', error);
            console.error('Détails:', {
                employeId,
                entrepriseId,
                dataURLLength: qrCodeDataURL?.length,
                errorMessage: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error(`Impossible de sauvegarder l'image QR code: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Supprime une image QR code
     */
    async deleteQrCodeImage(imagePath) {
        try {
            if (!imagePath)
                return;
            const fullPath = path.join(process.cwd(), 'assets', imagePath);
            await fs.unlink(fullPath);
        }
        catch (error) {
            console.error('Erreur lors de la suppression du QR code:', error);
            // Ne pas throw l'erreur pour ne pas bloquer les autres opérations
        }
    }
    /**
     * Récupère le chemin complet d'une image QR code
     */
    getFullImagePath(imagePath) {
        if (!imagePath)
            return '';
        return path.join(process.cwd(), 'assets', imagePath);
    }
    /**
     * Vérifie si une image QR code existe
     */
    async qrCodeImageExists(imagePath) {
        try {
            if (!imagePath)
                return false;
            const fullPath = this.getFullImagePath(imagePath);
            await fs.access(fullPath);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Génère le nom du dossier pour une entreprise
     */
    getEntrepriseQrCodeDir(entrepriseId) {
        return path.join(this.qrCodesDir, `entreprise_${entrepriseId}`);
    }
    /**
     * Sauvegarde les QR codes en lot pour une entreprise
     */
    async saveMultipleQrCodes(qrCodesData, entrepriseId) {
        const savedPaths = {};
        for (const [employeId, qrCodeDataURL] of Object.entries(qrCodesData)) {
            const savedPath = await this.saveQrCodeImage(qrCodeDataURL, parseInt(employeId), entrepriseId);
            savedPaths[parseInt(employeId)] = savedPath;
        }
        return savedPaths;
    }
}
//# sourceMappingURL=fileService.js.map