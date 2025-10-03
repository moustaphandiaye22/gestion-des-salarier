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
// Obtenir les informations QR code d'un employé - caissier, admin entreprise ou super admin
router.get('/employe/:employeId/info', requireReadAccess, qrCodeController.getQrCodeInfo);
// Scanner un QR code (validation) - accessible à tous les rôles authentifiés
router.post('/scan', requireReadAccess, qrCodeController.scanQrCode);
// Pointer via QR code (entrée ou sortie automatique) - accessible à tous les rôles authentifiés
router.post('/pointer', requireReadAccess, qrCodeController.pointerParQrCode);
export default router;
//# sourceMappingURL=qrCodeRoutes.js.map