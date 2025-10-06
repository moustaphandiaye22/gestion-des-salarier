import { Router } from 'express';
import { QrCodeController } from '../controller/qrCodeController.js';
import { requireAdminOrSuper, requireReadAccess } from '../middleware/rbacMiddleware.js';
const router = Router();
const qrCodeController = new QrCodeController();
// Générer un QR code pour un employé - admin entreprise ou super admin
router.post('/employe/:employeId/generate', requireAdminOrSuper, qrCodeController.generateEmployeeQr);
// Régénérer un QR code pour un employé - admin entreprise ou super admin
router.post('/employe/:employeId/regenerate', requireAdminOrSuper, qrCodeController.regenerateEmployeeQr);
// Générer des QR codes pour tous les employés d'une entreprise - admin entreprise ou super admin
router.post('/entreprise/:entrepriseId/generate-all', requireAdminOrSuper, qrCodeController.generateMultipleQrCodes);
// Obtenir les informations QR code d'un employé - accessible sans authentification pour l'affichage
router.get('/employe/:employeId/info', qrCodeController.getQrCodeInfo);
// Scanner un QR code (validation) - accessible sans authentification pour le pointage
router.post('/scan', qrCodeController.scanQrCode);
// Pointer via QR code (entrée ou sortie automatique) - accessible sans authentification pour le pointage
router.post('/pointer', qrCodeController.pointerParQrCode);
export default router;
//# sourceMappingURL=qrCodeRoutes.js.map