import { Router } from 'express';
import { EmployeController } from '../controller/employeController.js';
import { requireAdminOrSuper, requireReadAccess, requireSuperAdminAccess } from '../middleware/rbacMiddleware.js';
import multer from 'multer';
const router = Router();
const employeController = new EmployeController();
const upload = multer();
// Créer un employé - admin entreprise ou super admin
router.post('/', requireAdminOrSuper, employeController.create);
// Import Excel - ajout multiple
router.post('/bulk-import', requireAdminOrSuper, upload.single('file'), employeController.bulkImport);
// Lister les employés - caissier, admin entreprise (de leur entreprise) ou super admin
router.get('/', requireReadAccess, employeController.getAll);
// Obtenir un employé par ID - caissier, admin entreprise ou super admin (avec autorisation)
router.get('/:id', requireSuperAdminAccess, employeController.getById);
// Mettre à jour un employé - admin entreprise ou super admin (avec autorisation)
router.put('/:id', requireSuperAdminAccess, employeController.update);
// Supprimer un employé - admin entreprise ou super admin (avec autorisation)
router.delete('/:id', requireSuperAdminAccess, employeController.delete);
// Obtenir le dernier bulletin d'un employé - admin entreprise ou super admin (avec autorisation)
router.get('/:id/latest-bulletin', requireSuperAdminAccess, employeController.getLatestBulletin);
// Exporter le modèle Excel - admin entreprise ou super admin
router.get('/export/template', requireAdminOrSuper, employeController.exportTemplate);
// Générer QR code pour un employé - admin entreprise ou super admin (avec autorisation)
router.post('/:id/generate-qr', requireSuperAdminAccess, employeController.generateQrCode);
// Régénérer QR code pour un employé - admin entreprise ou super admin (avec autorisation)
router.post('/:id/regenerate-qr', requireSuperAdminAccess, employeController.regenerateQrCode);
// Obtenir les statistiques d'un employé - caissier, admin entreprise ou super admin (avec autorisation)
router.get('/:id/statistiques', requireSuperAdminAccess, employeController.getEmployeStats);
// Mettre à jour les statistiques de présence d'un employé - admin entreprise ou super admin (avec autorisation)
router.post('/:id/update-stats', requireSuperAdminAccess, employeController.updatePresenceStats);
// Générer tous les QR codes d'une entreprise - admin entreprise ou super admin
router.post('/entreprise/:entrepriseId/generate-all-qr', requireAdminOrSuper, employeController.generateAllQrCodes);
// Obtenir l'image QR code d'un employé - caissier, admin entreprise ou super admin (avec autorisation)
router.get('/:id/qr-image', requireSuperAdminAccess, employeController.getQrCodeImage);
export default router;
//# sourceMappingURL=employeRoutes.js.map