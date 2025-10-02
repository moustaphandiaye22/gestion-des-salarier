import { Router } from 'express';
import { CyclePaieController } from '../controller/cyclePaieController.js';
import { requireReadAccess, requireAdminOrSuper } from '../middleware/rbacMiddleware.js';
const router = Router();
const cyclePaieController = new CyclePaieController();
router.post('/', requireReadAccess, cyclePaieController.create);
router.get('/', requireReadAccess, cyclePaieController.getAll);
router.get('/:id', requireReadAccess, cyclePaieController.getById);
router.put('/:id', requireReadAccess, cyclePaieController.update);
router.delete('/:id', requireReadAccess, cyclePaieController.delete);
// Validation endpoint - only for ADMIN_ENTREPRISE and SUPER_ADMIN
router.put('/:id/validate', requireAdminOrSuper, cyclePaieController.validate);
// Close cycle endpoint - only for ADMIN_ENTREPRISE and SUPER_ADMIN
router.put('/:id/close', requireAdminOrSuper, cyclePaieController.close);
// Check if cashier can pay cycle - accessible to CAISSIER
router.get('/:id/can-cashier-pay', requireReadAccess, cyclePaieController.canCashierPay);
export default router;
//# sourceMappingURL=cyclePaieRoutes.js.map