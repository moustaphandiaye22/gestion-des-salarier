import { Router } from 'express';
import { LicenceController } from '../controller/licenceController.js';
import { requireSuperAdmin, requireAdminOrSuper, requireReadAccess } from '../middleware/rbacMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();
const licenceController = new LicenceController();

router.use(authenticateToken);

// Read operations - allow CAISSIER, ADMIN_ENTREPRISE, SUPER_ADMIN
router.get('/', requireReadAccess, licenceController.getAll.bind(licenceController));
router.get('/:id', requireReadAccess, licenceController.getById.bind(licenceController));
router.get('/nom/:nom', requireReadAccess, licenceController.getByNom.bind(licenceController));
router.get('/entreprise/:entrepriseId', requireReadAccess, licenceController.getByEntreprise.bind(licenceController));
router.get('/statut/:statut', requireReadAccess, licenceController.getByStatut.bind(licenceController));
router.get('/type/:typeLicence', requireReadAccess, licenceController.getByType.bind(licenceController));

// Write operations - only ADMIN_ENTREPRISE and SUPER_ADMIN
router.post('/', requireAdminOrSuper, licenceController.create.bind(licenceController));
router.put('/:id', requireAdminOrSuper, licenceController.update.bind(licenceController));
router.delete('/:id', requireAdminOrSuper, licenceController.delete.bind(licenceController));
router.post('/:id/assign', requireAdminOrSuper, licenceController.assignToEntreprise.bind(licenceController));
router.post('/:id/revoke', requireAdminOrSuper, licenceController.revokeFromEntreprise.bind(licenceController));

export default router;
