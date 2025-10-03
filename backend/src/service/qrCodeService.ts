import * as QRCode from 'qrcode';
import * as crypto from 'crypto';

export class QrCodeService {
  /**
   * Génère un QR code unique pour un employé
   */
  async generateEmployeeQrCode(employeId: number, entrepriseId: number): Promise<string> {
    // Générer un code unique basé sur l'ID employé et un timestamp
    const uniqueCode = `EMP_${employeId}_${entrepriseId}_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;

    // Générer le QR code en base64
    const qrCodeDataURL = await QRCode.toDataURL(uniqueCode, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return qrCodeDataURL;
  }

  /**
   * Génère le contenu du QR code (le texte encodé)
   */
  generateQrContent(employeId: number, entrepriseId: number): string {
    return `EMP_${employeId}_${entrepriseId}_${Date.now()}`;
  }

  /**
   * Valide un QR code scanné
   */
  validateQrCode(qrContent: string): { isValid: boolean; employeId?: number; entrepriseId?: number } {
    try {
      // Format attendu: EMP_[employeId]_[entrepriseId]_[timestamp]
      const parts = qrContent.split('_');

      if (parts.length < 4 || parts[0] !== 'EMP') {
        return { isValid: false };
      }

      const employeIdStr = parts[1];
      const entrepriseIdStr = parts[2];

      if (!employeIdStr || !entrepriseIdStr) {
        return { isValid: false };
      }

      const employeId = parseInt(employeIdStr);
      const entrepriseId = parseInt(entrepriseIdStr);

      if (isNaN(employeId) || isNaN(entrepriseId)) {
        return { isValid: false };
      }

      return {
        isValid: true,
        employeId,
        entrepriseId
      };
    } catch (error) {
      return { isValid: false };
    }
  }

  /**
   * Génère un QR code pour pointage rapide (avec URL de callback)
   */
  async generatePointageQrCode(baseUrl: string, employeId: number, entrepriseId: number): Promise<string> {
    const pointageUrl = `${baseUrl}/pointage/scan?emp=${employeId}&ent=${entrepriseId}&t=${Date.now()}`;

    const qrCodeDataURL = await QRCode.toDataURL(pointageUrl, {
      width: 400,
      margin: 3,
      color: {
        dark: '#1f2937',
        light: '#f9fafb'
      }
    });

    return qrCodeDataURL;
  }

  /**
   * Génère plusieurs QR codes pour une entreprise
   */
  async generateMultipleQrCodes(employeIds: number[], entrepriseId: number): Promise<{ [key: number]: string }> {
    const qrCodes: { [key: number]: string } = {};

    for (const employeId of employeIds) {
      qrCodes[employeId] = await this.generateEmployeeQrCode(employeId, entrepriseId);
    }

    return qrCodes;
  }
}