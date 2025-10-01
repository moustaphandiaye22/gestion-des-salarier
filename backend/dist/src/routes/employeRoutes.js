import { Router } from 'express';
import { EmployeController } from '../controller/employeController.js';
import { requireAdminOrSuper } from '../middleware/rbacMiddleware.js';
import multer from 'multer';
const router = Router();
const employeController = new EmployeController();
const upload = multer();
// Créer un employé - admin entreprise ou super admin
router.post('/', requireAdminOrSuper, employeController.create);
// Import Excel - ajout multiple
router.post('/bulk-import', requireAdminOrSuper, upload.single('file'), employeController.bulkImport);
// Lister les employés - admin entreprise (de leur entreprise) ou super admin
router.get('/', requireAdminOrSuper, employeController.getAll);
// Obtenir un employé par ID - admin entreprise ou super admin
router.get('/:id', requireAdminOrSuper, employeController.getById);
// Mettre à jour un employé - admin entreprise ou super admin
router.put('/:id', requireAdminOrSuper, employeController.update);
// Supprimer un employé - admin entreprise ou super admin
router.delete('/:id', requireAdminOrSuper, employeController.delete);
// Obtenir le dernier bulletin d'un employé - admin entreprise ou super admin
router.get('/:id/latest-bulletin', requireAdminOrSuper, employeController.getLatestBulletin);
export default router;
//# sourceMappingURL=employeRoutes.js.map